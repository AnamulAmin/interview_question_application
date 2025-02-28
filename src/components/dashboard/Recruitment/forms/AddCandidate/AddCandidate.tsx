import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";

import { useEffect, useState } from "react";
import { Button, Card } from "@nextui-org/react";
import BasicCandidateInformation from "./BasicCandidateInformation";
import EducationalInfo from "./EducationalInfo";
import PastExperience from "./PastExperience";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const AddCandidate: any = ({
  isShowModal,
  setIsShowModal,
  isEdit,
  setIsEdit,
  singleEmployee,
}: any) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState<any>(false);
  const [formData, setFormData] = useState<any>();

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
    console.log(singleEmployee, "singleData");

    setFormData(singleEmployee);
  }, [singleEmployee]);

  useEffect(() => {
    if (!isEdit || !isShowModal) {
      setFormData({});
      setCurrentStep(1);
    }
  }, [isEdit, isShowModal]);

  return (
    <Modal
      isOpen={isShowModal || isEdit}
      placement="top"
      onOpenChange={() => {
        setIsShowModal(false);
        setIsEdit(false);
      }}
      isDismissable={false}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[90vw]">
        <ModalHeader>Create Candidate </ModalHeader>
        <ModalBody>
          <div className="">
            <Card className=" p-6 bg-white shadow-none  mx-auto">
              <h1 className="text-2xl font-bold mb-4 text-center">
                Add Candidate
              </h1>

              <div className="flex mx-auto w-full max-w-[1200px] gap-4 relative mb-4 pb-3">
                <div className="grid grid-cols-3 absolute left-0 right-0 bottom-0 gap-2 z-10 bg-gray-200 rounded-xl w-full h-2 overflow-hidden">
                  <span
                    className={`col-span-${
                      currentStep == 3 ? "full" : currentStep
                    } bg-green-500 `}
                  ></span>
                </div>
                <Button
                  color={currentStep >= 1 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                >
                  Basic Information
                </Button>
                <Button
                  color={currentStep >= 2 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                >
                  Positional Info
                </Button>
                <Button
                  color={currentStep >= 3 ? `success` : "default"}
                  className="w-full font-bold text-[11px]"
                >
                  Benefits
                </Button>
              </div>

              {/* <div className="mb-6">{renderStepContent(currentStep)}</div> */}
              {currentStep === 1 && (
                <BasicCandidateInformation
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
                <EducationalInfo
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
                <PastExperience
                  nextStep={handleNext}
                  prevStep={handlePrevious}
                  setParentFormData={setFormData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  parentFormData={formData}
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

export default AddCandidate;
