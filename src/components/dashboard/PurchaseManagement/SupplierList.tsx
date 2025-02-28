import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaEdit, FaTrash, FaFileExport, FaSearch } from "react-icons/fa";
import AddSupplier from "./forms/AddSupplier";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import useGetAllSuppliers from "@/hooks/GetDataHook/useGetAllSuppliers";
import useDebounce from "@/hooks/useDebounce";
import EditSupplier from "./forms/EditSupplier";
import { CiSearch } from "react-icons/ci";
import Swal from "sweetalert2";

interface Supplier {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  balance: number;
}

const SupplierList = () => {
  // const [suppliers] = useState<Supplier[]>([
  //   {
  //     id: 1,
  //     name: "A supplier testing",
  //     email: "supplier@gmail.com",
  //     mobile: "41641414141",
  //     address: "3622 dufferin street",
  //     balance: 25000,
  //   },
  //   {
  //     id: 2,
  //     name: "test canada supplier",
  //     email: "adam@ikotij.ca",
  //     mobile: "899989098",
  //     address: "899809809",
  //     balance: 0,
  //   },
  //   {
  //     id: 3,
  //     name: "Alhadji Musa",
  //     email: "musa@gmail.com",
  //     mobile: "678550319",
  //     address: "Akwa",
  //     balance: 0,
  //   },
  //   {
  //     id: 4,
  //     name: "Coca Cocal",
  //     email: "cocacola@gmail.com",
  //     mobile: "71345465",
  //     address: "Karo house",
  //     balance: 0,
  //   },
  //   {
  //     id: 5,
  //     name: "vanessa",
  //     email: "vanessa@gmail.com",
  //     mobile: "71838838",
  //     address: "kanyosha gisyo",
  //     balance: 0,
  //   },
  //   {
  //     id: 6,
  //     name: "Noksi Shop",
  //     email: "",
  //     mobile: "0987654321",
  //     address: "",
  //     balance: 0,
  //   },
  //   {
  //     id: 7,
  //     name: "Usman",
  //     email: "mianprince397@yahoo.com",
  //     mobile: "923368695554",
  //     address: "",
  //     balance: 0,
  //   },
  // ]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [singleData, setSingleData] = useState<any>(null);
  const debounceValue = useDebounce(searchTerm, 500);

  const exportOptions = [
    { key: "copy", name: "Copy" },
    { key: "csv", name: "CSV" },
    { key: "excel", name: "Excel" },
    { key: "pdf", name: "PDF" },
    { key: "print", name: "Print" },
  ];

  const handleExport = (key: string) => {
    switch (key) {
      case "copy":
        handleCopyToClipboard();
        break;
      case "csv":
        exportToCSV();
        break;
      case "excel":
        exportToExcel();
        break;
      case "pdf":
        exportToPDF();
        break;
      case "print":
        handlePrint();
        break;
      default:
        console.log("Invalid export option");
    }
  };

  const handleCopyToClipboard = () => {
    const data = suppliers
      .map((supplier) => Object.values(supplier).join("\t"))
      .join("\n");

    navigator.clipboard
      .writeText(data)
      .then(() => alert("Data copied to clipboard!"))
      .catch((err) => console.error("Failed to copy data:", err));
  };

  const exportToCSV = () => {
    const header = ["ID", "Name", "Email", "Mobile", "Address", "Balance"];
    const data = suppliers.map((supplier) => [
      supplier.id,
      supplier.name,
      supplier.email,
      supplier.mobile,
      supplier.address,
      supplier.balance,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, "suppliers.csv");
  };

  const exportToExcel = () => {
    const header = ["ID", "Name", "Email", "Mobile", "Address", "Balance"];
    const data = suppliers.map((supplier) => [
      supplier.id,
      supplier.name,
      supplier.email,
      supplier.mobile,
      supplier.address,
      supplier.balance,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, "suppliers.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const header = [["ID", "Name", "Email", "Mobile", "Address", "Balance"]];
    const data = suppliers.map((supplier) => [
      supplier.id,
      supplier.name,
      supplier.email,
      supplier.mobile,
      supplier.address,
      supplier.balance,
    ]);

    // @ts-ignore
    autoTable(doc, {
      head: header,
      body: data,
      startY: 20,
      margin: { top: 20 },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("suppliers.pdf");
  };

  const handlePrint = async () => {
    // Create the HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Suppliers List</title>
          <style>
            body { 
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 { 
              text-align: center;
              color: #333;
              margin-bottom: 20px;
            }
            table { 
              border-collapse: collapse; 
              width: 100%;
              margin-bottom: 20px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px 8px;
              text-align: left;
            }
            th { 
              background-color: #f4f4f4;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <h1>Suppliers List</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              ${suppliers
                .map(
                  (supplier) => `
                <tr>
                  <td>${supplier.id}</td>
                  <td>${supplier.name}</td>
                  <td>${supplier.email || "-"}</td>
                  <td>${supplier.mobile}</td>
                  <td>${supplier.address || "-"}</td>
                  <td>${supplier.balance.toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Send the print content to the main process
    if (window.electron) {
      try {
        await window.electron.ipcRenderer.invoke("print-to-pdf", printContent);
      } catch (error) {
        console.error("Print failed:", error);
      }
    } else {
      // Fallback to browser printing when Electron is not available
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const {
    suppliers,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
  } = useGetAllSuppliers({
    isEdited,
    isDeleted,
    isShowModal: isAddModalOpen,
    filters: {
      search: debounceValue,
      page: page,
      limit: rowsPerPage,
    },
  });

  const handleEdit = (data: any) => {
    setIsEdited(true);
    setSingleData(data);
  };

  const handleDelete = (id: any): void => {
    Swal.fire({
      title: "Are you sure you want to delete this MenuType?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        interface editMenuResponse {
          success: boolean;
          message: string;
        }

        const receiveData: editMenuResponse = await window.ipcRenderer.invoke(
          "delete-supplier",
          { data: { _id: id } }
        );

        console.log(receiveData, "receiveData");

        if (receiveData.success) {
          setIsDeleted(true);
          Swal.fire({
            title: "Success!",
            text: receiveData.message,
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            setIsDeleted(false);
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: receiveData.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    handlePageChange(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setPage(1);
    handleLimitChange(newLimit);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supplier List</h1>
        <Button
          color="danger"
          variant="flat"
          onPress={() => setIsAddModalOpen(true)}
          startContent={<span>+</span>}
        >
          Add Supplier
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Select
          className="w-[250px]"
          value={rowsPerPage.toString()}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          label="Display per page"
          color="secondary"
        >
          <SelectItem key={10} value="10">
            10
          </SelectItem>
          <SelectItem key={25} value="25">
            25
          </SelectItem>
          <SelectItem key={50} value="50">
            50
          </SelectItem>
          <SelectItem key={100} value="100">
            100
          </SelectItem>
        </Select>

        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="py-7 w-44" color="primary">
                Export
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Export Options"
              onAction={(key) => handleExport(key.toString())}
            >
              {exportOptions.map((option) => (
                <DropdownItem key={option.key}>{option.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
            label={
              <div className="flex items-center gap-2">
                <CiSearch className="text-2xl" />
                Search ...
              </div>
            }
            color="success"
          />
        </div>
      </div>

      <Table
        aria-label="Supplier list table"
        bottomContent={
          <div className="flex w-full justify-between items-center">
            <span className="ml-4 text-small  text-black">
              Total {pagination.total} suppliers
            </span>
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={pagination.page}
              total={pagination.totalPages}
              onChange={onPageChange}
              boundaries={2}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Supplier Name</TableColumn>
          <TableColumn>Email Address</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>Address</TableColumn>
          <TableColumn>Balance</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell>
                <div className="flex justify-center">Loading...</div>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ) : suppliers.length === 0 ? (
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell>
                <div className="flex justify-center">No suppliers found</div>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier: any, index: number) => (
              <TableRow key={supplier._id}>
                <TableCell>
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </TableCell>
                <TableCell>{supplier.supplierName}</TableCell>
                <TableCell>{supplier.email || "-"}</TableCell>
                <TableCell>{supplier.mobile}</TableCell>
                <TableCell>{supplier.address || "-"}</TableCell>
                <TableCell>{supplier.previousCreditBalance || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      color="primary"
                      size="sm"
                      aria-label="Edit"
                      onPress={() => handleEdit(supplier)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      aria-label="Delete"
                      onPress={() => handleDelete(supplier._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AddSupplier
        isShowModal={isAddModalOpen}
        setIsShowModal={() => setIsAddModalOpen(false)}
        suppliers={suppliers}
      />

      <EditSupplier
        isShowModal={isEdited}
        setIsShowModal={() => setIsEdited(false)}
        singleData={singleData}
      />
    </div>
  );
};

export default SupplierList;
