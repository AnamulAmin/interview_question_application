import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Card,
  Form,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import moment from "moment";
import InputCalender from "@/shared/InputCalender/InputCalender";
import useGetAllDesignation from "@/hooks/GetDataHook/useGetAllDesignation";

const EmployeeDetailsForm: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  isEdit,
  setIsEdit,
  parentFormData,
  singleEmployee,
}: any) => {
  const [formData, setFormData] = useState({
    division: "",
    designation: "",
    dutyType: "",
    hireDate: null,
    originalHireDate: null,
    terminationDate: null,
    terminationReason: "",
    voluntaryTermination: false,
    rehireDate: null,
    rateType: "",
    rate: "",
    payFrequency: "",
    homeDepartment: "",
    shiftStart: "",
    shiftEnd: "",
  });
  const [errors, setErrors] = useState<any>(null);
  const { designations } = useGetAllDesignation({ role: "Designation" });
  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = [
      "division",
      "designation",
      "dutyType",
      "hireDate",
      "rateType",
      "rate",
      "originalHireDate",
      "payFrequency",
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

  const handleToggleChange = () => {
    setFormData({ ...formData, voluntaryTermination: !formData.isSupervisor });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log(formData, "newFormData");
    setParentFormData((prev: any) => ({ ...prev, ...formData }));
    nextStep();
  };

  useEffect(() => {
    const initialData = {
      division: parentFormData?.division || "",
      designation: parentFormData?.designation || "",
      dutyType: parentFormData?.dutyType || "",
      hireDate: parentFormData?.hireDate || null,
      originalHireDate: parentFormData?.originalHireDate || null,
      terminationDate: parentFormData?.terminationDate || null,
      terminationReason: parentFormData?.terminationReason || "",
      voluntaryTermination: parentFormData?.voluntaryTermination || false,
      rehireDate: parentFormData?.rehireDate || null,
      rateType: parentFormData?.rateType || "",
      rate: parentFormData?.rate || "",
      payFrequency: parentFormData?.payFrequency || "",
      homeDepartment: parentFormData?.homeDepartment || "",
      shiftStart: parentFormData?.shiftStart || "",
      shiftEnd: parentFormData?.shiftEnd || "",
    };
    setFormData(initialData);
  }, [isEdit, parentFormData]);

  console.log(parentFormData, "parentFormData");

  return (
    <div className="w-full ">
      <Card className="shadow-lg p-6 bg-white  ">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Employee Details Form
        </h1>
        <Form
          validationBehavior="native"
          validationErrors={errors}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Division and Designation */}
          <Input
            label="Division *"
            name="division"
            placeholder="Enter Division"
            value={formData.division}
            onChange={handleInputChange}
            fullWidth
            errorMessage={"Division is required"}
          />
          <Select
            label="Designation *"
            name="designation"
            placeholder={
              formData.designation ? formData.designation : "Select Designation"
            }
            value={formData.designation}
            defaultSelectedKeys={[formData.designation]}
            onChange={(e) =>
              setFormData({ ...formData, designation: e.target.value })
            }
            fullWidth
            errorMessage={"Designation is required"}
          >
            {designations.map((designation: any) => (
              <SelectItem key={designation.name} value={designation.name}>
                {designation.name}
              </SelectItem>
            ))}
          </Select>
          {/* <Input
            label="Designation *"
            name="designation"
            placeholder="Enter Designation"
            value={formData.designation}
            onChange={handleInputChange}
            fullWidth
            errorMessage={"Designation is required"}
          /> */}

          {/* Duty Type and Hire Date */}
          <Input
            label="Duty Type"
            name="dutyType"
            placeholder="Enter Duty Type"
            value={formData.dutyType}
            onChange={handleInputChange}
            fullWidth
            errorMessage={"Duty Type is required"}
          />
          {/* Duty Type and Hire Date */}
          <Input
            label="Shift Start"
            name="shiftStart"
            placeholder="Enter Shift Start"
            value={formData.shiftStart}
            onChange={handleInputChange}
            type="time"
            errorMessage={"Shift Start is required"}
          />
          <Input
            label="Shift End"
            name="shiftEnd"
            placeholder="Enter Shift End"
            value={formData.shiftEnd}
            onChange={handleInputChange}
            type="time"
            errorMessage={"Shift End is required"}
          />

          {/* <DatePicker
            label="Hire Date *"
            name="hireDate"
            placeholder="Select Hire Date"
            // value={formData.hireDate ? new Date(formData.hireDate) : null} // Convert to Date
            defaultFocusedValue={
              formData.hireDate ? new Date(formData.hireDate) : null
            } // Convert to Date
            onChange={(date: any) =>
              setFormData({
                ...formData,
                hireDate: date ? new Date(date) : null, // Ensure it's a Date or null
              })
            }
            fullWidth
            errorMessage={"Hire Date is required"}
          /> */}
          <InputCalender
            label="Hire Date *"
            name="hireDate"
            placeholder="Select Hire Date"
            value={formData.hireDate}
            onChange={(date: any) =>
              setFormData({
                ...formData,
                hireDate: date, // Ensure it's a Date or null
              })
            }
          />

          {/* Original Hire Date and Termination Date */}
          <InputCalender
            label="Original Hire Date *"
            name="originalHireDate"
            placeholder="Select Original Hire Date"
            // value={
            //   formData.originalHireDate
            //     ? new Date(formData.originalHireDate)
            //     : null
            // } // Convert to Date
            value={formData.originalHireDate}
            onChange={(date: any) =>
              setFormData({
                ...formData,
                originalHireDate: date, // Ensure it's a Date or null
              })
            }
            fullWidth
            errorMessage={"Original Hire Date is required"}
          />
          <InputCalender
            label="Termination Date"
            name="terminationDate"
            placeholder="Select Termination Date"
            value={formData.terminationDate}
            onChange={(date: any) =>
              setFormData({
                ...formData,
                terminationDate: date ? new Date(date) : null, // Ensure it's a Date or null
              })
            }
            fullWidth
          />

          {/* Termination Reason and Voluntary Termination */}
          <Input
            label="Termination Reason"
            name="terminationReason"
            placeholder="Enter Termination Reason"
            value={formData.terminationReason}
            onChange={handleInputChange}
            fullWidth
          />

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Voluntary Termination</label>
            <Switch
              checked={formData.voluntaryTermination}
              onChange={handleToggleChange}
              size="lg"
              color="primary"
            />
          </div>

          {/* Rehire Date and Rate Type */}
          <InputCalender
            label="Rehire Date"
            name="rehireDate"
            placeholder="Select Rehire Date"
            value={formData.rehireDate}
            onChange={(date: any) =>
              setFormData({ ...formData, rehireDate: date })
            }
            fullWidth
          />
          <Select
            label="Rate Type *"
            name="rateType"
            placeholder={
              formData.rateType ? formData.rateType : "Select Rate Type"
            }
            value={formData.rateType}
            onChange={(e: any) =>
              setFormData({ ...formData, rateType: e.target.value })
            }
            // options={[
            //   { label: "Hourly", value: "hourly" },
            //   { label: "Salary", value: "salary" },
            // ]}
            fullWidth
            errorMessage={"Rate Type is required"}
          >
            <SelectItem key={"hourly"} value="hourly">
              Hourly
            </SelectItem>
            <SelectItem key={"salary"} value="salary">
              Salary
            </SelectItem>
          </Select>

          {/* Rate and Pay Frequency */}
          <Input
            label="Rate *"
            name="rate"
            placeholder="Enter Rate"
            type="number"
            value={formData.rate}
            onChange={handleInputChange}
            fullWidth
            errorMessage={"Rate is required"}
          />
          <Select
            label="Pay Frequency *"
            name="payFrequency"
            placeholder={
              formData.payFrequency
                ? formData.payFrequency
                : "Select Pay Frequency"
            }
            value={formData.payFrequency}
            onChange={(e: any) =>
              setFormData({ ...formData, payFrequency: e.target.value })
            }
            fullWidth
            errorMessage={"Pay Frequency is required"}
            defaultSelectedKeys={[formData.payFrequency]}
          >
            <SelectItem key={"weekly"} value="weekly">
              Weekly
            </SelectItem>
            <SelectItem key={"biweekly"} value="biweekly">
              Bi-Weekly
            </SelectItem>
            <SelectItem key={"monthly"} value="monthly">
              Monthly
            </SelectItem>
          </Select>

          {/* Home Department */}
          <Input
            label="Home Department"
            name="homeDepartment"
            placeholder="Enter Home Department"
            value={formData.homeDepartment}
            onChange={handleInputChange}
            fullWidth
          />
        </Form>

        {/* Submit Button */}
        <div className="text-center mt-6 w-full flex justify-between items-center">
          <Button color="primary" onPress={prevStep}>
            Prev
          </Button>
          <Button color="secondary" onPress={handleSubmit}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDetailsForm;
