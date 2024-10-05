import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserInfo } from "../types/user";

interface UserStore {
  userInfo: UserInfo | null;
  isLogin: boolean;
  setLogin: (userInfo: UserInfo) => void;
  setLogout: () => void;
  setIsLogin: (isLogin: boolean) => void;
  setProfileImage: (newProfileImage: string) => void; // 여기에 추가
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      isLogin: false,

      setLogin: (userInfo: Partial<UserInfo>) => {
        return set({
          userInfo: {
            userId: userInfo.userId!,
            uuid: userInfo.uuid!,
            name: userInfo.name!,
            birth: userInfo.birth!,
            email: userInfo.email!,
            address: userInfo.address!,
            phoneNumber: userInfo.phoneNumber!,
            foreignFlag: false,
            nickname: userInfo.nickname!,
            profileImage: userInfo.profileImage!,
            role: userInfo.role!,
          },
          isLogin: true,
        });
      },
      setLogout: () => {
        set({ userInfo: null, isLogin: false });
        localStorage.clear();
      },
      setIsLogin: (isLogin: boolean) => {
        return set({ isLogin });
      },
      setProfileImage: (newProfileImage: string) => {
        set((state) => {
          if (state.userInfo) {
            return {
              userInfo: {
                ...state.userInfo, // 기존 userInfo를 복사하고
                profileImage: newProfileImage, // profileImage만 업데이트
              },
            };
          }
          return {}; // userInfo가 null인 경우 아무것도 하지 않음
        });
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
