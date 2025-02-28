import React, { useState } from "react";
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

const AddCommissionSettings: any = ({ isShowModal, setIsShowModal }: any) => {
  const [formData, setFormData] = useState({
    designation: "",
    commission: "",
  });
  const [data, setData] = useState([
    { id: 1, designation: "Chef", commission: "2%" },
    { id: 2, designation: "Waiter", commission: "15%" },
    { id: 3, designation: "Kitchen Manager", commission: "8%" },
    { id: 4, designation: "HRM", commission: "10%" },
    { id: 5, designation: "Accounts", commission: "10%" },
    { id: 6, designation: "Counter Server", commission: "2%" },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.designation && formData.commission) {
      const newId = data.length + 1;
      setData([
        ...data,
        {
          id: newId,
          designation: formData.designation,
          commission: `${formData.commission}%`,
        },
      ]);
      setFormData({ designation: "", commission: "" });
      setIsShowModal(false);
    } else {
      alert("Please fill all fields");
    }
  };

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
          <h3 className="text-xl font-bold">Create Commission</h3>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Designation"
              name="designation"
              placeholder="Enter Designation"
              value={formData.designation}
              onChange={handleInputChange}
              fullWidth
            />
            <Input
              label="Commission (%)"
              name="commission"
              type="number"
              placeholder="Enter Commission Percentage"
              value={formData.commission}
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

export default AddCommissionSettings;
