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
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import AddSalaryType from "./forms/AddSalaryType";
import EditSalaryType from "./forms/EditSalaryType";
import useGetAllSalaryType from "@/hooks/GetDataHook/useGetAllSalaryType";

export default function SalaryTypes() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isRender, setIsRender] = useState(false);

  const { salaryTypes, loading, pagination } = useGetAllSalaryType({
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke(
            "delete-salary-type",
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
  return (
    <div className="p-6 py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Salary Types</h1>
        <Button
          onPress={() => setIsCreateModalOpen(true)}
          color="primary"
          className="font-medium"
        >
          Add Salary Type
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Select
          label="Display Per Page"
          value={recordsPerPage}
          onChange={(e) => setRecordsPerPage(e.target.value)}
          className="w-64"
          color="primary"
        >
          <SelectItem key="10" value="">
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

        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startContent={<FiSearch />}
          className="w-64"
          color="secondary"
        />
      </div>

      <Table aria-label="Salary types table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Salary Type</TableColumn>
          <TableColumn>Action</TableColumn>
          <TableColumn align="center">Operations</TableColumn>
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
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ) : salaryTypes.length > 0 ? (
            salaryTypes.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  {(page - 1) * parseInt(recordsPerPage) + index + 1}
                </TableCell>
                <TableCell>{item.salaryType}</TableCell>
                <TableCell>{item.action}</TableCell>
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
            ))
          ) : (
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>No salary types found</TableCell>
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
          )}
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

      <AddSalaryType
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditSalaryType
        isShowModal={isEditModalOpen}
        setIsShowModal={setIsEditModalOpen}
        data={selectedData}
        setIsRender={setIsRender}
      />
    </div>
  );
}
