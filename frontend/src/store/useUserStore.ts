import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";
import { UserInfo } from "../types/user";

// 무슨 정보가 필요할지 몰라서 초안 작성만 했습니다...;;;

interface UserStore {
  userInfo: UserInfo | null;
  isLogin: boolean;
  setLogin: (userInfo: UserInfo) => void;
  setLogout: () => void;
  setIsLogin: (isLogin: boolean) => void;
}

const info = {
  id: 1,
  name: "Jone Doe",
  email: "2mail@1.com",
  addres: "대전 서구 둔산북로 36 1층 114호.",
  CP: "010-1234-5678",
  nickname: "구북맘",
};

export const useUserStore = create<UserStore>()(
  // persist(
  (set) => ({
    userInfo: info,
    isLogin: false,

    setLogin: (userInfo: UserInfo) => set({ userInfo, isLogin: true }),
    setLogout: () => set({ userInfo: null, isLogin: false }),
    setIsLogin: (isLogin: boolean) => {
      return set({ isLogin });
    },
  })
  // {
  //   name: "userStore",
  //   storage: createJSONStorage(() => localStorage),
  //   partialize: (state) => ({
  //     userInfo: state.userInfo,
  //     isLogin: state.isLogin,
  //   }),
  // }
  // )
);
