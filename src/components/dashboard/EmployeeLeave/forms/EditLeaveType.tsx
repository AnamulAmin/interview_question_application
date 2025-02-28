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
  Textarea,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import { toast } from "react-hot-toast";

interface Props {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  data: any;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditLeaveType({
  isShowModal,
  setIsShowModal,
  data,
  setIsRender,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxDays: "",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        description: data.description || "",
        maxDays: data.maxDays?.toString() || "",
        status: data.status || "Active",
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.maxDays) newErrors.maxDays = "Max days is required";
    if (parseInt(formData.maxDays) <= 0)
      newErrors.maxDays = "Max days must be greater than 0";
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

      const response = await window.ipcRenderer.invoke("update-leave-type", {
        id: data._id,
        data: {
          ...formData,
          maxDays: parseInt(formData.maxDays),
        },
      });

      if (response.success) {
        toast.success(response.message);
        handleReset();
        setIsRender((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update leave type");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (data) {
      setFormData({
        name: data.name || "",
        description: data.description || "",
        maxDays: data.maxDays?.toString() || "",
        status: data.status || "Active",
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
      placement="top"
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit Leave Type
        </ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <Input
              label="Name"
              placeholder="Enter leave type name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              errorMessage={errors.name}
              isInvalid={!!errors.name}
            />

            <Textarea
              label="Description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Input
              type="number"
              label="Max Days"
              placeholder="Enter max days"
              value={formData.maxDays}
              onChange={(e) =>
                setFormData({ ...formData, maxDays: e.target.value })
              }
              errorMessage={errors.maxDays}
              isInvalid={!!errors.maxDays}
            />

            <Select
              label="Status"
              value={formData.status}
              defaultSelectedKeys={[formData.status]}
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
