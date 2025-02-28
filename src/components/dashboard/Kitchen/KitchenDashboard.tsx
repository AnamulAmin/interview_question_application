import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Tab,
  Tabs,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import moment from "moment";
import { FiClock, FiSearch } from "react-icons/fi";
import useGetAllKitchenAssigns from "@/hooks/GetDataHook/useGetAllKitchenAssigns";
import useGetAllOrders from "@/hooks/GetDataHook/useGetAllOrders";
import CircleProgress from "@/components/shared/Progress/CircleProgress";
import getRemainingPercentage from "@/helpers/GetRemainingPercentage";
import KitchenDashboardOrderList from "./Ui/KitchenDashboardOrderList";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import Swal from "sweetalert2";
import ShowKitchenOrderItemDetail from "./Ui/ShowKitchenOrderItemDetail";

const statusColorMap = {
  Pending: "warning",
  Processing: "primary",
  Completed: "success",
  Cancelled: "danger",
};

const priorityColorMap = {
  Low: "default",
  Medium: "warning",
  High: "danger",
  Urgent: "danger",
};

const KitchenDashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState("Processing");
  const [search, setSearch] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRender, setIsRender] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [showItemDetail, setShowItemDetail] = useState<any>(false);
  const [orderStatusCounts, setOrderStatusCounts] = useState<any>({});

  const { orders, loading: ordersLoading } = useGetAllOrders({
    search,
    status: selectedStatus,
    startDate: moment("2025-02-10").format("YYYY-MM-DD"),
    isAssigned: true,
    isRender,
  });

  useEffect(() => {
    const fetchOrderStatusCounts = async () => {
      const response = await window.ipcRenderer.invoke(
        "get-order-status-counts",
        {
          data: {
            search,
            startDate: moment("2025-02-10").format("YYYY-MM-DD"),
            isAssigned: true,
          },
        }
      );

      console.log(response, "response order statics");

      if (response) {
        setOrderStatusCounts(response);
      }
    };
    fetchOrderStatusCounts();
  }, [search, selectedStatus, isRender]);

  const handleStartProcessing = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to process this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, order",
        cancelButtonText: "No, return",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await window.ipcRenderer.invoke("update-order", {
            data: { status: "processing", _id: id },
          });

          if (response.success) {
            toast.success("Order processing started");
            setIsRender((prev) => !prev);
          } else {
            toast.error(response.message);
          }
        }
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to start processing");
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      const response = await window.ipcRenderer.invoke("update-order", {
        data: {
          status: "served",
          serving_note: completionNotes,
          servedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          _id: selectedOrder._id,
        },
      });

      if (response.success) {
        toast.success("Order marked as completed");
        setIsRender((prev) => !prev);
        setIsUpdateModalOpen(false);
        setSelectedOrder(null);
        setCompletionNotes("");
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to set this order to pending?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, set to pending",
        cancelButtonText: "No, return",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await window.ipcRenderer.invoke("update-order", {
            data: { status: "pending", _id: id },
          });

          if (response.success) {
            toast.success("Order set to pending");
            setIsRender((prev) => !prev);
          } else {
            toast.error(response.message);
          }
        }
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    }
  };

  const getTimeStatus = (estimatedTime: string) => {
    const now = moment();
    const estimated = moment(estimatedTime);
    const diff = estimated.diff(now, "minutes");

    if (diff < 0) {
      return <Chip color="danger">Overdue by {Math.abs(diff)} mins</Chip>;
    } else if (diff <= 15) {
      return <Chip color="warning">{diff} mins left</Chip>;
    } else {
      return <Chip color="success">{diff} mins left</Chip>;
    }
  };

  const handleShowItemDetail = (data: any): void => {
    setShowItemDetail(data);
    setItems(data.cartItems);
  };

  console.log(orderStatusCounts, "order");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<FiSearch />}
            className="w-64"
            color="secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card>
          <CardBody className="text-center">
            <p className="text-lg font-medium">Pending Orders</p>
            <p className="text-2xl font-bold text-warning">
              {orderStatusCounts.pending || 0}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-lg font-medium">Processing</p>
            <p className="text-2xl font-bold text-primary">
              {orderStatusCounts.processing || 0}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-lg font-medium">Served Today</p>
            <p className="text-2xl font-bold text-secondary">
              {orderStatusCounts.served || 0}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-lg font-medium">Completed Today</p>
            <p className="text-2xl font-bold text-success">
              {orderStatusCounts.completed || 0}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-lg font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-danger">
              {orderStatusCounts.cancelled || 0}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs
            selectedKey={selectedStatus}
            onSelectionChange={(key) => setSelectedStatus(key as string)}
            color="secondary"
          >
            <Tab key="pending" title="Pending" />
            <Tab key="processing" title="Processing" />
            <Tab key="served" title="Served" />
            <Tab key="completed" title="Completed" />
            <Tab key="cancelled" title="Cancelled" />
          </Tabs>
        </CardHeader>
        <CardBody>
          <KitchenDashboardOrderList
            orders={orders}
            ordersLoading={ordersLoading}
            handleStartProcessing={handleStartProcessing}
            handleCancelOrder={handleCancelOrder}
            setSelectedOrder={setSelectedOrder}
            setIsUpdateModalOpen={setIsUpdateModalOpen}
            getRemainingPercentage={getRemainingPercentage}
            handleShowItemDetail={handleShowItemDetail}
          />
        </CardBody>
      </Card>

      <Modal
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        placement="top-center"
        motionProps={fadeTopToBottom()}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Served Order</ModalHeader>
              <ModalBody>
                <Textarea
                  label="Completion Notes"
                  placeholder="Add any notes about the Served order"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onPress={handleCompleteOrder}
                  isLoading={loading}
                >
                  Serve Order
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ShowKitchenOrderItemDetail
        items={items}
        isOpen={showItemDetail}
        onOpenChange={setShowItemDetail}
      />
    </div>
  );
};

export default KitchenDashboard;
