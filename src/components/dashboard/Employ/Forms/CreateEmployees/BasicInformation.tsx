import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Button,
  Card,
  SelectItem,
  Form,
} from "@nextui-org/react";

const BasicInformation: any = ({
  nextStep,
  prevStep,
  setParentFormData,
  isEdit,
  setIsEdit,
  parentFormData,
  singleEmployee,
}: any) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    zip_code: "",
    user_login_email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>(null);
  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["first_name", "email", "phone"];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [key]: undefined,
      }));
    }
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
      first_name: parentFormData?.first_name || "",
      last_name: parentFormData?.last_name || "",
      email: parentFormData?.email || "",
      phone: parentFormData?.phone || "",
      country: parentFormData?.country || "",
      state: parentFormData?.state || "",
      city: parentFormData?.city || "",
      zip_code: parentFormData?.zip_code || "",
      user_login_email: parentFormData?.user_login_email || "",
      password: parentFormData?.password || "",
    };
    setFormData(initialData);
  }, [isEdit, parentFormData]);

  console.log(parentFormData, "formData personal");

  return (
    <div className="p-6 w-full">
      <Card className="shadow-lg p-6 bg-white mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          User Details Form
        </h1>

        <Form
          validationBehavior="native"
          validationErrors={errors}
          onSubmit={handleSubmit}
          className="grid gap-4"
        >
          {/* Personal Information */}
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <Input
            label="First Name*"
            placeholder="Enter your first name"
            fullWidth
            required
            type={"text"}
            value={formData["first_name" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("first_name", e.target.value)}
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            fullWidth
            type={"text"}
            value={formData["last_name" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("last_name", e.target.value)}
          />
          <Input
            label="Email Address*"
            placeholder="Enter your email address"
            type="email"
            fullWidth
            required
            value={formData["email" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <Input
            label="Phone*"
            placeholder="Enter your phone number"
            type="number"
            fullWidth
            required
            value={formData["phone" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />

          {/* Location Information */}
          <h2 className="text-xl font-semibold mb-2">Location Information</h2>
          <Input
            label="Country"
            placeholder="Select your country"
            value={formData["country" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("country", e.target.value)}
          />
          <Input
            label="State"
            placeholder="Select your state"
            fullWidth
            value={formData["state" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("state", e.target.value)}
          />

          <Input label="City" placeholder="Enter your city" fullWidth />
          <Input
            label="Zip Code"
            placeholder="Enter your zip code"
            type="text"
            fullWidth
            value={formData["city" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("city", e.target.value)}
          />

          {/* Login Information */}
          <h2 className="text-xl font-semibold mb-2">Login Information</h2>
          <Input
            label="User Login Email"
            placeholder="Enter login email"
            type="email"
            fullWidth
            value={formData["login_email" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("login_email", e.target.value)}
          />
          <Input label="User Name" placeholder="Enter username" fullWidth />
          <Input
            label="Password"
            placeholder="Enter password"
            type="password"
            fullWidth
            value={formData["password" as keyof typeof formData]} // leave boolean as it is
            onChange={(e) => handleInputChange("password", e.target.value)}
          />

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

export default BasicInformation;
