import React from "react";

interface CellImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

const CellImage: React.FC<CellImageProps> = ({ src, width, height, alt }) => {
  return (
    <img
      width={width || 400}
      height={height || 400}
      src={src || "/no-image.png"}
      alt={alt || "Image"}
      className="w-20 h-20 object-contain rounded-2xl"
    />
  );
};

export default CellImage;
