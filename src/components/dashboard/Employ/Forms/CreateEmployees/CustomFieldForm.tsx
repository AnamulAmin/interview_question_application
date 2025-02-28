import React, { useState } from "react";
import { Input, Button, Card, Select } from "@nextui-org/react";

const CustomFieldForm: React.FC = ({}) => {
  const [formData, setFormData] = useState({
    customFieldName: "",
    customFieldType: "",
    customValue: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="shadow-lg p-6 bg-white max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Custom Field Form
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {/* Custom Field Name */}
          <Input
            label="Custom Field Name"
            type="text"
            name="customFieldName"
            placeholder="Enter custom field name"
            value={formData.customFieldName}
            onChange={handleInputChange}
            required
            fullWidth
          />

          {/* Custom Field Type */}
          <Select
            label="Custom Field Type"
            name="customFieldType"
            placeholder="Select custom field type"
            value={formData.customFieldType}
            onChange={(e) =>
              handleInputChange({
                ...e,
                target: { ...e.target, name: "customFieldType" },
              })
            }
            fullWidth
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="boolean">Boolean</option>
          </Select>

          {/* Custom Value */}
          <Input
            label="Custom Value"
            type="text"
            name="customValue"
            placeholder="Enter custom value"
            value={formData.customValue}
            onChange={handleInputChange}
            required
            fullWidth
          />
        </div>

        <div className="text-center mt-6 w-full flex justify-between items-center">
          <Button color="primary" onPress={handleSubmit}>
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

export default CustomFieldForm;
