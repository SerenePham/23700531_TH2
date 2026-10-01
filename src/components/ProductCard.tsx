import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '@services/productApi';
import { COLORS } from '@constants/theme';
import { formatPrice } from '@stores/cartStore';
import { triggerAddCartHaptic } from '@utils/haptics';
import useCartStore from '@stores/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  index: number;
}

// Màu nền pastel xen kẽ cho ảnh sản phẩm giống mockups hình 2
const PASTEL_BG = ['#FEF3C7', '#DBEAFE', '#DCFCE7', '#FFE4E6'];

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, index }) => {
  const add = useCartStore((state) => state.add);
  const bgColor = PASTEL_BG[index % PASTEL_BG.length];

  const handleAddToCart = () => {
    triggerAddCartHaptic();
    add(product);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { backgroundColor: bgColor }]}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToCart}
          activeOpacity={0.7}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    margin: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  imageContainer: {
    height: 110,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    position: 'relative',
    paddingBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    paddingRight: 32,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default ProductCard;
