import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import * as XLSX from "xlsx";

export default function BulkUpload({ setFileData, category, onSubmit }: any) {
  const [isUploadFile, setIsUploadFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileUpload = (file: File) => {
    try {
      if (!file) {
        setMessage("No file selected");
        return;
      }

      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const reader = new FileReader();

      console.log("fileExtension", fileExtension, file);

      // Handle JSON files
      if (fileExtension === "json") {
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target!.result as string);
            setFileData({ type: "json", data: jsonData });
          } catch (parseError) {
            setMessage("Invalid JSON file");
          }
        };
        reader.readAsText(file);
        return;
      }

      // Handle CSV files
      if (fileExtension === "csv") {
        reader.onload = (e) => {
          const csvData = e.target!.result as string;
          setFileData({ type: "csv", data: csvData });
        };
        reader.readAsText(file);
        return;
      }

      // Handle Excel files (.xlsx or .xls)
      if (fileExtension === "xlsx" || fileExtension === "xls") {
        reader.onload = (e) => {
          const arrayBuffer = e.target!.result;
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0]; // Get the first sheet
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          setFileData({ type: "excel", data: json });
        };
        reader.readAsArrayBuffer(file);
        return;
      }

      setMessage("Unsupported file type");
    } catch (err) {
      console.error("Error uploading file:", err);
      setMessage("An error occurred while processing the file");
    }
  };

  // Handle file drop using react-dropzone
  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setIsUploadFile(selectedFile);
    handleFileUpload(selectedFile);
    setMessage("");
  };

  // react-dropzone hook
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".xlsx, .xls, .csv, .json", // Allow other file types like .csv and .json
    multiple: false,
  });

  return (
    <div className="p-6 pt-10">
      <div className="">
        <h1 className="text-3xl font-semibold mb-9">
          Upload {category} Data from Excel, JSON, or CSV
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {/* Left Side Image */}
          <div className="flex items-center justify-center">
            <Image
              width={400}
              height={400}
              src="/file.jpg"
              alt="Excel Upload"
              className="w-full h-auto mult"
            />
          </div>

          {/* Right Side Instructions and File Upload */}
          <div>
            <p className="mb-4">
              You can upload Data using Excel files, but the format of the Excel
              file must match our sample file below. It is better to use our
              demo Excel file, fill in the data, and upload it to our system.
            </p>
            <a
              href="/demo/Data.xlsx"
              download
              className="text-blue-500 underline"
            >
              Demo Excel File: Data.xlsx
            </a>

            {/* File Dropzone */}
            <div
              {...getRootProps()}
              className="mt-4 p-4 py-20 border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer flex flex-col items-center justify-center"
            >
              <input {...getInputProps()} />
              {isUploadFile ? (
                <>
                  <p>{isUploadFile.name}</p>
                  <Image
                    src={"/success.png"}
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
                  <p className="text-xl">Upload Excel, JSON, or CSV file</p>
                </>
              )}
            </div>

            {/* Upload Button */}
            <Button
              type="button"
              onPress={onSubmit}
              className="customSaveButton mt-7 mb-3"
            >
              Upload File
            </Button>

            {/* Message */}
            {message && <p className="mt-4 text-green-500">{message}</p>}

            <p className="mt-2 text-gray-500">
              Please be patient. Uploading Data may take a few minutes depending
              on the volume of data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
