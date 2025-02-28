import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import { toast } from "react-hot-toast";

interface Props {
  isShowModal: boolean;
  data: any;
  setIsShowModal: (value: boolean) => void;
}

const EditThirdPartyCustomer = ({
  isShowModal,
  data,
  setIsShowModal,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    commission: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setFormData({
        companyName: data.companyName || "",
        commission: data.commission?.replace(" (%)", "") || "",
        address: data.address || "",
      });
    }
  }, [data]);

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
        "update-third-party-customer",
        {
          id: data._id,
          data: formData,
        }
      );

      if (response.success) {
        // Swal.fire({
        //   title: "Success!",
        //   text: "Company updated successfully",
        //   icon: "success",
        //   timer: 1500,
        //   showConfirmButton: false,
        // });
        toast.success(response.message);
        setIsShowModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      Swal.fire("Error!", error.message || "Failed to update company", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Edit Company</ModalHeader>
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
          <Button
            color="danger"
            variant="light"
            onPress={() => setIsShowModal(false)}
          >
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditThirdPartyCustomer;
