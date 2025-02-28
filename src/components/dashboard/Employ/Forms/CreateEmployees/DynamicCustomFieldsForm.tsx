import React, { useEffect, useState } from "react";
import { Input, Button, Card, Select, SelectItem } from "@nextui-org/react";
import Swal from "sweetalert2";

const DynamicCustomFieldsForm: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  parentFormData,
  isEdit,
  setIsEdit,
  singleEmployee,
  setCurrentStep,
}: any) => {
  const [fields, setFields] = useState<any>([
    { name: "", type: "", value: "" },
  ]);

  // Handler to add a new field
  const handleAddField = () => {
    setFields([...fields, { name: "", type: "", value: "" }]);
  };

  // Handler to remove a field
  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_: any, i: any) => i !== index));
  };

  // Handler to update a field
  const handleFieldChange = (
    index: number,
    key: "name" | "type" | "value",
    value: string
  ) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleSubmit = async () => {
    const fieldData = fields.map((field: any) => ({
      [field.name]: field["value"],
    }));

    const customFields = Object.assign({}, ...fieldData);
    console.log(fieldData, "fieldData", customFields);
    const newFormData = {
      ...parentFormData,
      ...customFields,
      fields,
    };

    console.log(newFormData, "newFormData", isEdit);
    if (isEdit) {
      const receiveData = await window.ipcRenderer.invoke("update-employee", {
        updateData: JSON.parse(JSON.stringify(newFormData)),
        _id: singleEmployee._id,
      });
      if (receiveData.success) {
        Swal.fire({
          title: "Success!",
          text: receiveData.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
        setParentFormData({});
        setIsEdit(false);
        setCurrentStep(1);
      } else {
        Swal.fire({
          title: "Error!",
          text: receiveData.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }

      console.log(singleEmployee, "singleEmployee edit");
    } else {
      const receiveData = await window.ipcRenderer.invoke("create-employee", {
        data: JSON.parse(JSON.stringify(newFormData)),
      });

      if (receiveData.success) {
        Swal.fire({
          title: "Success!",
          text: receiveData.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
        setParentFormData({});
        setIsEdit(false);
        setCurrentStep(1);
      } else {
        Swal.fire({
          title: "Error!",
          text: receiveData.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }

      console.log(singleEmployee, "create");
    }
  };

  useEffect(() => {
    if (isEdit) {
      setFields((prev: any) =>
        singleEmployee.fields ? [...prev, singleEmployee.fields] : prev
      );
    }
  }, [isEdit, singleEmployee]);

  return (
    <div className="p-6 w-full">
      <Card className="shadow-lg p-6 bg-white mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add Custom Fields
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {fields.map((field: any, index: any) => (
            <div key={index} className="grid grid-cols-2 gap-2 border-b pb-4">
              <Input
                label={`Custom Field Name ${index + 1}`}
                placeholder="Enter custom field name"
                value={field.name}
                onChange={(e) =>
                  handleFieldChange(index, "name", e.target.value)
                }
                required
              />
              <Select
                label={`Custom Field Type ${index + 1}`}
                placeholder="Select field type"
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value)
                }
                required
              >
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
              </Select>
              <Input
                label={`Custom Value ${index + 1}`}
                placeholder="Enter custom value"
                value={field.value}
                onChange={(e) =>
                  handleFieldChange(index, "value", e.target.value)
                }
                required
              />

              {index != fields.length - 1 ? (
                <Button
                  color="danger"
                  size="sm"
                  onPress={() => handleRemoveField(index)}
                  className="mt-2"
                >
                  Remove Field
                </Button>
              ) : (
                <Button
                  color="secondary"
                  size="sm"
                  onPress={handleAddField}
                  className="mt-2"
                >
                  Add Field
                </Button>
              )}
            </div>
          ))}
          <div className="text-center mt-6 w-full flex justify-between items-center">
            <Button color="primary" onPress={prevStep}>
              Prev
            </Button>
            <Button color="success" onPress={handleSubmit}>
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DynamicCustomFieldsForm;
