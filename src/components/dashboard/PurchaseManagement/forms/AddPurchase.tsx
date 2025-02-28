import React, { useState } from "react";
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
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import useGetAllSuppliers from "@/hooks/GetDataHook/useGetAllSuppliers";
import useGetAllInventories from "@/hooks/GetDataHook/useGetAllInventories";
import Swal from "sweetalert2";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface PurchaseItem {
  itemInfo: string;
  stock: number;
  qty: number;
  rate: number;
  total: number;
}

interface FormData {
  supplierName: string;
  purchaseDate: string;
  expiryDate: string;
  invoiceNo: string;
  paymentType: string;
  details: string;
  items: PurchaseItem[];
  paidAmount: number;
}

interface AddPurchaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPurchase = ({ isShowModal, setIsShowModal }: AddPurchaseProps) => {
  const inventories = useGetAllInventories({});
  const [unitType, setUnitType] = useState<string>("");
  const [formData, setFormData] = useState<any>({
    supplierName: "",
    supplierId: "",
    purchaseDate: "",
    expiryDate: "",
    invoiceNo: "",
    paymentType: "Cash Payment",
    details: "",
    items: [
      {
        inventoryName: "",
        inventoryId: "",
        stock: 0,
        qty: 0,
        rate: 0,
        total: 0,
      },
    ],
    paidAmount: 0,
  });

  const paymentTypes = ["Cash Payment", "Bank Payment", "Credit Payment"];
  // const suppliers = ["Supplier 1", "Supplier 2", "Supplier 3"];
  const items = ["Item 1", "Item 2", "Item 3"];

  const handleChange = (name: string, value: any) => {
    if (name === "supplierId") {
      const supplier = suppliers.find((item: any) => item._id === value);
      setFormData((prev: any) => ({
        ...prev,
        supplierName: supplier.supplierName,
        [name]: value,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleItemChange = (index: number, field: any, value: any) => {
    const newItems = [...formData.items];
    if (field === "inventoryId") {
      const inventory = inventories.find((item: any) => item._id === value);
      setUnitType(inventory.unitType);
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        inventoryName: inventory.ingredientName,
        unitType: inventory.unitType,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }

    if (field === "qty" || field === "rate") {
      newItems[index].total = newItems[index].qty * newItems[index].rate;
    }

    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addNewItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { itemInfo: "", stock: 0, qty: 0, rate: 0, total: 0 },
      ],
    }));
  };

  const deleteItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (
        !formData.supplierName ||
        !formData.invoiceNo ||
        !formData.purchaseDate ||
        !formData.supplierId
      ) {
        Swal.fire({
          title: "Error!",
          text: "Please fill in all required fields",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      // Validate items
      if (!formData.items || formData.items.length === 0) {
        Swal.fire({
          title: "Error!",
          text: "Please add at least one item",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      // Validate each item
      for (const item of formData.items) {
        if (!item.inventoryId || !item.qty || !item.rate) {
          Swal.fire({
            title: "Error!",
            text: "Please fill in all item details",
            icon: "error",
            confirmButtonText: "Ok",
          });
          return;
        }
      }

      // Calculate final amounts
      const totalAmount = formData.items.reduce(
        (sum, item) => sum + item.total,
        0
      );
      const dueAmount = totalAmount - (formData.paidAmount || 0);

      const purchaseData = {
        ...formData,
        totalAmount,
        dueAmount,
        status: "Pending",
      };

      const response = await window.ipcRenderer.invoke("create-purchase", {
        data: purchaseData,
      });

      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: response.message,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          setIsShowModal(false);
          // Reset form data
          setFormData({
            supplierName: "",
            supplierId: "",
            purchaseDate: "",
            expiryDate: "",
            invoiceNo: "",
            paymentType: "Cash Payment",
            details: "",
            items: [
              {
                inventoryName: "",
                inventoryId: "",
                stock: 0,
                qty: 0,
                rate: 0,
                total: 0,
              },
            ],
            paidAmount: 0,
          });
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error creating purchase:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.message || "Something went wrong while creating the purchase",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const {
    suppliers,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
  } = useGetAllSuppliers({});

  console.log(formData, "formData");

  return (
    <Modal
      isOpen={isShowModal}
      onClose={setIsShowModal}
      size="4xl"
      scrollBehavior="inside"
      isDismissable={false}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="max-w-[90%]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add Purchase
            </ModalHeader>
            <ModalBody>
              <form
                id="add-purchase-form"
                // onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex gap-2">
                    <Select
                      label="Supplier Name"
                      placeholder="Select supplier"
                      selectedKeys={[formData.supplierId]}
                      className="flex-1"
                      onSelectionChange={(keys) =>
                        handleChange("supplierId", Array.from(keys)[0])
                      }
                    >
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier._id} value={supplier._id}>
                          {supplier.supplierName}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button color="success" className="h-[60px]" variant="flat">
                      + Add Supplier
                    </Button>
                  </div>

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
                    onChange={(e) =>
                      handleChange("purchaseDate", e.target.value)
                    }
                    isRequired
                  />

                  <Input
                    type="date"
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                  />

                  <Select
                    label="Payment Type"
                    selectedKeys={[formData.paymentType]}
                    onChange={(e) =>
                      handleChange("paymentType", e.target.value)
                    }
                  >
                    {paymentTypes.map((type) => (
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
                    <TableColumn>Item Information</TableColumn>
                    <TableColumn>Stock/Qty</TableColumn>
                    <TableColumn>Qty {unitType && `(${unitType})`}</TableColumn>
                    <TableColumn>Rate</TableColumn>
                    <TableColumn>Total</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Autocomplete
                            defaultSelectedKey={[item.inventoryId]}
                            onSelectionChange={(key) =>
                              handleItemChange(index, "inventoryId", key)
                            }
                            label="Inventory Information"
                          >
                            {inventories.map((item: any) => (
                              <AutocompleteItem key={item._id} value={item._id}>
                                {item.ingredientName}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        </TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) => {
                                const inputValue = e.target.value;

                                if (inputValue[0] === "0") {
                                  e.target.value = inputValue.slice(1);
                                }

                                handleItemChange(
                                  index,
                                  "qty",
                                  Number(e.target.value)
                                );
                              }}
                              className="w-full"
                            />

                            <span>{item.unitType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => {
                              const inputValue = e.target.value;

                              if (inputValue[0] === "0") {
                                e.target.value = inputValue.slice(1);
                              }

                              handleItemChange(
                                index,
                                "rate",
                                Number(e.target.value)
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            color="danger"
                            size="sm"
                            onPress={() => deleteItem(index)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center">
                  <Button color="success" onPress={addNewItem}>
                    Add More Item
                  </Button>
                  <div className="flex items-center gap-4">
                    <div className="text-lg">
                      Grand Total: {calculateGrandTotal().toFixed(2)}
                    </div>
                    <Input
                      type="number"
                      label="Paid Amount"
                      value={formData.paidAmount}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        if (inputValue[0] === "0") {
                          e.target.value = inputValue.slice(1);
                        }

                        handleChange("paidAmount", Number(e.target.value));
                      }}
                      className="w-40"
                    />
                  </div>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                // type="submit"
                form="add-purchase-form"
                onPress={handleSubmit}
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddPurchase;
