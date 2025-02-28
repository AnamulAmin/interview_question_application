function BgBlurModal({
  isShowModal,
  children,
  setIsShowModal,
  setFormIndex = () => {},
}) {
  // Function to close modal on outside click
  const handleClose = (e) => {
    if (e.target.id === "modalBackdrop") {
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
}

export default BgBlurModal;
