import { useRef, useState } from "react";
import { FiEdit, FiSearch, FiTrash, FiTrash2 } from "react-icons/fi";
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
import { utils, writeFile } from "xlsx";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AddPaymentMethodList from "./forms/AddPaymentMethodList";
import UpdatePaymentMethodList from "./forms/UpdatePaymentMethodList";
import useDebounce from "@/hooks/useDebounce";
import useGetAllPaymentMethods from "@/hooks/GetDataHook/useGetAllPaymentMethods";
import Swal from "sweetalert2";

export default function PaymentMethodList(): JSX.Element {
  const tableRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any>(null);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isRender, setIsRender] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search, 500);

  const { methods, loading, pagination } = useGetAllPaymentMethods({
    search: debouncedSearch,
    isRender: isRender,
    page,
    limit: parseInt(recordsPerPage),
  });

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const exportData = async (type: string) => {
    try {
      const exportData = methods.map((method, index) => ({
        SI: (page - 1) * parseInt(recordsPerPage) + index + 1,
        "Payment Method Name": method.payment_method_name,
        Status: method.status,
      }));

      switch (type) {
        case "copy":
          const text = exportData
            .map((row) => Object.values(row).join("\t"))
            .join("\n");
          await navigator.clipboard.writeText(text);
          toast.success("Data copied to clipboard");
          break;

        case "csv":
          const ws = utils.json_to_sheet(exportData);
          const csv = utils.sheet_to_csv(ws);
          const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const csvUrl = URL.createObjectURL(csvBlob);
          const link = document.createElement("a");
          link.href = csvUrl;
          link.setAttribute("download", "payment-methods.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;

        case "excel":
          const wb = utils.book_new();
          const excelWs = utils.json_to_sheet(exportData);
          utils.book_append_sheet(wb, excelWs, "Payment Methods");
          writeFile(wb, "payment-methods.xlsx");
          break;

        case "pdf":
          const pdf = new jsPDF();
          pdf.setFontSize(16);
          pdf.text("Payment Methods", 14, 15);
          pdf.setFontSize(10);
          pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

          pdf.autoTable({
            head: [Object.keys(exportData[0])],
            body: exportData.map((row) => Object.values(row)),
            startY: 30,
            theme: "grid",
            styles: {
              fontSize: 8,
              cellPadding: 2,
            },
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontSize: 9,
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          });

          pdf.save("payment-methods.pdf");
          break;

        default:
          toast.error("Invalid export type");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const handleDelete = (id: string): void => {
    Swal.fire({
      title: "Are you sure you want to delete this ?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke(
            "delete-payment-method",
            {
              id,
            }
          );

          if (response.success) {
            setIsRender((prev) => !prev);
            toast.success("Payment method deleted successfully");
          } else {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        } catch (error) {
          console.error("Error deleting purchase:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete purchase",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  const handlePrint = async () => {
    await window.ipcRenderer.invoke("print", {
      location: "payment-method-print",
      data: { name: "Hello Anamul !" },
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="flex gap-2">
          <Button className="py-7" onPress={() => exportData("copy")}>
            Copy
          </Button>
          <Button className="py-7" onPress={() => exportData("csv")}>
            CSV
          </Button>
          <Button className="py-7" onPress={() => exportData("excel")}>
            Excel
          </Button>
          <Button className="py-7" onPress={() => exportData("pdf")}>
            Pdf
          </Button>
          <Button className="py-7" onPress={handlePrint}>
            Print
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
            color={"primary"}
            label={
              <div className="flex items-center gap-2">
                <FiSearch className="text-2xl" />
                Search...
              </div>
            }
          />

          <Button
            onPress={() => setIsCreateModalOpen(true)}
            color="primary"
            className="py-7 text-3xl"
          >
            +
          </Button>
        </div>
      </div>

      <Table aria-label="Payment methods table" ref={tableRef}>
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Payment Method Name</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn align="center">Action</TableColumn>
        </TableHeader>
        <TableBody>
          {loading
            ? [...Array(parseInt(recordsPerPage))].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : methods.map((method, index) => (
                <TableRow key={method._id}>
                  <TableCell>
                    {(page - 1) * parseInt(recordsPerPage) + index + 1}
                  </TableCell>
                  <TableCell>{method.payment_method_name}</TableCell>
                  <TableCell>{method.status}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        onPress={() => handleEdit(method)}
                      >
                        <FiEdit />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(method?._id)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {methods.length === 0 && !loading && (
        <div className="flex justify-center items-center h-full mt-10">
          <p className="text-2xl font-bold">No payment methods found</p>
        </div>
      )}

      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * parseInt(recordsPerPage) + 1} to{" "}
            {Math.min(page * parseInt(recordsPerPage), pagination.total)} of{" "}
            {pagination.total} entries
          </div>

          <Pagination
            total={pagination.totalPages}
            page={page}
            onChange={(newPage) => setPage(newPage)}
            showControls
            showShadow
            color="primary"
            variant="faded"
          />
        </div>
      )}

      <AddPaymentMethodList
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <UpdatePaymentMethodList
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
        data={singleData}
        setIsRender={setIsRender}
      />
    </div>
  );
}
