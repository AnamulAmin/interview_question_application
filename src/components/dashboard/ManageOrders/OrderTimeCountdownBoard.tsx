import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import moment from "moment";

interface Order {
  _id: string;
  orderId: string;
  kitchenId: {
    kitchenName: string;
  };
  items: Array<{
    itemName: string;
    quantity: number;
  }>;
  status: string;
  estimatedCompletionTime: string;
  assignedAt: string;
}

const OrderTimeCountdownBoard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(updateCountdowns, 1000);
    return () => clearInterval(timer);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const response = await window.ipcRenderer.invoke("get-all-kitchen-assigns", {
        status: "Processing",
      });
      if (response.success) {
        setOrders(response.data.assignments);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const updateCountdowns = () => {
    const now = moment();
    const newTimeLeft: { [key: string]: string } = {};

    orders.forEach((order) => {
      const estimatedTime = moment(order.estimatedCompletionTime);
      const duration = moment.duration(estimatedTime.diff(now));

      if (duration.asSeconds() <= 0) {
        newTimeLeft[order._id] = "Time's up!";
      } else {
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        newTimeLeft[order._id] = `${hours > 0 ? `${hours}h ` : ""}${
          minutes > 0 ? `${minutes}m ` : ""
        }${seconds}s`;
      }
    });

    setTimeLeft(newTimeLeft);
  };

  const getTimeLeftColor = (orderId: string, estimatedTime: string) => {
    const now = moment();
    const estimated = moment(estimatedTime);
    const minutesLeft = estimated.diff(now, "minutes");

    if (minutesLeft < 0) return "danger";
    if (minutesLeft < 5) return "warning";
    return "success";
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Order Time Countdown Board</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Order countdown table">
            <TableHeader>
              <TableColumn>Order ID</TableColumn>
              <TableColumn>Kitchen</TableColumn>
              <TableColumn>Items</TableColumn>
              <TableColumn>Time Left</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.kitchenId.kitchenName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {order.items.map((item, index) => (
                        <span key={index}>
                          {item.itemName} x {item.quantity}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getTimeLeftColor(
                        order._id,
                        order.estimatedCompletionTime
                      )}
                      variant="flat"
                    >
                      {timeLeft[order._id] || "Calculating..."}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={
                        order.status === "Processing" ? "primary" : "secondary"
                      }
                      variant="flat"
                    >
                      {order.status}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrderTimeCountdownBoard;
