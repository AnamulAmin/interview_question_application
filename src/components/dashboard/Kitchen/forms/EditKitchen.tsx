import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import useGetAllEmploys from "@/hooks/GetDataHook/useGetAllEmploys";

interface EditKitchenProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  data: any;
  setIsRender: (value: boolean) => void;
}

const EditKitchen = ({
  isShowModal,
  setIsShowModal,
  data,
  setIsRender,
}: EditKitchenProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kitchenName: "",
    chef: "",
    speciality: "",
    status: "Active",
    description: "",
    contactNumber: "",
    email: "",
    address: "",
  });

  const { employees } = useGetAllEmploys({});

  useEffect(() => {
    if (data) {
      setFormData({
        kitchenName: data.kitchenName || "",
        chef: data.chef || "",
        speciality: data.speciality || "",
        status: data.status || "Active",
        description: data.description || "",
        contactNumber: data.contactNumber || "",
        email: data.email || "",
        address: data.address || "",
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate form data
      if (
        !formData.kitchenName ||
        !formData.chef ||
        !formData.speciality ||
        !formData.description ||
        !formData.contactNumber ||
        !formData.email ||
        !formData.address
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const response = await window.ipcRenderer.invoke("update-kitchen", {
        id: data._id,
        data: formData,
      });

      if (response.success) {
        toast.success(response.message);
        setIsRender((prev) => !prev);
        setIsShowModal(false);
      } else {
        toast.error(
          response.message.includes("duplicate key error collection")
            ? "Kitchen name already exists"
            : response.message
        );
      }
    } catch (error: any) {
      toast.error(
        error.message.includes("duplicate key error collection")
          ? "Kitchen name already exists"
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={(open) => setIsShowModal(open)}
      placement="top-center"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Kitchen
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  autoFocus
                  label="Kitchen Name"
                  placeholder="Enter kitchen name"
                  variant="bordered"
                  value={formData.kitchenName}
                  onChange={(e) =>
                    setFormData({ ...formData, kitchenName: e.target.value })
                  }
                />
                <Select
                  label="Chef Name"
                  placeholder={
                    data?.chef?.properties.first_name
                      ? data?.chef?.properties.first_name
                      : "Enter chef name"
                  }
                  variant="bordered"
                  value={formData.chef}
                  onChange={(e) =>
                    setFormData({ ...formData, chef: e.target.value })
                  }
                >
                  {employees
                    ?.filter((staff: any) => staff.designation === "Chef")
                    .map((staff: any) => (
                      <SelectItem key={staff._id} value={staff._id}>
                        {staff.firstName}
                      </SelectItem>
                    ))}
                </Select>
                <Input
                  label="Speciality"
                  placeholder="Enter speciality"
                  variant="bordered"
                  value={formData.speciality}
                  onChange={(e) =>
                    setFormData({ ...formData, speciality: e.target.value })
                  }
                />
                <Select
                  label="Status"
                  placeholder="Select status"
                  variant="bordered"
                  selectedKeys={[formData.status]}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <SelectItem key="Active" value="Active">
                    Active
                  </SelectItem>
                  <SelectItem key="Inactive" value="Inactive">
                    Inactive
                  </SelectItem>
                </Select>
                <Input
                  label="Contact Number"
                  placeholder="Enter contact number"
                  variant="bordered"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  placeholder="Enter email"
                  variant="bordered"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Input
                  label="Address"
                  placeholder="Enter address"
                  variant="bordered"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                <Textarea
                  label="Description"
                  placeholder="Enter description"
                  variant="bordered"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                Update Kitchen
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditKitchen;
