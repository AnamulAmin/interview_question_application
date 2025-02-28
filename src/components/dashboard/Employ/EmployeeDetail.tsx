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
  Divider,
  Card,
  CardBody,
} from "@nextui-org/react";

interface ShowMenuDetailProps {
  data: any;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const formatFieldName = (name: string) => {
  return name
    .split(/(?=[A-Z])|_/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const EmployDetail: React.FC<ShowMenuDetailProps> = ({
  data,
  isOpen,
  onOpenChange,
}) => {
  const [arrayData, setArrayData] = useState<any>([]);
  const [personalInfo, setPersonalInfo] = useState<any>([]);
  const [contactInfo, setContactInfo] = useState<any>([]);
  const [employmentInfo, setEmploymentInfo] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const excludeFields = [
        "profilePicture",
        "_id",
        "createdAt",
        "updatedAt",
        "_rev",
      ];

      const newArrayData = Object.entries(data)
        .filter(([key]) => !excludeFields.includes(key))
        .map(([key, value]) => ({
          name: key,
          value,
        }));

      // Categorize fields
      const personal = newArrayData.filter(item =>
        ["firstName", "lastName", "dateOfBirth", "gender", "bloodGroup"].includes(
          item.name
        )
      );
      const contact = newArrayData.filter(item =>
        ["email", "phone", "address", "emergencyContact"].includes(item.name)
      );
      const employment = newArrayData.filter(
        item =>
          ![...personal, ...contact].map(i => i.name).includes(item.name)
      );

      setPersonalInfo(personal);
      setContactInfo(contact);
      setEmploymentInfo(employment);
      setArrayData(newArrayData);
    }
  }, [data, isOpen]);

  const renderSection = (title: string, items: any[], bgColor: string = "bg-content1") => (
    <Card className="mb-4">
      <CardBody className={bgColor}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <Divider className="my-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.name} className="flex flex-col">
              <span className="text-sm text-gray-500">{formatFieldName(item.name)}</span>
              <span className="font-medium">
                {Array.isArray(item.value)
                  ? item.value.join(", ")
                  : typeof item.value === "object" && item.value !== null
                  ? JSON.stringify(item.value)
                  : String(item.value || "-")}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div>
      <Modal
        size="3xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">
                  {data.firstName} {data.lastName}
                </h2>
                <p className="text-sm text-gray-500">{data.role || "Employee"}</p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {data.profilePicture && (
                    <div className="flex justify-center">
                      <Image
                        src={data.profilePicture}
                        alt={`${data.firstName}'s profile`}
                        className="rounded-lg object-cover max-h-[200px] w-auto"
                        isZoomed
                      />
                    </div>
                  )}
                  
                  {renderSection("Personal Information", personalInfo, "bg-blue-50")}
                  {renderSection("Contact Information", contactInfo, "bg-purple-50")}
                  {renderSection("Employment Information", employmentInfo, "bg-green-50")}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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

export default EmployDetail;
