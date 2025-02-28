import { Chip } from "@nextui-org/chip";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../providers/ContextProvider";
import { CiSearch } from "react-icons/ci";
import { Input } from "@nextui-org/input";
import { FiFilter } from "react-icons/fi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaCar, FaCartPlus } from "react-icons/fa";
const MenuBar: any = ({
  handleOpenModal,
  selectedKey,
  setIsShowFilter,
  isShowFilter,
  isShowCart,
  setIsShowCart,
  isEdit = false,
}: any) => {
  const { totalItems } = useGlobalContext();
  const [runningOrder, setRunningOrder] = useState<any>(0);
  const [cancelOrder, setCancelOrder] = useState<any>(0);
  const [completedOrder, setCompletedOrder] = useState<any>(0);
  // const orders = useGetAllOrders({
  //   status: "",
  //   isEdited: false,
  //   isShowModal: false,
  // });

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await window.ipcRenderer.invoke("get-order", {
        data: null,
      });

      console.log(response, "response order");

      if (response?.data) {
        const runningInfo = response.data.filter(
          (item: any) => item?.status === "running"
        );
        setRunningOrder(runningInfo?.length || 0);
        const cancelInfo = response.data.filter(
          (item: any) => item?.status === "canceled"
        );
        setCancelOrder(cancelInfo?.length || 0);
        const completeInfo = response.data.filter(
          (item: any) => item?.status === "completed"
        );
        setCompletedOrder(completeInfo?.length || 0);
      }
    };
    fetchOrders();
  }, []);

  console.log(runningOrder, cancelOrder, completedOrder, "orders menubar");

  return (
    <nav
      className={`fixed top-0 right-0  w-full h-fit  px-0 flex justify-end items-center z-[8]`}
    >
      {isEdit ? (
        <h2 className="bg-neutral-700 text-white ml-40 px-4 py-2 rounded-md mt-1 font-bold">
          Update POS Invoice
        </h2>
      ) : (
        ""
      )}
      <Tabs
        key={"success"}
        color={"success"}
        aria-label="Tabs colors"
        radius="full"
        variant="light"
        className="bg-neutral-700 text-white rounded-none  rounded-bl-[60px] ml-auto pl-[30px] pr-[30px]"
        selectedKey={selectedKey}
        defaultSelectedKey={"cart"}
        onSelectionChange={(key) => {
          handleOpenModal({ openModalName: key });
        }}
      >
        <Tab
          key="cancel"
          className="border-none outline-none focus:border-none focus:outline-none "
          title={
            <div className="flex items-center space-x-2">
              <span>Cancel Order</span>
              <Chip size="sm" variant="faded">
                {cancelOrder}
              </Chip>
            </div>
          }
        />
        <Tab
          key="completed"
          className="border-none outline-none focus:border-none focus:outline-none"
          title={
            <div className="flex items-center space-x-2">
              <span>Today Order</span>
              <Chip size="sm" variant="faded">
                {completedOrder}
              </Chip>
            </div>
          }
        />
        <Tab
          key="running"
          className="border-none outline-none focus:border-none focus:outline-none"
          title={
            <div className="flex items-center space-x-2">
              <span>Running</span>
              <Chip size="sm" variant="faded">
                {runningOrder}
              </Chip>
            </div>
          }
        />
        <Tab
          key="cart"
          className="border-none outline-none focus:border-none focus:outline-none "
          title={
            <div
              className="flex items-center space-x-2"
              // onClick={() => setIsShowCart((prev: any) => !prev)}
            >
              <FaCartPlus size={20} />
              <span>Cart</span>
              <Chip size="sm" variant="faded">
                {totalItems}
              </Chip>
            </div>
          }
        />
        <Tab
          key="filter"
          className="border-none outline-none focus:border-none focus:outline-none "
          title={
            <div
              className="flex items-center space-x-2"
              onClick={() => setIsShowFilter((prev: any) => !prev)}
            >
              {!isShowFilter ? <FiFilter size={20} /> : <IoMdClose size={20} />}
            </div>
          }
        />
      </Tabs>
    </nav>
  );
};

export default MenuBar;
