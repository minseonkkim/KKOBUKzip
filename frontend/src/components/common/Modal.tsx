import React, { useState, useEffect } from "react";
import useDeviceStore from "../../store/useDeviceStore";
import { IoClose } from "react-icons/io5";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const root = document.getElementById("modal");
    setModalRoot(root);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 300); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if ((!isOpen && !isClosing) || !modalRoot) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Animation duration
  };

  const animationClass = isClosing ? "animate-modal-up" : "animate-modal-down";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-1000 pointer-events-none">
      <div className={`${
        isMobile
          ? "absolute top-[68px] w-full pointer-events-auto transition"
          : "absolute top-[90px] right-[100px] pointer-events-auto"
      } ${animationClass}`}>
        <div className="relative border-2 border-yellow-500 bg-yellow-400 rounded-[10px] shadow-md">
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
            onClick={handleClose}
          >
            <IoClose className="text-[28px]" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;