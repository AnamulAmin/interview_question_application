import { useState, FormEvent } from "react";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import useGetAllCandidates from "@/hooks/GetDataHook/useGetAllCandidates";
import useGetAllDesignation from "@/hooks/GetDataHook/useGetAllDesignation";
import InputCalendar from "@/shared/InputCalender/InputCalender";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface FormData {
  candidateName: string;
  jobPosition: string;
  shortlistDate: string;
  interviewDate: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function AddCandidateSelection({
  isShowModal,
  setIsShowModal,
}: any) {
  const [formData, setFormData] = useState<any>({
    candidateName: "",
    jobPosition: "",
    selection_term: "",
    interview_date: "",
    interview_time: "",
  });
  const [candidateId, setCandidateId] = useState<any>("");
  const [errors, setErrors] = useState<any>({});

  const [isLoading, setIsLoading] = useState(false);

  const candidates: any = useGetAllCandidates({
    filters: { isShortlist: true },
  });
  const { designations }: any = useGetAllDesignation({});

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["candidateName", "jobPosition", "selection_term"];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }
    setIsLoading(true);

    formData.isSelected = true;
    console.log(formData, "formData");

    try {
      // Add your form submission logic here
      console.log("Form submitted:", formData);

      const receiveData = await window.ipcRenderer.invoke("update-candidate", {
        updateData: JSON.parse(JSON.stringify(formData)),
        _id: candidateId,
      });
      if (receiveData.success) {
        Swal.fire({
          title: "Success!",
          text: receiveData.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: receiveData.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }

      // Reset form and close modal on success
      handleReset();
      setIsShowModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: any, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      candidateName: "",
      jobPosition: "",
      selection_term: "",
      interview_date: "",
      interview_time: "",
    });
  };

  console.log("candidateId", candidateId);

  const handleCandidateName = (id: any) => {
    const selectedCandidate = candidates.find((item: any) => item._id === id);
    setCandidateId(id);
    setFormData((prev: any) => {
      prev.jobPosition = selectedCandidate.jobPosition;
      return {
        ...prev,
        candidateName: selectedCandidate.firstName,
      };
    });
  };

  console.log("formData", formData);

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      placement="center"
      size="2xl"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Candidate Selection
            </ModalHeader>
            <ModalBody>
              <Form
                id="candidate-form"
                onSubmit={handleSubmit}
                className="space-y-6"
                validationBehavior="native"
                validationErrors={errors}
              >
                <InputCalendar
                  boxClass="w-full"
                  label=" Interview Date"
                  color="default"
                  type="date"
                  isRequired
                  onChange={(date: any) =>
                    handleInputChange("interview_date", date)
                  }
                  value={formData.interview_date}
                  errorMessage={errors.interview_date}
                  // defaultSelectedKeys={[formData.jobPosition]}
                >
                  {designations.map((item: any) => (
                    <SelectItem key={item.name}>{item.name}</SelectItem>
                  ))}
                </InputCalendar>

                <Input
                  className="w-full mb-3"
                  label="Interview Time"
                  color="default"
                  type="time"
                  isRequired
                  onChange={(e) =>
                    handleInputChange("interview_time", e.target.value)
                  }
                  value={formData.interview_time}
                  errorMessage={errors.interview_time}
                  // defaultSelectedKeys={[formData.jobPosition]}
                />
                <Autocomplete
                  className="w-full mb-3"
                  defaultItems={candidates}
                  name="candidateName"
                  label="Select Candidate"
                  color="default"
                  value={formData.candidateName}
                  onSelectionChange={(value) => handleCandidateName(value)}
                  isRequired
                  errorMessage={errors.candidateName}
                >
                  {(item: any) => (
                    <AutocompleteItem key={item._id}>
                      {item.firstName}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Input
                  className="w-full mb-3"
                  label="Select Position"
                  color="default"
                  isRequired
                  onChange={(e) =>
                    handleInputChange("jobPosition", e.target.value)
                  }
                  value={formData.jobPosition}
                  errorMessage={errors.jobPosition}
                  // defaultSelectedKeys={[formData.jobPosition]}
                  isDisabled={true}
                >
                  {designations.map((item: any) => (
                    <SelectItem key={item.name}>{item.name}</SelectItem>
                  ))}
                </Input>

                <Textarea
                  label="Selection Term"
                  color="default"
                  value={formData.selection_term}
                  onChange={(e) =>
                    handleInputChange("selection_term", e.target.value)
                  }
                  isRequired
                  validationState={
                    !formData.selection_term ? "invalid" : "valid"
                  }
                  errorMessage={
                    !formData.selection_term && "Shortlist date is required"
                  }
                  variant="bordered"
                />
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  handleReset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                form="candidate-form"
                isLoading={isLoading}
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
