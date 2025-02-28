import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableColumn,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination,
  Skeleton,
} from "@nextui-org/react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import EditThirdPartyCustomer from "./forms/EditThirdPartyCustomer";
import AddThirdPartyCustomer from "./forms/AddThirdPartyCustomer";
import useGetAllThirdPartyCustomers from "@/hooks/GetDataHook/useGetAllThirdPartyCustomers";
import Swal from "sweetalert2";
import useDebounce from "@/hooks/useDebounce";
import { utils, writeFile } from "xlsx";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ThirdPartyCustomer {
  id: number;
  companyName: string;
  commission: string;
  address: string;
}

const ThirdPartyCustomers: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any>(null);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search, 500);

  const { customers, pagination, loading } = useGetAllThirdPartyCustomers({
    search: debouncedSearch,
    page,
    limit: parseInt(recordsPerPage),
    isEdit: isEdited,
    isShowModal: isCreateModalOpen,
    isDelete: isDeleted,
  });

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        setIsDeleted(true);
        setIsDeleted(true);
        const response = await window.ipcRenderer.invoke(
          "delete-third-party-customer",
          { id }
        );

        if (response.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Third party customer has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error: any) {
      Swal.fire("Error!", error.message || "Failed to delete", "error");
    } finally {
      setIsDeleted(false);
    }
  };

  const exportData = async (type: string) => {
    try {
      const exportData = customers.map((customer, index) => ({
        SI: (page - 1) * parseInt(recordsPerPage) + index + 1,
        "Company Name": customer.companyName,
        Commission: customer.commission,
        Address: customer.address,
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
          link.setAttribute("download", "third-party-customers.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;

        case "excel":
          const wb = utils.book_new();
          const excelWs = utils.json_to_sheet(exportData);
          utils.book_append_sheet(wb, excelWs, "Third Party Customers");
          writeFile(wb, "third-party-customers.xlsx");
          break;

        case "pdf":
          const pdf = new jsPDF();

          // Add title
          pdf.setFontSize(16);
          pdf.text("Third Party Customers", 14, 15);

          // Add timestamp
          pdf.setFontSize(10);
          pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

          // Add table
          pdf.autoTable({
            head: [Object.keys(exportData[0])],
            body: exportData.map((row) => Object.values(row)),
            startY: 30,
            theme: "grid",
            styles: {
              fontSize: 8,
              cellPadding: 2,
              overflow: "linebreak",
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

          // Save the PDF
          pdf.save("third-party-customers.pdf");
          break;

        default:
          toast.error("Invalid export type");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(e.target.value)}
            className="w-48"
            label="Display per page"
            color="primary"
            variant="bordered"
          >
            <SelectItem key="10" value="10">
              10
            </SelectItem>
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
            PDF
          </Button>
          <Button className="py-7" onPress={() => window.print()}>
            Print
          </Button>
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
          color="secondary"
          label={
            <div className="flex items-center gap-2">
              <FiSearch className="w-4 h-4" />
              <span>Search...</span>
            </div>
          }
        />

        <Button
          onPress={() => setIsCreateModalOpen(true)}
          color="primary"
          className="py-7 text-2xl"
        >
          +
        </Button>
      </div>

      <Table aria-label="Third-party customers table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Company Name</TableColumn>
          <TableColumn>Commission</TableColumn>
          <TableColumn>Address</TableColumn>
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
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : customers.map((customer, index) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    {(page - 1) * parseInt(recordsPerPage) + index + 1}
                  </TableCell>
                  <TableCell>{customer.companyName}</TableCell>
                  <TableCell>{customer.commission}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        onPress={() => handleEdit(customer)}
                      >
                        <FiEdit />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(customer._id)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {(page - 1) * parseInt(recordsPerPage) + 1} to{" "}
          {Math.min(page * parseInt(recordsPerPage), customers.length)} of{" "}
          {customers.length} entries
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

      <AddThirdPartyCustomer
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
      />

      <EditThirdPartyCustomer
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
        data={singleData}
      />
    </div>
  );
};

export default ThirdPartyCustomers;
