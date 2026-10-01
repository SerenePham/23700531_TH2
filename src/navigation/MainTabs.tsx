import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import ShopStack from './ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import useCartStore from '@stores/cartStore';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const totalQty = useCartStore((state) => state.totalQuantity());

  const shopScreen = (
    <Tab.Screen
      key="shop"
      name="ShopTab"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏪</Text>,
      }}
    />
  );

  const cartScreen = (
    <Tab.Screen
      key="cart"
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Giỏ',
        tabBarBadge: totalQty > 0 ? totalQty : undefined,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.secondary,
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🛒</Text>,
      }}
    />
  );

  const meScreen = (
    <Tab.Screen
      key="me"
      name="MeTab"
      component={MeScreen}
      options={{
        title: 'Tôi',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text>,
      }}
    />
  );

  // Thứ tự tab phụ thuộc VARIANT.tabOrder: shopFirst hoặc cartFirst
  const tabsInOrder =
    VARIANT.tabOrder === 'shopFirst'
      ? [shopScreen, cartScreen, meScreen]
      : [cartScreen, shopScreen, meScreen];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      {tabsInOrder}
    </Tab.Navigator>
  );
};

export default MainTabs;
