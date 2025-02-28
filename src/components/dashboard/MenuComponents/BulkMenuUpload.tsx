import { useState } from "react";
import BulkUpload from "../../../shared/BulkUpload";
import Swal from "sweetalert2";

export default function BulkMenuUpload() {
  const [fileData, setFileData] = useState<any>(null);

  const handleSubmit = async () => {
    console.log("data sdfasf ", fileData);

    try {
      const receiveData: any = await window.ipcRenderer.invoke("bulk-menu", {
        data: fileData,
      });

      if (receiveData.success) {
        Swal.fire({
          title: "Success!",
          text: "question created successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  return (
    <BulkUpload
      setFileData={setFileData}
      category={"Menu"}
      onSubmit={handleSubmit}
    />
  );
}
