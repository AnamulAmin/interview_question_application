import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Pagination,
  Spinner,
  Card,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import PurchaseReturn from "./forms/PurchaseReturn";
import PurchaseReturnDetail from "./forms/PurchaseReturnDetail";
import EditPurchaseReturn from "./forms/EditPurchaseReturn";
import useGetAllPurchaseReturns from "@/hooks/GetDataHook/useGetAllPurchaseReturns";
import useDebounce from "@/hooks/useDebounce";

interface PurchaseReturn {
  _id: string;
  purchaseId: string;
  supplierId: string;
  supplierName: string;
  returnDate: string;
  reason: string;
  items: {
    inventoryId: string;
    inventoryName: string;
    returnQty: number;
    rate: number;
    total: number;
  }[];
  totalAmount: number;
  status: "Pending" | "Completed" | "Rejected";
}

const PurchaseReturnListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(
    null
  );
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    purchaseReturns,
    loading,
    pagination,
    handlePageChange,
    handleStatusChange,
  } = useGetAllPurchaseReturns({
    isEdited,
    filters: {
      search: debouncedSearch,
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewEdit = (returnItem: PurchaseReturn) => {
    setSelectedReturn(returnItem);
    setIsEdited(true);
  };

  const handleViewDetails = (returnItem: PurchaseReturn) => {
    setSelectedReturn(returnItem);
    setIsShowDetail(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase Return List</h1>
        <Button color="primary" onPress={() => setIsShowModal(true)}>
          Create Return
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex justify-between items-center">
          <Input
            isClearable
            placeholder="Search by Supplier or Return ID"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-1/3"
          />
        </div>
      </Card>

      <Card className="p-6">
        <Table aria-label="Purchase Returns">
          <TableHeader>
            <TableColumn>Return ID</TableColumn>
            <TableColumn>Supplier</TableColumn>
            <TableColumn>Return Date</TableColumn>
            <TableColumn>Items</TableColumn>
            <TableColumn>Total Amount</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {purchaseReturns.map((returnItem) => (
              <TableRow key={returnItem._id}>
                <TableCell>{returnItem.purchaseId}</TableCell>
                <TableCell>{returnItem.supplierName}</TableCell>
                <TableCell>{returnItem.returnDate}</TableCell>
                <TableCell>{returnItem.items.length}</TableCell>
                <TableCell>${returnItem.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    color={
                      returnItem.status === "Completed"
                        ? "success"
                        : returnItem.status === "Rejected"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {returnItem.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => handleViewEdit(returnItem)}
                      isDisabled={returnItem.status === "Completed"}
                    >
                      Edit
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      onPress={() => handleViewDetails(returnItem)}
                    >
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagination && (
          <div className="flex justify-end mt-4">
            <Pagination
              total={pagination.totalPages}
              initialPage={pagination.page}
              onChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      <PurchaseReturn
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
      />
      <EditPurchaseReturn
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
        returnData={selectedReturn}
      />
      <PurchaseReturnDetail
        isShowModal={isShowDetail}
        setIsShowModal={setIsShowDetail}
        returnData={selectedReturn}
      />
    </div>
  );
};

export default PurchaseReturnListPage;
