import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
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
  Skeleton,
  Pagination,
} from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import useDebounce from "@/hooks/useDebounce";
import AddCustomerType from "./forms/AddCustomerType";
import EditCustomerType from "./forms/EditCustomerType";
import useGetAllCustomerTypes from "@/hooks/GetDataHook/useGetAllCustomerTypes";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

export default function CustomerType() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const { customerTypes, pagination, loading, error } = useGetAllCustomerTypes({
    search: debouncedSearch,
    page,
    limit: parseInt(recordsPerPage),
    isEdit: isEdited,
    isShowModal: isCreateModalOpen,
    isDelete: isDeleteModalOpen,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleEdit = (data: any) => {
    setSelectedType(data);
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
        setIsDeleteModalOpen(true);
        const response = await window.ipcRenderer.invoke(
          "delete-customer-type",
          {
            id,
          }
        );

        if (response.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Customer type has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          setIsDeleteModalOpen(false);
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error: any) {
      Swal.fire("Error!", error.message || "Failed to delete", "error");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const exportData = async (type: string) => {
    try {
      // Get all customer types for export (without pagination)
      const response = await window.ipcRenderer.invoke("get-customer-types", {
        data: { search: debouncedSearch, limit: 1000000 }, // Large limit to get all
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      const exportData = response.data.customerTypes.map(
        (type: any, index: number) => ({
          SI: index + 1,
          "Type Name": type.type_name,
        })
      );

      switch (type) {
        case "copy":
          await copyToClipboard(exportData);
          break;
        case "csv":
          exportToCSV(exportData);
          break;
        case "excel":
          exportToExcel(exportData);
          break;
        case "pdf":
          exportToPDF(exportData);
          break;
        default:
          console.error("Invalid export type");
      }
    } catch (error: any) {
      Swal.fire("Error!", error.message || "Export failed", "error");
    }
  };

  const copyToClipboard = async (data: any[]) => {
    const text = data.map((row) => Object.values(row).join("\t")).join("\n");

    await navigator.clipboard.writeText(text);
    Swal.fire({
      title: "Success!",
      text: "Data copied to clipboard",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const exportToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => `"${row[header]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `customer_types_${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Types");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save to file
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customer_types_${new Date().toISOString()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: any[]) => {
    const doc = new jsPDF();
    const headers = Object.keys(data[0]);

    doc.autoTable({
      head: [headers],
      body: data.map((row) => Object.values(row)),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { top: 20 },
    });

    // Add title
    doc.setFontSize(16);
    doc.text("Customer Type List", 14, 15);

    // Add export date
    doc.setFontSize(8);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 20);

    doc.save(`customer_types_${new Date().toISOString()}.pdf`);
  };

  const renderTableSkeleton = () => {
    return Array(parseInt(recordsPerPage))
      .fill(0)
      .map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="w-8 h-4 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-48 h-4 rounded" />
          </TableCell>
          <TableCell>
            <div className="flex justify-end gap-2">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRecordsPerPageChange = (e: any) => {
    setRecordsPerPage(e.target.value);
    setPage(1); // Reset to first page when changing records per page
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Type List</h1>
        <Button color="primary" onPress={() => setIsCreateModalOpen(true)}>
          Add Customer Type
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Select
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
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
          <Button onPress={() => exportData("copy")}>Copy</Button>
          <Button onPress={() => exportData("csv")}>CSV</Button>
          <Button onPress={() => exportData("excel")}>Excel</Button>
          <Button onPress={() => exportData("pdf")}>PDF</Button>
          <Button onPress={() => window.print()}>Print</Button>
        </div>

        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
          color="secondary"
          label={
            <div className="flex items-center gap-2">
              <FiSearch className="w-4 h-4" />
              <span>Search...</span>
            </div>
          }
        />
      </div>

      <Table aria-label="Customer type list">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Type name</TableColumn>
          <TableColumn align="right">Action</TableColumn>
        </TableHeader>
        <TableBody>
          {loading
            ? renderTableSkeleton()
            : customerTypes.map((type, index) => (
                <TableRow key={type._id}>
                  <TableCell>
                    {index + (page - 1) * parseInt(recordsPerPage) + 1}
                  </TableCell>
                  <TableCell>{type.type_name}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        onPress={() => handleEdit(type)}
                      >
                        <FiEdit />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(type._id)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {!loading && customerTypes.length === 0 && (
        <div className="text-center py-4">No customer types found</div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {(page - 1) * parseInt(recordsPerPage) + 1} to{" "}
          {Math.min(page * parseInt(recordsPerPage), pagination.total)} of{" "}
          {pagination.total} entries
        </div>

        <Pagination
          total={pagination.totalPages}
          page={page}
          onChange={handlePageChange}
          showControls
          showShadow
          color="primary"
          className="mt-4"
          variant="faded"
        />
      </div>

      <AddCustomerType
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
      />

      <EditCustomerType
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
        data={selectedType}
      />
    </div>
  );
}
