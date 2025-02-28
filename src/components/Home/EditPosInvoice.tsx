import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { useGlobalContext } from "../../providers/ContextProvider";
import useGetAllMenu from "../../hooks/GetDataHook/useGetAllMenu";
import { useCallback, useEffect, useState } from "react";
import ShowMenuDetail from "../dashboard/MenuComponents/ShowMenuDetail";
import MenuBar from "../Sidebar/MenuBar/MenuBar";
import Cart from "../shared/cart/Cart";
import RunningOrders from "../dashboard/Orders/RunningOrders";
import CompletedOrders from "../dashboard/Orders/CompletedOrders";
import CanceledOrders from "../dashboard/Orders/CanceledOrders";
import FoodFilterBar from "../Sidebar/FoodFilterBar/FoodFilterBar";
import useDebounce from "@/hooks/useDebounce";
import Calculator from "../shared/Calculator";
import { useParams } from "react-router-dom";

export default function EditPosInvoice() {
  const { id } = useParams();
  const [editSingleOrderData, setEditSingleOrderData] = useState<any>({}); // Properly typed state for singleData
  const [singleData, setSingleData] = useState<any>(null); // Properly typed state for singleData
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { addToCart, setCartItems } = useGlobalContext();
  const [isShowRunningOrder, setIsShowRunningOrder] = useState<any>(false);
  const [isShowCart, setIsShowCart] = useState<any>(false);
  const [isShowFilter, setIsShowFilter] = useState<any>(false);
  const [isShowCompletedOrders, setIsShowCompletedOrders] =
    useState<any>(false);
  const [isShowCanceledOrders, setIsShowCanceledOrders] = useState<any>(false);
  const [searchText, setSearchText] = useState<any>("");
  const debouncedValue: any = useDebounce(searchText, 500);
  const [category, setCategory] = useState<any>("");
  const [subcategory, setSubcategory] = useState<any>("");
  const [showCalculator, setShowCalculator] = useState<any>(false);

  const handleOpenModal = useCallback(({ openModalName }: any) => {
    setIsShowRunningOrder(false);
    setIsShowCart(false);
    setIsShowCompletedOrders(false);
    setIsShowCanceledOrders(false);
    setIsShowFilter(false);

    switch (openModalName) {
      case "running":
        setIsShowRunningOrder(true);
        break;
      case "cart":
        setIsShowCart(true);
        break;
      case "completed":
        setIsShowCompletedOrders(true);
        break;
      case "cancel":
        setIsShowCanceledOrders(true);
        break;
      case "filter":
        setIsShowFilter(true);
        break;
      default:
        break;
    }
  }, []);

  // Parse the currency safely from localStorage
  console.log(showCalculator, "category, subcategory, debouncedValue");
  const currency = JSON.parse(localStorage.getItem("currency") || "{}");

  // Fetching menu items with appropriate type
  const menuItems = useGetAllMenu({
    filter: { search: debouncedValue, category, subcategory },
  });

  const handleShowDetail = (data: any): void => {
    setSingleData(data);

    onOpen();
  };

  useEffect(() => {
    const fetchSingleOrder = async () => {
      const response = await window.ipcRenderer.invoke("get-single-order", {
        data: { _id: id },
      });

      if (response.success) {
        setEditSingleOrderData(response.data || {});
        setCartItems(response.data?.cartItems);
      }
    };

    fetchSingleOrder();
  }, [id]);

  console.log(editSingleOrderData, "editSingleOrderData");
  return (
    <div>
      <MenuBar
        setIsShowRunningOrder={setIsShowRunningOrder}
        setIsShowCart={setIsShowCart}
        isShowCart={isShowCart}
        isShowRunningOrder={isShowRunningOrder}
        isShowCompletedOrders={isShowCompletedOrders}
        setIsShowCompletedOrders={setIsShowCompletedOrders}
        handleOpenModal={handleOpenModal}
        setIsShowFilter={setIsShowFilter}
        isShowFilter={isShowFilter}
        isEdit={true}
      />
      <ul
        className={`gap-5 duration-200 transition-all grid grid-cols-2 ${
          isShowFilter || isShowCart
            ? "sm:grid-cols-2 md:grid-cols-4"
            : "sm:grid-cols-4 md:grid-cols-5"
        } w-full p-14 ${isShowFilter || isShowCart ? "pr-[330px]" : ""}`}
      >
        {menuItems.map((item: any) => (
          <Card
            shadow="sm"
            key={item._id} // Use item._id as the key
            isBlurred={true}
            isHoverable={true}
            onPress={() => {}} // Placeholder for onPress logic
            className="h-[350px] w-full"
          >
            <CardBody className="overflow-hidden p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.name}
                isZoomed
                className="w-full object-cover h-[200px]"
                src={item.image}
              />
            </CardBody>
            <CardFooter className="text-small justify-between flex-col items-between">
              <div className="w-full flex justify-between border-b-1 ">
                <b>{item.name}</b>
                <p className="text-default-500">
                  {currency.symbol
                    ? ` ${currency.symbol}  ${item.price}`
                    : item.price}
                </p>
              </div>
              <div className="w-full flex justify-between mt-4">
                <Button color="success" onPress={() => handleShowDetail(item)}>
                  Detail
                </Button>
                <Button
                  className="bg-neutral-600 text-white"
                  onPress={() => addToCart(item)}
                >
                  Add
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </ul>
      <ShowMenuDetail
        data={singleData}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      <Cart
        isShow={isShowCart}
        setIsShow={setIsShowCart}
        handleOpenModal={handleOpenModal}
        showCalculator={showCalculator}
        setShowCalculator={setShowCalculator}
        isEdit={true}
        singleOrderData={editSingleOrderData}
      />
      <RunningOrders
        isShow={isShowRunningOrder}
        setIsShow={setIsShowRunningOrder}
        handleOpenModal={handleOpenModal}
      />
      <CompletedOrders
        isShow={isShowCompletedOrders}
        setIsShow={setIsShowCompletedOrders}
        handleOpenModal={handleOpenModal}
      />
      <CanceledOrders
        isShow={isShowCanceledOrders}
        setIsShow={setIsShowCanceledOrders}
        handleOpenModal={handleOpenModal}
      />
      <FoodFilterBar
        isShowFilter={isShowFilter}
        setIsShowFilter={setIsShowFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        category={category}
        setCategory={setCategory}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
      />
      <Calculator isShow={showCalculator} setIsShow={setShowCalculator} />
    </div>
  );
}
