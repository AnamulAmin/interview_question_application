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
  Chip,
} from "@nextui-org/react";
import AddLeaveType from "./forms/AddLeaveType";
import EditLeaveType from "./forms/EditLeaveType";
import { toast } from "react-hot-toast";
import useGetAllLeaveTypes from "@/hooks/GetDataHook/useGetAllLeaveTypes";
import { exportUtils } from "@/utils/exportUtils";
import Swal from "sweetalert2";

export default function LeaveType(): JSX.Element {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isRender, setIsRender] = useState(false);

  const { leaveTypes, loading, pagination } = useGetAllLeaveTypes({
    search,
    page,
    limit: parseInt(recordsPerPage),
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke(
            "delete-leave-type",
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
          toast.error(error.message || "Failed to delete leave type");
        }
      }
    });
  };

  const handleExport = async (type: string) => {
    try {
      const exportData = leaveTypes.map((leaveType, index) => ({
        "SL No": (page - 1) * parseInt(recordsPerPage) + index + 1,
        Name: leaveType.name,
        Description: leaveType.description || "",
        "Max Days": leaveType.maxDays,
        Status: leaveType.status,
      }));

      const filename = `leave-types-${new Date().toISOString().split("T")[0]}`;

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leave Types</h1>
        <div className="flex gap-2">
          <Button
            onPress={() => setIsCreateModalOpen(true)}
            color="primary"
            className="font-medium"
          >
            Add Leave Type
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

      <Table aria-label="Leave types table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Max Days</TableColumn>
          <TableColumn>Status</TableColumn>
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
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ) : leaveTypes.length > 0 ? (
            leaveTypes.map((leaveType, index) => (
              <TableRow key={leaveType._id}>
                <TableCell>
                  {(page - 1) * parseInt(recordsPerPage) + index + 1}
                </TableCell>
                <TableCell>{leaveType.name}</TableCell>
                <TableCell>{leaveType.description || "-"}</TableCell>
                <TableCell>{leaveType.maxDays}</TableCell>
                <TableCell>
                  <Chip
                    color={leaveType.status === "Active" ? "success" : "danger"}
                    variant="flat"
                  >
                    {leaveType.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      isIconOnly
                      color="warning"
                      size="sm"
                      onPress={() => handleEdit(leaveType)}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onPress={() => handleDelete(leaveType._id)}
                    >
                      <FiTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>No leave types found</TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && leaveTypes.length > 0 && (
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
            variant="bordered"
          />
        </div>
      )}

      <AddLeaveType
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditLeaveType
        isShowModal={isEditModalOpen}
        setIsShowModal={setIsEditModalOpen}
        data={selectedData}
        setIsRender={setIsRender}
      />
    </div>
  );
}
