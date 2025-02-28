import { useState, useEffect } from "react";
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
  useDisclosure,
  Pagination,
  Skeleton,
} from "@nextui-org/react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import useGetAllCustomers from "@/hooks/GetDataHook/useGetAllCustomers";
import AddCustomer from "./forms/AddCustomer";
import EditCustomer from "./forms/EditCustomer";
import useDebounce from "@/hooks/useDebounce";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CustomerDetails from "./forms/CustomerDetails";

export default function CustomerList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const { customers, pagination, loading, error } = useGetAllCustomers({
    search: debouncedSearch,
    page,
    limit: parseInt(recordsPerPage),
    isEdit: isEditModalOpen,
    isShowModal: isAddModalOpen,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };
  const handleDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
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
        const response = await window.ipcRenderer.invoke("delete-customer", {
          id,
        });

        if (response.success) {
          Swal.fire("Deleted!", "Customer has been deleted.", "success");
          // The useGetAllCustomers hook will automatically refresh the data
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error: any) {
      Swal.fire("Error!", error.message || "Something went wrong!", "error");
    }
  };

  const exportData = async (type: string) => {
    try {
      // Get all customers for export (without pagination)
      const response = await window.ipcRenderer.invoke("get-customers", {
        data: { search: debouncedSearch, limit: 1000000 }, // Large limit to get all
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      const exportData = response.data.customers.map(
        (customer: any, index: number) => ({
          SI: index + 1,
          "Customer Name": customer.customer_name,
          Email: customer.email,
          Mobile: customer.mobile,
          Address: customer.address || "",
          "VIP Status": customer.is_vip ? "Yes" : "No",
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
    link.setAttribute("download", `customers_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

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
    link.download = `customers_${new Date().toISOString()}.xlsx`;
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
    doc.text("Customer List", 14, 15);

    // Add export date
    doc.setFontSize(8);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 20);

    doc.save(`customers_${new Date().toISOString()}.pdf`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRecordsPerPageChange = (e: any) => {
    setRecordsPerPage(e.target.value);
    setPage(1); // Reset to first page when changing records per page
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
            <Skeleton className="w-32 h-4 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-48 h-4 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-24 h-4 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-40 h-4 rounded" />
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <Button color="primary" onPress={() => setIsAddModalOpen(true)}>
          Add Customer
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

      <Table aria-label="Customer list">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Customer name</TableColumn>
          <TableColumn>Email Address</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>Address</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {loading
            ? renderTableSkeleton()
            : customers.map((customer, index) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    {index + (page - 1) * parseInt(recordsPerPage) + 1}
                  </TableCell>
                  <TableCell>{customer.customer_name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.mobile}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        onPress={() => handleDetails(customer)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        isIconOnly
                        color="secondary"
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

      {!loading && customers.length === 0 && (
        <div className="text-center py-4">No customers found</div>
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
        />
      </div>

      <AddCustomer
        isShowModal={isAddModalOpen}
        setIsShowModal={setIsAddModalOpen}
      />

      <EditCustomer
        isShowModal={isEditModalOpen}
        setIsShowModal={setIsEditModalOpen}
        data={selectedCustomer}
      />

      <CustomerDetails
        isShowModal={isDetailsModalOpen}
        setIsShowModal={setIsDetailsModalOpen}
        data={selectedCustomer}
      />
    </div>
  );
}
