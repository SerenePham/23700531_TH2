import { useState, useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

// Tọa độ cổng Ký túc xá cố định
export const KTX_GATE_COORDS = {
  latitude: 10.8756,
  longitude: 106.8007,
};

// Tọa độ giả lập dành cho máy ảo (cách cổng KTX khoảng 1.2 km)
export const MOCK_USER_COORDS = {
  latitude: 10.8652,
  longitude: 106.7953,
};

export type PermissionStatus = 'undetermined' | 'granted' | 'denied' | 'blocked';

export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Bán kính Trái Đất (km)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const computeShippingFee = (km: number): number => {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  }
  return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
};

// Global shared state để đồng bộ giữa màn Tôi (MeScreen) và màn Giỏ (CartScreen)
let globalLocationState = {
  status: 'granted' as PermissionStatus,
  coords: MOCK_USER_COORDS,
  distanceKm: 1.2,
  shippingFee: computeShippingFee(1.2),
  hasLocation: true,
};

const listeners = new Set<() => void>();
const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const useCampusLocation = () => {
  const [state, setState] = useState(globalLocationState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listener = () => setState({ ...globalLocationState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings().catch(() => {
      Alert.alert('Không thể mở Cài đặt', 'Vui lòng mở Cài đặt thiết bị thủ công.');
    });
  }, []);

  const requestPermission = useCallback(async () => {
    setLoading(true);

    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'KTXGo cần quyền vị trí',
            message: 'KTXGo cần truy cập vị trí để ước tính khoảng cách tới cổng KTX và tính phí ship.',
            buttonPositive: 'Cho phép',
            buttonNegative: 'Từ chối',
          },
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          fetchCoords('granted');
        } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          updateStatus('blocked');
          setLoading(false);
        } else {
          updateStatus('denied');
          setLoading(false);
        }
      } else {
        // iOS
        Geolocation.requestAuthorization(
          () => {
            fetchCoords('granted');
          },
          (err) => {
            if (err.code === 1) {
              updateStatus('blocked');
            } else {
              updateStatus('denied');
            }
            setLoading(false);
          },
        );
      }
    } catch (e) {
      console.warn('Lỗi xin quyền vị trí:', e);
      // Fallback an toàn trên máy ảo
      fetchCoords('granted');
    }
  }, []);

  const updateStatus = (status: PermissionStatus) => {
    globalLocationState = {
      ...globalLocationState,
      status,
      hasLocation: status === 'granted',
    };
    notifyListeners();
  };

  const fetchCoords = (status: PermissionStatus) => {
    Geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const dist = haversineDistance(
          lat,
          lon,
          KTX_GATE_COORDS.latitude,
          KTX_GATE_COORDS.longitude,
        );
        const roundedDist = Math.round(dist * 10) / 10;
        const fee = computeShippingFee(roundedDist);

        globalLocationState = {
          status,
          coords: { latitude: lat, longitude: lon },
          distanceKm: roundedDist,
          shippingFee: fee,
          hasLocation: true,
        };
        notifyListeners();
        setLoading(false);
      },
      (_err) => {
        // Nếu GPS máy ảo timeout, dùng toạ độ mẫu 1.2km
        const dist = 1.2;
        const fee = computeShippingFee(dist);

        globalLocationState = {
          status,
          coords: MOCK_USER_COORDS,
          distanceKm: dist,
          shippingFee: fee,
          hasLocation: true,
        };
        notifyListeners();
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
    );
  };

  return {
    ...state,
    loading,
    requestPermission,
    openSettings,
    computeShippingFee,
  };
};

export default useCampusLocation;
