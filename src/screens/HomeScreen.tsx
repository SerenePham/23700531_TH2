import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { STUDENT, STALE_TIME_MS, VARIANT, ROOM_LABEL } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';
import ProductCard from '@components/ProductCard';
import useDebouncedValue from '@hooks/useDebouncedValue';
import { fetchProducts, Product } from '@services/productApi';
import { ShopStackParamList } from '@navigation/ShopStack';

type HomeScreenNavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

// Thời gian hiển thị loading tối thiểu khi mất mạng (ms)
const MIN_LOADING_DISPLAY_MS = 3000;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  // Trạng thái loading kéo dài để theo dõi mạng
  const [showError, setShowError] = useState(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    retry: 1,
  });

  // Khi có lỗi, chờ MIN_LOADING_DISPLAY_MS rồi mới hiển thị màn lỗi
  useEffect(() => {
    if (isError) {
      errorTimerRef.current = setTimeout(() => {
        setShowError(true);
      }, MIN_LOADING_DISPLAY_MS);
    } else {
      setShowError(false);
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
        errorTimerRef.current = null;
      }
    }
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [isError]);

  // Lấy danh sách danh mục từ dữ liệu
  const categories = useMemo(() => {
    if (!products) return ['Tất cả'];
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['Tất cả', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products;

    // Lọc theo danh mục
    if (selectedCategory !== 'Tất cả') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Lọc theo từ khóa tìm kiếm
    if (debouncedSearch.trim()) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase().trim()),
      );
    }

    return result;
  }, [products, debouncedSearch, selectedCategory]);

  const renderContent = () => {
    // 1. Cảnh đang tải (Loading) — kể cả khi đang chờ hiển thị lỗi
    if (isLoading || (isError && !showError)) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {isError ? 'Đang kiểm tra kết nối mạng...' : 'Đang tải món...'}
          </Text>
          {isError && (
            <Text style={styles.loadingSubText}>Vui lòng chờ trong giây lát</Text>
          )}
        </View>
      );
    }

    // 2. Cảnh lỗi mạng (Error) — hiển thị sau MIN_LOADING_DISPLAY_MS
    if (isError && showError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>📡</Text>
          <Text style={styles.errorStudentId}>{STUDENT.mssv}</Text>
          <Text style={styles.errorText}>Không tải được dữ liệu món.</Text>
          <Text style={styles.errorSubText}>Kiểm tra kết nối Internet và thử lại.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setShowError(false);
              refetch();
            }}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyText}>Không tìm thấy món nào</Text>
            </View>
          }
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
          <Text style={styles.headerSubtitle}>Giao tại {ROOM_LABEL}</Text>
        </View>
      </View>

      {/* Ô tìm kiếm có Debounce */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Tìm món ăn yêu thích của bạn — ${STUDENT.mssv}`}
            placeholderTextColor={COLORS.textLight}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Thanh danh mục */}
      {products && products.length > 0 && (
        <View style={styles.categoryWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

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
    paddingVertical: 14,
    justifyContent: 'center',
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
    fontWeight: '600',
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
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 2,
  },
  // ─── Category Filter ───
  categoryWrapper: {
    paddingTop: 6,
    paddingBottom: 2,
  },
  categoryList: {
    paddingHorizontal: 12,
    gap: 8,
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  // ─── Main Content ───
  mainContent: {
    flex: 1,
    marginTop: 4,
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
  loadingSubText: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textLight,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
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
    marginBottom: 6,
  },
  errorSubText: {
    fontSize: 13,
    color: COLORS.textLight,
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
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});

export default HomeScreen;
