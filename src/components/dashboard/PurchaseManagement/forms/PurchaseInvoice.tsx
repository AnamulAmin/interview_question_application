import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface PurchaseItem {
  inventoryName: string;
  inventoryId: string;
  stock: number;
  qty: number;
  rate: number;
  total: number;
}

interface Purchase {
  _id: string;
  supplierName: string;
  purchaseDate: string;
  expiryDate: string;
  invoiceNo: string;
  paymentType: string;
  details: string;
  items: PurchaseItem[];
  paidAmount: number;
  totalAmount: number;
  dueAmount: number;
  status: string;
  supplierId: string;
}

interface PurchaseInvoiceProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  singleData: Purchase | null;
}

const PurchaseInvoice: React.FC<PurchaseInvoiceProps> = ({
  isShowModal,
  setIsShowModal,
  singleData,
}) => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      size="2xl"
      scrollBehavior="inside"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Purchase Invoice
        </ModalHeader>
        <ModalBody>
          <div className="p-4">
            {/* Invoice Header */}
            <Card className="p-4 mb-4">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Invoice Details
                  </h2>
                  <p>Invoice No: {singleData?.invoiceNo}</p>
                  <p>Purchase Date: {singleData?.purchaseDate}</p>
                  <p>Expiry Date: {singleData?.expiryDate}</p>
                  <p>Payment Type: {singleData?.paymentType}</p>
                  <p>
                    Status:{" "}
                    {singleData?.status && (
                      <Chip
                        color={getStatusColor(singleData.status)}
                        variant="flat"
                        size="sm"
                      >
                        {singleData.status}
                      </Chip>
                    )}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Supplier Details
                  </h2>
                  <p>Name: {singleData?.supplierName}</p>
                  {singleData?.details && <p>Details: {singleData.details}</p>}
                </div>
              </div>
            </Card>

            {/* Items Table */}
            <Card className="p-4 mb-4">
              <Table aria-label="Purchase Items">
                <TableHeader>
                  <TableColumn>Item Name</TableColumn>
                  <TableColumn>Stock</TableColumn>
                  <TableColumn>Quantity</TableColumn>
                  <TableColumn>Rate</TableColumn>
                  <TableColumn>Total</TableColumn>
                </TableHeader>
                <TableBody>
                  {singleData?.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.inventoryName}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>${item.rate.toFixed(2)}</TableCell>
                      <TableCell>${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Payment Summary */}
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span>${singleData?.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span>${singleData?.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Due Amount:</span>
                  <span>${singleData?.dueAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Button color="primary" onPress={handlePrint}>
                Print Invoice
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseInvoice;
