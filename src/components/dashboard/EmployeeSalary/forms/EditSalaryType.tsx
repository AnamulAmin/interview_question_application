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
  setIsRender: any;
}

export default function EditSalaryType({
  isShowModal,
  setIsShowModal,
  data,
  setIsRender,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    salaryType: "",
    action: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isShowModal) {
      setFormData({
        salaryType: data.salaryType || "",
        action: data.action || "",
      });
    }
  }, [isShowModal]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.salaryType) {
      newErrors.salaryType = "Salary type is required";
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

      const response = await window.ipcRenderer.invoke("update-salary-type", {
        id: data._id,
        data: formData,
      });

      if (response.success) {
        toast.success(response.message);
        handleReset();
        setIsRender((prev: any) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update leave application");
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    if (data) {
      setFormData({
        salaryType: data.salaryType || "",
        action: data.action || "",
      });
    }
    setErrors({});
    setIsShowModal(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
      size="xl"
      placement="top"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit Salary Type
        </ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <Input
              label="Salary Type"
              placeholder="Enter salary type"
              value={formData.salaryType}
              onChange={(e) =>
                setFormData({ ...formData, salaryType: e.target.value })
              }
              errorMessage={errors.salaryType}
              isInvalid={!!errors.salaryType}
            />

            <Select
              label="Action"
              placeholder="Enter action"
              value={formData?.action}
              onChange={(e) =>
                setFormData({ ...formData, action: e.target.value })
              }
              defaultSelectedKeys={[data?.action]}
            >
              <SelectItem value="add" key={"Add"}>
                Add
              </SelectItem>
              <SelectItem value="deduct" key={"Deduct"}>
                Deduct
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
