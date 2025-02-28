import useGetApplicationSettingData from "@/hooks/GetDataHook/useGetApplicationSettingData";
import { useEffect, useState } from "react";

const CustomerInvoice = () => {
  const { settingData } = useGetApplicationSettingData({});
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
    <div className="p-4 border rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-xl font-bold">Customer Invoice</h2>
      <p>
        <strong>Store:</strong> {settingData.storeName}
      </p>
      <p>
        <strong>Address:</strong> {settingData.address}
      </p>
      <p>
        <strong>Phone:</strong> {settingData.phone}
      </p>
      <h3 className="mt-3 font-semibold">Items:</h3>
      <ul>
        {data.cartItems.map((item) => (
          <li key={item._id} className="border-b py-2">
            {item.name} - {item.quantity}x @ ${item.price}
          </li>
        ))}
      </ul>
      <p className="mt-3">
        <strong>Subtotal:</strong> ${data.subtotal}
      </p>
      <p>
        <strong>VAT ({settingData.vatPercentage}%):</strong> ${data.vat}
      </p>
      <p className="font-bold text-lg">Total: ${data.total}</p>
      <p className="mt-4 text-sm">{settingData.footerText}</p>
    </div>
  );
};

export default CustomerInvoice;
