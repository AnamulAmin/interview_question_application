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
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import ItemCard from "./ItemCard";

const ShowKitchenOrderItemDetail: any = ({
  items,
  isOpen,
  onOpenChange,
}: any) => {
  return (
    <Modal
      isOpen={isOpen}
      placement="top"
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
              <div className="grid grid-cols-2 gap-4">
                {items?.length > 0 &&
                  items.map((item: any, index: number) => (
                    <ItemCard data={item} key={index} />
                  ))}
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

export default ShowKitchenOrderItemDetail;
