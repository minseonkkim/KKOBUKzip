import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById("modal");
    setModalRoot(root);
  }, []);

  if (!isOpen || !modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-1000 pointer-events-none">
      <div className="absolute top-[90px] right-[100px] pointer-events-auto">
        <div className="relative border-2 border-yellow-500 bg-yellow-400 rounded-[10px] shadow-md">
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
            onClick={onClose}
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