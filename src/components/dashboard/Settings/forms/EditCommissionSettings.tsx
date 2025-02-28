import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Card,
  Table,
  Modal,
  useModal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const EditCommissionSettings: any = ({
  isShowModal,
  setIsShowModal,
  data,
}: any) => {
  const [formData, setFormData] = useState({
    designation: "",
    commission: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.designation && formData.commission) {
      const newId = data.length + 1;

      setFormData({ designation: "", commission: "" });
      setIsShowModal(false);
    } else {
      alert("Please fill all fields");
    }
  };

  useEffect(() => {
    if (isShowModal) {
      setFormData(data);
    }
  }, [data]);

  return (
    <Modal
      closeButton
      aria-labelledby="create-commission-modal"
      isOpen={isShowModal}
      onOpenChange={() => setIsShowModal(false)}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">Edit Commission</h3>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Designation"
              name="designation"
              placeholder="Enter Designation"
              value={formData?.designation}
              onChange={handleInputChange}
              fullWidth
            />
            <Input
              label="Commission (%)"
              name="commission"
              type="number"
              placeholder="Enter Commission Percentage"
              value={formData?.commission}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={() => setIsShowModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCommissionSettings;
