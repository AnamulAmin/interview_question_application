import React, { useEffect, useState } from "react";
import {
  Input,
  Switch,
  Select,
  Button,
  Card,
  Form,
  SelectItem,
} from "@nextui-org/react";

const SupervisorInfoForm: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  isEdit,
  setIsEdit,
  singleEmployee,
  parentFormData,
}: any) => {
  const [formData, setFormData] = useState({
    supervisorName: "",
    isSupervisor: false,
    supervisorReport: "",
    reports: "",
  });

  const [errors, setErrors] = useState<any>(null);
  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields: any = [];
    requiredFields.forEach((field: any) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
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
    setParentFormData((prev: any) => ({ ...prev, ...formData }));
    nextStep();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = () => {
    setFormData({ ...formData, isSupervisor: !formData.isSupervisor });
  };

  useEffect(() => {
    if (isEdit) {
      const initialData: any = {
        benefitClassCode: parentFormData.benefitClassCode || "",
        benefitDescription: parentFormData.benefitDescription || "",
        benefitAccrualDate: parentFormData.benefitAccrualDate || "",
        benefitStatus: parentFormData.benefitStatus || "",
      };
      setFormData(initialData);
    }
  }, [isEdit, parentFormData]);

  console.log(parentFormData, "parentFormData");
  return (
    <div className="p-6 bg-gray-100 w-full">
      <Card className="shadow-lg p-6 bg-white  mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Supervisor Information Form
        </h1>
        <Form
          validationBehavior="native"
          validationErrors={errors}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
        >
          {/* Supervisor Name */}
          <Input
            label="Supervisor Name"
            name="supervisorName"
            placeholder="Enter Supervisor Name"
            value={formData.supervisorName}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Is Supervisor */}

          {/* Supervisor Report */}
          <Select
            label="Supervisor Report "
            name="supervisorReport"
            placeholder={
              formData.supervisorReport
                ? formData.supervisorReport
                : "Select Supervisor Report"
            }
            value={formData.supervisorReport}
            onChange={(e: any) =>
              setFormData({ ...formData, supervisorReport: e.target.value })
            }
            fullWidth
          >
            <SelectItem key={"monthly"} value="monthly">
              Monthly
            </SelectItem>
            <SelectItem key={"weekly"} value="weekly">
              Weekly
            </SelectItem>
            <SelectItem key={"daily"} value="daily">
              Daily
            </SelectItem>
          </Select>

          {/* Reports */}
          <Select
            label="Reports "
            name="reports"
            placeholder={formData.reports ? formData.reports : "Select Reports"}
            value={formData.reports}
            onChange={(e) =>
              setFormData({ ...formData, reports: e.target.value })
            }
            fullWidth
          >
            <SelectItem key={"performance"} value="performance">
              Performance Report
            </SelectItem>
            <SelectItem key={"attendance"} value="attendance">
              Attendance Report
            </SelectItem>
            <SelectItem key={"sales"} value="sales">
              Sales Report
            </SelectItem>
          </Select>

          <div className="flex items-center gap-4">
            <label className="text-lg font-medium">Is Supervisor</label>
            <Switch
              checked={formData.isSupervisor}
              onChange={handleToggleChange}
              size="lg"
              color="primary"
            />
          </div>
          <div className="text-center mt-6 w-full flex justify-between items-center">
            <Button color="primary" onPress={prevStep}>
              Prev
            </Button>
            <Button color="secondary" type="submit">
              Next
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SupervisorInfoForm;
