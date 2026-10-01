import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  userField: string;
  login: (fieldValue?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userField: '',
  login: (fieldValue: string = '') => {
    const stamp = examStamp();
    const fakeToken = `ktxgo-${STUDENT.mssv}-${stamp}`;
    set({
      token: fakeToken,
      userField: fieldValue,
    });
  },
  logout: () => {
    set({
      token: null,
      userField: '',
    });
  },
}));

export default useAuthStore;
