import { ReactNode, MouseEvent } from "react";

interface BgBlurModalProps {
  isShowModal: boolean; // To control modal visibility
  children: ReactNode; // Modal content
  setIsShowModal: (value: boolean) => void; // Function to toggle modal visibility
  setFormIndex?: (value: number) => void; // Optional function to reset form index
}

const BgBlurModal: React.FC<BgBlurModalProps> = ({
  isShowModal,
  children,
  setIsShowModal,
  setFormIndex = () => {},
}) => {
  // Function to close modal on outside click
  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.id === "modalBackdrop") {
      setIsShowModal(false);
      setFormIndex(0);
    }
  };

  return (
    <div
      id="modalBackdrop"
      onClick={handleClose}
      className={`fixed top-0 left-0 w-screen h-screen overflow-auto z-[99] backdrop-blur-lg bg-opacity-10 bg-black transition-all duration-500 ${
        isShowModal ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="relative rounded shadow-lg z-10 max-w-[70%] mx-auto mt-3">
        {children}
      </div>
    </div>
  );
};

export default BgBlurModal;
