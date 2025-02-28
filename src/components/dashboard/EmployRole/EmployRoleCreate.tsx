import { useState, FormEvent } from "react";
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

// {
//   employeeId: getEmployId(),
//   fullName: "",
//   email: "",
//   phone: "",
//   address: "",
//   dateOfBirth: "",
//   position: "",
//   department: "",
//   employmentType: "",
//   dateOfJoining: "",
//   salary: 0,
//   shift: "",
//   status: "",
//   performanceRating: 0,
//   remarks: "",
//   username: "",
//   password: "",
//   roles: [""],
//   profilePicture: "",
//   emergencyContact: {
//     name: "",
//     phone: "",
//     relation: "",
//   },
// }

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function EmployRoleCreate({
  setIsShowModal,
  isShowModal,
}: Props) {
  const [loading, setLoading] = useState<any>(false);

  // Form states
  const [formData, setFormData] = useState<any>({
    role: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["role"];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [key]: undefined,
      }));
    }
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

    const receiveData = await window.ipcRenderer.invoke("create-stuff-role", {
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
    setIsShowModal(false);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      placement="top"
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <ModalHeader>Create Employ Role</ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <h1 className="text-3xl font-semibold mb-6">Create Employ Role</h1>
            <form onSubmit={handleSubmit} className="w-full gap-4">
              {[
                {
                  label: "Stuff Role",
                  key: "role",
                  placeholder: "Enter Stuff Role",
                  type: "text",
                },
              ].map(({ label, key, placeholder, type = "text" }) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    {label}
                  </label>
                  <Input
                    type={type}
                    value={formData[key as keyof typeof formData] as string}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-sm">{errors[key]}</p>
                  )}
                </div>
              ))}
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleSubmit} isLoading={loading} color="primary">
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button onPress={handleReset} color="danger">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
