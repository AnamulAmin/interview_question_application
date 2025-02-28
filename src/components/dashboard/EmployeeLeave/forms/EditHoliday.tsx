import { useState, useEffect } from "react";
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
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  data: any;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditHoliday({
  isShowModal,
  setIsShowModal,
  data,
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

  useEffect(() => {
    if (data) {
      setFormData({
        holidayName: data.holidayName || "",
        from: data.from || "",
        to: data.to || "",
        numberOfDays: data.numberOfDays || 0,
        status: data.status || "Active",
      });
    }
  }, [data]);

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
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await window.ipcRenderer.invoke("update-holiday", {
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
      toast.error(error.message || "Failed to update holiday");
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
        <ModalHeader className="flex flex-col gap-1">Edit Holiday</ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <Input
              label="Holiday Name"
              value={formData.holidayName}
              onChange={(e) =>
                setFormData({ ...formData, holidayName: e.target.value })
              }
              errorMessage={errors.holidayName}
              isInvalid={!!errors.holidayName}
              isRequired
            />
            <Input
              type="date"
              label="From"
              value={formData.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
              errorMessage={errors.from}
              isInvalid={!!errors.from}
              isRequired
            />
            <Input
              type="date"
              label="To"
              value={formData.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
              errorMessage={errors.to}
              isInvalid={!!errors.to}
              isRequired
            />
            <Input
              type="number"
              label="Number of Days"
              value={formData.numberOfDays.toString()}
              isReadOnly
              isRequired
            />
            <Select
              label="Status *"
              placeholder="Select status"
              value={formData.status}
              defaultSelectedKeys={[formData.status]}
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
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
