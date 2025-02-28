import { useState } from "react";
import { Input, Textarea } from "@nextui-org/input";
import Swal from "sweetalert2";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import { toast } from "react-hot-toast";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function AddThirdPartyCustomer({
  setIsShowModal,
  isShowModal,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    commission: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
    }
    if (!formData.commission.trim()) {
      newErrors.commission = "Commission is required";
    } else if (isNaN(Number(formData.commission))) {
      newErrors.commission = "Commission must be a number";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await window.ipcRenderer.invoke(
        "create-third-party-customer",
        {
          data: formData,
        }
      );

      if (response.success) {
        // Swal.fire({
        //   title: "Success!",
        //     text: "Third party company added successfully",
        //     icon: "success",
        //     timer: 1500,
        //     showConfirmButton: false,
        //   });
        toast.success(response.message);
        handleReset();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      Swal.fire("Error!", error.message || "Failed to add company", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      companyName: "",
      commission: "",
      address: "",
    });
    setErrors({});
    setIsShowModal(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Add New Company</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              isRequired
              errorMessage={errors.companyName}
              isInvalid={!!errors.companyName}
            />
            <Input
              label="Commission(%)"
              value={formData.commission}
              onChange={(e) =>
                setFormData({ ...formData, commission: e.target.value })
              }
              isRequired
              errorMessage={errors.commission}
              isInvalid={!!errors.commission}
            />
            <Textarea
              label="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              isRequired
              errorMessage={errors.address}
              isInvalid={!!errors.address}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
            Reset
          </Button>
          <Button color="success" onPress={handleSubmit} isLoading={loading}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
