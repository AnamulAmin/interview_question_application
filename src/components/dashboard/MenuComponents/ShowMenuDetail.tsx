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
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const ShowMenuDetail: any = ({ data, isOpen, onOpenChange }: any) => {
  const [arrayData, setArrayData] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const newArrayData: any[] = Object.entries(data).map(
        ([key, value]: any): any => ({
          name: key,
          value,
        })
      );
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
      const inventoriesIndex = newArrayData.findIndex(
        (item: any) => item.name === "inventories"
      );
      delete newArrayData[inventoriesIndex];
      delete newArrayData[imageIndex];
      delete newArrayData[IdIndex];
      delete newArrayData[createdAtIndex];
      delete newArrayData[updatedAtIndex];
      setArrayData(newArrayData);
    }
  }, [data, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      size="lg"
      onOpenChange={onOpenChange}
      backdrop="blur"
      className="p-4"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[90vw]">
        {(onClose) => (
          <>
            {/* Header */}
            <ModalHeader className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Food Item Details
              </h2>
              <p className="text-sm text-gray-500">
                Explore ingredients & preparation details
              </p>
            </ModalHeader>

            {/* Body */}
            <ModalBody className="space-y-5">
              {/* Image Section */}
              <div className="w-full flex justify-center">
                <Image
                  src={data.image}
                  alt="Food Image"
                  className="w-64 h-64 rounded-lg shadow-lg object-cover"
                  isZoomed
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Food Details */}
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Food Information
                  </h3>
                  <Listbox aria-label="Food Details" className="space-y-1">
                    {arrayData.map((item: any) => (
                      <ListboxItem
                        key={item.name}
                        className="flex justify-between text-gray-700 text-sm"
                      >
                        <span className="font-medium">{item.name}:</span>
                        <span>
                          {Array.isArray(item.value)
                            ? item.value.join(", ")
                            : item.value.toString()}
                        </span>
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>

                {/* Inventory List */}
                {data?.inventories?.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                      Inventory
                    </h3>
                    <Listbox aria-label="Inventory">
                      {data.inventories.map((item: any, index: number) => (
                        <ListboxItem
                          key={item.inventoryItemName}
                          className="flex justify-between text-sm text-gray-700"
                        >
                          <span className="font-medium">
                            {index + 1}. {item.inventoryItemName}
                          </span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-md">
                            {item.usagePerItem} {item.unitType}
                          </span>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
              </div>
            </ModalBody>

            {/* Footer */}
            <ModalFooter className="flex justify-end">
              <Button
                color="danger"
                variant="bordered"
                className="px-6 py-2"
                onPress={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ShowMenuDetail;
