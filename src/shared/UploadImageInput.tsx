import { FiUploadCloud } from "react-icons/fi";
import { Image } from "@nextui-org/image";

const UploadImageInput: any = ({ imageString, setImageString }: any) => {
  // Function to open the dialog and get the image data
  const openDialog = async () => {
    try {
      // Invoke the IPC event to open the file dialog and receive the image data
      const receiveData: string = await window.ipcRenderer.invoke(
        "openDialog",
        { file: "open-dialog" }
      );

      setImageString(receiveData);
    } catch (error) {
      console.error("Error opening dialog:", error);
    }
  };

  return (
    <div
      onClick={openDialog}
      className="w-full p-4 border-dashed min-h-[200px] flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
    >
      {imageString ? (
        <>
          <Image
            src={imageString}
            alt="categoryBanner"
            width={200}
            height={200}
            isZoomed
            className="object-contain"
          />
        </>
      ) : (
        <>
          <FiUploadCloud size={60} />
          <p className="text-xl">Upload Image</p>
        </>
      )}
    </div>
  );
};

export default UploadImageInput;
