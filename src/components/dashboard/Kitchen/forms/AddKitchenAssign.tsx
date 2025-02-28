import { useEffect, useState } from "react";
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
import { toast } from "react-hot-toast";
import useGetAllKitchens from "@/hooks/GetDataHook/useGetAllKitchens";
import moment from "moment";

interface AddKitchenAssignProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  setIsRender: (value: boolean) => void;
}

interface OrderItem {
  itemName: string;
  quantity: number;
  notes?: string;
}

const AddKitchenAssign = ({
  isShowModal,
  setIsShowModal,
  setIsRender,
}: AddKitchenAssignProps) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([
    { itemName: "", quantity: 1 },
  ]);
  const { kitchens } = useGetAllKitchens();

  const [formData, setFormData] = useState({
    kitchenId: "",
    orderId: "",
    priority: "Medium",
    notes: "",
    estimatedTime: 30, // in minutes
  });

  const handleAddItem = () => {
    setItems([...items, { itemName: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate form data
      if (
        !formData.kitchenId ||
        !formData.orderId ||
        items.some((item) => !item.itemName)
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const estimatedCompletionTime = moment(formData.estimatedTime).format(
        "YYYY-MM-DDTHH:mm"
      );

      const response = await window.ipcRenderer.invoke(
        "create-kitchen-assign",
        {
          data: {
            ...formData,
            items,
            estimatedCompletionTime,
          },
        }
      );

      if (response.success) {
        toast.success(response.message);
        setIsRender((prev) => !prev);
        setIsShowModal(false);
        // Reset form
        setFormData({
          kitchenId: "",
          orderId: "",
          priority: "Medium",
          notes: "",
          estimatedTime: 30,
        });
        setItems([{ itemName: "", quantity: 1 }]);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={(open) => setIsShowModal(open)}
      placement="top-center"
      size="3xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Assign New Order
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Kitchen"
                  placeholder="Select kitchen"
                  variant="bordered"
                  selectedKeys={formData.kitchenId ? [formData.kitchenId] : []}
                  onChange={(e) =>
                    setFormData({ ...formData, kitchenId: e.target.value })
                  }
                >
                  {kitchens?.map((kitchen: any) => (
                    <SelectItem key={kitchen._id} value={kitchen._id}>
                      {kitchen.kitchenName}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Order ID"
                  placeholder="Enter order ID"
                  variant="bordered"
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                />

                <Select
                  label="Priority"
                  placeholder="Select priority"
                  variant="bordered"
                  selectedKeys={[formData.priority]}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <SelectItem key="Low" value="Low">
                    Low
                  </SelectItem>
                  <SelectItem key="Medium" value="Medium">
                    Medium
                  </SelectItem>
                  <SelectItem key="High" value="High">
                    High
                  </SelectItem>
                  <SelectItem key="Urgent" value="Urgent">
                    Urgent
                  </SelectItem>
                </Select>

                <Input
                  type="number"
                  label="Estimated Time (minutes)"
                  placeholder="Enter estimated time"
                  variant="bordered"
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedTime: parseInt(e.target.value),
                    })
                  }
                />

                <div className="col-span-2">
                  <Textarea
                    label="Notes"
                    placeholder="Enter any additional notes"
                    variant="bordered"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Order Items</h3>
                    <Button size="sm" color="primary" onPress={handleAddItem}>
                      Add Item
                    </Button>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                      <Input
                        placeholder="Item name"
                        value={item.itemName}
                        onChange={(e) =>
                          handleItemChange(index, "itemName", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Notes"
                          value={item.notes}
                          onChange={(e) =>
                            handleItemChange(index, "notes", e.target.value)
                          }
                        />
                        {items.length > 1 && (
                          <Button
                            isIconOnly
                            color="danger"
                            size="sm"
                            onPress={() => handleRemoveItem(index)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                Assign Order
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddKitchenAssign;
