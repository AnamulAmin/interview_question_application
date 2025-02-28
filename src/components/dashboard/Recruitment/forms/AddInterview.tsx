import { useState, FormEvent } from "react";
import { Input, Textarea } from "@nextui-org/input";
import Swal from "sweetalert2";
import {
  Button,
  DatePicker,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import useGetAllFloors from "@/hooks/GetDataHook/useGetAllFloors";
import useGetAllCandidates from "@/hooks/GetDataHook/useGetAllCandidates";
import InputCalendar from "@/shared/InputCalender/InputCalender";
import TimeInput from "@/shared/TimeInput/TimeInput";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

type ErrorType = {
  [key: string]: string | undefined;
};

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function AddInterview({ setIsShowModal, isShowModal }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const floors = useGetAllFloors({});
  const [image, setImage] = useState<any>("");
  const [singleCandidate, setSingleCandidate] = useState<any>({});

  // Form states
  const [formData, setFormData] = useState<any>({
    candidate_name: "",
    jobPosition: "",
    interview_date: "",
    interviewer: "",
    viva_marks: "",
    written_total_marks: "",
    mcq_total_marks: "",
    total_marks: "",
    recommendation: "",
    selection: "",
    details: "",
  });

  const [errors, setErrors] = useState<ErrorType>({});

  console.log(errors, "errors");

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = [
      "candidate_name",
      "jobPosition",
      "interview_date",
      "interviewer",
      "viva_marks",
      "written_total_marks",
      "mcq_total_marks",
      "total_marks",
      "selection",
      "interview_time",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field
          .replace(/_/g, " ")
          .toUpperCase()} is required.`;
      }
    });
    return newErrors;
  };
  const candidates: any = useGetAllCandidates({
    filters: { isSelected: true },
  });

  const handleTotalMarks = (key: string, value: any) => {
    const marks: any = {
      viva_marks: formData.viva_marks,
      written_total_marks: formData?.written_total_marks,
      mcq_total_marks: formData?.mcq_total_marks,
    };

    if (key === "viva_marks") {
      marks.viva_marks = value;
    } else if (key === "written_total_marks") {
      marks.written_total_marks = value;
    } else if (key === "mcq_total_marks") {
      marks.mcq_total_marks = value;
    }

    const vivaMarks = marks.viva_marks || 0;
    const writtenMarks = marks.written_total_marks || 0;
    const mcqMarks = marks.mcq_total_marks || 0;

    console.log(
      vivaMarks,
      writtenMarks,
      mcqMarks,
      key,
      value,
      "vivaMarks, writtenMarks, mcqMarks"
    );
    const totalMarks =
      Number(vivaMarks) + Number(writtenMarks) + Number(mcqMarks);
    return totalMarks;
  };

  const handleInputChange = (key: string, value: any) => {
    if (key === "candidate_name") {
      const singleData = candidates.find((item: any) => item._id === value);
      setSingleCandidate(singleData);
      setFormData((prev: any) => ({
        ...prev,
        jobPosition: singleData.jobPosition,
        interview_date: singleData.interview_date,
        interview_time: singleData.interview_time,
        viva_marks: singleData.viva_marks,
        written_total_marks: singleData.written_total_marks,
        mcq_total_marks: singleData.mcq_total_marks,
        total_marks: singleData.total_marks,
        selection: singleData.selection,
        recommendation: singleData.recommendation,
        details: singleData.details,
        interviewer: singleData.interviewer,
      }));
    }

    if (
      key === "viva_marks" ||
      key === "written_total_marks" ||
      key === "mcq_total_marks"
    ) {
      console.log(handleTotalMarks(key, value), "handleTotalMarks(key, value)");
      setFormData((prev: any) => ({
        ...prev,
        total_marks: handleTotalMarks(key, value),
      }));
    }
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

  const handleSubmit = async () => {
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    formData.is_interviewed = true;

    const receiveData = await window.ipcRenderer.invoke("update-candidate", {
      updateData: JSON.parse(JSON.stringify(formData)),
      _id: singleCandidate._id,
    });

    if (receiveData.success) {
      Swal.fire({
        title: "Success!",
        text: receiveData.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      handleReset();
    } else {
      Swal.fire({
        title: "Error!",
        text: receiveData.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }

    setLoading(false);
  };

  console.log(singleCandidate, "singleCandidate");

  const handleReset = () => {
    setFormData({
      candidate_name: "",
      job_position: "",
      designation: "",
      interview_date: "",
      interviewer: "",
      viva_marks: "",
      written_total_marks: "",
      mcq_total_marks: "",
      total_marks: "",
      recommendation: "",
      selection: "",
      details: "",
      interview_time: "",
    });
    setImage("");
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      placement="top"
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <ModalHeader>Add Interview</ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <h1 className="text-3xl font-semibold mb-6">Interview Form</h1>
            <Form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              {[
                {
                  label: "Candidate Name *",
                  key: "candidate_name",
                  placeholder: "Enter Candidate Name",
                  type: "select",
                  options: candidates,
                },
                {
                  label: "Job Position *",
                  key: "jobPosition",
                  placeholder: "Enter Job Position",
                  type: "text",
                  disabled: true,
                },

                {
                  label: "Interview Date *",
                  key: "interview_date",
                  placeholder: "Select Interview Date",
                  type: "date",
                },
                {
                  label: "Interview Time *",
                  key: "interview_time",
                  placeholder: "Select Interview Time",
                  type: "time",
                },
                {
                  label: "Interviewer *",
                  key: "interviewer",
                  placeholder: "Enter Interviewer Name",
                  type: "text",
                },
                {
                  label: "Viva Marks *",
                  key: "viva_marks",
                  placeholder: "Enter Viva Marks",
                  type: "number",
                },
                {
                  label: "Written Total Marks *",
                  key: "written_total_marks",
                  placeholder: "Enter Written Total Marks",
                  type: "number",
                },
                {
                  label: "MCQ Total Marks *",
                  key: "mcq_total_marks",
                  placeholder: "Enter MCQ Total Marks",
                  type: "number",
                },
                {
                  label: "Total Marks *",
                  key: "total_marks",
                  placeholder: "Enter Total Marks",
                  type: "number",
                },
                {
                  label: "Selection *",
                  key: "selection",
                  placeholder: "Select Status",
                  type: "select",
                  options: ["Selected", "Not Selected", "On Hold"],
                },
                {
                  label: "Recommendation",
                  key: "recommendation",
                  placeholder: "Enter Recommendation",
                  type: "textarea",
                },
                {
                  label: "Details",
                  key: "details",
                  placeholder: "Enter Details",
                  type: "textarea",
                },
              ].map(
                ({
                  label,
                  key,
                  placeholder,
                  type = "text",
                  options = [],
                  disabled = false,
                }: any) => {
                  if (type === "select") {
                    console.log(options, "options");
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-gray-700 font-semibold">
                          {label}
                        </label>
                        <Select
                          value={
                            formData[key as keyof typeof formData] as string
                          }
                          defaultSelectedKeys={[
                            formData[key as keyof typeof formData] as string,
                          ]}
                          onSelectionChange={(e: any) =>
                            handleInputChange(key, e.currentKey)
                          }
                          placeholder={placeholder}
                        >
                          {options.map((option: any) => (
                            <SelectItem key={option?._id || option}>
                              {option.firstName || option}
                            </SelectItem>
                          ))}
                        </Select>
                        {errors[key] && (
                          <p className="text-red-500 text-sm">{errors[key]}</p>
                        )}
                      </div>
                    );
                  } else if (type === "textarea") {
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-gray-700 font-semibold">
                          {label}
                        </label>
                        <Textarea
                          value={
                            formData[key as keyof typeof formData] as string
                          }
                          onChange={(e: any) =>
                            handleInputChange(key, e.target.value)
                          }
                          placeholder={placeholder}
                        />
                        {errors[key] && (
                          <p className="text-red-500 text-sm">{errors[key]}</p>
                        )}
                      </div>
                    );
                  } else if (type === "date") {
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-gray-700 font-semibold">
                          {label}
                        </label>
                        <InputCalendar
                          label={placeholder}
                          name="benefitAccrualDate"
                          value={formData.interview_date}
                          onChange={(e: any) =>
                            handleInputChange(key, e.target.value)
                          }
                          fullWidth
                        />
                        {errors[key] && (
                          <p className="text-red-500 text-sm">{errors[key]}</p>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-gray-700 font-semibold">
                        {label}
                      </label>
                      <Input
                        type={type}
                        value={formData[key as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={placeholder}
                        isDisabled={disabled}
                      />
                      {errors[key] && (
                        <p className="text-red-500 text-sm">{errors[key]}</p>
                      )}
                    </div>
                  );
                }
              )}
            </Form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleSubmit} isLoading={loading} color="success">
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button onPress={handleReset} variant="light">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
