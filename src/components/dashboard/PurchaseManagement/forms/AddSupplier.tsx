import { useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { FaFileExport } from "react-icons/fa";
import Swal from "sweetalert2";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface Supplier {
  supplierName: string;
  email: string;
  mobile: string;
  previousCreditBalance: string;
  address: string;
}

interface AddSupplierProps {
  isShowModal: boolean;
  setIsShowModal: (isOpen: boolean) => void;
  suppliers: Supplier[];
  onSupplierAdded?: () => void;
}

const AddSupplier = ({
  isShowModal,
  setIsShowModal,
  suppliers,
  onSupplierAdded,
}: AddSupplierProps) => {
  const [formData, setFormData] = useState<any>({
    supplierName: "",
    email: "",
    mobile: "",
    previousCreditBalance: "",
    address: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<any>({});

  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Supplier Name is required.";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile is required.";
    } else if (!/^\d{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid mobile number.";
    }
    if (!formData.previousCreditBalance.trim()) {
      newErrors.previousCreditBalance = "Previous Credit Balance is required.";
    } else if (isNaN(Number(formData.previousCreditBalance))) {
      newErrors.previousCreditBalance = "Must be a valid number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const receiveData = await window.ipcRenderer.invoke("create-supplier", {
      data: formData,
    });

    if (receiveData.success) {
      Swal.fire({
        title: "Success!",
        text: receiveData.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      handleReset();
    } else {
      Swal.fire({
        title: "Error!",
        text: receiveData.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }

    setLoading(false);
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      size="2xl"
      placement="center"
      isDismissable={false}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <span>Add Supplier</span>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Supplier Name */}
                <div>
                  <Input
                    label="Supplier Name *"
                    placeholder="Add Supplier Name"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleChange}
                    validationState={errors.supplierName ? "invalid" : "valid"}
                    errorMessage={errors.supplierName}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <Input
                    label="Email Address"
                    placeholder="Add Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <Input
                    label="Mobile *"
                    placeholder="Add Mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    validationState={errors.mobile ? "invalid" : "valid"}
                    errorMessage={errors.mobile}
                  />
                </div>

                {/* Previous Credit Balance */}
                <div>
                  <Input
                    label="Previous Credit Balance *"
                    placeholder="Previous Credit Balance"
                    name="previousCreditBalance"
                    value={formData.previousCreditBalance}
                    onChange={handleChange}
                    validationState={
                      errors.previousCreditBalance ? "invalid" : "valid"
                    }
                    errorMessage={errors.previousCreditBalance}
                  />
                </div>

                {/* Address */}
                <div>
                  <Textarea
                    label="Address"
                    placeholder="Add Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onPress={() => {
                  handleReset();
                  onClose();
                }}
              >
                Reset
              </Button>
              <Button
                color="success"
                onPress={handleSubmit}
                isLoading={loading}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddSupplier;
