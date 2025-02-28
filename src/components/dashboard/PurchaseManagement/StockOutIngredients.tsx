import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Select,
  SelectItem,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Spinner,
  Chip,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import useGetAllInventories from "@/hooks/GetDataHook/useGetAllInventories";
import Restock from "./forms/Restock";

interface StockOutEntry {
  _id: string;
  inventoryId: string;
  inventoryName: string;
  quantity: number;
  date: string;
  reason: string;
  unit: string;
}

interface Inventory {
  _id: string;
  ingredientName: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  stockStatus: "Out of Stock" | "In Stock";
  category?: {
    _id: string;
    name: string;
  };
  subcategory?: {
    _id: string;
    name: string;
  };
}

const StockOutIngredients = () => {
  const [ingredient, setIngredient] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [stockOutData, setStockOutData] = useState<StockOutEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );

  const inventoriesItems = useGetAllInventories({});

  // Form state for new stock out entry
  const [formData, setFormData] = useState({
    quantity: "",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch inventories
  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await window.ipcRenderer.invoke("get-inventory-item", {
          outOfStock: true,
        });

        console.log("Inventory Response:", response);

        if (response.success) {
          // Filter out items that are not actually out of stock (additional safety check)
          const outOfStockItems = response.data.filter(
            (item: Inventory) =>
              !item.currentStock || // No stock
              item.currentStock === 0 || // Zero stock
              (item.minThreshold && item.currentStock <= item.minThreshold) // Below threshold
          );

          setInventories(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch inventory data");
        }
      } catch (error) {
        console.error("Error fetching inventories:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch inventory data",
          icon: "error",
        });
      }
    };

    fetchInventories();
  }, []);

  // Fetch stock out data
  const fetchStockOutData = async () => {
    setLoading(true);
    try {
      const response = await window.ipcRenderer.invoke("get-stock-outs", {
        inventoryId: ingredient,
        fromDate,
        toDate,
      });

      if (response.success) {
        setStockOutData(response.data);
      }
    } catch (error) {
      console.error("Error fetching stock out data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch stock out data",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStockOut = async () => {
    if (!selectedInventory) return;

    try {
      const quantity = Number(formData.quantity);
      if (quantity > selectedInventory.currentStock) {
        Swal.fire({
          title: "Error",
          text: "Stock out quantity cannot be greater than current stock",
          icon: "error",
        });
        return;
      }

      const response = await window.ipcRenderer.invoke("create-stock-out", {
        data: {
          inventoryId: selectedInventory._id,
          inventoryName: selectedInventory.ingredientName,
          quantity,
          date: formData.date,
          reason: formData.reason,
          unit: selectedInventory.unit,
        },
      });

      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Stock out recorded successfully",
          icon: "success",
        });
        setIsModalOpen(false);
        fetchStockOutData();
        // Reset form
        setFormData({
          quantity: "",
          reason: "",
          date: new Date().toISOString().split("T")[0],
        });
        setSelectedInventory(null);
      }
    } catch (error) {
      console.error("Error creating stock out:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to record stock out",
        icon: "error",
      });
    }
  };

  const handlePrint = async () => {
    try {
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Stock Out Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Stock Out Report</h2>
              <p>Period: ${fromDate || "All time"} to ${toDate || "Present"}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Ingredient</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                ${stockOutData
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.date}</td>
                    <td>${item.inventoryName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td>${item.reason}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      await window.ipcRenderer.invoke("print-content", {
        content: printContent,
      });
    } catch (error) {
      console.error("Error printing:", error);
    }
  };

  const handleRestockComplete = () => {
    // Refresh inventory data
    fetchInventories();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Out of Ingredients</h1>
        <div className="space-x-2">
          <Button color="primary" onPress={() => setIsModalOpen(true)}>
            New Stock Out
          </Button>
          <Button color="secondary" onPress={handlePrint}>
            Print Report
          </Button>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <Select
              label="Select Ingredient"
              placeholder="Select Ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              color="primary"
            >
              {inventoriesItems.map((inv) => (
                <SelectItem key={inv._id} value={inv._id}>
                  {inv.ingredientName}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex-1">
            <Input
              type="date"
              label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              color="secondary"
            />
          </div>

          <div className="flex-1">
            <Input
              type="date"
              label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              color="success"
            />
          </div>

          <Button color="primary" onPress={fetchStockOutData}>
            Filter
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <Table aria-label="Stock Out Ingredients">
          <TableHeader>
            <TableColumn>Date</TableColumn>
            <TableColumn>Ingredient</TableColumn>
            <TableColumn>Current Stock</TableColumn>
            <TableColumn>Min Threshold</TableColumn>
            <TableColumn>Unit</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {inventories.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.ingredientName}</p>
                    {item.category && (
                      <p className="text-xs text-gray-500">
                        {item.category.name}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={item.currentStock === 0 ? "text-danger" : ""}
                  >
                    {item.currentStock}
                  </span>
                </TableCell>
                <TableCell>{item.minThreshold}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  <Chip
                    color={
                      !item.currentStock || item.currentStock === 0
                        ? "danger"
                        : item.currentStock <= (item.minThreshold || 0)
                        ? "warning"
                        : "success"
                    }
                    size="sm"
                  >
                    {!item.currentStock || item.currentStock === 0
                      ? "No Stock"
                      : item.currentStock <= (item.minThreshold || 0)
                      ? "Low Stock"
                      : "In Stock"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    color={
                      !item.currentStock || item.currentStock === 0
                        ? "danger"
                        : "warning"
                    }
                    onPress={() => {
                      setSelectedInventory(item);
                      setIsModalOpen(true);
                    }}
                  >
                    Restock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Restock
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedInventory={selectedInventory}
        onRestock={handleRestockComplete}
      />
    </div>
  );
};

export default StockOutIngredients;
