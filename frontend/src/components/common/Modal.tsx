import React, { useState, useEffect, useRef } from "react";
import useDeviceStore from "../../store/useDeviceStore";
import { IoClose } from "react-icons/io5";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // 디바이스 타입 (모바일/데스크톱) 확인
  const isMobile = useDeviceStore((state) => state.isMobile);
  
  // 모달 루트 요소 상태 관리
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  
  // 애니메이션 적용 여부 상태
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  // 첫 렌더링 여부 확인을 위한 ref
  const firstRender = useRef(true);

  // 모달 루트 요소 설정
  useEffect(() => {
    const root = document.getElementById("modal");
    setModalRoot(root);
  }, []);

  // isOpen 상태 변경 시 애니메이션 적용 여부 결정
  useEffect(() => {
    if (firstRender.current) {
      // 첫 렌더링 시 애니메이션 미적용
      firstRender.current = false;
      return;
    }
    // 이후 렌더링부터 애니메이션 적용
    setShouldAnimate(true);
  }, [isOpen]);

  // 모달이 닫혀있거나 모달 루트가 없으면 렌더링하지 않음
  if (!isOpen || !modalRoot) return null;

  // 애니메이션 클래스 결정
  const animationClass = shouldAnimate
    ? (isOpen ? "animate-modal-down" : "animate-modal-up")
    : "";

  // 모달 컨텐츠 렌더링
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[40] pointer-events-none">
      <div className={`${
        isMobile
          ? "absolute top-[68px] w-full pointer-events-auto transition"
          : "absolute top-[90px] right-[100px] pointer-events-auto"
      } ${animationClass}`}>
        <div className="relative border-2 border-yellow-500 bg-yellow-400 rounded-[10px] shadow-md">
          {/* 닫기 버튼 */}
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
            onClick={onClose}
          >
            <IoClose className="text-[28px]" />
          </button>
          {/* 모달 내용 */}
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;