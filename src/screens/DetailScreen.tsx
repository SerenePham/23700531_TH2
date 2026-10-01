import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { STUDENT, STALE_TIME_MS, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';
import { fetchProductById, Product } from '@services/productApi';
import useCartStore, { formatPrice } from '@stores/cartStore';
import { triggerAddCartHaptic } from '@utils/haptics';
import { ShopStackParamList } from '@navigation/ShopStack';

type DetailRouteProp = RouteProp<ShopStackParamList, 'ProductDetail'>;

export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  const add = useCartStore((state) => state.add);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    staleTime: STALE_TIME_MS,
  });

  const handleAddToCart = () => {
    if (!product) return;
    triggerAddCartHaptic();
    add(product);
    Alert.alert(
      'Thêm thành công',
      `Đã thêm món vào giỏ hàng thành công!\nMSSV: ${STUDENT.mssv}`,
      [{ text: 'Đóng', style: 'default' }],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.headerTitle}>Chi tiết món</Text>
        </TouchableOpacity>
        <Text style={styles.stackIndicator}>Stack</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
        </View>
      ) : isError || !product ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Không thể tải chi tiết món với ID: {id}</Text>
          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backHomeButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Card trình bày theo VARIANT.detailPresentation */}
          <View style={styles.cardContainer}>
            <View style={styles.imageBackground}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.detailsBody}>
              <Text style={styles.titleText}>{product.title}</Text>
              <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
              <Text style={styles.deliveryBadge}>Giao nội khu · nhận tận phòng</Text>

              <View style={styles.divider} />

              <Text style={styles.descriptionHeader}>Mô tả món ăn</Text>
              <Text style={styles.descriptionText} numberOfLines={3}>
                {product.description || 'Mô tả ngắn từ API (tối đa 3 dòng). Giữ nguyên id từ route.params.'}
              </Text>
              <Text style={styles.paramNote}>ID: {id} · route.params</Text>
            </View>
          </View>

          {/* Nút Thêm vào giỏ */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Thêm vào giỏ · Haptic</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  stackIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  imageBackground: {
    backgroundColor: '#FEF3C7',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsBody: {
    padding: 18,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  deliveryBadge: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  descriptionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    textAlign: 'left',
    width: '100%',
  },
  paramNote: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.primary,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginBottom: 16,
  },
  backHomeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backHomeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default DetailScreen;
