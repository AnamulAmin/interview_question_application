import { useState, useEffect } from "react";
import { Input, Textarea } from "@nextui-org/input";
import Swal from "sweetalert2";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import useGetAllDepartment from "@/hooks/GetDataHook/useGetAllDepartment";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

type ErrorType = {
  [key: string]: string | undefined;
};

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function CreateDivision({ setIsShowModal, isShowModal }: Props) {
  const [loading, setLoading] = useState<any>(false);

  const [formData, setFormData] = useState<any>({});

  const [stuffRoles, setStuffRoles] = useState<string[]>([]);

  const [profilePicture, setProfilePicture] = useState<string>("");

  const [errors, setErrors] = useState<ErrorType>({});

  const { departments } = useGetAllDepartment({
    isShowModal: isShowModal,
  });

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["name", "department"];
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
      const receiveData = await window.ipcRenderer.invoke("create-division", {
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

            <Select
              className="w-full mb-3"
              defaultItems={departments}
              label="Select Department"
              color="default"
              name="department"
              isRequired
              value={formData.name}
              onChange={handleInputChange}
              errorMessage={errors.department}
            >
              {departments.length > 0 &&
                departments.map((item: any) => (
                  <SelectItem key={item.name}>{item.name}</SelectItem>
                ))}
            </Select>
            <Textarea
              name="description"
              rows={3}
              label="Description"
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
