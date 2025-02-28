import React from "react";

function NoDataImage() {
  return (
    <div className="flex w-full col-span-full justify-center items-center h-[60vh]  flex-col">
      <img
        src={
          "https://mgpwebaps.s3.eu-north-1.amazonaws.com/assets/47718911_9169232.jpg"
        }
        alt="No Data"
        className="w-full h-full  object-contain mix-blend-multiply"
      />

      <h3 className="text-4xl -mt-10">No Data Found!</h3>
    </div>
  );
}

export default NoDataImage;
