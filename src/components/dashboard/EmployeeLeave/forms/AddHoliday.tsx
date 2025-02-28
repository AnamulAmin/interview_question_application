import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import { toast } from "react-hot-toast";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddHoliday({
  setIsShowModal,
  isShowModal,
  setIsRender,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    holidayName: "",
    from: "",
    to: "",
    numberOfDays: 0,
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.holidayName)
      newErrors.holidayName = "Holiday name is required";
    if (!formData.from) newErrors.from = "From date is required";
    if (!formData.to) newErrors.to = "To date is required";
    if (!formData.status) newErrors.status = "Status is required";
    return newErrors;
  };

  const calculateDays = (fromDate: string, toDate: string): number => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleDateChange = (field: "from" | "to", value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (newData.from && newData.to) {
        newData.numberOfDays = calculateDays(newData.from, newData.to);
      }
      return newData;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      console.log(formData, "formData");

      const response = await window.ipcRenderer.invoke("create-holiday", {
        data: formData,
      });

      if (response.success) {
        toast.success(response.message);
        handleReset();
        setIsRender((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create holiday");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      holidayName: "",
      from: "",
      to: "",
      numberOfDays: 0,
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
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add Holiday</ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <Input
              label="Holiday Name *"
              placeholder="Enter holiday name"
              value={formData.holidayName}
              onChange={(e) =>
                setFormData({ ...formData, holidayName: e.target.value })
              }
              errorMessage={errors.holidayName}
              isInvalid={!!errors.holidayName}
            />
            <Input
              type="date"
              label="From *"
              placeholder="Select start date"
              value={formData.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
              errorMessage={errors.from}
              isInvalid={!!errors.from}
            />
            <Input
              type="date"
              label="To *"
              placeholder="Select end date"
              value={formData.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
              errorMessage={errors.to}
              isInvalid={!!errors.to}
            />
            <Input
              type="number"
              label="Number of Days"
              value={formData.numberOfDays.toString()}
              isReadOnly
            />
            <Select
              label="Status *"
              placeholder="Select status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              errorMessage={errors.status}
              isInvalid={!!errors.status}
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
            Reset
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            SET
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
