import React, { useEffect, useState } from "react";
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
import Swal from "sweetalert2";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface EditPurchaseReturnProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  returnData: any;
}

const EditPurchaseReturn: React.FC<EditPurchaseReturnProps> = ({
  isShowModal,
  setIsShowModal,
  returnData,
}) => {
  const [formData, setFormData] = useState({
    reason: "",
    status: "",
    items: [] as any[],
  });

  useEffect(() => {
    if (returnData) {
      setFormData({
        reason: returnData.reason,
        status: returnData.status,
        items: returnData.items,
      });
    }
  }, [returnData]);

  const handleSubmit = async () => {
    try {
      if (!formData.reason) {
        throw new Error("Please provide a reason for the return");
      }

      const response = await window.ipcRenderer.invoke(
        "update-purchase-return",
        {
          _id: returnData._id,
          updateData: formData,
        }
      );

      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: "Purchase return updated successfully",
          icon: "success",
        });
        setIsShowModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update purchase return",
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

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      size="2xl"
      scrollBehavior="inside"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Edit Purchase Return</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <SelectItem key="Pending" value="Pending">
                Pending
              </SelectItem>
              <SelectItem key="Completed" value="Completed">
                Completed
              </SelectItem>
              <SelectItem key="Rejected" value="Rejected">
                Rejected
              </SelectItem>
            </Select>

            <Table aria-label="Return Items">
              <TableHeader>
                <TableColumn>Item</TableColumn>
                <TableColumn>Return Qty</TableColumn>
                <TableColumn>Rate</TableColumn>
                <TableColumn>Total</TableColumn>
              </TableHeader>
              <TableBody>
                {formData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.inventoryName}</TableCell>
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
            Update Return
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPurchaseReturn;
