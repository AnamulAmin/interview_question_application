import { useState, FormEvent, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Switch,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import getEmployId from "../../../../electron/main/Helpers/getEmployId";
import UploadImageInput from "../../../shared/UploadImageInput";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface EditInventoryTrackingFormProps {
  isShowModal: boolean;
  data: any;
  setIsShowModal: (value: boolean) => void;
}

const EmployEdit: React.FC<EditInventoryTrackingFormProps> = ({
  isShowModal,
  data,
  setIsShowModal,
}) => {
  const [loading, setLoading] = useState<any>(false);

  const [formData, setFormData] = useState<any>({
    employeeId: getEmployId(),
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    position: "",
    department: "",
    employmentType: "",
    dateOfJoining: "",
    salary: 0,
    shift: "",
    status: "",
    performanceRating: 0,
    remarks: "",
    username: "",
    role: [""],
    profilePicture: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    shiftStart: "",
    shiftEnd: "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const [stuffRoles, setStuffRoles] = useState<string[]>([]);

  const [profilePicture, setProfilePicture] = useState<string>("");

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
      "shiftStart",
      "shiftEnd",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleInputChange = (key: string, value: any) => {
    console.log(key, value);
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
      Swal.fire({
        title: "Error!",
        text: "Please fix the validation errors.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setLoading(false);
      return;
    }

    const receiveData = await window.ipcRenderer.invoke("update-employee", {
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
  };

  const handleReset = () => {
    setFormData(data || {});
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  useEffect(() => {
    setFormData(data || {});
    setProfilePicture(data?.profilePicture || "");
  }, [isShowModal, data]);

  console.log(setStuffRoles, "setStuffRoles");

  return (
    <Modal
      isOpen={isShowModal}
      placement="top"
      onOpenChange={(isOpen) => setIsShowModal(isOpen)}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <ModalHeader>Edit Employ </ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <h1 className="text-3xl font-semibold mb-6">Edit Form</h1>
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              {[
                {
                  label: "Full Name",
                  key: "fullName",
                  placeholder: "Enter Full Name",
                  type: "text",
                  option: [],
                },
                {
                  label: "Email",
                  key: "email",
                  placeholder: "Enter Email",
                  type: "text",
                  option: [],
                },
                {
                  label: "Phone",
                  key: "phone",
                  placeholder: "Enter Phone",
                  type: "text",
                  option: [],
                },
                {
                  label: "Address",
                  key: "address",
                  placeholder: "Enter Address",
                  type: "text",
                  option: [],
                },
                {
                  label: "Date Of Birth",
                  key: "dateOfBirth",
                  placeholder: "Enter Date Of Birth",
                  type: "date",
                  option: [],
                },
                {
                  label: "Position",
                  key: "position",
                  placeholder: "Enter Position",
                  type: "text",
                  option: [],
                },
                {
                  label: "Department",
                  key: "department",
                  placeholder: "Enter Department",
                  type: "text",
                  option: [],
                },
                {
                  label: "Employment Type",
                  key: "employmentType",
                  placeholder: "Enter Employment Type",
                  type: "text",
                  option: [],
                },
                {
                  label: "Date Of Joining",
                  key: "dateOfJoining",
                  placeholder: "Enter Date Of Joining",
                  type: "date",
                  option: [],
                },
                {
                  label: "Salary",
                  key: "salary",
                  placeholder: "Enter Salary",
                  type: "number",
                  option: [],
                },
                {
                  label: "shiftStart",
                  key: "shiftStart",
                  placeholder: "Enter shiftStart",
                  type: "time",
                  option: [],
                  isDisabled: false,
                },
                {
                  label: "shiftEnd",
                  key: "shiftEnd",
                  placeholder: "Enter shiftEnd",
                  type: "time",
                  option: [],
                  isDisabled: false,
                },
                {
                  label: "Status",
                  key: "status",
                  placeholder: "Enter Status",
                  type: "text",
                  option: [],
                },
                {
                  label: "Performance Rating",
                  key: "performanceRating",
                  placeholder: "Enter Performance Rating",
                  type: "number",
                  option: [],
                },
                {
                  label: "Remarks",
                  key: "remarks",
                  placeholder: "Enter Remarks",
                  type: "text",
                  option: [],
                },
                {
                  label: "Username",
                  key: "username",
                  placeholder: "Enter Username",
                  type: "text",
                  option: [],
                },
                {
                  label: "Roles",
                  key: "roles",
                  placeholder: "Enter Roles",
                  type: "text",
                  option: [],
                },
                {
                  label: "Profile Picture",
                  key: "profilePicture",
                  placeholder: "Enter Profile Picture",
                  type: "text",
                  option: [],
                },
                {
                  label: "Emergency Contact Name",
                  key: "emergencyContactName",
                  placeholder: "Enter Emergency Contact Name",
                  type: "text",
                  option: [],
                },
                {
                  label: "Emergency Contact Phone",
                  key: "emergencyContactPhone",
                  placeholder: "Enter Emergency Contact Phone",
                  type: "text",
                  option: [],
                },
                {
                  label: "Emergency Contact Relation",
                  key: "emergencyContactRelation",
                  placeholder: "Enter Emergency Contact Relation",
                  type: "text",
                  option: [],
                },
              ].map(
                ({
                  label,
                  key,
                  placeholder,
                  type = "text",
                  options = [],
                  isDisabled = false,
                }: any) => {
                  if (type === "switch") {
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-gray-700 font-semibold">
                          {label}
                        </label>
                        <Switch
                          isSelected={
                            formData[key as keyof typeof formData] as boolean
                          }
                          defaultSelected={
                            formData[key as keyof typeof formData] as boolean
                          }
                          onValueChange={(value) =>
                            handleInputChange(key, value)
                          }
                          isDisabled={isDisabled}
                          color={isDisabled ? "danger" : "primary"}
                        />
                        {errors[key] && (
                          <p className="text-red-500 text-sm">{errors[key]}</p>
                        )}
                      </div>
                    );
                  }

                  if (type === "select") {
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-gray-700 font-semibold">
                          {label}
                        </label>
                        <Select
                          value={formData[key as keyof typeof formData]}
                          defaultSelectedKeys={[
                            formData[key as keyof typeof formData],
                          ]}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          placeholder={placeholder}
                          isDisabled={isDisabled}
                          color={isDisabled ? "danger" : "default"}
                        >
                          {options.map((item: any) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </Select>
                        {errors[key] && (
                          <p className="text-red-500 text-sm">{errors[key]}</p>
                        )}
                      </div>
                    );
                  }

                  if (type === "time") {
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-gray-700 font-semibold">
                          {label}
                        </label>
                        <Input
                          type={type}
                          value={
                            formData[key as keyof typeof formData] as string
                          }
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          placeholder={placeholder}
                          isDisabled={isDisabled}
                          color={isDisabled ? "danger" : "default"}
                        />
                        {errors[key] && (
                          <p className="text-red-500 text-sm">{errors[key]}</p>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-gray-700 font-semibold">
                        {label}
                      </label>
                      <Input
                        type={type}
                        value={formData[key as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={placeholder}
                        isDisabled={isDisabled}
                      />
                      {errors[key] && (
                        <p className="text-red-500 text-sm">{errors[key]}</p>
                      )}
                    </div>
                  );
                }
              )}
            </form>
          </div>

          {/* Image */}
          <div className="mb-4 col-span-full">
            <label className="block text-gray-700 font-semibold">
              Upload Image
            </label>
            <UploadImageInput
              imageString={profilePicture}
              setImageString={setProfilePicture}
            />
          </div>

          {/* Employee Role */}
          <Popover
            placement="bottom"
            className="col-span-full w-full"
            showArrow={true}
          >
            <div
              className={`bg-gray-100 rounded-md p-2 flex flex-wrap justify-start items-start gap-3 col-span-full min-h-[100px] w-full relative`}
            >
              {formData?.roles?.length > 0
                ? formData.roles.map((item: any) => (
                    <b
                      className="border p-1 border-gray-400 rounded-md relative"
                      key={item}
                    >
                      {item}

                      <span
                        className="absolute -right-2 -top-2 text-black"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            roles: formData.roles.filter(
                              (item2: any) => item2 !== item
                            ),
                          })
                        }
                      >
                        <AiOutlineCloseCircle />
                      </span>
                    </b>
                  ))
                : "Add Staff Role"}

              <PopoverTrigger className="w-fit absolute -right-3 -top-3 bg-gray-200">
                <span
                  color="primary"
                  className="border rounded-md border-gray-400 p-1"
                >
                  <FaPlus />
                </span>
              </PopoverTrigger>
            </div>
            <PopoverContent>
              <Listbox
                aria-label="Actions"
                onAction={(key) => {
                  console.log(key, formData);
                  if (formData?.roles?.includes(key)) {
                    return;
                  }
                  setFormData({
                    ...formData,
                    roles: [
                      ...formData.roles.filter((item: any) => item !== ""),
                      key,
                    ],
                  });
                }}
              >
                {stuffRoles.map((item: any) => (
                  <ListboxItem key={item.role}>
                    <div className="flex justify-between">
                      <b>{item.role}</b>
                    </div>
                  </ListboxItem>
                ))}
              </Listbox>
            </PopoverContent>
          </Popover>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleSubmit} isLoading={loading} color="primary">
            Submit
          </Button>
          <Button onPress={handleReset} color="danger">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EmployEdit;
