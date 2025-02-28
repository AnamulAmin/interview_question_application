import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface ShowMenuDetailProps {
  data: {
    name: string;
    price: string;
    category: string;
    description: string;
    image: string;
    ingredients: string[];
    tags: string[];
    calories: string;
    specialOffer: boolean;
    discountPrice: number;
    spiceLevel: number;
    preparationTime: number;
    menuType: string;
    allergens: string[];
    stock: number;
  };
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ArrayDataItem {
  name: string;
  value: string | number | boolean | string[];
}

const ShowMenuDetail: React.FC<ShowMenuDetailProps> = ({
  data,
  isOpen,
  onOpenChange,
}) => {
  const [arrayData, setArrayData] = useState<ArrayDataItem[]>([]);

  useEffect(() => {
    const newArrayData: ArrayDataItem[] = Object.entries(data).map(
      ([key, value]) => ({
        name: key,
        value,
      })
    );
    const imageIndex = newArrayData.findIndex(
      (item: any) => item.name === "image"
    );
    const IdIndex = newArrayData.findIndex((item: any) => item.name === "_id");
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
  }, [data, isOpen]);

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

export default ShowMenuDetail;
