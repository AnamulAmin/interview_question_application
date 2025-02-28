import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import useGetAllPurchases from "@/hooks/GetDataHook/useGetAllPurchases";
import Swal from "sweetalert2";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface Purchase {
  _id: string;
  purchaseId: string;
  supplierId: string;
  supplierName: string;
  items: {
    inventoryId: string;
    inventoryName: string;
    qty: number;
    rate: number;
    total: number;
  }[];
}

interface PurchaseReturnProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
}

const PurchaseReturn: React.FC<PurchaseReturnProps> = ({
  isShowModal,
  setIsShowModal,
}) => {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [formData, setFormData] = useState({
    purchaseId: "",
    supplierId: "",
    supplierName: "",
    returnDate: "",
    reason: "",
    status: "Pending",
    items: [] as any[],
  });

  const { purchases } = useGetAllPurchases({
    filters: {
      status: "Completed",
    },
  });

  useEffect(() => {
    if (selectedPurchase) {
      setFormData({
        ...formData,
        purchaseId: selectedPurchase._id,
        supplierId: selectedPurchase.supplierId,
        supplierName: selectedPurchase.supplierName,
        items: selectedPurchase.items.map((item: any) => ({
          ...item,
          returnQty: 0,
          total: 0,
        })),
      });
    }
  }, [selectedPurchase]);

  const handleSubmit = async () => {
    console.log(formData, "formData");

    try {
      // Validate form
      if (!formData.purchaseId || !formData.returnDate || !formData.reason) {
        throw new Error("Please fill in all required fields");
      }

      const hasItems = formData.items.some((item) => item.returnQty > 0);
      if (!hasItems) {
        throw new Error("Please add at least one item to return");
      }

      // Validate return quantities
      for (const item of formData.items) {
        if (item.returnQty > item.qty) {
          throw new Error(
            `Return quantity cannot be greater than purchased quantity for ${item.inventoryName}`
          );
        }
      }

      const totalAmount = formData.items.reduce(
        (sum, item) => sum + item.total,
        0
      );

      const response = await window.ipcRenderer.invoke(
        "create-purchase-return",
        {
          data: {
            ...formData,
            totalAmount,
          },
        }
      );

      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: "Purchase return created successfully",
          icon: "success",
        });
        setIsShowModal(false);
        resetForm();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to create purchase return",
        icon: "error",
      });
    }
  };

  const handleItemChange = (index: number, field: string, value: number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total:
        field === "returnQty"
          ? value * newItems[index].rate
          : newItems[index].returnQty * value,
    };
    setFormData({ ...formData, items: newItems });
  };

  const resetForm = () => {
    setFormData({
      purchaseId: "",
      supplierId: "",
      supplierName: "",
      returnDate: "",
      reason: "",
      status: "Pending",
      items: [],
    });
    setSelectedPurchase(null);
  };

  console.log(formData, "formData");

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={(open) => {
        setIsShowModal(open);
        if (!open) resetForm();
      }}
      size="2xl"
      scrollBehavior="inside"
      isDismissable={false}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Create Purchase Return</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Select
              label="Select Purchase"
              value={formData.purchaseId}
              onChange={(e) => {
                const purchase = purchases.find(
                  (p) => p._id === e.target.value
                );
                setSelectedPurchase(purchase);
              }}
            >
              {purchases.map((purchase) => (
                <SelectItem key={purchase._id} value={purchase._id}>
                  {purchase.purchaseId} - {purchase.supplierName}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="date"
              label="Return Date"
              value={formData.returnDate}
              onChange={(e) =>
                setFormData({ ...formData, returnDate: e.target.value })
              }
            />

            <Input
              label="Reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />

            {formData.items.length > 0 && (
              <Table aria-label="Return Items">
                <TableHeader>
                  <TableColumn>Item</TableColumn>
                  <TableColumn>Purchased Qty</TableColumn>
                  <TableColumn>Return Qty</TableColumn>
                  <TableColumn>Rate</TableColumn>
                  <TableColumn>Total</TableColumn>
                </TableHeader>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.inventoryName}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.returnQty}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "returnQty",
                              Number(e.target.value)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>${item.rate.toFixed(2)}</TableCell>
                      <TableCell>${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => setIsShowModal(false)}
          >
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Create Return
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseReturn;
