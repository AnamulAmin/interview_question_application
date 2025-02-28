import { Image } from "@nextui-org/image";
import React from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

function DragUploadImageInput({ image, setImage }: any) {
  const onDropThumbnail = (acceptedFiles: any) => {
    // Generate preview URLs for all accepted files
    const file = acceptedFiles[0];

    // Create a local URL for the dropped image
    const previewUrl = URL.createObjectURL(file);

    console.log(previewUrl, "previewUrl");

    // Add all new files to the gallery state
    setImage(previewUrl);
  };

  const { getRootProps: getRootProps, getInputProps: getInputProps } =
    useDropzone({
      onDrop: onDropThumbnail,
      accept: "image/*",
      multiple: false,
    });

  return (
    <div
      {...getRootProps()}
      className="w-full p-4 border-dashed min-h-[200px] flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {image ? (
        <>
          <Image src={image} alt="Image" width={200} height={200} />
        </>
      ) : (
        <>
          <FiUploadCloud size={60} />
          <p className="text-xl">Drag and drop a file here or click</p>
        </>
      )}
    </div>
  );
}

export default DragUploadImageInput;
