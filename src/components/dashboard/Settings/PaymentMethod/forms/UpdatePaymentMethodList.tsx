import { useState, useEffect } from "react";
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

interface Props {
  isShowModal: boolean;
  data: any;
  setIsShowModal: (value: boolean) => void;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdatePaymentMethodList({
  isShowModal,
  data,
  setIsShowModal,
  setIsRender,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    payment_method_name: "",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setFormData({
        payment_method_name: data.payment_method_name || "",
        status: data.status || "Active",
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.payment_method_name.trim()) {
      newErrors.payment_method_name = "Payment method name is required";
    }
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
        "update-payment-method",
        {
          id: data._id,
          data: formData,
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
      toast.error(error.message || "Failed to update payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ payment_method_name: "", status: "Active" });
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Edit Payment Method</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Payment Method Name"
              value={formData.payment_method_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payment_method_name: e.target.value,
                })
              }
              errorMessage={errors.payment_method_name}
              isInvalid={!!errors.payment_method_name}
              isRequired
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              defaultSelectedKeys={[formData.status]}
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
            Update Method
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
