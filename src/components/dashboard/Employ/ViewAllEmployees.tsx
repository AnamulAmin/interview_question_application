import { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
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
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import EmployCreate from "./EmployCreate";
import EmployDetail from "./EmployeeDetail";
import EmployEdit from "./EmployeeEdit";
import useGetAllEmploys from "../../../hooks/GetDataHook/useGetAllEmploys";
import { exportUtils } from "@/utils/exportUtils";
import useGetAllDesignation from "@/hooks/GetDataHook/useGetAllDesignation";

export default function ViewAllEmployees(): JSX.Element {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [selectedRoles, setSelectedRoles] = useState("");
  const [singleData, setSingleData] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { designations } = useGetAllDesignation({ role: "Designation" });

  const { employees = [], loading } = useGetAllEmploys({
    role: selectedRoles,
    isEdited,
    isShowModal: isCreateModalOpen,
    isDeleted,
  }) || { employees: [], loading: true };

  console.log(employees, loading, "employs , loading");

  const filteredEmployees = employees.filter((employee: any) => {
    if (!search && !selectedRoles) return true;
    const searchLower = search.toLowerCase();
    return (
      employee?.firstName?.toLowerCase().includes(searchLower) ||
      employee?.lastName?.toLowerCase().includes(searchLower) ||
      employee?.email?.toLowerCase().includes(searchLower) ||
      employee?.phone?.toLowerCase().includes(searchLower) ||
      employee?.roles?.join(", ").toLowerCase().includes(searchLower) ||
      employee?.designation.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const handleDetail = (data: any): void => {
    setSingleData(data);
    setIsDetailOpen(true);
  };

  const handleDelete = (data: any): void => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await window.ipcRenderer.invoke("delete-employee", {
          data,
        });

        if (response.success) {
          setIsDeleted(true);
          Swal.fire("Deleted!", response.message, "success").then(() => {
            setIsDeleted(false);
          });
        } else {
          Swal.fire("Error!", response.message, "error");
        }
      }
    });
  };

  const handleExport = async (type: string) => {
    try {
      const exportData = filteredEmployees.map((emp: any, index: number) => ({
        "SL No": (page - 1) * parseInt(recordsPerPage) + index + 1,
        "Full Name": emp.firstName + " " + emp.lastName,
        Role: emp.roles?.join(", "),
        Phone: emp.phone,
        Email: emp.email,
        Address: emp.address,
      }));

      const filename = `employees-${new Date().toISOString().split("T")[0]}`;

      switch (type) {
        case "copy":
          await exportUtils.copyToClipboard(exportData);
          Swal.fire("Success", "Copied to clipboard", "success");
          break;
        case "csv":
          exportUtils.exportToCSV(exportData, filename);
          Swal.fire("Success", "CSV file downloaded", "success");
          break;
        case "excel":
          exportUtils.exportToExcel(exportData, filename);
          Swal.fire("Success", "Excel file downloaded", "success");
          break;
        case "pdf":
          exportUtils.exportToPDF(exportData, filename);
          Swal.fire("Success", "PDF file downloaded", "success");
          break;
        case "print":
          exportUtils.print(exportData);
          break;
        default:
          Swal.fire("Error", "Invalid export type", "error");
      }
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export data", "error");
    }
  };

  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * parseInt(recordsPerPage),
    page * parseInt(recordsPerPage)
  );

  const totalPages = Math.ceil(
    filteredEmployees.length / parseInt(recordsPerPage)
  );

  console.log(selectedRoles, "selectedRoles");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        <div className="flex gap-2">
          <Button
            onPress={() => setIsCreateModalOpen(true)}
            color="primary"
            className="font-medium"
          >
            Create Employee
          </Button>
        </div>
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

      <Table aria-label="Employees table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Full Name</TableColumn>
          <TableColumn>Designation</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn align="center">Action</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((employee: any, index: number) => (
              <TableRow key={employee._id}>
                <TableCell>
                  {(page - 1) * parseInt(recordsPerPage) + index + 1}
                </TableCell>
                <TableCell>
                  {employee.first_name} {employee.last_name}
                </TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Tooltip content="View Details">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        onPress={() => handleDetail(employee)}
                      >
                        <FaEye />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Edit">
                      <Button
                        isIconOnly
                        color="warning"
                        size="sm"
                        onPress={() => handleEdit(employee)}
                      >
                        <FiEdit />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete">
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(employee)}
                      >
                        <FiTrash />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <div className="text-center py-6">
                  <p className="text-gray-500 text-lg">No employees found</p>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!loading && filteredEmployees.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * parseInt(recordsPerPage) + 1} to{" "}
            {Math.min(
              page * parseInt(recordsPerPage),
              filteredEmployees.length
            )}{" "}
            of {filteredEmployees.length} entries
          </div>
          <Pagination
            total={totalPages}
            page={page}
            onChange={(newPage) => setPage(newPage)}
            showControls
            showShadow
            color="primary"
            variant="bordered"
          />
        </div>
      )}

      <EmployCreate
        setIsShowModal={setIsCreateModalOpen}
        isShowModal={isCreateModalOpen}
        singleData={singleData}
        isEdit={isEdited}
        setIsEdit={setIsEdited}
        singleEmployee={singleData}
      />

      <EmployDetail
        data={singleData}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      {/* {isEdited && (
        <EmployEdit
          singleData={singleData}
          setIsShowModal={setIsEdited}
          isShowModal={isEdited}
        />
      )} */}
    </div>
  );
}
