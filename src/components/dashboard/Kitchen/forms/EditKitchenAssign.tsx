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
  Card,
  CardBody,
  Image,
  CardFooter,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import useGetAllKitchens from "@/hooks/GetDataHook/useGetAllKitchens";
import moment from "moment";
import formatPrepTime from "@/helpers/FormateTime";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import getEstimatedTime from "@/helpers/getEstimatedTime";

interface EditKitchenAssignProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  setIsRender: (value: boolean) => void;
  data: any;
}

interface OrderItem {
  itemName: string;
  quantity: number;
  notes?: string;
}

const EditKitchenAssign = ({
  isShowModal,
  setIsShowModal,
  setIsRender,
  data,
}: EditKitchenAssignProps) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([
    { itemName: "", quantity: 1 },
  ]);
  const { kitchens } = useGetAllKitchens();

  const [formData, setFormData] = useState({
    kitchenId: "",
    order_id: "",
    priority: "Medium",
    notes: "",
    estimatedTime: "",
    requiredEstimatedTime: "",
  });

  useEffect(() => {
    if (data && isShowModal) {
      setFormData({
        kitchenId: data?.kitchenId,
        order_id: data.order_id,
        priority: data.priority,
        notes: data.notes || "",
        estimatedTime: getEstimatedTime(
          data.preparationTimes,
          data.order_placed_time,
          data.order_placed_date
        ),
        requiredEstimatedTime: getEstimatedTime(
          data.requiredPreparationTime,
          data.order_placed_time,
          data.order_placed_date
        ),
      });
      setItems(data.cartItems);
    }
  }, [data, isShowModal]);

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

      console.log(formData, "formData");

      // Validate form data
      if (!formData.kitchenId || !formData.order_id) {
        toast.error("Please fill in all required fields");
        return;
      }

      const response = await window.ipcRenderer.invoke("update-order", {
        data: {
          ...formData,
          items,
          isAssigned: true,
          _id: data._id,
        },
      });

      console.log(response, "response order");

      if (response.success) {
        toast.success(response.message);
        setIsRender((prev) => !prev);
        setIsShowModal(false);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={(open) => setIsShowModal(open)}
      placement="top"
      size="3xl"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Kitchen Assignment
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
                  value={formData.order_id}
                  onChange={(e) =>
                    setFormData({ ...formData, order_id: e.target.value })
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
                  type="datetime-local"
                  label="Estimated Completion Time"
                  placeholder="Select estimated completion time"
                  variant="bordered"
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedTime: e.target.value,
                    })
                  }
                />

                <Input
                  type="datetime-local"
                  label=" Required Completion Time"
                  placeholder="Select estimated completion time"
                  variant="bordered"
                  value={formData.requiredEstimatedTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requiredEstimatedTime: e.target.value,
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
                  </div>

                  <div className="border-b pl-3 pr-6 py-3  h-[50vh] overflow-auto grid grid-cols-2 gap-4 col-span-2">
                    {items.length > 0 ? (
                      items.map((item: any, index: number) => (
                        <Card
                          shadow="sm"
                          key={index}
                          isPressable
                          onPress={() => console.log("item pressed")}
                          className="h-[390px]"
                        >
                          <CardBody className="overflow-hidden p-0">
                            <Image
                              shadow="sm"
                              radius="lg"
                              width="100%"
                              alt={item?.name}
                              isZoomed
                              className="w-full object-cover h-[200px] "
                              src={item?.image}
                            />
                          </CardBody>
                          <CardFooter className="text-small justify-between flex-col items-between">
                            <div className="w-full flex justify-between  mb-5">
                              <b className="font-bold text-2xl">{item?.name}</b>
                            </div>
                            <div className="w-full flex justify-between border-b-1 ">
                              <b>Preparation Time</b>
                              <p className="text-default-500">
                                {formatPrepTime(item?.preparationTime)}
                              </p>
                            </div>
                            <div className="w-full flex justify-between border-b-1 ">
                              <b>Price</b>
                              <p className="text-default-500">{item?.price}</p>
                            </div>
                            <div className="w-full flex justify-between border-b-1 ">
                              <b>Quantity</b>
                              <p className="text-default-500">
                                {item?.quantity}
                              </p>
                            </div>
                            <div className="w-full flex justify-between ">
                              <b>Subtotal</b>
                              <p className="text-default-500">
                                {Number(item?.price * item?.quantity).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div>No Items Available!</div>
                    )}
                  </div>
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
                Update Assignment
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditKitchenAssign;
