import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { ROOM_LABEL, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';
import useCartStore, { formatPrice, calcProductVND } from '@stores/cartStore';
import useCampusLocation from '@hooks/useCampusLocation';

export const CartScreen: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const remove = useCartStore((state) => state.remove);
  const changeQty = useCartStore((state) => state.changeQty);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const { hasLocation, shippingFee } = useCampusLocation();

  const goodsTotal = totalAmount();
  const finalShipFee = hasLocation ? shippingFee : 0;
  const grandTotal = goodsTotal + finalShipFee;

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
      <Text style={styles.emptySubtitle}>Hãy chọn món từ Cửa hàng để thêm vào giỏ</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
      </View>

      <View style={styles.content}>
        {items.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.product.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const itemTotal = calcProductVND(item.product.price) * item.quantity;
              return (
                <View style={styles.cartCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.product.title}
                    </Text>
                    <Text style={styles.itemSub}>
                      ×{item.quantity}  {itemTotal.toLocaleString('vi-VN')} đ
                    </Text>
                  </View>

                  <View style={styles.qtyActionGroup}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => changeQty(item.product.id, -1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyDisplay}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => changeQty(item.product.id, 1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => remove(item.product.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={
              <View style={styles.footerSection}>
                {/* Khung địa chỉ phòng & phí ship có viền cam */}
                <View style={styles.shippingBox}>
                  <Text style={styles.roomText}>Giao đến {ROOM_LABEL}</Text>
                  <Text style={styles.shippingText}>
                    Phí ship: {shippingFee.toLocaleString('vi-VN')} đ{!hasLocation ? ' (mặc định)' : ''}
                  </Text>
                </View>

                {/* Tổng tiền */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalText}>
                    Tổng hàng: {grandTotal.toLocaleString('vi-VN')} đ
                  </Text>
                </View>
              </View>
            }
          />
        )}
      </View>

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
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  cartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemSub: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  qtyActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  qtyDisplay: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 8,
    minWidth: 16,
    textAlign: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 14,
  },
  footerSection: {
    marginTop: 14,
  },
  shippingBox: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  roomText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  shippingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  totalRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default CartScreen;
