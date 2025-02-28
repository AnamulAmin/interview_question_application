import { useState } from "react";
import { FiEdit, FiSearch, FiTrash } from "react-icons/fi";
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
  Card,
  CardBody,
} from "@nextui-org/react";
import useDebounce from "@/hooks/useDebounce";
import AddWeeklyHoliday from "./forms/AddWeeklyHoliday";
import EditWeeklyHoliday from "./forms/EditWeeklyHoliday";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import useGetAllWeeklyHolidays from "@/hooks/GetDataHook/useGetAllWeeklyHolidays";
import { exportUtils } from "@/utils/exportUtils";

export default function WeeklyHoliday(): JSX.Element {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any>(null);
  const [isRender, setIsRender] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search, 500);

  const { holidays, loading, pagination } = useGetAllWeeklyHolidays({
    search: debouncedSearch,
    isRender,
    page,
    limit: parseInt(recordsPerPage),
  });

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const handleDelete = (id: string): void => {
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
            "delete-weekly-holiday",
            { id }
          );

          if (response.success) {
            setIsRender((prev) => !prev);
            toast.success("Weekly holiday deleted successfully");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          console.error("Error deleting weekly holiday:", error);
          toast.error("Failed to delete weekly holiday");
        }
      }
    });
  };

  const handleExport = async (type: string) => {
    try {
      const exportData = holidays.map((holiday, index) => ({
        si: (page - 1) * parseInt(recordsPerPage) + index + 1,
        weeklyLeaveDay: holiday.weeklyLeaveDay,
        status: holiday.status,
      }));

      const filename = `weekly-holidays-${
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
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Weekly Holiday List</h1>
            <Button
              onPress={() => setIsCreateModalOpen(true)}
              color="primary"
              className="font-medium"
            >
              Add Weekly Holiday
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-2">
              <Select
                label="Display"
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(e.target.value)}
                className="w-32"
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
              <span>records per page</span>
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
              />
            </div>
          </div>

          <Table aria-label="Weekly holidays table">
            <TableHeader>
              <TableColumn>SI</TableColumn>
              <TableColumn>Weekly Leave Day</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn align="center">Action</TableColumn>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(parseInt(recordsPerPage))].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : holidays.length > 0 ? (
                holidays.map((holiday, index) => (
                  <TableRow key={holiday._id}>
                    <TableCell>
                      {(page - 1) * parseInt(recordsPerPage) + index + 1}
                    </TableCell>
                    <TableCell>{holiday.weeklyLeaveDay}</TableCell>
                    <TableCell>{holiday.status}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          isIconOnly
                          color="primary"
                          size="sm"
                          onPress={() => handleEdit(holiday)}
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          onPress={() => handleDelete(holiday._id)}
                        >
                          <FiTrash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>Empty for SI</TableCell>
                  <TableCell>No weekly holidays found</TableCell>
                  <TableCell>Empty for Status</TableCell>
                  <TableCell>Empty for Action</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pagination && holidays.length > 0 && (
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
        </CardBody>
      </Card>

      <AddWeeklyHoliday
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditWeeklyHoliday
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
        data={singleData}
        setIsRender={setIsRender}
      />
    </div>
  );
}
