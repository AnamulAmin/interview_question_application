import { useState, useEffect } from "react";
import { Input, Textarea } from "@nextui-org/input";
import Swal from "sweetalert2";
import {
  Button,
  Form,
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

export default function CreateDepartment({
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
    const requiredFields = ["name"];
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
    setLoading(true);

    const validationErrors = validateForm();

    console.log(validationErrors, "validationErrors");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    console.log(formData, "formData department");

    setLoading(true);

    try {
      const receiveData = await window.ipcRenderer.invoke("create-department", {
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
    } catch (error: any) {
      console.log(error, "error");
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  useEffect(() => {
    const fetchMenuItems = async (): Promise<void> => {
      const response = await window.ipcRenderer.invoke("get-stuff-role", {
        data: null,
      });

      console.log(response, "response");
      setStuffRoles(response.data);
    };
    fetchMenuItems();
  }, []);

  return (
    <Modal
      isOpen={isShowModal}
      aria-labelledby="modal-title"
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">Create Department</h3>
        </ModalHeader>
        <ModalBody>
          <Form
            validationBehavior="native"
            validationErrors={errors}
            className="flex flex-col gap-4"
          >
            <Input
              label="name"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              isRequired
              errorMessage={errors.name}
            />
            <Textarea
              name="description"
              rows={3}
              label="Description"
              className="w-full p-2 border rounded"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onPress={handleReset}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
