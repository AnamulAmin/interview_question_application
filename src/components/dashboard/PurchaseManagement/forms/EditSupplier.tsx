import { useEffect, useState } from "react";
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
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const EditSupplier = ({ isShowModal, setIsShowModal, singleData }: any) => {
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.supplierName) {
      newErrors.supplierName = "Supplier Name is required.";
    }
    if (!formData.mobile) {
      newErrors.mobile = "Mobile is required.";
    } else if (!/^\d{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid mobile number.";
    }
    if (!formData.previousCreditBalance) {
      newErrors.previousCreditBalance = "Previous Credit Balance is required.";
    } else if (isNaN(Number(formData.previousCreditBalance))) {
      newErrors.previousCreditBalance = "Must be a valid number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Replace with your actual API call
      const response = await window.ipcRenderer.invoke("update-supplier", {
        _id: singleData._id,
        updateData: formData,
      });

      if (response.success) {
        setIsShowModal(false);
        // Add any success notification here
      } else {
        // Add error notification here
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      supplierName: "",
      email: "",
      mobile: "",
      previousCreditBalance: "",
      address: "",
    });
    setErrors({});
    setIsShowModal(false);
  };

  useEffect(() => {
    if (isShowModal) {
      setFormData(singleData || {});
    }
  }, [singleData, isShowModal]);

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="max-w-[600px]">
        <ModalHeader>Edit Supplier</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Supplier Name"
              placeholder="Add Supplier Name"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              isInvalid={!!errors.supplierName}
              errorMessage={errors.supplierName}
              isRequired
            />

            <Input
              label="Email Address"
              placeholder="Add Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />

            <Input
              label="Mobile"
              placeholder="Add Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              isInvalid={!!errors.mobile}
              errorMessage={errors.mobile}
              isRequired
            />

            <Input
              label="Previous Credit Balance"
              placeholder="Previous Credit Balance"
              name="previousCreditBalance"
              value={formData.previousCreditBalance}
              onChange={handleChange}
              isInvalid={!!errors.previousCreditBalance}
              errorMessage={errors.previousCreditBalance}
              isRequired
            />

            <Textarea
              label="Address"
              placeholder="Add Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
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

export default EditSupplier;
