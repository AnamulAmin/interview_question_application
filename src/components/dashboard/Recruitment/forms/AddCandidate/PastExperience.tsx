import { useEffect, useState } from "react";
import { Input, Button, Card, Select, SelectItem } from "@nextui-org/react";
import Swal from "sweetalert2";

const PastExperience: any = ({
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
    {
      companyName: "",
      workingPeriod: "",
      duties: "",
      supervisor: "",
    },
  ]);

  // Handler to add a new field
  const handleAddField = () => {
    setFields([
      ...fields,
      {
        companyName: "",
        workingPeriod: "",
        duties: "",
        supervisor: "",
      },
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

  const handleSubmit = async () => {
    const newFormData = {
      ...parentFormData,
      past_experience: fields,
    };

    console.log(newFormData, "new'FormData");
    setParentFormData(newFormData);
    if (isEdit) {
      const receiveData = await window.ipcRenderer.invoke("update-candidate", {
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
        setFields([]);
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
      const receiveData = await window.ipcRenderer.invoke("create-candidate", {
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
        setFields([]);
        setCurrentStep(1);
      } else {
        Swal.fire({
          title: "Error!",
          text: receiveData.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
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

  const handlePrev = () => {
    const newFormData = {
      ...parentFormData,
      past_experience: fields,
    };

    setParentFormData(newFormData);
    prevStep();
  };

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
                label={`Company Name ${index + 1}`}
                placeholder="Enter Company Name"
                value={field.companyName}
                onChange={(e) =>
                  handleFieldChange(index, "companyName", e.target.value)
                }
                required
              />

              <Input
                label={`Working Period ${index + 1}`}
                placeholder="Enter Working Period "
                value={field.workingPeriod}
                onChange={(e) =>
                  handleFieldChange(index, "workingPeriod", e.target.value)
                }
                required
              />
              <Input
                label={`Duties ${index + 1}`}
                placeholder="Enter Duties "
                value={field.duties}
                onChange={(e) =>
                  handleFieldChange(index, "duties", e.target.value)
                }
                required
              />
              <Input
                label={`Supervisor ${index + 1}`}
                placeholder="Enter Supervisor "
                value={field.supervisor}
                onChange={(e) =>
                  handleFieldChange(index, "supervisor", e.target.value)
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
            <Button color="primary" onPress={handlePrev}>
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

export default PastExperience;
