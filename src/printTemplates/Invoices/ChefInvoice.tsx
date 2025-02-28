import { useEffect, useState } from "react";

interface Settings {
  appTitle: string;
  storeName: string;
  address: string;
  phone: string;
  email: string;
}

interface OrderData {
  orderType: string;
  preparationTimes: number;
  cartItems: Array<{
    _id: string;
    name: string;
    quantity: number;
    preparationTime: number;
    inventories?: Array<{
      inventoryItemName: string;
      usagePerItem: number;
      unitType: string;
    }>;
  }>;
  order_placed_date: string;
  order_placed_time: string;
  order_placed_by: string;
  table: string;
  counter: string;
  customerType: string;
  specialInstructions?: string;
}

const ChefInvoice = () => {
  const [data, setData] = useState<OrderData | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window?.ipcRenderer.invoke("close-print");
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await window.ipcRenderer.invoke("get-settings");
        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    fetchSettings();

    window.ipcRenderer.on("receive-print-data", (_event, receivedData) => {
      setData(receivedData.data);
    });

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!data || !settings) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded-lg shadow-lg   mt-5 ">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">{settings.storeName}</h1>
        <p className="text-sm">{settings.address}</p>
        <p className="text-sm">Phone: {settings.phone}</p>
      </div>

      <div className="border-t border-b py-2 mb-4">
        <h2 className="text-xl font-bold">Chef Invoice</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <strong>Order Type:</strong> {data.orderType}
          </p>
          <p>
            <strong>Table:</strong> {data.table}
          </p>
          <p>
            <strong>Counter:</strong> {data.counter}
          </p>
          <p>
            <strong>Customer Type:</strong> {data.customerType}
          </p>
          <p>
            <strong>Date:</strong> {data.order_placed_date}
          </p>
          <p>
            <strong>Time:</strong> {data.order_placed_time}
          </p>
          <p>
            <strong>Placed By:</strong> {data.order_placed_by}
          </p>
          <p>
            <strong>Preparation Time:</strong> {data.preparationTimes} mins
          </p>
        </div>
      </div>

      {data.specialInstructions && (
        <div className="mb-4">
          <h3 className="font-semibold">Special Instructions:</h3>
          <p className="text-sm bg-gray-100 p-2 rounded">
            {data.specialInstructions}
          </p>
        </div>
      )}

      <h3 className="font-semibold mb-2">Items:</h3>
      <ul className="space-y-4">
        {data.cartItems.map((item) => (
          <li key={item._id} className="border-b pb-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm">Quantity: {item.quantity}x</p>
                <p className="text-sm">
                  Prep Time: {item.preparationTime} mins
                </p>
              </div>
            </div>
            {item?.inventories && item.inventories.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium">Ingredients:</h4>
                <ul className="text-sm pl-4">
                  {item.inventories.map((inv, index) => (
                    <li key={index}>
                      {inv.inventoryItemName} ({inv.usagePerItem} {inv.unitType}
                      )
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChefInvoice;
