import { IUser } from '@entities/entities';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TUserStore = {
  user?: IUser;
  setUser: (user?: IUser) => void;
};

const useUserStore = create<TUserStore>()(
  persist(
    set => ({
      user: undefined,
      setUser: user => set({ user }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useUserStore;
