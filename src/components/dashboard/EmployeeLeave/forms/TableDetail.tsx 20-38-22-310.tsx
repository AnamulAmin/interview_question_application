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

interface TableDetailProps {
  data: Record<string, any> | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const TableDetail: React.FC<TableDetailProps> = ({
  data,
  isOpen,
  onOpenChange,
}) => {
  const [arrayData, setArrayData] = useState<{ name: string; value: any }[]>(
    []
  );

  useEffect(() => {
    if (data) {
      const excludedFields = ["image", "_id", "createdAt", "updatedAt", "__v"];
      const filteredData = Object.entries(data)
        .filter(([key]) => !excludedFields.includes(key))
        .map(([key, value]) => ({
          name: key,
          value: value == false ? "No" : value == true ? "Yes" : value,
        }));

      setArrayData(filteredData);
    }
  }, [data]);

  if (!data) return null; // Render nothing if data is null or undefined

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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {data.name || "Details"}
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex justify-center">
                  <Image
                    src={data.image || "/no-image.png"}
                    alt="image"
                    height={200}
                    className="object-contain w-full mx-auto block"
                    isZoomed
                  />
                </div>
                <Listbox aria-label="Details">
                  {arrayData.map((item) => (
                    <ListboxItem key={item.name}>
                      <div className="flex justify-between">
                        <b className="capitalize">
                          {item.name
                            .replaceAll("_", " ")
                            .replaceAll("-", " ")
                            .replaceAll("is", "")}{" "}
                          :
                        </b>{" "}
                        <span>
                          {Array.isArray(item.value)
                            ? item.value.join(", ")
                            : item.value?.toString() || "N/A"}
                        </span>
                      </div>
                    </ListboxItem>
                  ))}
                </Listbox>
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

export default TableDetail;
