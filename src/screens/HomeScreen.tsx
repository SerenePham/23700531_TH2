import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { STUDENT, ROOM_LABEL, STALE_TIME_MS, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';
import ProductCard from '@components/ProductCard';
import useDebouncedValue from '@hooks/useDebouncedValue';
import { fetchProducts, Product } from '@services/productApi';
import { ShopStackParamList } from '@navigation/ShopStack';

type HomeScreenNavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery);

  const {
    data: products,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    return products.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase().trim()),
    );
  }, [products, debouncedSearch]);

  const renderContent = () => {
    // 1. Cảnh đang tải (Loading)
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải món...</Text>
        </View>
      );
    }

    // 2. Cảnh lỗi mạng (Error)
    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorStudentId}>{STUDENT.mssv}</Text>
          <Text style={styles.errorText}>Không tải được dữ liệu món.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // 3. Cảnh có dữ liệu lưới (Data)
    return (
      <View style={styles.listContainer}>
        <View style={styles.listHeaderRow}>
          <Text style={styles.flashListBadge}>(C) FlashList x2</Text>
        </View>
        <FlashList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              index={index}
              onPress={() => navigation.navigate('ProductDetail', { id: String(item.id) })}
            />
          )}
          // @ts-ignore - estimatedItemSize cho tiêu chí chấm v1
          estimatedItemSize={190}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={styles.flashListContent}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View>
          <Text style={styles.headerTitle}>KTXGO</Text>
          <Text style={styles.headerSubtitle}>Giao tận {ROOM_LABEL}</Text>
        </View>
        <Text style={styles.headerTag}>(A)</Text>
      </View>

      {/* Ô tìm kiếm có Debounce */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
            placeholderTextColor={COLORS.textLight}
            clearButtonMode="while-editing"
          />
          <Text style={styles.searchTag}>(B)</Text>
        </View>
      </View>

      {/* Vùng hiển thị 3 cảnh mạng */}
      <View style={styles.mainContent}>{renderContent()}</View>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBanner: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    marginTop: 2,
  },
  headerTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BFDBFE',
  },
  searchSection: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 13,
    color: COLORS.text,
    paddingRight: 32,
    paddingVertical: 2,
  },
  searchTag: {
    position: 'absolute',
    right: 14,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  listHeaderRow: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
  flashListBadge: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  flashListContent: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorStudentId: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.error,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default HomeScreen;
