import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Button,
  Card,
  Form,
  DatePicker,
  SelectItem,
} from "@nextui-org/react";
import InputCalendar from "@/shared/InputCalender/InputCalender";
import UploadImageInput from "@/shared/UploadImageInput";

const BiographicalInfoForm: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  isEdit,
  setIsEdit,
  singleEmployee,
  parentFormData,
}: any) => {
  const [formData, setFormData] = useState({
    dateOfBirth: null,
    gender: "",
    maritalStatus: "",
    ethnicGroup: "",
    eeoClass: "",
    ssn: "",
    workInState: "",
    liveInState: "",
    citizenship: "",
    photograph: "",
  });
  const [image, setImage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value, "formData");
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, photograph: e.target.files[0] });
    }
  };

  const [errors, setErrors] = useState<any>(null);
  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields: any = ["dateOfBirth", "gender", "maritalStatus"];
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
    formData.photograph = image;
    setParentFormData((prev: any) => ({ ...prev, ...formData }));
    nextStep();
  };
  const handleDateChange = (date: string) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  useEffect(() => {
    const initialData = {
      dateOfBirth: parentFormData.dateOfBirth || null,
      gender: parentFormData.gender || "",
      maritalStatus: parentFormData.maritalStatus || "",
      ethnicGroup: parentFormData.ethnicGroup || "",
      eeoClass: parentFormData.eeoClass || "",
      ssn: parentFormData.ssn || "",
      workInState: parentFormData.workInState || "",
      liveInState: parentFormData.liveInState || "",
      citizenship: parentFormData.citizenship || "",
      photograph: parentFormData.photograph || "",
    };
    setFormData(initialData);
    setImage(parentFormData.photograph || "");
  }, [isEdit, parentFormData]);

  console.log(parentFormData, "parentFormData");

  return (
    <div className="p-6 bg-gray-100 w-full">
      <Card className="shadow-lg p-6 bg-white  mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Biographical Information Form
        </h1>
        <Form
          validationBehavior="native"
          validationErrors={errors}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
        >
          <InputCalendar
            label="Date of Birth *"
            name="dateOfBirth"
            placeholder="Select Benefit Accrual Date"
            value={formData?.dateOfBirth}
            onChange={handleDateChange}
            fullWidth
          />

          {/* Gender */}
          <Select
            label="Gender *"
            name="gender"
            placeholder={formData.gender ? formData.gender : "Select Gender"}
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            fullWidth
          >
            <SelectItem key={"male"} value="male">
              Male
            </SelectItem>
            <SelectItem key={"female"} value="female">
              Female
            </SelectItem>
            <SelectItem key={"other"} value="other">
              Other
            </SelectItem>
          </Select>

          {/* Marital Status */}
          <Select
            label="Marital Status *"
            name="maritalStatus"
            placeholder={
              formData.maritalStatus
                ? formData.maritalStatus
                : "Select Marital Status "
            }
            value={formData.maritalStatus}
            onChange={(e) =>
              setFormData({ ...formData, maritalStatus: e.target.value })
            }
            fullWidth
          >
            <SelectItem key={"single"} value="single">
              Single
            </SelectItem>
            <SelectItem key={"married"} value="married">
              Married
            </SelectItem>
            <SelectItem key={"divorced"} value="divorced">
              Divorced
            </SelectItem>
            <SelectItem key={"widowed"} value="widowed">
              Widowed
            </SelectItem>
          </Select>

          {/* Ethnic Group */}
          <Input
            label="Ethnic Group"
            name="ethnicGroup"
            placeholder="Enter Ethnic Group"
            value={formData.ethnicGroup}
            onChange={handleInputChange}
            fullWidth
          />

          {/* EEO Class */}
          <Input
            label="EEO Class"
            name="eeoClass"
            placeholder="Enter EEO Class"
            value={formData.eeoClass}
            onChange={handleInputChange}
            fullWidth
          />

          {/* SSN */}
          <Input
            label="SSN"
            name="ssn"
            placeholder="Enter SSN"
            value={formData.ssn}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Work in State */}
          <Select
            label="Work in State"
            name="workInState"
            placeholder={
              formData.workInState
                ? formData.workInState
                : "Select Work in State"
            }
            value={formData.workInState}
            onChange={(e: any) =>
              setFormData({ ...formData, workInState: e.target.value })
            }
            fullWidth
          >
            <SelectItem key={0} value="">
              {" "}
              Select Work in State
            </SelectItem>
            <SelectItem key={"yes"} value="yes">
              Yes
            </SelectItem>
            <SelectItem key={"no"} value="no">
              No
            </SelectItem>
          </Select>

          {/* Live in State */}
          <Select
            label="Live in State"
            name="liveInState"
            placeholder={
              formData.liveInState
                ? formData.liveInState
                : "Select Live in State"
            }
            value={formData.liveInState}
            onChange={(e: any) =>
              setFormData({ ...formData, liveInState: e.target.value })
            }
            fullWidth
          >
            <SelectItem key={0} value="">
              {" "}
              Select Live in State
            </SelectItem>
            <SelectItem key={"yes"} value="yes">
              Yes
            </SelectItem>
            <SelectItem key={"no"} value="no">
              No
            </SelectItem>
          </Select>

          {/* Citizenship */}
          <Input
            label="Citizenship"
            name="citizenship"
            placeholder="Enter Citizenship"
            value={formData.citizenship}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Photograph */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Upload Image
            </label>
            <UploadImageInput imageString={image} setImageString={setImage} />
          </div>
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

export default BiographicalInfoForm;
