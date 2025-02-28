import { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
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

type ErrorType = {
  [key: string]: string | undefined;
};

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function CreateExpenseItem({
  setIsShowModal,
  isShowModal,
}: Props) {
  const [loading, setLoading] = useState<any>(false);

  // Form states
  const [formData, setFormData] = useState<any>({});

  const [stuffRoles, setStuffRoles] = useState<string[]>([]);

  const [profilePicture, setProfilePicture] = useState<string>("");

  const [errors, setErrors] = useState<ErrorType>({});

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "address",
      "dateOfBirth",
      "dateOfJoining",
      "salary",
      "status",
      "username",
      "emergencyContactName",
      "emergencyContactPhone",
      "emergencyContactRelation",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    formData.profilePicture = profilePicture;

    const receiveData = await window.ipcRenderer.invoke("create-employee", {
      data: formData,
    });

    console.log(receiveData, "receiveData", formData, "formData");

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
    setIsShowModal(false);
    setLoading(false);
  };

  useEffect(() => {
    const fetchmenuItems = async (): Promise<void> => {
      const response = await window.ipcRenderer.invoke("get-stuff-role", {
        data: null,
      });

      console.log(response, "response");
      setStuffRoles(response.data);
    };
    fetchmenuItems();
  }, []);

  console.log(errors, "errors");

  return (
    <Modal
      isOpen={isShowModal}
      aria-labelledby="modal-title"
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">Create Expense Item</h3>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Position"
              name="position"
              placeholder="Enter position"
              value={formData.position}
              onChange={handleInputChange}
              fullWidth
            />
            <textarea
              name="details"
              rows={3}
              className="w-full p-2 border rounded"
              placeholder="Enter details"
              value={formData.details}
              onChange={handleInputChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onPress={() => setIsShowModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {"Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
