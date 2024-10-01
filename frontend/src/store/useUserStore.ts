import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserInfo } from "../types/user";

interface UserStore {
  userInfo: UserInfo | null;
  isLogin: boolean;
  setLogin: (userInfo: UserInfo) => void;
  setLogout: () => void;
  setIsLogin: (isLogin: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      isLogin: false,

      setLogin: (userInfo: UserInfo) =>
        set({
          userInfo: {
            userId: userInfo.userId,
            email: userInfo.email,
            address: userInfo.address,
            phoneNumber: userInfo.phoneNumber,
            nickname: userInfo.nickname,
            profileImage: userInfo.profileImage,
            role: userInfo.role,
          },
          isLogin: true,
        }),
      setLogout: () => set({ userInfo: null, isLogin: false }),
      setIsLogin: (isLogin: boolean) => {
        return set({ isLogin });
      },
    }),
    {
      name: "userStore",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userInfo: state.userInfo,
        isLogin: state.isLogin,
      }),
    }
  )
);
