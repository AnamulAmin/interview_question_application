import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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

interface EditPurchaseProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  singleData: Purchase | null;
}

const EditPurchase: React.FC<EditPurchaseProps> = ({
  isShowModal,
  setIsShowModal,
  singleData,
}) => {
  const [formData, setFormData] = useState<Partial<Purchase>>({
    supplierName: "",
    purchaseDate: "",
    expiryDate: "",
    invoiceNo: "",
    paymentType: "Cash Payment",
    details: "",
    items: [],
    paidAmount: 0,
    totalAmount: 0,
    dueAmount: 0,
    status: "Pending",
  });

  const paymentTypes = ["Cash Payment", "Bank Payment", "Credit Payment"];
  const statusTypes = ["Pending", "Completed", "Cancelled"];

  useEffect(() => {
    if (singleData) {
      setFormData(singleData);
    }
  }, [singleData]);

  const handleChange = (name: keyof Purchase, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof PurchaseItem,
    value: any
  ) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    if (field === "qty" || field === "rate") {
      newItems[index].total = newItems[index].qty * newItems[index].rate;
    }

    const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
    const dueAmount = totalAmount - (formData.paidAmount || 0);

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalAmount,
      dueAmount,
    }));
  };

  const addNewItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          inventoryName: "",
          inventoryId: "",
          stock: 0,
          qty: 0,
          rate: 0,
          total: 0,
        },
      ],
    }));
  };

  const deleteItem = (index: number) => {
    const newItems = formData.items?.filter((_, i) => i !== index) || [];
    const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
    const dueAmount = totalAmount - (formData.paidAmount || 0);

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalAmount,
      dueAmount,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await window.ipcRenderer.invoke("update-purchase", {
        _id: singleData?._id,
        updateData: formData,
      });

      if (response.success) {
        setIsShowModal(false);
      }
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      size="4xl"
      scrollBehavior="inside"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Edit Purchase</ModalHeader>
        <ModalBody>
          <form
            id="edit-purchase-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Supplier Name"
                value={formData.supplierName}
                onChange={(e) => handleChange("supplierName", e.target.value)}
                isRequired
              />

              <Input
                label="Invoice No"
                value={formData.invoiceNo}
                onChange={(e) => handleChange("invoiceNo", e.target.value)}
                isRequired
              />

              <Input
                type="date"
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
                isRequired
              />

              <Input
                type="date"
                label="Expiry Date"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                isRequired
              />

              <Select
                label="Payment Type"
                selectedKeys={[formData.paymentType || ""]}
                onChange={(e) => handleChange("paymentType", e.target.value)}
              >
                {paymentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Status"
                selectedKeys={[formData.status || ""]}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                {statusTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Details"
                value={formData.details}
                onChange={(e) => handleChange("details", e.target.value)}
              />
            </div>

            <Table aria-label="Purchase items table">
              <TableHeader>
                <TableColumn>Item Name</TableColumn>
                <TableColumn>Stock</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Rate</TableColumn>
                <TableColumn>Total</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {formData.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.inventoryName}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "inventoryName",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.qty.toString()}
                        onChange={(e) =>
                          handleItemChange(index, "qty", Number(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate.toString()}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "rate",
                            Number(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>${item.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => deleteItem(index)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center">
              <Button color="success" onClick={addNewItem}>
                Add More Item
              </Button>
              <div className="flex items-center gap-4">
                <div className="text-lg">
                  Total Amount: ${formData.totalAmount?.toFixed(2)}
                </div>
                <Input
                  type="number"
                  label="Paid Amount"
                  value={formData.paidAmount?.toString()}
                  onChange={(e) =>
                    handleChange("paidAmount", Number(e.target.value))
                  }
                  className="w-40"
                />
                <div className="text-lg">
                  Due Amount: ${formData.dueAmount?.toFixed(2)}
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => setIsShowModal(false)}
          >
            Cancel
          </Button>
          <Button color="primary" type="submit" form="edit-purchase-form">
            Update Purchase
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPurchase;
