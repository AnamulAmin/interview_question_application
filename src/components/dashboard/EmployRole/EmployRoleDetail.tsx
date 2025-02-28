import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const EmployRoleDetail: React.FC<any> = ({ data, isOpen, onOpenChange }) => {
  const [arrayData, setArrayData] = React.useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const newArrayData: any = Object.entries(data).map(([key, value]) => ({
        name: key,
        value,
      }));
      const imageIndex = newArrayData.findIndex(
        (item: any) => item.name === "image"
      );
      const IdIndex = newArrayData.findIndex(
        (item: any) => item.name === "_id"
      );
      const createdAtIndex = newArrayData.findIndex(
        (item: any) => item.name === "createdAt"
      );
      const updatedAtIndex = newArrayData.findIndex(
        (item: any) => item.name === "updatedAt"
      );
      delete newArrayData[imageIndex];
      delete newArrayData[IdIndex];
      delete newArrayData[createdAtIndex];
      delete newArrayData[updatedAtIndex];
      setArrayData(newArrayData);
    }
  }, [data, isOpen]);

  console.log(data, "data in modal");

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
                Modal Title
              </ModalHeader>
              <ModalBody>
                {/* <Image
                  src={data.image}
                  alt="image"
                  height={200}
                  className="object-contain w-full mx-auto block"
                /> */}
                <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
                  {arrayData.map((item: any) => (
                    <ListboxItem key={item.name}>
                      <div className="flex justify-between">
                        <b>{item.name} :</b>{" "}
                        <span>
                          {Array.isArray(item.value)
                            ? item.value.join(", ")
                            : item.value.toString()}
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

export default EmployRoleDetail;
