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

export default function AddPaymentSetup({
  setIsShowModal,
  isShowModal,
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

      const response = await window.ipcRenderer.invoke("create-payment-setup", {
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
      toast.error(error.message || "Failed to create payment setup");
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

  const { methods } = useGetAllPaymentMethods({});

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader>Add Payment Setup</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            {/* <Input
              label="Payment Method Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              errorMessage={errors.name}
              isInvalid={!!errors.name}
              isRequired
            /> */}
            <Select
              label="Payment Method Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              errorMessage={errors.name}
              isInvalid={!!errors.name}
              isRequired
            >
              {methods.map((method) => (
                <SelectItem
                  key={method.payment_method_name}
                  value={method.payment_method_name}
                >
                  {method.payment_method_name}
                </SelectItem>
              ))}
            </Select>
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
              defaultSelectedKeys={["Test Mode"]}
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
              defaultSelectedKeys={["Active"]}
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
            Add Setup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
