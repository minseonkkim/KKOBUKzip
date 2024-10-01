import { create } from "zustand";

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  setIsMobile: (isMobile: boolean) => void;
  setIsTablet: (isTablet: boolean) => void;
}

const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: window.innerWidth <= 700,
  isTablet: window.innerWidth <= 1000,
  //   모바일 사이즈 유동적으로 설정 ex)441
  setIsMobile: (isMobile) => set({ isMobile }),
  setIsTablet: (isTablet) => set({ isTablet }),
}));

window.addEventListener("resize", () => {
  const isMobile = window.innerWidth <= 441;
  useDeviceStore.getState().setIsMobile(isMobile);
});

window.addEventListener("resize", () => {
  const isTablet = window.innerWidth <= 768;
  useDeviceStore.getState().setIsTablet(isTablet);
});

export default useDeviceStore;
