interface AlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100000] text-[19px]" onClick={handleOverlayClick}>
      <div className="w-[390px] bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="mb-5">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#4B721F] text-white rounded-[30px] hover:bg-[#4F6636] transition"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Alert;
