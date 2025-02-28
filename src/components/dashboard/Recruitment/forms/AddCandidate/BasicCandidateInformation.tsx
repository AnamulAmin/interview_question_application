import districts from "@/assets/data/districts";
import zones from "@/assets/data/zones";
import UploadImageInput from "@/shared/UploadImageInput";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  form,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Validation patterns
const BD_PHONE_REGEX = /^(?:\+88)?01[3-9]\d{8}$/;
const BD_NID_REGEX = /^\d{10}$|^\d{13}$/;
const BD_POSTAL_CODE_REGEX = /^\d{4}$/;

interface BasicCandidateInformationProps {
  nextStep: () => void;
  prevStep?: () => void;
  setParentFormData: React.Dispatch<React.SetStateAction<any>>;
  parentFormData: any;
  isEdit?: boolean;
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  singleEmployee?: any;
}

export default function BasicCandidateInformation({
  nextStep,
  prevStep,
  setParentFormData,
  parentFormData,
  isEdit,
  setIsEdit,
  singleEmployee,
}: BasicCandidateInformationProps) {
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedZones, setSelectedZones] = useState<any>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<any>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: parentFormData,
  });

  const onSubmit = (data: any) => {
    console.log(data, "submitData");
    setParentFormData((prev: any) => ({ ...prev, ...data }));
    nextStep();
  };

  useEffect(() => {
    if (selectedCity) {
      const filteredZones = zones.filter(
        (zone: any) => zone?.city_id == selectedCity
      );
      const cityName = districts.find(
        (district: any) =>
          district.city_id == selectedCity ||
          district.city_id == parentFormData?.district
      )?.city_name;
      setValue("district_name", cityName);
      setSelectedZones(filteredZones);
    }

    if (selectedZoneId) {
      const filteredZone: any = zones.find(
        (zone: any) => zone.zone_id === selectedZoneId
      );
      setValue("zone_name", filteredZone?.zone_name);
    }
  }, [selectedCity, selectedZoneId, setValue]);

  useEffect(() => {
    if (isEdit) {
      reset(singleEmployee);
    } else {
      reset(parentFormData);
    }
  }, [parentFormData, reset, singleEmployee]);

  console.log(
    parentFormData,
    "formData",
    selectedZoneId,
    "selectedZoneId",
    selectedCity
  );

  return (
    <Card className="w-full mx-auto p-6">
      <CardHeader className="flex justify-center">
        <h1 className="text-2xl font-bold">Candidate Information</h1>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <Input
              {...register("firstName", {
                required: "First Name is required",
              })}
              label="First Name"
              variant="bordered"
              isRequired
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName?.message}
            />

            {/* Last Name */}
            <Input
              {...register("lastName")}
              label="Last Name"
              variant="bordered"
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName?.message}
            />

            {/* Email */}
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              label="Email"
              variant="bordered"
              type="email"
              isRequired
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />

            {/* Phone */}
            <Input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: BD_PHONE_REGEX,
                  message:
                    "Invalid Bangladeshi phone number (e.g. 01712345678 or +8801712345678)",
                },
              })}
              label="Phone Number"
              variant="bordered"
              placeholder="01712345678"
              isRequired
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
            />

            {/* Alternative Phone */}
            <Input
              {...register("altPhone", {
                pattern: {
                  value: BD_PHONE_REGEX,
                  message: "Invalid Bangladeshi phone number",
                },
              })}
              label="Alternative Phone"
              variant="bordered"
              placeholder="01812345678"
              isInvalid={!!errors.altPhone}
              errorMessage={errors.altPhone?.message}
            />

            {/* National ID (SSN) */}
            <Input
              {...register("ssn", {
                pattern: {
                  value: BD_NID_REGEX,
                  message: "Invalid NID (10 or 13 digits)",
                },
              })}
              label="National ID (NID)"
              variant="bordered"
              placeholder="Enter 10 or 13 digit NID"
              isInvalid={!!errors.ssn}
              errorMessage={errors.ssn?.message}
            />

            {/* Present Address */}
            <Textarea
              {...register("presentAddress", {
                required: "Present Address is required",
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters",
                },
              })}
              label="Present Address"
              variant="bordered"
              isRequired
              isInvalid={!!errors.presentAddress}
              errorMessage={errors.presentAddress?.message}
            />

            {/* Permanent Address */}
            <Textarea
              {...register("permanentAddress", {
                required: "Permanent Address is required",
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters",
                },
              })}
              label="Permanent Address"
              variant="bordered"
              isRequired
              isInvalid={!!errors.permanentAddress}
              errorMessage={errors.permanentAddress?.message}
            />

            {/* District Selection */}
            <Select
              {...register("district", {
                required: "District is required",
                onChange: (e) => setSelectedCity(e.target.value),
              })}
              label="Select District"
              variant="bordered"
              isRequired
              isInvalid={!!errors.district}
              errorMessage={errors.district?.message}
            >
              {districts.map((district) => (
                <SelectItem key={district.city_id} value={district?.city_id}>
                  {district.city_name}
                </SelectItem>
              ))}
            </Select>

            {/* Zone Selection */}
            <Select
              {...register("zone", {
                required: "Zone is required",
                onChange: (e) => {
                  setSelectedZoneId(e.target.value);
                  setValue("zone", e.target.value);
                },
              })}
              label="Select Zone"
              variant="bordered"
              isRequired
              isInvalid={!!errors.zone}
              errorMessage={errors.zone?.message}
              defaultSelectedKeys={
                isEdit ? [singleEmployee?.zone] : [parentFormData?.zone]
              }
            >
              {selectedZones.map((zone: any) => (
                <SelectItem key={zone.zone_id} value={zone.zone_id}>
                  {zone.zone_name}
                </SelectItem>
              ))}
            </Select>

            {/* Zip Code */}
            <Input
              {...register("zipCode", {
                pattern: {
                  value: BD_POSTAL_CODE_REGEX,
                  message: "Invalid Bangladeshi postal code (4 digits)",
                },
              })}
              label="Postal Code"
              variant="bordered"
              placeholder="e.g., 1212"
              isInvalid={!!errors.zipCode}
              errorMessage={errors.zipCode?.message}
            />

            {/* Picture Upload */}
            <div className="col-span-full">
              <UploadImageInput
                imageString={watch("picture")}
                setImageString={(imageString: any) =>
                  setValue("picture", imageString)
                }
                validation={{
                  maxSize: 2 * 1024 * 1024, // 2MB
                  allowedFormats: ["image/jpeg", "image/png"],
                }}
              />
            </div>
          </div>

          <div className="flex justify-between">
            {prevStep && (
              <Button color="default" onClick={prevStep} size="lg">
                Previous
              </Button>
            )}
            <Button type="submit" color="primary" size="lg">
              Next
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
