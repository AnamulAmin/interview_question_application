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

export default function EditPaymentSetup({
  isShowModal,
  data,
  setIsShowModal,
  setIsRender,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    merchantId: "",
    currency: "",
    mode: "Test Mode",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        merchantId: data.merchantId || "",
        currency: data.currency || "",
        mode: data.mode || "Test Mode",
        status: data.status || "Active",
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.currency.trim()) newErrors.currency = "Currency is required";
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

      const response = await window.ipcRenderer.invoke("update-payment-setup", {
        id: data._id,
        data: formData,
      });

      if (response.success) {
        toast.success(response.message);
        handleReset();
        setIsRender((prev) => !prev);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update payment setup");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      merchantId: "",
      currency: "",
      mode: "Test Mode",
      status: "Active",
    });
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader>Edit Payment Setup</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Payment Method Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              errorMessage={errors.name}
              isInvalid={!!errors.name}
              isRequired
            />
            <Input
              label="Email Address/Location ID"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              errorMessage={errors.email}
              isInvalid={!!errors.email}
              isRequired
            />
            <Input
              label="Merchant ID/Application ID"
              value={formData.merchantId}
              onChange={(e) =>
                setFormData({ ...formData, merchantId: e.target.value })
              }
            />
            <Input
              label="Currency"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              errorMessage={errors.currency}
              isInvalid={!!errors.currency}
              isRequired
            />
            <Select
              label="Mode"
              value={formData.mode}
              onChange={(e) =>
                setFormData({ ...formData, mode: e.target.value })
              }
              defaultSelectedKeys={[formData.mode]}
            >
              <SelectItem key="Live Mode" value="Live Mode">
                Live Mode
              </SelectItem>
              <SelectItem key="Test Mode" value="Test Mode">
                Test Mode
              </SelectItem>
            </Select>
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
            Update Setup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
