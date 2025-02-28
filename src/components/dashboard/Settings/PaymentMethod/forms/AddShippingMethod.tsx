import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import { toast } from "react-hot-toast";
import useGetAllPaymentMethods from "@/hooks/GetDataHook/useGetAllPaymentMethods";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddShippingMethod({
  setIsShowModal,
  isShowModal,
  setIsRender,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    paymentMethod: "",
    shippingType: "Standard",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { methods: paymentMethods } = useGetAllPaymentMethods({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.rate.trim()) newErrors.rate = "Rate is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await window.ipcRenderer.invoke(
        "create-shipping-method",
        {
          data: {
            ...formData,
            rate: parseFloat(formData.rate),
          },
        }
      );

      if (response.success) {
        toast.success(response.message);
        handleReset();
        setIsRender((prev) => !prev);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create shipping method");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      rate: "",
      paymentMethod: "",
      shippingType: "Standard",
      status: "Active",
    });
    setErrors({});
    setIsShowModal(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader>Add Shipping Method</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Shipping Method Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              errorMessage={errors.name}
              isInvalid={!!errors.name}
              isRequired
            />
            <Input
              label="Shipping Rate"
              value={formData.rate}
              onChange={(e) =>
                setFormData({ ...formData, rate: e.target.value })
              }
              type="number"
              min="0"
              step="0.01"
              errorMessage={errors.rate}
              isInvalid={!!errors.rate}
              isRequired
            />
            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              errorMessage={errors.paymentMethod}
              isInvalid={!!errors.paymentMethod}
              isRequired
            >
              {paymentMethods.map((method) => (
                <SelectItem
                  key={method.payment_method_name}
                  value={method.payment_method_name}
                >
                  {method.payment_method_name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Shipping Type"
              value={formData.shippingType}
              onChange={(e) =>
                setFormData({ ...formData, shippingType: e.target.value })
              }
            >
              <SelectItem key="Standard" value="Standard">
                Standard
              </SelectItem>
              <SelectItem key="Express" value="Express">
                Express
              </SelectItem>
              <SelectItem key="Overnight" value="Overnight">
                Overnight
              </SelectItem>
            </Select>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <SelectItem key="Active" value="Active">
                Active
              </SelectItem>
              <SelectItem key="Inactive" value="Inactive">
                Inactive
              </SelectItem>
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Add Shipping Method
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
