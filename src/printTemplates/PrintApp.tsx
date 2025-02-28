import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";

export default function PrintApp() {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window?.ipcRenderer.invoke("close-print");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    window.ipcRenderer.on("receive-print-data", (event, data) => {
      console.log("print data", data);
      setData(data.data);
    });

    console.log("print root");
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-x-3">
      <h1>{data.name}</h1>
      <button onClick={() => window?.print()} className="bg-blue-500">
        Print
      </button>
    </div>
  );
}
