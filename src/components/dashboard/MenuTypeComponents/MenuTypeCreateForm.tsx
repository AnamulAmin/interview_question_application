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

type ErrorType = {
  name?: string;
};

interface MenuTypeCreateFormProps {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function MenuTypeCreateForm({
  setIsShowModal,
  isShowModal,
}: MenuTypeCreateFormProps) {
  // const [loading, setLoading] = useState<any>(false);
  const [name, setName] = useState<string>("");

  const [errors, setErrors] = useState<ErrorType>({});

  const validateForm = (): ErrorType => {
    const newErrors: ErrorType = {};
    if (!name) newErrors.name = "Name is required.";

    return newErrors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Swal.fire({
      //   title: "Error!",
      //   text: "Please fix the validation errors.",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      // });
      // setLoading(false);
      return;
    }

    // Prepare menu item data

    const newMenuItem = {
      name,
    };

    interface createMenuResponse {
      success: boolean;
      message: string;
    }

    const receiveData: createMenuResponse = await window.ipcRenderer.invoke(
      "create-menu-type",
      { data: newMenuItem }
    );

    console.log(newMenuItem, "newMenuItem", receiveData, "receiveData");

    if (receiveData.success) {
      Swal.fire({
        title: "Success!",
        text: receiveData.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      handleReset();
      setIsShowModal(false);
    } else {
      Swal.fire({
        title: "Error!",
        text: receiveData.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
      // setLoading(false);
    }

    // setLoading(false);
  };

  const handleReset = () => {
    setName("");
    setErrors({});
  };

  return (
    <Modal
      isOpen={isShowModal}
      placement={"center"}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Create Menu Type
        </ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <form onSubmit={handleSubmit} className="w-full ">
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-xl"
                  placeholder="Menu Item Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Submit Button */}
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => setIsShowModal(false)}
          >
            Close
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
