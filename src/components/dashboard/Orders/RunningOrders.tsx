import { useEffect, useState } from "react";
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
import Swal from "sweetalert2";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@nextui-org/drawer";
import MenuBar from "../../Sidebar/MenuBar/MenuBar";
import formatPrepTime from "../../../helpers/FormateTime";
import useGetAllOrders from "../../../hooks/GetDataHook/useGetAllOrders";
import ModalMenuBar from "@/components/Sidebar/MenuBar/ModalMenuBar";
import CircleProgress from "@/components/shared/Progress/CircleProgress";
import getRemainingPercentage from "@/helpers/GetRemainingPercentage";

interface OrderItem {
  name: string;
  image: string;
  preparationTime: number;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  username: string;
  cartItems: OrderItem[];
  subtotal: number;
  discount: number;
  vatTotal: number;
  totalPrice: number;
  preparationTimes: number;
}

const RunningOrders: any = ({ isShow, setIsShow, handleOpenModal }: any) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<any>(false);

  const { orders } = useGetAllOrders({
    status: "pending",
    isEdited: loading,
    isShowModal: isShow,
  });

  const handleSubmitOrder = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to confirm this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, order",
      cancelButtonText: "No, return",
    }).then(async (result) => {
      if (result.isConfirmed && order?._id) {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("update-order", {
          data: { status: "completed", _id: order?._id },
        });

        if (response?.success) {
          Swal.fire(
            "Order Submitted",
            "Your order has been submitted.",
            "success"
          );
          setOrder(null);
          setItems([]);
        }
        setLoading(false);
      }
    });
  };

  const handleCancelOrder = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No, return",
    }).then(async (result) => {
      if (result.isConfirmed && order?._id) {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("update-order", {
          data: { status: "canceled", _id: order?._id },
        });

        if (response?.success) {
          Swal.fire(
            "Order Canceled",
            "Your order has been canceled.",
            "success"
          );
          setOrder(null);
          setItems([]);
        }
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (orders.length > 0) {
      setOrder(orders[currentIndex]);
      setItems(orders[currentIndex]?.cartItems || []);
    }
  }, [orders, currentIndex, isShow]);

  const handleChefPrint = async () => {
    await window.ipcRenderer.invoke("print", {
      location: "chef-invoice-print",
      data: orders[currentIndex],
    });
  };

  const handleCustomerPrint = async () => {
    await window.ipcRenderer.invoke("print", {
      location: "customer-invoice-print",
      data: orders[currentIndex],
    });
  };

  return (
    <Drawer
      isOpen={isShow}
      onOpenChange={setIsShow}
      size="5xl"
      className="z-[9]"
      isDismissable={false}
      motionProps={{
        initial: { y: "-100%" }, // Drawer initially slides down from the top
        animate: { y: 0 }, // Slides into position
        exit: { y: "-100%" }, // Slides back up when closed
        transition: { duration: 0.3, ease: "easeInOut" }, // Smooth animation
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex gap-1">
          Running Orders <Chip color="success">{orders.length}</Chip>
          <ModalMenuBar
            handleOpenModal={handleOpenModal}
            selectedKey="running"
          />
        </DrawerHeader>
        <DrawerBody>
          <div className="bg-white p-4 grid grid-cols-3 gap-4">
            {orders.length > 0 ? (
              <>
                <div className="border-b pl-3 pr-6 py-3  h-[80vh] overflow-auto grid grid-cols-2 gap-4 col-span-2">
                  {items.length > 0 ? (
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
                    <div>No Items Available!</div>
                  )}
                </div>
                <div className="flex flex-col justify-between text-center py-5 col-span-1 border px-2 rounded-lg">
                  <h2 className="text-left text-lg font-bold mb-2">
                    Order Id: {orders[currentIndex]?.order_id}
                  </h2>
                  <Tabs
                    key="success"
                    color="success"
                    variant="bordered"
                    isVertical
                    fullWidth
                    onSelectionChange={(key) => setCurrentIndex(key as number)}
                  >
                    {orders.map((item: any, index: number) => (
                      <Tab
                        key={index}
                        className="justify-start w-full"
                        title={
                          <div className="flex text-left justify-between border-b w-[250px] items-center gap-2 ">
                            <b className="font-bold text-lg capitalize">{`${
                              index + 1
                            }. ${item?.username}`}</b>

                            <Chip size="sm" className="ml-auto">
                              {item?.cartItems.length}
                            </Chip>
                          </div>
                        }
                      ></Tab>
                    ))}
                  </Tabs>
                  <div className="border-b pb-4 mt-auto pt-2 capitalize">
                    <div className="flex justify-between text-sm text-gray-500">
                      <b className="font-bold">Prepare Times:</b>
                      <b className="font-bold text-lg">
                        {formatPrepTime(orders[currentIndex]?.preparationTimes)}
                      </b>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <b className="font-bold">Required Preparation Times:</b>
                      <b className="font-bold text-lg">
                        {formatPrepTime(
                          orders[currentIndex]?.requiredPreparationTime
                        )}
                      </b>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 ">
                      <b>Subtotal:</b>
                      <b className="font-bold">
                        ${orders[currentIndex]?.subtotal}
                      </b>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 ">
                      <b>discount:</b>
                      <b className="font-bold">
                        ${orders[currentIndex]?.discount}
                      </b>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 ">
                      <b>Vat:</b>
                      <b className="font-bold">${orders[currentIndex]?.vat}</b>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 mt-3">
                      <b className="text-2xl">Total:</b>
                      <b className="text-2xl">${orders[currentIndex]?.total}</b>
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
          <div className="mr-auto flex gap-3">
            <CircleProgress
              label={
                <h2 className="text-md font-bold bg-blue-300 px-3 py-1 rounded-md">
                  Preparation Time
                </h2>
              }
              getRemainingPercentage={getRemainingPercentage}
              totalTimes={orders[currentIndex]?.preparationTimes}
              createdTime={orders[currentIndex]?.order_placed_time}
              createdDate={orders[currentIndex]?.order_placed_date}
              strokeColor="stroke-blue-500"
            />
            <CircleProgress
              label={
                <h2 className="text-md font-bold bg-green-300 px-3 py-1 rounded-md">
                  {" "}
                  Required Preparation Time
                </h2>
              }
              getRemainingPercentage={getRemainingPercentage}
              totalTimes={orders[currentIndex]?.requiredPreparationTime}
              createdTime={orders[currentIndex]?.order_placed_time}
              createdDate={orders[currentIndex]?.order_placed_date}
            />
          </div>
          {orders.length > 0 && (
            <>
              <Button color="primary" onPress={handleCustomerPrint}>
                Customer Print
              </Button>
              <Button color="secondary" onPress={handleChefPrint}>
                Chef Print
              </Button>
              <Button color="danger" onPress={handleCancelOrder}>
                Cancel Order
              </Button>
              <Button color="success" onPress={handleSubmitOrder}>
                Confirm Order
              </Button>
            </>
          )}
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

export default RunningOrders;
