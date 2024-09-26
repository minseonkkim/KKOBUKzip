import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 무슨 정보가 필요할지 몰라서 초안 작성만 했습니다...;;;

// define the interface for the userStore
interface UserInfo {
  id: number;
  name: string;
  email: string;
  addres: string;
  CP: string;
  avatar: string;
  nickname: string;
}

// set the interface for the userStore
interface UserStore {
  userInfo: UserInfo | null;
  isLogin: boolean;
  extraData: any;
  setUserInfo: (userInfo: UserInfo) => void;
  setIsLogin: (isLogin: boolean) => void;
  setExtraData: (extraData: any) => void;
}

const info = {
  id: 1,
  name: "Jone Doe",
  email: "2mail@1.com",
  addres: "대전 서구 둔산북로 36 1층 114호.",
  CP: "010-1234-5678",
  avatar: "XXXXXXXXXXXXXXXXXXXXXXXXX",
  nickname: "구북맘",
};

// create zustand userStore and persist it in local storage, so that the user can be accessed across different pages. save userInfo, login status and extra data. especially partial save only userInfo.
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: info,
      isLogin: false,
      extraData: null,

      setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
      setIsLogin: (isLogin: boolean) => set({ isLogin }),
      setExtraData: (extraData: any) => set({ extraData }),
      // setExtraData: (extraData: any) => set((state) => ({ ...state, extraData })), // if you want to update extraData, use this code. but it is not recommended because it will overwrite all the state.
    }),
    {
      name: "userStore",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userInfo: state.userInfo,
        isLogin: state.isLogin,
        extraData: state.extraData,
      }),
    }
  )
);
