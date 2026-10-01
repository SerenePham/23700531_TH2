import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VARIANT } from '@constants/student';
import HomeScreen from '@screens/HomeScreen';
import DetailScreen from '@screens/DetailScreen';

export type ShopStackParamList = {
  Home: undefined;
  ProductDetail: { id: string };
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

export const ShopStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="ProductDetail"
        component={DetailScreen}
        options={{
          presentation: VARIANT.detailPresentation === 'modal' ? 'modal' : 'card',
        }}
      />
    </Stack.Navigator>
  );
};

export default ShopStack;
