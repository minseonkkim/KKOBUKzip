import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 무슨 정보가 필요할지 몰라서 초안 작성만 했습니다...;;;

// define the interface for the userStore
interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
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

// create zustand userStore and persist it in local storage, so that the user can be accessed across different pages. save userInfo, login status and extra data. especially partial save only userInfo.
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
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
