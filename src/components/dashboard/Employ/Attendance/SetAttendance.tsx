import { useState, FormEvent, useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment";
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
  Image,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
interface EditInventoryTrackingFormProps {
  isShowModal: boolean;
  data: any;
  setIsShowModal: (value: boolean) => void;
}

const SetAttendance: React.FC<EditInventoryTrackingFormProps> = ({
  isShowModal,
  data,
  setIsShowModal,
}) => {
  const [loading, setLoading] = useState<any>(false);

  const [formData, setFormData] = useState<any>({
    employeeId: "",
    date: "",
    status: "",
    checkInTime: "",
    checkOutTime: "",
    hoursWorked: 0,
    shiftStart: "",
    shiftEnd: "",
    shiftType: "",
    isOnLeave: false,
    leaveType: null,
    overtimeHours: 0,
    remarks: "On time",
    approvedBy: "Admin001",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const [profilePicture, setProfilePicture] = useState<string>("");
  const [singleAttendance, setSingleAttendance] = useState<any>(null);

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["checkInTime", "checkOutTime", "approvedBy"];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleInputChange = (key: string, value: any) => {
    console.log(`Key: ${key}, Value: ${value}`);
    const format = "hh:mm"; // Time format for parsing (24-hour or 12-hour)

    if (key === "checkInTime") {
      console.log("Check-In Time updated");
      setFormData((prev: any) => ({
        ...prev,
        [key]: value,
        checkOutTime: "", // Reset check-out time
        hoursWorked: 0, // Reset hours worked
      }));
      return;
    }

    if (key === "checkOutTime") {
      console.log("Check-Out Time updated");
      setFormData((prev: any) => {
        const checkInMoment = moment(prev.checkInTime, format); // Parse check-in time
        const checkOutMoment = moment(value, format); // Parse check-out time

        // Ensure valid check-in and check-out times
        if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
          console.error("Invalid time format");
          return { ...prev, [key]: value, hoursWorked: 0 };
        }

        // Calculate hours worked
        const hoursWorked = moment
          .duration(checkOutMoment.diff(checkInMoment))
          .asHours();

        console.log(
          `Check-In: ${prev.checkInTime}, Check-Out: ${value}, Hours Worked: ${hoursWorked}`
        );

        return {
          ...prev,
          [key]: value,
          hoursWorked: hoursWorked >= 0 ? hoursWorked.toFixed(2) : 0, // Ensure no negative values
        };
      });
      return;
    }

    // Default case for handling other fields
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));

    // Clear errors for the specific field, if any
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

    console.log(formData, "formData sumbit");

    let receiveData;

    if (singleAttendance) {
      receiveData = await window.ipcRenderer.invoke(
        "update-employee-attendance",
        {
          data: formData,
        }
      );
    } else {
      receiveData = await window.ipcRenderer.invoke(
        "create-employee-attendance",
        {
          data: formData,
        }
      );
    }

    data.attendanceDate = new Date().toLocaleDateString();

    const responseData = await window.ipcRenderer.invoke("update-employee", {
      data,
    });

    if (receiveData.success && responseData.success) {
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
    setFormData(data || {});
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  useEffect(() => {
    setProfilePicture(data?.profilePicture || "");

    // if (formData.checkInTime && formData.checkOutTime) {
    //   const checkInTime = new Date(formData.checkInTime);
    //   const checkOutTime = new Date(formData.checkOutTime);
    //   console.log(checkInTime, checkOutTime);
    //   setFormData({
    //     ...formData,
    //     hoursWorked: checkOutTime.getTime() - checkInTime.getTime(),
    //   });
    // }

    const fetchAttendance = async () => {
      const responseData = await window.ipcRenderer.invoke(
        "get-single-attendance",
        {
          data,
        }
      );
      const responseDataAll = await window.ipcRenderer.invoke(
        "get-employ-attendance",
        {
          data,
        }
      );

      console.log(
        responseData,
        "responseData",
        responseDataAll,
        "responseDataAll"
      );

      if (responseData.success && responseData.data) {
        setSingleAttendance(responseData.data);
        setFormData(responseData.data || {});
      } else {
        setFormData((prevState: any) => ({
          ...prevState,
          shiftStart: data.shiftStart,
          shiftEnd: data.shiftEnd,
          employeeId: data.employeeId,
        }));
      }
    };
    if (data) {
      fetchAttendance();
    }
  }, [isShowModal, data]);

  console.log(formData, "formData");

  return (
    <Modal
      isOpen={isShowModal}
      placement="top"
      onOpenChange={(isOpen) => setIsShowModal(isOpen)}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <ModalHeader>Employee Attendance </ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <div className="flex justify-center gap-1 w-full mb-6">
              <Image
                src={profilePicture}
                alt="image"
                height={200}
                isZoomed
                className="object-contain w-full max-w-[300px] mx-auto block border p-4"
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              {[
                {
                  label: "Attendance Date",
                  key: "attendance_date",
                  placeholder: "Enter Attendance Date",
                  type: "date",
                  isDisabled: data?.attendanceDate ? true : false,
                },
                {
                  label: "Status",
                  key: "status",
                  placeholder: "Enter Status",
                  type: "select",
                  options: [
                    {
                      value: "Present",
                      label: "Present",
                    },
                    {
                      value: "Absent",
                      label: "Absent",
                    },
                    {
                      value: "Late",
                      label: "Late",
                    },
                    {
                      value: "Leave",
                      label: "Leave",
                    },
                    {
                      value: "Sick",
                      label: "Sick",
                    },
                    {
                      value: "Holiday",
                      label: "Holiday",
                    },
                    {
                      value: "Suspended",
                      label: "Suspended",
                    },
                    {
                      value: "Work from Home",
                      label: "Work from Home",
                    },
                    {
                      value: "Pending Approval",
                      label: "Pending Approval",
                    },
                    {
                      value: "Half Day",
                      label: "Half Day",
                    },
                  ],
                  isDisabled: data?.attendanceDate ? true : false,
                },
                {
                  label: "checkInTime",
                  key: "checkInTime",
                  placeholder: "Enter checkInTime",
                  type: "time",
                  isDisabled: data?.attendanceDate ? true : false,
                },
                {
                  label: "checkOutTime",
                  key: "checkOutTime",
                  placeholder: "Enter checkOutTime",
                  type: "time",
                  isDisabled: false,
                },
                {
                  label: "hoursWorked",
                  key: "hoursWorked",
                  placeholder: "Enter hoursWorked",
                  type: "text",
                  isDisabled: false,
                },
                {
                  label: "shiftStart",
                  key: "shiftStart",
                  placeholder: "Enter shiftStart",
                  type: "time",
                  isDisabled: false,
                },
                {
                  label: "shiftEnd",
                  key: "shiftEnd",
                  placeholder: "Enter shiftEnd",
                  type: "time",
                  isDisabled: false,
                },
                {
                  label: "shiftType",
                  key: "shiftType",
                  placeholder: "Enter shiftType",
                  type: "select",
                  options: [
                    { value: "Morning", label: "Morning" },
                    { value: "Afternoon", label: "Afternoon" },
                    { value: "Evening", label: "Evening" },
                    { value: "Night", label: "Night" },
                    { value: "Weekend", label: "Weekend" },
                    { value: "Day", label: "Day" },
                  ],
                  isDisabled: false,
                },
                {
                  label: "leaveType",
                  key: "leaveType",
                  placeholder: "Enter leaveType",
                  type: "select",
                  options: [
                    { value: "Sick", label: "Sick" },
                    { value: "Holiday", label: "Holiday" },
                    { value: "Other", label: "Other" },
                    { value: "none", label: "none" },
                  ],
                  isDisabled: false,
                },
                {
                  label: "overtimeHours",
                  key: "overtimeHours",
                  placeholder: "Enter overtimeHours",
                  type: "text",
                  isDisabled: false,
                },
                {
                  label: "remarks",
                  key: "remarks",
                  placeholder: "Enter remarks",
                  type: "select",
                  options: [
                    { value: "On time", label: "On time" },
                    { value: "Late", label: "Late" },
                    { value: "No show", label: "No show" },
                    { value: "Cancelled", label: "Cancelled" },
                    { value: "Other", label: "Other" },
                  ],
                  isDisabled: false,
                },
                {
                  label: "approvedBy",
                  key: "approvedBy",
                  placeholder: "Enter approvedBy",
                  type: "text",
                  isDisabled: false,
                },
                {
                  label: "isOnLeave",
                  key: "isOnLeave",
                  placeholder: "Enter isOnLeave",
                  type: "switch",
                  isDisabled: false,
                },
              ].map(
                ({
                  label,
                  key,
                  placeholder,
                  type = "text",
                  options = [],
                  isDisabled = false,
                }) => {
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
                          value={
                            formData[key as keyof typeof formData] as string
                          }
                          defaultSelectedKeys={
                            formData[key as keyof typeof formData] as string
                          }
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

export default SetAttendance;
