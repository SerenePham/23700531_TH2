import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { STUDENT, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';
import useAuthStore from '@stores/authStore';

export const LoginScreen: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const defaultPlaceholder =
    VARIANT.authField === 'email'
      ? `Email — ${STUDENT.mssv}@iuh.edu.vn`
      : `Số điện thoại — 09${STUDENT.mssv}`;

  const [inputValue, setInputValue] = useState(defaultPlaceholder);

  const handleLogin = () => {
    login(inputValue);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          <Text style={styles.brandTitle}>KTXGO</Text>
          <Text style={styles.brandSubtitle}>Giao đồ tận phòng ký túc xá</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={defaultPlaceholder}
              placeholderTextColor={COLORS.textLight}
              keyboardType={VARIANT.authField === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
            />
            <Text style={styles.inputTag}>(A)</Text>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>Auth Stack · chưa có token</Text>
        </View>
      </KeyboardAvoidingView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.text,
    paddingRight: 40,
  },
  inputTag: {
    position: 'absolute',
    right: 14,
    top: 14,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    marginTop: 24,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default LoginScreen;
