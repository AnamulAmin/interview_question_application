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
} from "@nextui-org/react";
import useDebounce from "@/hooks/useDebounce";
import useGetAllPaymentSetups from "@/hooks/GetDataHook/useGetAllPaymentSetups";
import AddPaymentSetup from "./forms/AddPaymentSetup";
import EditPaymentSetup from "./forms/EditPaymentSetup";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

export default function PaymentSetup(): JSX.Element {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any>(null);
  const [isRender, setIsRender] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search, 500);

  const { setups, loading, pagination } = useGetAllPaymentSetups({
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
      title: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke(
            "delete-payment-setup",
            {
              id,
            }
          );

          if (response.success) {
            setIsRender((prev) => !prev);
            toast.success("Payment setup deleted successfully");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          console.error("Error deleting payment setup:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete payment setup",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(e.target.value)}
            className="w-48"
            label="Display Per Page"
            variant="flat"
            color={"secondary"}
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

        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
            color={"primary"}
            label={
              <div className="flex items-center gap-2">
                <FiSearch className="text-2xl" />
                Search...
              </div>
            }
          />

          <Button
            onPress={() => setIsCreateModalOpen(true)}
            color="primary"
            className="py-7 text-3xl"
          >
            +
          </Button>
        </div>
      </div>

      <Table aria-label="Payment setups table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Payment Method Name</TableColumn>
          <TableColumn>Email Address/Location ID</TableColumn>
          <TableColumn>Merchant ID/Application ID</TableColumn>
          <TableColumn>Currency</TableColumn>
          <TableColumn>Mode</TableColumn>
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
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : setups.length > 0 ? (
            setups.map((setup, index) => (
              <TableRow key={setup._id}>
                <TableCell>
                  {(page - 1) * parseInt(recordsPerPage) + index + 1}
                </TableCell>
                <TableCell>{setup.name}</TableCell>
                <TableCell>{setup.email}</TableCell>
                <TableCell>{setup.merchantId || "N/A"}</TableCell>
                <TableCell>{setup.currency}</TableCell>
                <TableCell>{setup.mode}</TableCell>
                <TableCell>{setup.status}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      isIconOnly
                      color="primary"
                      size="sm"
                      onPress={() => handleEdit(setup)}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onPress={() => handleDelete(setup._id)}
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
              <TableCell>No payment setups found</TableCell>
              <TableCell>Empty for Email</TableCell>
              <TableCell>Empty for Merchant ID</TableCell>
              <TableCell>Empty for Currency</TableCell>
              <TableCell>Empty for Mode</TableCell>
              <TableCell>Empty for Status</TableCell>
              <TableCell>Empty for Action</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && setups.length > 0 && (
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
            variant="faded"
          />
        </div>
      )}

      <AddPaymentSetup
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditPaymentSetup
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
        data={singleData}
        setIsRender={setIsRender}
      />
    </div>
  );
}
