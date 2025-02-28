import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Outlet, useNavigate } from "react-router-dom";

const PrintRoot = () => {
  const [isCollapsed, setIsCollapsed] = useState<any>(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window?.ipcRenderer.invoke("close-print");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-screen h-screen relative">
      <span
        color="danger"
        className="absolute top-1 right-1 text-white z-30 bg-neutral-700 border hover:border-red-400  rounded-full p-1 text-md hover:scale-125 transition-all duration-300 hover:bg-red-400 cursor-pointer"
        onClick={() => window?.ipcRenderer.invoke("close-print")}
      >
        <IoMdClose />
      </span>

      <Button
        color="danger"
        variant="light"
        onPress={() => window?.ipcRenderer.invoke("pdf")}
      >
        Print
      </Button>

      <Outlet />
    </div>
  );
};

export default PrintRoot;
