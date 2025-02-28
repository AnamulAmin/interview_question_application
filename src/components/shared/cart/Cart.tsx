import { useGlobalContext } from "../../../providers/ContextProvider";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { FaChevronLeft, FaChevronRight, FaMinus, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoMdCalculator, IoMdClose } from "react-icons/io";
import formatPrepTime from "../../../helpers/FormateTime";
import calculateDiscounts from "../../../helpers/calculateDiscounts";
import calculateVAT from "../../../helpers/calculateVat";
import useGetAllEmploys from "../../../hooks/GetDataHook/useGetAllEmploys";
import MenuBar from "../../Sidebar/MenuBar/MenuBar";
import useGetAllTables from "../../../hooks/GetDataHook/useGetAllTables";
import moment from "moment";
import ModalMenuBar from "@/components/Sidebar/MenuBar/ModalMenuBar";
import { RiResetRightFill } from "react-icons/ri";
import { LuCookingPot } from "react-icons/lu";
import useGetAllCustomerTypes from "@/hooks/GetDataHook/useGetAllCustomerTypes";
import useGetAllCounters from "@/hooks/GetDataHook/useGetAllCounters";
import { FiLayout } from "react-icons/fi";

const Cart = ({
  isShow,
  setIsShow,
  handleOpenModal,
  setShowCalculator,
  isEdit = false,
  singleOrderData,
}: any) => {
  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    totalPrice,
    setTotalPrice,
    setTotalItems,
    setCartItems,
    totalPreparationTimes,
    setTotalPreparationTimes,
    totalItems,
  }: any = useGlobalContext();

  const [discounts, setDiscounts] = useState<any>({});
  const [isLoyaltyDiscount, setIsLoyaltyDiscount] = useState<any>(false);
  const [username, setUsername] = useState<any>("");
  const [orderType, setOrderType] = useState<any>("Dine-In");
  const [waiter, setWaiter] = useState<any>("");
  const [specialInstructions, setSpecialInstructions] = useState<any>("");
  const [table, setTable] = useState<any>("");
  const [order_placed_by, setOrder_placed_by] = useState<any>("");
  const [isMouseOver, setIsMouseOver] = useState<any>(false);
  const [customerType, setCustomerType] = useState<any>("");
  const [counter, setCounter] = useState<any>("");
  const [requiredPreparationTime, setRequiredPreparationTime] =
    useState<any>("");

  const [order_placer_name, setOrder_placer_name] = useState<any>("");

  const { customerTypes, pagination, loading, error } = useGetAllCustomerTypes(
    {}
  );
  const { employees } = useGetAllEmploys({});
  const tables: any = useGetAllTables({});
  const { counters }: any = useGetAllCounters({});

  const handleCancelOrder = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to cancel this order once it has been placed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel order",
      cancelButtonText: "No, return",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("cartItems");
        setCartItems([]);
        setTotalItems(0);
        setTotalPrice(0);
        setTotalPreparationTimes(0);
        Swal.fire({
          title: "Order cancelled",
          text: "Your order has been cancelled.",
          icon: "success",
        });
      } else if (result.isDismissed) {
        Swal.fire({
          title: "Order cancelled",
          text: "Your order has been cancelled.",
          icon: "error",
        });
      }
    });
  };

  useEffect(() => {
    const fetchDiscounts = async () => {
      const response = await window.ipcRenderer.invoke("get-discount", {
        data: null,
      });

      console.log(response, "response");

      if (response?.data) {
        setDiscounts(response.data[0]);
        setIsLoyaltyDiscount(response.data[0].loyaltyDiscountActive);
      }
    };
    fetchDiscounts();
  }, []);

  const handleLoyaltyDiscount = (value: any) => {
    console.log(value, "value");
    setIsLoyaltyDiscount(value);
    discounts.loyaltyDiscountActive = value;
    setDiscounts(discounts);
  };

  useEffect(() => {
    if (isEdit) {
      // setDiscounts(singleOrderData?.discounts );
      // setIsLoyaltyDiscount(singleOrderData?.discounts?.loyaltyDiscountActive);
      setTotalPrice(singleOrderData?.totalPrice);

      setCustomerType(singleOrderData?.customerType);
      setCounter(singleOrderData?.counter);
      setOrderType(singleOrderData?.orderType);
      setTable(singleOrderData?.table);
      setWaiter(singleOrderData?.waiter);
      setOrder_placed_by(singleOrderData?.order_placed_by);
      setSpecialInstructions(singleOrderData?.specialInstructions);
      setUsername(singleOrderData?.username);
      setRequiredPreparationTime(singleOrderData?.requiredPreparationTime);
      console.log(singleOrderData, "singleOrderData");
    }
  }, [isEdit, singleOrderData]);

  console.log(isLoyaltyDiscount, "isLoyaltyDiscount");

  const discount: any = calculateDiscounts(
    cartItems,
    discounts,
    discounts?.promoCode,
    discounts?.promoCodes
  )?.totalDiscount;
  const vatTotal = calculateVAT(totalPrice - discount).vat;

  const submitOrder = async () => {
    console.log(
      {
        username,
        orderType,
        discount,
        cartItems,
        preparationTimes: totalPreparationTimes,
        specialInstructions,
        subtotal: totalPrice,
        vat: vatTotal,
        total: totalPrice - discount + vatTotal,
        status: "running",
        table,
        order_placed_date: moment().format("YYYY-MM-DD"),
        order_placed_time: moment().format("HH:mm:ss"),
        order_placed_by,
        requiredPreparationTime,
        counter,
        customerType,
      },
      "submitOrder",
      {
        username,
        waiter,
        orderType,
        table,
        customerType,
        counter,
        order_placed_by,
        cartItems,
      }
    );
    if (
      !username ||
      !waiter ||
      !orderType ||
      !table ||
      !customerType ||
      !counter ||
      !order_placed_by ||
      !cartItems
    ) {
      Swal.fire({
        title: "Error",
        text: "Please fill all the required fields",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to confirm this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, order",
      cancelButtonText: "No, return",
    }).then(async (result) => {
      const submitData = {
        username,
        waiter,
        orderType,
        discount,
        cartItems,
        preparationTimes: totalPreparationTimes,
        specialInstructions,
        subtotal: totalPrice,
        vat: vatTotal,
        total: totalPrice - discount + vatTotal,
        status: "pending",
        table,
        order_placed_date: moment().format("YYYY-MM-DD"),
        order_placed_time: moment().format("HH:mm:ss"),
        order_placed_by,
        requiredPreparationTime,
        counter,
        customerType,
        order_placer_name,
      };

      if (isEdit && singleOrderData._id) {
        submitData._id = singleOrderData._id;
      }

      console.log(submitData, "submit data");
      if (result.isConfirmed) {
        let response;

        if (isEdit) {
          response = await window.ipcRenderer.invoke("update-order", {
            data: submitData,
          });
        } else {
          response = await window.ipcRenderer.invoke("create-order", {
            data: submitData,
          });
        }

        console.log(response, "response");

        if (response?.success) {
          setCartItems([]);
          setTotalItems(0);
          setTotalPrice(0);
          setTotalPreparationTimes(0);
          setWaiter("");
          setTable("");
          setOrderType("");
          setSpecialInstructions("");
          setUsername("");
          setIsLoyaltyDiscount(false);
          localStorage.removeItem("cartItems");
          Swal.fire({
            title: "Order Submitted",
            text: "Your order has been submitted.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Something went wrong",
            icon: "error",
          });
        }
      }
    });
  };

  useEffect(() => {
    const defaultCounter = localStorage.getItem("counter");

    setCounter(defaultCounter);
  }, []);

  return (
    <div
      className={`fixed top-0 right-0 pt-10 w-full h-dvh border-4 border-black shadow-2xl ${
        isMouseOver ? "max-w-[300px]" : "max-w-[1000px]"
      } bg-white  p-4 a transition-all duration-500 grid grid-cols-3 gap-4 justify-start ${
        isShow ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        className="bg-gray-400 hover:bg-green-100 w-3 h-full absolute top-0 left-0 cursor-col-resize"
        onClick={() => setIsMouseOver((prev: any) => !prev)}
      ></button>
      <div
        className={`transition-all duration-250  ${
          isMouseOver ? "col-span-full" : "col-span-2"
        }`}
      >
        <div
          className={`border-b pl-3 pr-6 py-3 transition-all duration-250  ${
            isMouseOver ? "h-[75vh] grid-cols-1" : "h-[82vh] grid-cols-2"
          } overflow-auto grid  gap-4`}
          style={{ scrollbarWidth: "thin" }}
        >
          {cartItems?.length > 0 ? (
            cartItems.map((item: any, index: number) => (
              <Card
                shadow="sm"
                key={index}
                isPressable
                onPress={() => console.log("item pressed")}
                className="h-[350px]"
              >
                <span
                  color="danger"
                  className="absolute top-1 right-1 text-white z-30 bg-neutral-700 border hover:border-red-400  rounded-full p-1 text-md hover:scale-125 transition-all duration-300 hover:bg-red-400"
                  onClick={() => removeFromCart(item._id)}
                >
                  <IoMdClose />
                </span>

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
                  <div className="w-full flex justify-between border-b-1 ">
                    <b>{item?.name}</b>
                    <p className="text-default-500">{item?.price}</p>
                  </div>
                  <div className="w-full flex justify-between mt-4">
                    <Button
                      color="success"
                      isIconOnly
                      type="button"
                      onPress={() => updateCartQuantity(item?._id)}
                    >
                      <FaMinus size={20} color="white" />
                    </Button>
                    <Button>{item.quantity}</Button>
                    <Button
                      className="bg-neutral-600 text-white"
                      type="button"
                      onPress={() => updateCartQuantity(item?._id, "increment")}
                      isIconOnly
                    >
                      <FaPlus size={20} color="white" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex justify-center col-span-2 flex-col items-center">
              <div className="text-center text-gray-500 text-3xl">
                <Image
                  src={"/empty.png"}
                  alt="No Products Available"
                  width={300}
                  height={300}
                />
                <span className="text-center">No Item Available!</span>
              </div>
            </div>
          )}
        </div>
        <div
          className={`col-span-full transition-all duration-250  ${
            !isMouseOver ? "h-0 pt-0 overflow-hidden" : "pt-8"
          }`}
        >
          <div className="border-b capitalize">
            <div className="flex justify-between text-sm text-gray-500">
              <b className="font-bold">Prepare Times:</b>
              <b className="font-bold text-lg">
                {formatPrepTime(totalPreparationTimes)}
              </b>
            </div>
            <div className="flex justify-between text-sm text-gray-500 ">
              <b>Subtotal:</b>
              <b className="font-bold">${totalPrice}</b>
            </div>
            <div className="flex justify-between text-sm text-gray-500 ">
              <b>discount:</b>
              <b className="font-bold">${discount}</b>
            </div>
            <div className="flex justify-between text-sm text-gray-500 ">
              <b>Vat:</b>
              <b className="font-bold">${vatTotal}</b>
            </div>
            {/* <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>discounts</span>
          <span className="font-medium">-${discount.toFixed(2)}</span>
        </div> */}
          </div>

          <div className=" pb-4 mt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Your Total</span>
              {/* <span>${totalPrice - discount}</span> */}
              <span>${totalPrice - discount + vatTotal}</span>
            </div>
          </div>
        </div>

        <div className="flex  gap-4 text-center transition-all duration-250  col-span-1 py-5 ">
          {!isMouseOver && (
            <>
              <Button color="danger" onPress={() => setIsShow(false)}>
                Close
              </Button>
              <Button
                color="default"
                onPress={() => setIsMouseOver(true)}
                className="cursor-col-resize"
              >
                <FiLayout size={30} /> Sort Layout
              </Button>
              <Button color="primary" onPress={handleCancelOrder}>
                <RiResetRightFill /> Clear
              </Button>
              <Button
                color="success"
                onPress={submitOrder}
                isDisabled={cartItems.length === 0}
              >
                <LuCookingPot size={30} /> {isEdit ? "Update" : "Place"} Order
              </Button>
              <Button color="secondary" onPress={() => setShowCalculator(true)}>
                <IoMdCalculator size={30} /> Calculator
              </Button>
            </>
          )}
        </div>
      </div>

      <div
        className={`w-full flex justify-between gap-4 text-center transition-all duration-250 overflow-auto border border-gray-300 rounded-md ${
          isMouseOver
            ? "col-span-0 py-0 h-0 overflow-hidden"
            : "col-span-1 py-5"
        }  `}
      >
        <div className="w-full   p-4 flex flex-col">
          <Select
            className="w-full mb-3"
            label="Counter"
            onChange={(e: any) => {
              setCounter(e.target.value);
              localStorage.setItem("counter", e.target.value);
            }}
            value={counter}
            defaultSelectedKeys={[localStorage.getItem("counter")]}
            color="success"
          >
            {counters.map((item: any) => (
              <SelectItem key={item?.counterName} value={item?.counterName}>
                {item?.counterName}
              </SelectItem>
            ))}
          </Select>
          <Input
            className="w-full mb-3"
            color={"secondary"}
            label="Customer Name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Autocomplete
            className="w-full mb-3"
            defaultItems={customerTypes}
            value={customerType}
            placeholder={customerType ? `${customerType}` : ``}
            label="Search Customer Type"
            onSelectionChange={(value) => setCustomerType(value)}
          >
            {(stuff: any) => (
              <AutocompleteItem key={stuff?.type_name}>
                {stuff?.type_name}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Autocomplete
            className="w-full mb-3"
            defaultItems={tables}
            placeholder={table ? `${table}` : ``}
            color="primary"
            onSelectionChange={(value) => setTable(value)}
            label="Search Table"
          >
            {(item: any) => (
              <AutocompleteItem key={item.table_name || "name"}>
                {item.table_name}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Autocomplete
            className="w-full mb-3"
            defaultItems={[
              { name: "Dine-In" },
              { name: "Takeaway" },
              { name: "Custom Delivery" },
              { name: "Third Party Food Delivery Platform" },
            ]}
            placeholder={orderType ? `${orderType}` : ``}
            color="success"
            onSelectionChange={(value) => setOrderType(value)}
            label={`Search Order Type`}
          >
            {(item: any) => (
              <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
            )}
          </Autocomplete>
          <Autocomplete
            className="w-full mb-3"
            defaultItems={employees}
            placeholder={
              singleOrderData?.waiter?.properties.firstName
                ? `${singleOrderData?.waiter?.properties.firstName}`
                : ``
            }
            onSelectionChange={(value) => setWaiter(value)}
            value={waiter}
            color="secondary"
            label="Search Waiter"
          >
            {(stuff: any) => (
              <AutocompleteItem key={stuff._id}>
                {stuff.firstName}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Autocomplete
            className="w-full mb-3"
            defaultItems={employees}
            placeholder={
              singleOrderData?.order_placed_by?.properties.firstName
                ? `${singleOrderData?.order_placed_by?.properties.firstName}`
                : ``
            }
            label="Order Placed By"
            onSelectionChange={(value) => {
              const employee = employees.find(
                (employee) => employee._id === value
              );
              setOrder_placer_name(employee?.firstName);
              setOrder_placed_by(value);
            }}
            value={order_placed_by}
          >
            {(stuff: any) => (
              <AutocompleteItem key={stuff._id}>
                {stuff.firstName}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Input
            className="w-full mb-3"
            color={"danger"}
            label="Required Preparation Time"
            type="Number"
            placeholder="Enter time in minutes"
            value={requiredPreparationTime}
            onChange={(e) => setRequiredPreparationTime(e.target.value)}
          />
          <Textarea
            isClearable={false}
            className="max-w-xs "
            label="Special Instructions"
            variant="bordered"
            // eslint-disable-next-line no-console
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            onClear={() => console.log("textarea cleared")}
          />

          <div
            className="flex justify-between items-center  gap-2 mt-4 mb-3 
                "
          >
            <h3 className="text-lg font-bold text-gray-500">
              Loyalty Discount
            </h3>
            <Switch
              defaultSelected
              aria-label="Automatic updates"
              value={isLoyaltyDiscount}
              // defaultSelected={isLoyaltyDiscount}
              onValueChange={(value) => handleLoyaltyDiscount(value)}
              size="sm"
            />
          </div>

          <div className="pb-4 mt-auto pt-2 capitalize">
            <div className="flex justify-between text-sm text-gray-500">
              <b className="font-bold">Prepare Times:</b>
              <b className="font-bold text-lg">
                {formatPrepTime(totalPreparationTimes)}
              </b>
            </div>
            <div className="flex justify-between text-sm text-gray-500 ">
              <b>Subtotal:</b>
              <b className="font-bold">${totalPrice}</b>
            </div>
            <div className="flex justify-between text-sm text-gray-500 ">
              <b>discount:</b>
              <b className="font-bold">${discount}</b>
            </div>
            <div className="flex justify-between text-sm text-gray-500 ">
              <b>Vat:</b>
              <b className="font-bold">${vatTotal}</b>
            </div>
            {/* <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>discounts</span>
          <span className="font-medium">-${discount.toFixed(2)}</span>
        </div> */}
          </div>

          <div className=" pb-4 mt-4">
            <div className="flex justify-between text-lg font-bold">
              <b className="text-2xl">Your Total</b>
              {/* <b>${totalPrice - discount}</b> */}
              <b className="text-2xl">${totalPrice - discount + vatTotal}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
