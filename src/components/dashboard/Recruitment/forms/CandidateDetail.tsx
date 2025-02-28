import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@nextui-org/react";

interface ShowMenuDetailProps {
  data: any;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const CandidateDetail: React.FC<ShowMenuDetailProps> = ({
  data,
  isOpen,
  onOpenChange,
}) => {
  const [arrayData, setArrayData] = useState<any>([]);
  const [educationalInfoArray, setEducationalInfoArray] = useState([]);
  const [pastExperienceArray, setPastExperienceArray] = useState([]);

  useEffect(() => {
    if (!data) return;

    const excludedKeys = [
      "picture",
      "_id",
      "createdAt",
      "updatedAt",
      "_rev",
      "educational_info",
      "past_experience",
      "__v",
    ];

    const formateKeys = (key: string) => {
      switch (key) {
        case "firstName":
          return "First Name";
        case "lastName":
          return "Last Name";
        case "altPhone":
          return "Alternative Phone";
        case "ssn":
          return "SSN";
        case "presentAddress":
          return "Present Address";
        case "permanentAddress":
          return "Permanent Address";
        case "district_name":
          return "District Name";
        case "zone_name":
          return "Zone Name";
        case "zip_Code":
          return "Post Code";
        case "admission_date":
          return "Admission Date";
        case "candidateId":
          return "Candidate ID";
        case "companyName":
          return "Company Name";
        case "obtainedDegree":
          return "Obtained Degree";
        case "c_g_p_a":
          return "CGPA";
        case "workingPeriod":
          return "Working Period";
        case "total_marks":
          return "Total Marks";
        case "viva_marks":
          return "Viva Marks";
        case "written_total_marks":
          return "Written Total Marks";
        case "mcq_total_marks":
          return "MCQ Total Marks";
        case "interviewDate":
          return "Interview Date";
        case "interview_time":
          return "Interview Time";
        case "interview_status":
        default:
          return key;
      }
    };

    const newArrayData = Object.entries(data)
      .filter(([key]) => !excludedKeys.includes(key)) // Remove unwanted keys
      .map(([key, value]) => ({ name: formateKeys(key), value }));

    const newEducationalArrayData: any =
      data?.educational_info?.length > 0
        ? data?.educational_info.map((item: any) =>
            Object.entries(item).map(([key, value]) => ({
              name: formateKeys(key),
              value,
            }))
          )
        : [];

    const newPastExperienceArrayData: any =
      data?.past_experience?.length > 0
        ? data?.past_experience.map((item: any) =>
            Object.entries(item).map(([key, value]) => ({
              name: formateKeys(key),
              value,
            }))
          )
        : [];

    setEducationalInfoArray(newEducationalArrayData || []);
    setPastExperienceArray(newPastExperienceArrayData || []);

    setArrayData(newArrayData);
  }, [data, isOpen]);

  console.log(educationalInfoArray, "educationalInfoArray");

  return (
    <div>
      <Modal
        isOpen={isOpen}
        placement={"top"}
        onOpenChange={onOpenChange}
        motionProps={{
          initial: { y: "-100%" }, // Drawer initially slides down from the top
          animate: { y: 0 }, // Slides into position
          exit: { y: "100%" }, // Slides back up when closed
          transition: { duration: 0.3, ease: "easeInOut" }, // Smooth animation
        }}
      >
        <ModalContent className="min-w-[80vw]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Candidate Detail
              </ModalHeader>
              <ModalBody>
                <div className="w-full p-6 pt-0 flex justify-center items-center border border-gray-300 rounded-lg">
                  <Image
                    src={data?.picture || "/no-image.png"}
                    alt="image"
                    height={200}
                    isZoomed
                    className="object-contain w-full mx-auto block"
                  />
                </div>
                <Listbox aria-label="Actions">
                  {arrayData.map((item: any) => (
                    <ListboxItem key={item.name} className="mb-0">
                      <div className="flex justify-between gap-1 bg-gray-100 p-2 rounded-lg capitalize">
                        <b className="text-nowrap">{item.name} :</b>{" "}
                        <span>
                          {Array.isArray(item.value)
                            ? item.value.join(", ")
                            : item.value.toString()}
                        </span>
                      </div>
                    </ListboxItem>
                  ))}
                </Listbox>

                <h2 className="text-3xl font-bold mt-4 border-b text-green-500 border-green-500">
                  Educational Info
                </h2>

                {educationalInfoArray?.map((item: any, index: number) => (
                  <div
                    className="grid grid-cols-2 mt-4 gap-3 w-full"
                    key={index}
                  >
                    {item.map((item2, index) => (
                      <div
                        className="border bg-green-100 hover:bg-green-200 p-2 rounded-lg"
                        key={index}
                      >
                        <div className="flex justify-between gap-1  p-2 rounded-lg capitalize">
                          <b className="text-nowrap">{item2?.name}</b>
                          <span>{item2?.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <h2 className="text-3xl font-bold mt-4 border-b text-blue-500 border-blue-500">
                  Past Experience
                </h2>

                {pastExperienceArray?.map((item: any, index: number) => (
                  <div
                    className="grid grid-cols-2 mt-4 gap-3 w-full"
                    key={index}
                  >
                    {item.map((item2: any, index: any) => (
                      <div
                        className="border bg-blue-100 hover:bg-blue-200 p-2 rounded-lg"
                        key={index}
                      >
                        <div className="flex justify-between gap-1 p-2 rounded-lg capitalize">
                          <b className="text-nowrap">{item2?.name}</b>
                          <span>{item2?.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CandidateDetail;

// 01716673491 nojrul bignai
