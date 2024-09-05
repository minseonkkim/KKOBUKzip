import { create } from "zustand";

interface DeviceState {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: window.innerWidth <= 700,
  //   모바일 사이즈 유동적으로 설정 ex)441
  setIsMobile: (isMobile) => set({ isMobile }),
}));

window.addEventListener("resize", () => {
  const isMobile = window.innerWidth <= 441;
  useDeviceStore.getState().setIsMobile(isMobile);
});

export default useDeviceStore;
