import { useEffect, useRef } from "react";
function Modal({
  isShowModal,
  children,
  setIsShowModal,
  setFormIndex = () => {},
}) {
  const modalElem = useRef(null);

  useEffect(() => {
    if (!isShowModal) {
      modalElem.current.scrollTop = 0;
    }
  }, [isShowModal]);
  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen grid place-items-center  z-[99] bg-black bg-opacity-50 overflow-auto transition-all duration-500 ${
        isShowModal ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      ref={modalElem}
    >
      <div
        // added comment
        className="w-full h-full fixed top-0 left-0 bottom-0 right-0 z-[-1]"
        onClick={() => {
          setIsShowModal(false);
          setFormIndex(0);
        }}
      ></div>
      {children}
    </div>
  );
}

export default Modal;
