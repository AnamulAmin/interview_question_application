import React from "react";
import { FiUploadCloud } from "react-icons/fi";
import { Image } from "@nextui-org/image";

interface UploadFileInputProps {
  fileData: string; // Assuming the file data is a string (change this if it's a different type)
  setFileData: React.Dispatch<React.SetStateAction<string>>;
  isSuccess?: boolean; // Optional prop for success status, if you want to track upload success
}

const UploadFileInput: React.FC<UploadFileInputProps> = ({
  setFileData,
  isSuccess = false, // Default to false if not passed
}) => {
  const [isUploaded, setIsUploaded] = React.useState<any>(false);

  // Function to open the dialog and get the image data
  const openDialog = async () => {
    try {
      // Invoke the IPC event to open the file dialog and receive the image data
      const receiveData: { success: boolean; data: string } =
        await window.ipcRenderer.invoke("upload-file", {
          file: "open-dialog",
        });

      console.log(receiveData, "receiveData");

      if (receiveData.success) {
        setIsUploaded(true);
        setFileData(receiveData.data);

        setTimeout(() => {
          setIsUploaded(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error opening dialog:", error);
    }
  };

  return (
    <div
      onClick={openDialog}
      className="w-full p-4 border-dashed min-h-[200px] flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
    >
      {isUploaded ? (
        <>
          <Image
            src={"/success.png"}
            alt="Upload Success"
            width={200}
            height={200}
            isZoomed
            className="object-contain"
          />
          <p className="text-green-600 mt-2">File uploaded successfully!</p>
        </>
      ) : (
        <>
          <FiUploadCloud size={60} />
          <p className="text-xl">Upload Excel, JSON, or CSV file</p>
          {isSuccess && <p className="text-green-600">Upload successful!</p>}
        </>
      )}
    </div>
  );
};

export default UploadFileInput;
