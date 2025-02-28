import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import formatPrepTime from "../../../helpers/FormateTime";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@nextui-org/drawer";
import useGetAllOrders from "../../../hooks/GetDataHook/useGetAllOrders";
import MenuBar from "../../Sidebar/MenuBar/MenuBar";
import ModalMenuBar from "@/components/Sidebar/MenuBar/ModalMenuBar";

const CanceledOrders = ({ isShow, setIsShow, handleOpenModal }: any) => {
  const [order, setOrder] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState<any>(0);
  // const [loading, setLoading] = useState<any>(false);

  const { orders } = useGetAllOrders({
    status: "canceled",
    // isEdited: loading,
    isShowModal: isShow,
  });

  // useEffect(() => {
  //   const fetchDiscounts = async () => {
  //     const response = await window.ipcRenderer.invoke("get-order", {
  //       data: { status: "Running" },
  //     });

  //     console.log(response, "response");

  //     if (response?.data) {
  //       setOrder(response.data[0] || {});
  //       // setItems(response.data[0]?.cartItems || []);
  //     }
  //   };
  //   fetchDiscounts();
  // }, []);

  useEffect(() => {
    console.log(orders, "orders");
    setItems(orders[currentIndex]?.cartItems || []);
    setOrder(orders[currentIndex]);

    console.log(
      orders[currentIndex]?.cartItems,
      "cartItems",
      currentIndex,
      "currentIndex",
      order,
      "order"
    );
  }, [orders, currentIndex, isShow]);

  return (
    <Drawer
      isOpen={isShow}
      onOpenChange={setIsShow}
      size="5xl"
      className="z-[9]"
      motionProps={{
        initial: { y: "-100%" }, // Drawer initially slides down from the top
        animate: { y: 0 }, // Slides into position
        exit: { y: "-100%" }, // Slides back up when closed
        transition: { duration: 0.3, ease: "easeInOut" }, // Smooth animation
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex gap-1">
          Canceled Orders <Chip color="success">{orders?.length || 0}</Chip>
          <ModalMenuBar
            handleOpenModal={handleOpenModal}
            selectedKey="cancel"
          />
        </DrawerHeader>
        <DrawerBody>
          <div
            className={` bg-white  p-4 a transition-all duration-500 grid grid-cols-3 gap-4 justify-start `}
          >
            {orders?.length > 0 ? (
              <>
                <div
                  className="border-b pl-3 pr-6 py-3 h-full max-h-[80vh] overflow-auto grid grid-cols-2 gap-4 col-span-2"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {items?.length > 0 ? (
                    items.map((item: any, index: number) => (
                      <Card
                        shadow="sm"
                        key={index}
                        isPressable
                        onPress={() => console.log("item pressed")}
                        className="h-[390px]"
                      >
                        <CardBody className="overflow-hidden p-0">
                          <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt={item?.name}
                            isZoomed
                            className="w-full object-cover h-[200px] "
                            src={item?.image}
                          />
                        </CardBody>
                        <CardFooter className="text-small justify-between flex-col items-between">
                          <div className="w-full flex justify-between  mb-5">
                            <b className="font-bold text-2xl">{item?.name}</b>
                          </div>
                          <div className="w-full flex justify-between border-b-1 ">
                            <b>Preparation Time</b>
                            <p className="text-default-500">
                              {formatPrepTime(item?.preparationTime)}
                            </p>
                          </div>
                          <div className="w-full flex justify-between border-b-1 ">
                            <b>Price</b>
                            <p className="text-default-500">{item?.price}</p>
                          </div>
                          <div className="w-full flex justify-between border-b-1 ">
                            <b>Quantity</b>
                            <p className="text-default-500">{item?.quantity}</p>
                          </div>
                          <div className="w-full flex justify-between ">
                            <b>Subtotal</b>
                            <p className="text-default-500">
                              {Number(item?.price * item?.quantity).toFixed(2)}
                            </p>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div>
                      <div className="flex justify-center">
                        <div className="text-center text-gray-500 text-3xl">
                          <span>No Orders Available!</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col justify-between gap-4 text-center py-5 col-span-1 h-[80dvh]">
                  <Tabs
                    key={"success"}
                    color={"success"}
                    aria-label="Tabs colors"
                    variant="bordered"
                    isVertical={true}
                    className="w-full"
                    fullWidth={true}
                    onSelectionChange={setCurrentIndex}
                  >
                    {orders.map((item: any, index: number) => (
                      <Tab
                        key={index}
                        className="border-none outline-none focus:border-none focus:outline-none w-full"
                        title={
                          <div className=" space-x-2">
                            <span>
                              {item?.username || `User (${index + 1})`}
                            </span>
                            <Chip size="sm" variant="faded">
                              {item?.cartItems?.length}
                            </Chip>
                          </div>
                        }
                      />
                    ))}
                  </Tabs>

                  <div className="border-b pb-4 mt-auto pt-2 capitalize">
                    <div className="flex justify-between text-sm text-gray-500">
                      <b className="font-bold">Prepare Times:</b>
                      <b className="font-bold text-lg">
                        {formatPrepTime(order?.preparationTimes)}
                      </b>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 ">
                      <b>Subtotal:</b>
                      <b className="font-bold">${order?.subtotal}</b>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 ">
                      <b>discount:</b>
                      <b className="font-bold">${order?.discount}</b>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 ">
                      <b>Vat:</b>
                      <b className="font-bold">${order?.vatTotal || 0}</b>
                    </div>
                  </div>

                  <div className=" pb-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Your Total</span>
                      {/* <span>${totalPrice - discount}</span> */}
                      <span>${order?.totalPrice || 0}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center col-span-full mt-20 flex-col items-center">
                <div className="text-center text-gray-500 text-3xl">
                  <Image
                    src={"/no_order.jpg"}
                    alt="No Order Available"
                    width={300}
                    height={300}
                  />
                  <span className="text-center">No Order Available!</span>
                </div>
              </div>
            )}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => setIsShow(false)}
          >
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CanceledOrders;
