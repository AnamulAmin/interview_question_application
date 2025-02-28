import { Chip } from "@nextui-org/chip";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../providers/ContextProvider";

const MenuBar: any = ({ handleOpenModal, selectedKey }: any) => {
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

      console.log(response, "response");

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
      className={`fixed top-0 right-10  w-full h-fit  px-0 flex justify-end z-[8]`}
    >
      
      <Tabs
        key={"success"}
        color={"success"}
        aria-label="Tabs colors"
        radius="full"
        variant="light"
        className="bg-neutral-700 text-white rounded-none  rounded-bl-[60px] ml-auto pl-[80px] pr-[60px]"
        selectedKey={selectedKey}
        defaultSelectedKey={""}
        onSelectionChange={(key) => {
          handleOpenModal({ openModalName: key });
        }}
      >
        <Tab
          key="completed"
          className="border-none outline-none focus:border-none focus:outline-none"
          title={
            <div className="flex items-center space-x-2">
              <span>Completed</span>
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
            <div className="flex items-center space-x-2">
              <span>Cart</span>
              <Chip size="sm" variant="faded">
                {totalItems}
              </Chip>
            </div>
          }
        />
        <Tab
          key="cancel"
          className="border-none outline-none focus:border-none focus:outline-none "
          title={
            <div className="flex items-center space-x-2">
              <span>Cancel</span>
              <Chip size="sm" variant="faded">
                {cancelOrder}
              </Chip>
            </div>
          }
        />
      </Tabs>
    </nav>
  );
};

export default MenuBar;
