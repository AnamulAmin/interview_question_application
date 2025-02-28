import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Card,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";

const EducationalInfo: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  parentFormData,
  isEdit,
  setIsEdit,
  singleEmployee,
}: any) => {
  const [fields, setFields] = useState<any>([
    { obtainedDegree: "", university: "", c_g_p_a: "", comments: "" },
  ]);

  // Handler to add a new field
  const handleAddField = () => {
    setFields([
      ...fields,
      { obtainedDegree: "", university: "", c_g_p_a: "", comments: "" },
    ]);
  };

  // Handler to remove a field
  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_: any, i: any) => i !== index));
  };

  // Handler to update a field
  const handleFieldChange = (index: number, key: any, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };
  const handleSubmit = () => {
    setParentFormData((prev: any) => ({ ...prev, educational_info: fields }));
    nextStep();
  };

  useEffect(() => {
    if (isEdit) {
      setFields((prev: any) =>
        singleEmployee.educational_info
          ? [...singleEmployee.educational_info]
          : prev
      );
    } else {
      setFields((prev: any) =>
        parentFormData.educational_info
          ? [...parentFormData.educational_info]
          : prev
      );
    }
  }, [isEdit, singleEmployee]);

  console.log(fields, "fields educational info");

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
                label={`Obtained Degree (${index + 1})`}
                placeholder="Enter Obtained Degree "
                value={field.obtainedDegree}
                onChange={(e) =>
                  handleFieldChange(index, "obtainedDegree", e.target.value)
                }
                required
              />
              <Input
                label={`University ${index + 1}`}
                placeholder="Select University"
                value={field.university}
                onChange={(e) =>
                  handleFieldChange(index, "university", e.target.value)
                }
                required
              />

              <Input
                label={`CGPA (${index + 1})`}
                placeholder="Enter CGPA "
                value={field.c_g_p_a}
                onChange={(e) =>
                  handleFieldChange(index, "c_g_p_a", e.target.value)
                }
                required
              />
              <Textarea
                label={`Comments ${index + 1}`}
                placeholder="Enter Comments "
                value={field.comments}
                onChange={(e) =>
                  handleFieldChange(index, "comments", e.target.value)
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
              Next
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EducationalInfo;
