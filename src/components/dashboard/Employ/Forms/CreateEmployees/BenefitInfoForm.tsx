import React, { useEffect, useState } from "react";
import {
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  SelectItem,
} from "@nextui-org/react";
import InputCalendar from "@/shared/InputCalender/InputCalender";

interface BenefitInfoFormProps {}

const BenefitInfoForm: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  isEdit,
  setIsEdit,
  singleEmployee,
  parentFormData,
}: any) => {
  const [formData, setFormData] = useState({
    benefitClassCode: "",
    benefitDescription: "",
    benefitAccrualDate: null,
    benefitStatus: "",
  });

  const [errors, setErrors] = useState<any>(null);
  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields: any = [];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
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
    setParentFormData((prev: any) => ({ ...prev, ...formData }));
    nextStep();
  };
  const handleDateChange = (date: string) => {
    setFormData({ ...formData, benefitAccrualDate: date });
  };

  useEffect(() => {
    const initialData = {
      benefitClassCode: parentFormData.benefitClassCode || "",
      benefitDescription: parentFormData.benefitDescription || "",
      benefitAccrualDate: parentFormData.benefitAccrualDate || null,
      benefitStatus: parentFormData.benefitStatus || "",
    };
    setFormData(initialData);
  }, [isEdit, parentFormData]);

  console.log(parentFormData, "parentFormData");

  return (
    <div className="p-6 overflow-auto w-full">
      <Card className="shadow-lg p-6 bg-white overflow-visible">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Benefit Information Form
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {/* Benefit Accrual Date */}
          <InputCalendar
            label="Benefit Accrual Date "
            name="benefitAccrualDate"
            placeholder="Select Benefit Accrual Date"
            value={formData.benefitAccrualDate}
            onChange={handleDateChange}
            fullWidth
          />
          {/* Benefit Class Code */}
          <Input
            label="Benefit Class Code "
            name="benefitClassCode"
            placeholder="Enter Benefit Class Code"
            value={formData.benefitClassCode}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Benefit Description */}
          <Input
            label="Benefit Description "
            name="benefitDescription"
            placeholder="Enter Benefit Description"
            value={formData.benefitDescription}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Benefit Status */}
          <Select
            label="Benefit Status "
            name="benefitStatus"
            placeholder={
              formData.benefitStatus
                ? formData.benefitStatus
                : "Select Benefit Status"
            }
            value={formData.benefitStatus}
            onChange={(e: any) =>
              setFormData({ ...formData, benefitStatus: e.target.value })
            }
            fullWidth
          >
            <SelectItem key={0} value="">
              {" "}
              Select Benefit Status
            </SelectItem>
            <SelectItem key={"active"} value="active">
              Active
            </SelectItem>
            <SelectItem key={"inactive"} value="inactive">
              Inactive
            </SelectItem>
          </Select>
        </div>

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

export default BenefitInfoForm;
