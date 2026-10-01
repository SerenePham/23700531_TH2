import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';
import useCampusLocation from '@hooks/useCampusLocation';
import useAuthStore from '@stores/authStore';

export const MeScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const {
    status,
    distanceKm,
    shippingFee,
    loading,
    requestPermission,
    openSettings,
  } = useCampusLocation();

  useEffect(() => {
    // Tự động kiểm tra / lấy vị trí khi mở màn hình
    requestPermission();
  }, [requestPermission]);

  const getStatusColor = () => {
    switch (status) {
      case 'granted':
        return '#16A34A'; // green
      case 'blocked':
      case 'denied':
        return '#DC2626'; // red
      default:
        return COLORS.textLight;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'granted':
        return 'Allowed';
      case 'blocked':
      case 'denied':
        return 'Denied';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>TÔI · LOCATION</Text>
      </View>

      <View style={styles.content}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <Text style={styles.userName}>{STUDENT.hoTen}</Text>
          <Text style={styles.userSub}>
            {STUDENT.mssv} · #{examStamp()}
          </Text>
        </View>

        {/* Location & Shipping Fee Card */}
        <View style={styles.locationCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Quyền: </Text>
            <Text style={[styles.statusValue, { color: getStatusColor() }]}>
              {getStatusLabel()}
            </Text>
          </View>

          {distanceKm !== null && (
            <Text style={styles.distanceText}>≈ {distanceKm} km tới cổng KTX</Text>
          )}

          <Text style={styles.feeLabel}>Phí ship ước tính</Text>
          <Text style={styles.feeValue}>
            {shippingFee.toLocaleString('vi-VN')} đ
          </Text>

          {loading && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginTop: 8 }}
            />
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={requestPermission}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.primaryBtnText}>Lấy vị trí ước tính ship</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={openSettings}
            activeOpacity={0.7}
          >
            <Text style={styles.outlineBtnText}>Mở Cài đặt (BLOCKED)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutBtnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    justifyContent: 'flex-start',
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  userSub: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 14,
  },
  feeLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  feeValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  formulaNote: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
  },
  buttonGroup: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  outlineBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    elevation: 2,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MeScreen;
