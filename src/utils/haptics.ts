import { Vibration, Platform } from 'react-native';
import { VARIANT } from '@constants/student';

let hapticsEnabled = true;

export const setHapticsEnabled = (value: boolean) => {
  hapticsEnabled = value;
};

const safeVibrate = (pattern: number | number[]) => {
  if (!hapticsEnabled) return;
  try {
    Vibration.vibrate(pattern);
  } catch (e) {
    console.log('[haptics] Thiết bị không hỗ trợ rung:', e);
  }
};

/** Chạm nhẹ dạng selection - rung 15-20ms */
export const hapticSelection = () => {
  if (Platform.OS === 'ios') {
    safeVibrate(1);
  } else {
    safeVibrate(20);
  }
};

/** Chạm mạnh dạng impact - rung 40-50ms */
export const hapticImpact = () => {
  if (Platform.OS === 'ios') {
    safeVibrate(1);
  } else {
    safeVibrate(45);
  }
};

/** Kích hoạt haptic theo VARIANT.hapticOnAdd ('impact' hoặc 'selection') */
export const triggerAddCartHaptic = () => {
  if (VARIANT.hapticOnAdd === 'impact') {
    hapticImpact();
  } else {
    hapticSelection();
  }
};

export default {
  hapticSelection,
  hapticImpact,
  triggerAddCartHaptic,
  setHapticsEnabled,
};
