import { useState } from "react";
import { FiEdit, FiTrash, FiSearch } from "react-icons/fi";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination,
  Skeleton,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { exportUtils } from "@/utils/exportUtils";
import Swal from "sweetalert2";
import useGetAllOrders from "@/hooks/GetDataHook/useGetAllOrders";

export default function ReturnOrders(): JSX.Element {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isRender, setIsRender] = useState(false);

  const { orders, loading, pagination } = useGetAllOrders({
    query: `status=Delivered`,
    isRender,
  });

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke("delete-order", {
            id,
          });
          if (response.success) {
            toast.success(response.message);
            setIsRender((prev) => !prev);
          } else {
            toast.error(response.message);
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to delete order");
        }
      }
    });
  };

  const handleExport = async (type: string) => {
    try {
      const exportData = orders.map((order, index) => ({
        "SL No": (page - 1) * parseInt(recordsPerPage) + index + 1,
        "Order ID": order.orderId,
        "Customer Name": order.customerName,
        "Order Date": order.orderDate,
        Status: order.status,
        Total: order.total,
      }));

      const filename = `pending-orders-${
        new Date().toISOString().split("T")[0]
      }`;

      switch (type) {
        case "copy":
          await exportUtils.copyToClipboard(exportData);
          toast.success("Copied to clipboard");
          break;
        case "csv":
          exportUtils.exportToCSV(exportData, filename);
          toast.success("CSV file downloaded");
          break;
        case "excel":
          exportUtils.exportToExcel(exportData, filename);
          toast.success("Excel file downloaded");
          break;
        case "pdf":
          exportUtils.exportToPDF(exportData, filename);
          toast.success("PDF file downloaded");
          break;
        case "print":
          exportUtils.print(exportData);
          break;
        default:
          toast.error("Invalid export type");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const statusBgColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "#90EE90"; // Light green
      case "canceled":
        return "#FFB6C1"; // Light red
      case "pending":
        return "#FFE4B5"; // Light orange
      case "shipped":
        return "#ADD8E6"; // Light blue
      case "returned":
        return "#E6E6FA"; // Light purple
      case "processing":
        return "#F0F0F0"; // Light gray
      case "completed":
        return "#FFFACD"; // Light yellow
      case "cancelled":
        return "#FFB6C1"; // Light red (same as canceled)
      default:
        return "#E6E6FA"; // Light purple
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pending Orders</h1>
      </div>

      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Select
            label="Display Per Page"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(e.target.value)}
            className="w-52"
            variant="bordered"
          >
            <SelectItem key="25" value="25">
              25
            </SelectItem>
            <SelectItem key="50" value="50">
              50
            </SelectItem>
            <SelectItem key="100" value="100">
              100
            </SelectItem>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            color="primary"
            variant="flat"
            onPress={() => handleExport("copy")}
          >
            Copy
          </Button>
          <Button
            color="primary"
            variant="flat"
            onPress={() => handleExport("csv")}
          >
            CSV
          </Button>
          <Button
            color="primary"
            variant="flat"
            onPress={() => handleExport("excel")}
          >
            Excel
          </Button>
          <Button
            color="primary"
            variant="flat"
            onPress={() => handleExport("pdf")}
          >
            PDF
          </Button>
          <Button
            color="primary"
            variant="flat"
            onPress={() => handleExport("print")}
          >
            Print
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<FiSearch />}
            className="w-64"
            color="secondary"
          />
        </div>
      </div>

      <Table aria-label="Pending orders table">
        <TableHeader>
          <TableColumn>Order ID</TableColumn>
          <TableColumn>Customer Name</TableColumn>
          <TableColumn>Order Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell>
                <Skeleton className="h-8 w-full rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-full rounded" />
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.username}</TableCell>
                <TableCell>{order.order_placed_date}</TableCell>
                <TableCell>
                  <span
                    style={{ backgroundColor: statusBgColor(order.status) }}
                    className="text-xs font-semibold px-2 py-1 rounded"
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => handleDelete(order.id)}
                    >
                      <FiTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={pagination.totalPages}
            page={page}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
