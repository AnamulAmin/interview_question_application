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

interface ShowMenuDetailProps {
  data: any;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowInventoryCategoryDetail: React.FC<ShowMenuDetailProps> = ({
  data,
  isOpen,
  onOpenChange,
}) => {
  const [arrayData, setArrayData] = React.useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const newArrayData: any[] = Object.entries(data).map(([key, value]) => ({
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
      const _revIndex = newArrayData.findIndex(
        (item: any) => item.name === "_rev"
      );
      delete newArrayData[imageIndex];
      delete newArrayData[IdIndex];
      delete newArrayData[createdAtIndex];
      delete newArrayData[updatedAtIndex];
      delete newArrayData[_revIndex];
      console.log(newArrayData, "newArrayData");
      setArrayData(newArrayData);
    }
  }, [data, isOpen]);

  console.log(data, "data in modal", arrayData);

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
                Category Details
              </ModalHeader>
              <ModalBody>
                {/* <Image
                  src={data.image}
                  alt="image"
                  height={200}
                  className="object-contain w-full mx-auto block"
                /> */}
                <Listbox aria-label="Actions">
                  {arrayData.map((item: any) => (
                    <ListboxItem key={item.name}>
                      <div className="flex justify-between">
                        <b>{item.name} :</b>{" "}
                        <span>
                          {/* {Array.isArray(item.value)
                            ? item.value.join(", ")
                            : item.value.toString()} */}

                          {item.value}
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

export default ShowInventoryCategoryDetail;
