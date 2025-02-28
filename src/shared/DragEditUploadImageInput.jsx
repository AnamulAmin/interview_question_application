import React from "react";
import EditFormImage from "./ImageComponents/EditFormImage";
import { FiUploadCloud } from "react-icons/fi";

function DragEditUploadImageInput({
  getRootProps,
  getInputProps,
  image,
  imagePreview,
}) {
  return (
    <div
      {...getRootProps()}
      className="p-5 border-dashed mt-2 rounded-2xl bg-white border-neutral-400 border-2 flex justify-center items-center min-h-[200px]"
    >
      <input {...getInputProps()} />
      <div className="text-center flex justify-center items-center flex-col">
        {imagePreview ? (
          <>
            {Array.isArray(image) ? (
              <div className="flex flex-wrap gap-4">
                {imagePreview.map((item: any, index: number) => (
                  <EditFormImage
                    key={index}
                    imageObject={item.preview ? image : null}
                    imagePreview={item.image || item.preview}
                    width={100}
                    height={100} // Assuming you have a URL for the icon
                    imageType="icon"
                  />
                ))}
              </div>
            ) : (
              <>
                <EditFormImage
                  imageObject={image}
                  imagePreview={imagePreview}
                  width={100}
                  height={100} // Assuming you have a URL for the icon
                  imageType="icon"
                />
              </>
            )}
          </>
        ) : (
          <>
            <FiUploadCloud size={50} />
            <p className="text-xl">Drag and drop a file here or click</p>
          </>
        )}
      </div>
    </div>
  );
}

export default DragEditUploadImageInput;
