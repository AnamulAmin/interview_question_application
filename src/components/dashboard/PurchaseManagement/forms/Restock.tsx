import React, { useState } from "react";
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
  Textarea,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import useGetAllSuppliers from "@/hooks/GetDataHook/useGetAllSuppliers";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface RestockProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInventory: {
    _id: string;
    ingredientName: string;
    currentStock: number;
    minThreshold: number;
    unit: string;
  } | null;
  onRestock: () => void;
}

export default function Restock({
  isOpen,
  onClose,
  selectedInventory,
  onRestock,
}: RestockProps) {
  const { suppliers } = useGetAllSuppliers({});
  const [restockForm, setRestockForm] = useState({
    quantity: "",
    cost: "",
    date: new Date().toISOString().split("T")[0],
    supplier: "",
    notes: "",
  });

  const handleRestock = async () => {
    if (!selectedInventory) return;

    try {
      const response = await window.ipcRenderer.invoke("restock-inventory", {
        data: {
          inventoryId: selectedInventory._id,
          quantity: Number(restockForm.quantity),
          cost: Number(restockForm.cost),
          date: restockForm.date,
          supplier: restockForm.supplier,
          notes: restockForm.notes,
        },
      });

      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Inventory restocked successfully",
          icon: "success",
        });
        onClose();
        onRestock();
        // Reset form
        setRestockForm({
          quantity: "",
          cost: "",
          date: new Date().toISOString().split("T")[0],
          supplier: "",
          notes: "",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error restocking:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to restock inventory",
        icon: "error",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="lg"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Restock Inventory</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {selectedInventory && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">
                  {selectedInventory.ingredientName}
                </p>
                <p className="text-sm text-gray-500">
                  Current Stock: {selectedInventory.currentStock}{" "}
                  {selectedInventory.unit}
                </p>
                <p className="text-sm text-gray-500">
                  Min Threshold: {selectedInventory.minThreshold}{" "}
                  {selectedInventory.unit}
                </p>
              </div>
            )}

            <Input
              type="number"
              label="Quantity to Restock"
              value={restockForm.quantity}
              onChange={(e) =>
                setRestockForm({ ...restockForm, quantity: e.target.value })
              }
            />

            <Input
              type="number"
              label="Cost"
              value={restockForm.cost}
              onChange={(e) =>
                setRestockForm({ ...restockForm, cost: e.target.value })
              }
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />

            <Select
              label="Supplier"
              placeholder="Select Supplier"
              value={restockForm.supplier}
              onChange={(e) =>
                setRestockForm({ ...restockForm, supplier: e.target.value })
              }
            >
              {suppliers.map((supplier) => (
                <SelectItem key={supplier._id} value={supplier._id}>
                  {supplier.supplierName}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="date"
              label="Restock Date"
              value={restockForm.date}
              onChange={(e) =>
                setRestockForm({ ...restockForm, date: e.target.value })
              }
            />

            <Textarea
              label="Notes"
              placeholder="Add any additional notes"
              value={restockForm.notes}
              onChange={(e) =>
                setRestockForm({ ...restockForm, notes: e.target.value })
              }
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleRestock}>
            Restock
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
