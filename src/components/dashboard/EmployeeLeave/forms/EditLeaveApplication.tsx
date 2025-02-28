import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import { toast } from "react-hot-toast";

interface Props {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  data: any;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditLeaveApplication({
  isShowModal,
  setIsShowModal,
  data,
  setIsRender,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    leaveType: "",
    applicationStartDate: "",
    applicationEndDate: "",
    days: 0,
    applicationHardCopy: "",
    approveStartDate: "",
    approvedEndDate: "",
    approvedDay: 0,
    approvedBy: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setFormData({
        employeeName: data.employeeName || "",
        leaveType: data.leaveType || "",
        applicationStartDate: data.applicationStartDate || "",
        applicationEndDate: data.applicationEndDate || "",
        days: data.days || 0,
        applicationHardCopy: data.applicationHardCopy || "",
        approveStartDate: data.approveStartDate || "",
        approvedEndDate: data.approvedEndDate || "",
        approvedDay: data.approvedDay || 0,
        approvedBy: data.approvedBy || "",
        reason: data.reason || "",
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.employeeName)
      newErrors.employeeName = "Employee name is required";
    if (!formData.leaveType) newErrors.leaveType = "Leave type is required";
    if (!formData.applicationStartDate)
      newErrors.applicationStartDate = "Start date is required";
    if (!formData.applicationEndDate)
      newErrors.applicationEndDate = "End date is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    return newErrors;
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleDateChange = (
    field:
      | "applicationStartDate"
      | "applicationEndDate"
      | "approveStartDate"
      | "approvedEndDate",
    value: string
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (newData.applicationStartDate && newData.applicationEndDate) {
        newData.days = calculateDays(
          newData.applicationStartDate,
          newData.applicationEndDate
        );
      }

      if (newData.approveStartDate && newData.approvedEndDate) {
        newData.approvedDay = calculateDays(
          newData.approveStartDate,
          newData.approvedEndDate
        );
      }
      return newData;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, applicationHardCopy: file }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await window.ipcRenderer.invoke(
        "update-leave-application",
        {
          id: data._id,
          data: formData,
        }
      );

      if (response.success) {
        toast.success(response.message);
        handleReset();
        setIsRender((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update leave application");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (data) {
      setFormData({
        employeeName: data.employeeName || "",
        leaveType: data.leaveType || "",
        applicationStartDate: data.applicationStartDate || "",
        applicationEndDate: data.applicationEndDate || "",
        days: data.days || 0,
        applicationHardCopy: data.applicationHardCopy || "",
        approveStartDate: data.approveStartDate || "",
        approvedEndDate: data.approvedEndDate || "",
        approvedDay: data.approvedDay || 0,
        approvedBy: data.approvedBy || "",
        reason: data.reason || "",
      });
    }
    setErrors({});
    setIsShowModal(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
      size="2xl"
      placement="top"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit Leave Application
        </ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <Select
              label="Select Employee Name"
              placeholder="Select employee"
              value={formData.employeeName}
              defaultSelectedKeys={[formData.employeeName]}
              onChange={(e) =>
                setFormData({ ...formData, employeeName: e.target.value })
              }
              errorMessage={errors.employeeName}
              isInvalid={!!errors.employeeName}
            >
              <SelectItem key="employee1" value="Dorathy Mclain">
                Dorathy Mclain
              </SelectItem>
              {/* Add more employees */}
            </Select>

            <Select
              label="Select Leave Type"
              placeholder="Select leave type"
              value={formData.leaveType}
              defaultSelectedKeys={[formData.leaveType]}
              onChange={(e) =>
                setFormData({ ...formData, leaveType: e.target.value })
              }
              errorMessage={errors.leaveType}
              isInvalid={!!errors.leaveType}
            >
              <SelectItem key="ssdas" value="ssdas">
                ssdas
              </SelectItem>
              <SelectItem key="earnLeave" value="Earn Leave">
                Earn Leave
              </SelectItem>
            </Select>

            <Input
              type="date"
              label="Application Start Date"
              value={formData.applicationStartDate}
              onChange={(e) =>
                handleDateChange("applicationStartDate", e.target.value)
              }
              errorMessage={errors.applicationStartDate}
              isInvalid={!!errors.applicationStartDate}
            />

            <Input
              type="date"
              label="Application End date"
              value={formData.applicationEndDate}
              onChange={(e) =>
                handleDateChange("applicationEndDate", e.target.value)
              }
              errorMessage={errors.applicationEndDate}
              isInvalid={!!errors.applicationEndDate}
            />

            <Input
              type="number"
              label="Days"
              value={formData.days.toString()}
              isReadOnly
            />

            <Input
              type="file"
              label="Application Hard Copy"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />

            <Input
              type="date"
              label="Approve Start Date"
              value={formData.approveStartDate}
              onChange={(e) =>
                handleDateChange("approveStartDate", e.target.value)
              }
            />

            <Input
              type="date"
              label="Approved End Date"
              value={formData.approvedEndDate}
              onChange={(e) =>
                handleDateChange("approvedEndDate", e.target.value)
              }
            />

            <Input
              type="number"
              label="Approved Day"
              value={formData.approvedDay.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  approvedDay: parseInt(e.target.value),
                })
              }
            />

            <Select
              label="Approved By"
              placeholder="Select approver"
              value={formData.approvedBy}
              defaultSelectedKeys={[formData.approvedBy]}
              onChange={(e) =>
                setFormData({ ...formData, approvedBy: e.target.value })
              }
            >
              <SelectItem key="approver1" value="Approver 1">
                Approver 1
              </SelectItem>
              {/* Add more approvers */}
            </Select>

            <Textarea
              label="Reason"
              placeholder="Enter reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              errorMessage={errors.reason}
              isInvalid={!!errors.reason}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
            Reset
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
