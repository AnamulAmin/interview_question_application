import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
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
import { FiSearch } from "react-icons/fi";
import AddLeaveApplication from "./forms/AddLeaveApplication";
import EditLeaveApplication from "./forms/EditLeaveApplication";
import { toast } from "react-hot-toast";
import useGetAllLeaveApplications from "@/hooks/GetDataHook/useGetAllLeaveApplications";
import { exportUtils } from "@/utils/exportUtils";
import Swal from "sweetalert2";

export default function LeaveApplication(): JSX.Element {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isRender, setIsRender] = useState(false);

  const { applications, loading, pagination } = useGetAllLeaveApplications({
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke(
            "delete-leave-application",
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
          toast.error(error.message || "Failed to delete leave application");
        }
      }
    });
  };

  const handleExport = async (type: string) => {
    try {
      const exportData = applications.map((app, index) => ({
        "SL No": (page - 1) * parseInt(recordsPerPage) + index + 1,
        Name: app.employeeName,
        "Leave Type": app.leaveType,
        "Application Start Date": app.applicationStartDate,
        "Application End date": app.applicationEndDate,
        "Approve Start Date": app.approveStartDate || "0000-00-00",
        "Approved End Date": app.approvedEndDate || "0000-00-00",
        Days: app.days,
        "Approved Day": app.approvedDay || 0,
      }));

      const filename = `leave-applications-${
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leave</h1>
        <div className="flex gap-2">
          <Button
            onPress={() => setIsCreateModalOpen(true)}
            color="primary"
            className="font-medium"
          >
            Others Leave
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

      <Table aria-label="Leave applications table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Leave Type</TableColumn>
          <TableColumn>Application Start Date</TableColumn>
          <TableColumn>Application End date</TableColumn>
          <TableColumn>Approve Start Date</TableColumn>
          <TableColumn>Approved End Date</TableColumn>
          <TableColumn>Days</TableColumn>
          <TableColumn>Approved Day</TableColumn>
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
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
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
          ) : applications.length > 0 ? (
            applications.map((application, index) => (
              <TableRow key={application._id}>
                <TableCell>
                  {(page - 1) * parseInt(recordsPerPage) + index + 1}
                </TableCell>
                <TableCell>{application.employeeName}</TableCell>
                <TableCell>{application.leaveType}</TableCell>
                <TableCell>{application.applicationStartDate}</TableCell>
                <TableCell>{application.applicationEndDate}</TableCell>
                <TableCell>
                  {application.approveStartDate || "0000-00-00"}
                </TableCell>
                <TableCell>
                  {application.approvedEndDate || "0000-00-00"}
                </TableCell>
                <TableCell>{application.days}</TableCell>
                <TableCell>{application.approvedDay || 0}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      isIconOnly
                      color="warning"
                      size="sm"
                      onPress={() => handleEdit(application)}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onPress={() => handleDelete(application._id)}
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
              <TableCell>No applications found</TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
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

      {pagination && applications.length > 0 && (
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

      <AddLeaveApplication
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditLeaveApplication
        isShowModal={isEditModalOpen}
        setIsShowModal={setIsEditModalOpen}
        data={selectedData}
        setIsRender={setIsRender}
      />
    </div>
  );
}
