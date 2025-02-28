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
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

const ShowInventoryTrackingDetail: any = ({
  data,
  isOpen,
  onOpenChange,
  setIsEdited,
}: any) => {
  const [arrayData, setArrayData] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

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
      const inventoriesIndex = newArrayData.findIndex(
        (item: any) => item.name === "menuItems"
      );

      delete newArrayData[inventoriesIndex];

      delete newArrayData[_revIndex];

      delete newArrayData[imageIndex];
      delete newArrayData[IdIndex];
      delete newArrayData[createdAtIndex];
      delete newArrayData[updatedAtIndex];
      setArrayData(newArrayData);
    }
    setMenuItems(data?.menuItems || []);
  }, [data, isOpen]);

  console.log(data, "data in modal");

  const handleDelete = (item: any): void => {
    Swal.fire({
      title: "Are you sure you want to delete this any?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        item._id = data._id;
        const filterItems = menuItems.filter((item) => item._id !== data._id);

        const submitData = {
          _id: data._id,
          updatedData: filterItems,
        };

        const receiveData: any = await window.ipcRenderer.invoke(
          "delete-menu-item-from-inventory",
          { data: submitData }
        );

        console.log(receiveData, "delete receiveData");

        if (receiveData.success) {
          Swal.fire({
            title: "Success!",
            text: receiveData.message,
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            setMenuItems((prev) =>
              prev.filter((item) => item._id !== data._id)
            );
            setIsEdited((prev: boolean) => !prev);
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: receiveData.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        placement={"top"}
        onOpenChange={onOpenChange}
        className="z-[9999"
        isDismissable={false}
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
                Inventory Detail
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
                          {Array.isArray(item.value)
                            ? item.value.join(", ")
                            : item.value.toString()}
                        </span>
                      </div>
                    </ListboxItem>
                  ))}
                </Listbox>
                <Listbox
                  aria-label="Actions"
                  onAction={(key) => alert(key)}
                  className="bg-gray-100 border-2 rounded-md"
                >
                  {menuItems.map((item: any, index: number) => (
                    <ListboxItem key={item.inventoryItemName}>
                      <div className="flex justify-between items-center">
                        <Image
                          src={item?.menuItemImage}
                          alt="image"
                          height={60}
                        />
                        <b>{item.menuItemName}</b>
                        <Button
                          onPress={() => {
                            handleDelete(item);
                            // setSingleData(item);
                          }}
                          isIconOnly
                          color="danger"
                        >
                          <FiTrash2 />
                        </Button>
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

export default ShowInventoryTrackingDetail;
