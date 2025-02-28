import React from "react";

// Define prop types
interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageKey: string; // Ensure imageKey is a required string
}

const CustomImage: React.FC<CustomImageProps> = ({
  imageKey,
  alt = "Image",
  ...rest
}) => {
  return (
    <img
      src={`https://mgpwebaps.s3.eu-north-1.amazonaws.com/multi-sports/${imageKey}`}
      alt={alt}
      width={600}
      height={500}
      {...rest}
    />
  );
};

export default CustomImage;
