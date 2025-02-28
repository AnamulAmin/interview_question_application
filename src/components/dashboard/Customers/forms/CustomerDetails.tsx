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

interface CustomerDetailsProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  data: Record<string, any> | null;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  data,
  isShowModal,
  setIsShowModal,
}) => {
  const [formattedData, setFormattedData] = useState<
    { name: string; value: any }[]
  >([]);

  useEffect(() => {
    if (data) {
      // Fields to exclude from display
      const excludedFields = [
        "_id",
        "createdAt",
        "updatedAt",
        "__v",
        "password",
      ];

      // Fields to rename for display
      const fieldMappings: Record<string, string> = {
        customer_name: "Customer Name",
        email: "Email Address",
        mobile: "Mobile Number",
        address: "Address",
        is_vip: "VIP Status",
        customer_type: "Customer Type",
      };

      const filteredData = Object.entries(data)
        .filter(([key]) => !excludedFields.includes(key))
        .map(([key, value]) => ({
          name: fieldMappings[key] || key,
          value: formatValue(key, value),
        }));

      setFormattedData(filteredData);
    }
  }, [data]);

  const formatValue = (key: string, value: any) => {
    if (key === "is_vip") {
      return value ? "Yes" : "No";
    }
    if (key === "customer_type") {
      return value?.type_name || "N/A";
    }
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    return value;
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      placement="top-center"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Customer Details
            </ModalHeader>
            <ModalBody>
              <Listbox
                aria-label="Customer Details"
                className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-full overflow-visible shadow-small rounded-medium"
              >
                {formattedData.map((item) => (
                  <ListboxItem
                    key={item.name}
                    className="px-4 py-3 data-[hover=true]:bg-default-100"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-default-500">{item.value}</span>
                    </div>
                  </ListboxItem>
                ))}
              </Listbox>
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
  );
};

export default CustomerDetails;
