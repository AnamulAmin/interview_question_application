import { useState } from "react";
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
  Spinner,
  Chip,
} from "@nextui-org/react";
import { FiEdit, FiTrash, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AddGenerateSalary from "./forms/AddGenerateSalary";
import EditGenerateSalary from "./forms/EditGenerateSalary";
import useGetAllGeneratedSalaries from "@/hooks/GetDataHook/useGetAllGeneratedSalaries";
import Swal from "sweetalert2";

export default function GenerateSalary() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isRender, setIsRender] = useState(false);

  const { generatedSalaries, loading, pagination } = useGetAllGeneratedSalaries({
    search,
    page,
    limit: recordsPerPage,
    isRender,
  });

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke(
            "delete-generated-salary",
            {
              id,
            }
          );

          if (response.success) {
            toast.success(response.message);
            setIsRender((prev) => !prev);
          } else {
            toast.error(response.message);
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to delete generated salary");
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Generate Salary</h1>
        <div className="flex gap-2">
          <Button
            onPress={() => setIsCreateModalOpen(true)}
            color="primary"
            className="font-medium"
          >
            Generate Now
          </Button>
          <Button color="secondary" className="font-medium">
            Manage Salary Generate
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(e.target.value)}
            className="w-20"
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
          <span>records per page</span>
        </div>

        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startContent={<FiSearch />}
          className="w-64"
        />
      </div>

      <Table aria-label="Generated salaries table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Employee Name</TableColumn>
          <TableColumn>Employee ID</TableColumn>
          <TableColumn>Generate Date</TableColumn>
          <TableColumn>Start Date</TableColumn>
          <TableColumn>End Date</TableColumn>
          <TableColumn>Total Additions</TableColumn>
          <TableColumn>Total Deductions</TableColumn>
          <TableColumn>Net Salary</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={loading ? <Spinner /> : "No generated salaries found"}
          isLoading={loading}
        >
          {generatedSalaries?.map((item: any, index: number) => (
            <TableRow key={item._id}>
              <TableCell>
                {(page - 1) * parseInt(recordsPerPage) + index + 1}
              </TableCell>
              <TableCell>{item.employeeName}</TableCell>
              <TableCell>{item.employee_id}</TableCell>
              <TableCell>
                {new Date(item.generateDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{item.totalAdditions}</TableCell>
              <TableCell>{item.totalDeductions}</TableCell>
              <TableCell className="font-semibold">{item.netSalary}</TableCell>
              <TableCell>
                <Chip
                  color={getStatusColor(item.status)}
                  size="sm"
                  variant="flat"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    isIconOnly
                    color="warning"
                    size="sm"
                    onPress={() => handleEdit(item)}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    onPress={() => handleDelete(item._id)}
                  >
                    <FiTrash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination?.total > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * parseInt(recordsPerPage) + 1} to{" "}
            {Math.min(page * parseInt(recordsPerPage), pagination.total)} of{" "}
            {pagination.total} entries
          </div>
          <Pagination
            total={Math.ceil(pagination.total / parseInt(recordsPerPage))}
            page={page}
            onChange={(newPage) => setPage(newPage)}
            showControls
            color="primary"
            variant="bordered"
          />
        </div>
      )}

      <AddGenerateSalary
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditGenerateSalary
        isShowModal={isEditModalOpen}
        setIsShowModal={setIsEditModalOpen}
        data={selectedData}
        setIsRender={setIsRender}
      />
    </div>
  );
}
