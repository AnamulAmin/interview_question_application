import { useState } from "react";
import {
  Button,
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
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  weeklyLeaveDay: string;
  status: string;
}

export default function AddWeeklyHoliday({
  setIsShowModal,
  isShowModal,
  setIsRender,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    weeklyLeaveDay: "",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.weeklyLeaveDay) {
      newErrors.weeklyLeaveDay = "Weekly leave day is required";
    }
    return newErrors;
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await window.ipcRenderer.invoke(
        "create-weekly-holiday",
        {
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
      toast.error(error.message || "Failed to create weekly holiday");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      weeklyLeaveDay: "",
      status: "active",
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
        <ModalHeader>Add Weekly Holiday</ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <Select
              label="Weekly Leave Day"
              value={formData.weeklyLeaveDay}
              onChange={(e) =>
                setFormData({ ...formData, weeklyLeaveDay: e.target.value })
              }
              errorMessage={errors.weeklyLeaveDay}
              isInvalid={!!errors.weeklyLeaveDay}
              isRequired
            >
              <SelectItem key="Friday,Saturday" value="Friday,Saturday">
                Friday,Saturday
              </SelectItem>
              <SelectItem key="Saturday,Sunday" value="Saturday,Sunday">
                Saturday,Sunday
              </SelectItem>
              <SelectItem key="Sunday,Monday" value="Sunday,Monday">
                Sunday,Monday
              </SelectItem>
            </Select>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <SelectItem key="active" value="active">
                Active
              </SelectItem>
              <SelectItem key="inactive" value="inactive">
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
            Add Weekly Holiday
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
