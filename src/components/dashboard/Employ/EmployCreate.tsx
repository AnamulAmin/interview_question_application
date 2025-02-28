import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

import React, { useEffect, useState } from "react";
import { Button, Card } from "@nextui-org/react";
import EmployeeDetailsForm from "./Forms/CreateEmployees/EmployeeDetailsForm";
import BenefitInfoForm from "./Forms/CreateEmployees/BenefitInfoForm";
import SupervisorInfoForm from "./Forms/CreateEmployees/SupervisorInfoForm";
import BiographicalInfoForm from "./Forms/CreateEmployees/BiographicalInfoForm";
import ContactInfoForm from "./Forms/CreateEmployees/ContactInfoForm";
import EmergencyContactForm from "./Forms/CreateEmployees/EmergencyContactForm";
import BasicInformation from "./Forms/CreateEmployees/BasicInformation";
import DynamicCustomFieldsForm from "./Forms/CreateEmployees/DynamicCustomFieldsForm";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const AddEmployeeForm: any = ({
  isShowModal,
  setIsShowModal,
  isEdit,
  setIsEdit,
  singleEmployee,
}: any) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState<any>(false);
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    userEmail: "",
    userName: "",
    password: "",
  });

  const steps = [
    "Basic Information",
    "Positional Info",
    "Benefits",
    "Supervisor",
    "Biographical Info",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    alert("Form submitted!");
  };

  useEffect(() => {
    if (isEdit) {
      setFormData(singleEmployee);
    }
  }, [isEdit, singleEmployee]);

  return (
    <Modal
      isOpen={isShowModal || isEdit}
      placement="top"
      onOpenChange={() => {
        setIsShowModal(false);
        setIsEdit(false);
      }}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[90vw]">
        <ModalHeader>Create Employ </ModalHeader>
        <ModalBody>
          <div className="">
            <Card className=" p-6 bg-white shadow-none  mx-auto">
              <h1 className="text-2xl font-bold mb-4 text-center">
                Add Employee
              </h1>

              <div className="flex mx-auto w-full max-w-[1200px] gap-4 relative mb-4 pb-3">
                <div className="grid grid-cols-8 absolute left-0 right-0 bottom-0 gap-2 z-10 bg-gray-200 rounded-xl w-full h-2 overflow-hidden">
                  <span
                    className={`col-span-${
                      currentStep == 8 ? "full" : currentStep
                    } bg-green-500 `}
                  ></span>
                </div>
                <Button
                  color={currentStep >= 1 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                  onPress={() => {
                    if (isEdit) {
                      setCurrentStep(1);
                    }
                  }}
                >
                  Basic Information
                </Button>
                <Button
                  color={currentStep >= 2 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                  onPress={() => {
                    if (isEdit) {
                      setCurrentStep(2);
                    }
                  }}
                >
                  Positional Info
                </Button>
                <Button
                  color={currentStep >= 3 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                  onPress={() => {
                    if (isEdit) {
                      setCurrentStep(3);
                    }
                  }}
                >
                  Benefits
                </Button>
                <Button
                  color={currentStep >= 4 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                  onPress={() => {
                    if (isEdit) {
                      setCurrentStep(4);
                    }
                  }}
                >
                  Supervisor
                </Button>
                <Button
                  color={currentStep >= 5 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                  onPress={() => {
                    if (isEdit) {
                      setCurrentStep(5);
                    }
                  }}
                >
                  Biographical Info
                </Button>
                <Button
                  color={currentStep >= 6 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                  onPress={() => {
                    if (isEdit) {
                      setCurrentStep(6);
                    }
                  }}
                >
                  Additional Address
                </Button>
                <Button
                  color={currentStep >= 7 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                  onPress={() => {
                    if (isEdit) {
                      setCurrentStep(7);
                    }
                  }}
                >
                  Emergency Contact
                </Button>
                <Button
                  color={currentStep >= 8 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                  onPress={() => {
                    if (isEdit) {
                      setCurrentStep(8);
                    }
                  }}
                >
                  Custom
                </Button>
              </div>

              {/* <div className="mb-6">{renderStepContent(currentStep)}</div> */}
              {currentStep === 1 && (
                <BasicInformation
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  parentFormData={formData}
                  singleEmployee={singleEmployee}
                />
              )}

              {currentStep === 2 && (
                <EmployeeDetailsForm
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  isEdit={isEdit}
                  parentFormData={formData}
                  setIsEdit={setIsEdit}
                  singleEmployee={singleEmployee}
                />
              )}

              {currentStep === 3 && (
                <BenefitInfoForm
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  parentFormData={formData}
                  singleEmployee={singleEmployee}
                />
              )}

              {currentStep === 4 && (
                <SupervisorInfoForm
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  parentFormData={formData}
                  singleEmployee={singleEmployee}
                />
              )}

              {currentStep === 5 && (
                <BiographicalInfoForm
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  parentFormData={formData}
                  singleEmployee={singleEmployee}
                />
              )}

              {currentStep === 6 && (
                <ContactInfoForm
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  parentFormData={formData}
                  singleEmployee={singleEmployee}
                />
              )}

              {currentStep === 7 && (
                <EmergencyContactForm
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  parentFormData={formData}
                  singleEmployee={singleEmployee}
                />
              )}
              {currentStep === 8 && (
                <DynamicCustomFieldsForm
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  parentFormData={formData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  singleEmployee={singleEmployee}
                  setCurrentStep={setCurrentStep}
                />
              )}
            </Card>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddEmployeeForm;
