import { useState } from "react";
import {
  Table,
  Button,
  Card,
  Input,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import AddPurchase from "./forms/AddPurchase";
import PurchaseInvoice from "./forms/PurchaseInvoice";
import EditPurchase from "./forms/EditPurchase";
import useGetAllPurchases from "@/hooks/GetDataHook/useGetAllPurchases";
import useDebounce from "@/hooks/useDebounce";

const PurchaseItemListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [singleData, setSingleData] = useState<any>(null);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    purchases,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleStatusChange,
  } = useGetAllPurchases({
    isEdited,
    isDeleted,
    isShowModal: isOpen,
    filters: {
      search: debouncedSearch,
      page: 1,
      limit: 10,
    },
  });

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const handleDetail = (data: any): void => {
    setSingleData(data);
    setIsShowDetail(true);
  };

  const handleDelete = (id: string): void => {
    Swal.fire({
      title: "Are you sure you want to delete this purchase?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke("delete-purchase", {
            data: { _id: id },
          });

          if (response.success) {
            setIsDeleted(true);
            Swal.fire({
              title: "Success!",
              text: response.message,
              icon: "success",
              confirmButtonText: "Ok",
            }).then(() => {
              setIsDeleted(false);
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        } catch (error) {
          console.error("Error deleting purchase:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete purchase",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between gap-4">
        <h1 className="text-2xl font-bold mb-4">Purchase List</h1>
        <Button onPress={onOpen} color="primary">
          Add Purchase
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by supplier name or invoice number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Card className="p-4">
        <Table aria-label="Purchase list">
          <TableHeader>
            <TableColumn>Invoice No</TableColumn>
            <TableColumn>Supplier</TableColumn>
            <TableColumn>Purchase Date</TableColumn>
            <TableColumn>Total Amount</TableColumn>
            <TableColumn>Paid Amount</TableColumn>
            <TableColumn>Due Amount</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell>Loading...</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ) : purchases.length === 0 ? (
              <TableRow>
                <TableCell>No purchases found</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ) : (
              purchases.map((purchase) => (
                <TableRow key={purchase._id}>
                  <TableCell>{purchase.invoiceNo}</TableCell>
                  <TableCell>{purchase.supplierName}</TableCell>
                  <TableCell>{purchase.purchaseDate}</TableCell>
                  <TableCell>${purchase.totalAmount}</TableCell>
                  <TableCell>${purchase.paidAmount}</TableCell>
                  <TableCell>${purchase.dueAmount}</TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(purchase.status)}
                      variant="flat"
                      size="sm"
                    >
                      {purchase.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Tooltip content="View Details">
                        <Button
                          isIconOnly
                          size="sm"
                          color="primary"
                          onPress={() => handleDetail(purchase)}
                        >
                          <FaEye />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit">
                        <Button
                          isIconOnly
                          size="sm"
                          color="secondary"
                          onPress={() => handleEdit(purchase)}
                        >
                          <FiEdit />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          onPress={() => handleDelete(purchase._id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AddPurchase isShowModal={isOpen} setIsShowModal={onOpenChange} />
      <EditPurchase
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
        singleData={singleData}
      />
      <PurchaseInvoice
        isShowModal={isShowDetail}
        setIsShowModal={setIsShowDetail}
        singleData={singleData}
      />
    </div>
  );
};

export default PurchaseItemListPage;
