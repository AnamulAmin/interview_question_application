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
} from "@nextui-org/react";
import { FiEdit, FiTrash, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AddBank from "./forms/AddBank";
import EditBank from "./forms/EditBank";
import useGetAllBanks from "@/hooks/GetDataHook/useGetAllBanks";
import Swal from "sweetalert2";

const BankList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isRender, setIsRender] = useState(false);

  const { banks, loading, pagination } = useGetAllBanks({
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
          const response = await window.ipcRenderer.invoke("delete-bank", {
            id,
          });

          if (response.success) {
            toast.success(response.message);
            setIsRender((prev) => !prev);
          } else {
            toast.error(response.message);
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to delete bank");
        }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bank List</h1>
        <Button
          onPress={() => setIsCreateModalOpen(true)}
          color="primary"
          className="font-medium"
        >
          Add New Bank
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(e.target.value)}
            className="w-64"
            label="Records per page"
            color="primary"
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

        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startContent={<FiSearch />}
          className="w-64"
          color="secondary"
        />
      </div>

      <Table aria-label="Bank list table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Bank Name</TableColumn>
          <TableColumn>A/C Name</TableColumn>
          <TableColumn>A/C Number</TableColumn>
          <TableColumn>Branch</TableColumn>
          <TableColumn>Balance</TableColumn>
          <TableColumn>Signature Picture</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={loading ? <Spinner /> : "No banks found"}
          isLoading={loading}
        >
          {banks?.map((bank: any, index: number) => (
            <TableRow key={bank._id}>
              <TableCell>
                {(page - 1) * parseInt(recordsPerPage) + index + 1}
              </TableCell>
              <TableCell>{bank.bankName}</TableCell>
              <TableCell>{bank.accountName}</TableCell>
              <TableCell>{bank.accountNumber}</TableCell>
              <TableCell>{bank.branch}</TableCell>
              <TableCell>{bank.balance}</TableCell>
              <TableCell>
                <img
                  src={bank.signaturePicture}
                  alt="Signature"
                  className="w-20 h-10 object-contain"
                />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    isIconOnly
                    color="warning"
                    size="sm"
                    onPress={() => handleEdit(bank)}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    onPress={() => handleDelete(bank._id)}
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

      <AddBank
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditBank
        isShowModal={isEditModalOpen}
        setIsShowModal={setIsEditModalOpen}
        data={selectedData}
        setIsRender={setIsRender}
      />
    </div>
  );
};

export default BankList;
