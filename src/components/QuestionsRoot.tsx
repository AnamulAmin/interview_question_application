import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import "../index.css";
import { HomeSidebar } from "./Home/HomeSidebar/HomeSidebar";
import MenuBar from "./Sidebar/MenuBar/MenuBar";
import Cart from "./shared/cart/Cart";
import RunningOrders from "./dashboard/Orders/RunningOrders";
import CompletedOrders from "./dashboard/Orders/CompletedOrders";
import CanceledOrders from "./dashboard/Orders/CanceledOrders";
import Header from "./Sidebar/Header/Header";
const QuestionsRoot = () => {
  // const { isShowCart, setIsShowCart } = useGlobalContext();
  const [isOpen, setIsOpen] = useState<any>(false);
  const [isShowRunningOrder, setIsShowRunningOrder] = useState<any>(false);
  const [isShowCart, setIsShowCart] = useState<any>(false);
  const [isShowCompletedOrders, setIsShowCompletedOrders] =
    useState<any>(false);
  const [isShowCanceledOrders, setIsShowCanceledOrders] = useState<any>(false);

  // useEffect(() => {
  //   if (isShowRunningOrder) {
  //     handleCloseModal({ openModalName: "isShowRunningOrder" });
  //   } else if (isShowCart) {
  //     handleCloseModal({ openModalName: "isShowCart" });
  //   } else if (isShowCompletedOrders) {
  //     handleCloseModal({ openModalName: "isShowCompletedOrders" });
  //   }
  // }, [isShowRunningOrder, isShowCart, isShowCompletedOrders, handleCloseModal]);

  return (
    <div className="flex h-dvh w-screen bg-gray-100">
      <Header />
      <HomeSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full h-full">
        <div
          className={`w-full min-h-dvh h-full mt-12 overflow-auto transition-all duration-500 ${
            isOpen ? "pl-[282px]" : "pl-0"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default QuestionsRoot;
