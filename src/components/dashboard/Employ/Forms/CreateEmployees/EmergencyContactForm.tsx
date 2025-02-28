import React, { useEffect, useState } from "react";
import { Input, Button, Card, Form } from "@nextui-org/react";

const EmergencyContactForm: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  isEdit,
  setIsEdit,
  singleEmployee,
  parentFormData,
}: any) => {
  const [formData, setFormData] = useState({
    emergencyContact: "", // Placeholder example
    emergencyHomePhone: "", // Placeholder example
    emergencyWorkPhone: "", // Placeholder example
    emergencyContactRelation: "",
    alterEmergencyContact: "",
    altEmergencyHomePhone: "",
    altEmergencyWorkPhone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState<any>(null);
  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields: any = [
      "emergencyContact",
      "emergencyHomePhone",
      "emergencyWorkPhone",
    ];
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
      emergencyContact: parentFormData?.emergencyContact || "",
      emergencyHomePhone: parentFormData?.emergencyHomePhone || "",
      emergencyWorkPhone: parentFormData?.emergencyWorkPhone || "",
      emergencyContactRelation: parentFormData?.emergencyContactRelation || "",
      alterEmergencyContact: parentFormData?.alterEmergencyContact || "",
      altEmergencyHomePhone: parentFormData?.altEmergencyHomePhone || "",
      altEmergencyWorkPhone: parentFormData?.altEmergencyWorkPhone || "",
    };
    setFormData(initialData);
  }, [isEdit, parentFormData]);

  console.log(parentFormData, "parentFormData");

  return (
    <div className="p-6 bg-gray-100 w-full">
      <Card className="shadow-lg p-6 bg-white  mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Emergency Contact Form
        </h1>
        <Form
          validationBehavior="native"
          validationErrors={errors}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Emergency Contact */}
          <Input
            label="Emergency Contact *"
            type="text"
            name="emergencyContact"
            placeholder="Enter emergency contact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            required
            fullWidth
          />

          {/* Emergency Home Phone */}
          <Input
            label="Emergency Home Phone *"
            type="tel"
            name="emergencyHomePhone"
            placeholder="Enter emergency home phone"
            value={formData.emergencyHomePhone}
            onChange={handleInputChange}
            required
            fullWidth
          />

          {/* Emergency Work Phone */}
          <Input
            label="Emergency Work Phone *"
            type="tel"
            name="emergencyWorkPhone"
            placeholder="Enter emergency work phone"
            value={formData.emergencyWorkPhone}
            onChange={handleInputChange}
            required
            fullWidth
          />

          {/* Emergency Contact Relation */}
          <Input
            label="Emergency Contact Relation"
            type="text"
            name="emergencyContactRelation"
            placeholder="Enter relation (e.g., Parent, Friend)"
            value={formData.emergencyContactRelation}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Alternate Emergency Contact */}
          <Input
            label="Alternate Emergency Contact"
            type="text"
            name="alterEmergencyContact"
            placeholder="Enter alternate contact name"
            value={formData.alterEmergencyContact}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Alternate Emergency Home Phone */}
          <Input
            label="Alt Emergency Home Phone"
            type="tel"
            name="altEmergencyHomePhone"
            placeholder="Enter alternate home phone"
            value={formData.altEmergencyHomePhone}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Alternate Emergency Work Phone */}
          <Input
            label="Alt Emergency Work Phone"
            type="tel"
            name="altEmergencyWorkPhone"
            placeholder="Enter alternate work phone"
            value={formData.altEmergencyWorkPhone}
            onChange={handleInputChange}
            fullWidth
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

export default EmergencyContactForm;
