import React, { useEffect, useState } from "react";
import { Input, Button, Card, Form } from "@nextui-org/react";

const ContactInfoForm: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  isEdit,
  setIsEdit,
  singleEmployee,
  parentFormData,
}: any) => {
  const [formData, setFormData] = useState({
    homeEmail: "",
    businessEmail: "",
    homePhone: "",
    businessPhone: "",
    cellPhone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState<any>(null);
  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields: any = ["homePhone", "cellPhone"];
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

  useEffect(() => {
    const initialData = {
      homeEmail: parentFormData?.homeEmail || "",
      businessEmail: parentFormData?.businessEmail || "",
      homePhone: parentFormData?.homePhone || "",
      businessPhone: parentFormData?.businessPhone || "",
      cellPhone: parentFormData?.cellPhone || "",
    };
    setFormData(initialData);
  }, [isEdit, parentFormData]);

  console.log(parentFormData, "parentFormData");

  return (
    <div className="p-6 bg-gray-100 w-full">
      <Card className="shadow-lg p-6 bg-white  mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Contact Information Form
        </h1>
        <Form
          validationBehavior="native"
          validationErrors={errors}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
        >
          {/* Home Email */}
          <Input
            label="Home Email"
            type="email"
            name="homeEmail"
            placeholder="Enter Home Email"
            value={formData.homeEmail}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Business Email */}
          <Input
            label="Business Email"
            type="email"
            name="businessEmail"
            placeholder="Enter Business Email"
            value={formData.businessEmail}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Home Phone */}
          <Input
            label="Home Phone *"
            type="tel"
            name="homePhone"
            placeholder="Enter Home Phone"
            value={formData.homePhone}
            onChange={handleInputChange}
            fullWidth
            required
          />

          {/* Business Phone */}
          <Input
            label="Business Phone"
            type="tel"
            name="businessPhone"
            placeholder="Enter Business Phone"
            value={formData.businessPhone}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Cell Phone */}
          <Input
            label="Cell Phone *"
            type="tel"
            name="cellPhone"
            placeholder="Enter Cell Phone"
            value={formData.cellPhone}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Form>

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

export default ContactInfoForm;
