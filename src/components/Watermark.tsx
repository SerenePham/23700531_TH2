import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp } from '@constants/student';
import { COLORS } from '@constants/theme';

export const Watermark: React.FC = () => {
  const stamp = examStamp();

  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={1}>
        TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{stamp}
      </Text>
      <Text style={styles.tag}>(0)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    zIndex: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
    flex: 1,
    textAlign: 'center',
  },
  tag: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 6,
  },
});

export default Watermark;
