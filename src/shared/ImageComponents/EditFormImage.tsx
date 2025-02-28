import React from "react";

interface EditFormImageProps {
  imageObject: File | null; // Replace `File` with the appropriate type if necessary
  imagePreview: string; // URL or base64 string for the image preview
}

const EditFormImage: React.FC<EditFormImageProps> = ({ imageObject, imagePreview }) => {
  console.log(imageObject, "imageObject", imagePreview, "imagePreview");
  return (
    <img
      src={imagePreview}
      alt="categoryIcon"
      width={200}
      height={200}
    />
  );
};

export default EditFormImage;
