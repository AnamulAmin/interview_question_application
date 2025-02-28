import CircleProgress from "@/components/shared/Progress/CircleProgress";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Button, Chip, Spinner } from "@nextui-org/react";
import { FiClock } from "react-icons/fi";
const priorityColorMap = {
  Low: "default",
  Medium: "warning",
  High: "danger",
  Urgent: "danger",
};
export default function KitchenDashboardOrderList({
  orders,
  ordersLoading,
  handleStartProcessing,
  handleCancelOrder,
  setSelectedOrder,
  setIsUpdateModalOpen,
  getRemainingPercentage,
  handleShowItemDetail,
}: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border px-4 rounded-md py-4">
      {ordersLoading ? (
        <div className="flex justify-center items-center w-full col-span-full py-10">
          <Spinner />
        </div>
      ) : orders?.length === 0 ? (
        <p className="text-center w-full text-2xl font-bold col-span-full py-10">
          No orders found
        </p>
      ) : (
        orders.map((assignment: any) => (
          <Card
            key={assignment._id}
            className="p-4 shadow-md hover:scale-105 hover:translate-y-1 transition-all duration-300 hover:shadow-lg border"
            isPressable
          >
            {/* Order Header */}
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Order ID: {assignment.order_id}
              </h2>
              <Chip
                color={
                  priorityColorMap[
                    assignment.priority as keyof typeof priorityColorMap
                  ] as any
                }
                size="sm"
              >
                {assignment.priority || "Normal"}
              </Chip>
            </CardHeader>

            {/* Order Items */}
            <CardBody>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {assignment.cartItems.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    {item.quantity}x {item.name}
                  </div>
                ))}
              </div>

              <div className="max-h-20 overflow-y-auto space-y-1 flex gap-4 border rounded-md p-2 mt-2">
                <h2 className="text-lg font-bold">Note:</h2>{" "}
                <p className="text-md">{assignment.notes}</p>
              </div>

              <div className="max-h-20 overflow-y-auto space-y-1 flex gap-4 border rounded-md p-2 mt-2">
                <h2 className="text-lg font-bold">Special Instruction:</h2>{" "}
                <p className="text-md">
                  {assignment.specialInstructions || "__ __ __"}
                </p>
              </div>

              {/* Time Status */}
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FiClock className="text-gray-500" />
                  <span className="text-sm font-medium">Time Status</span>
                </div>
                <div className="flex gap-4 justify-center items-center">
                  <CircleProgress
                    label={
                      <h2 className="text-sm font-bold">Preparation Time</h2>
                    }
                    getRemainingPercentage={getRemainingPercentage}
                    totalTimes={assignment?.preparationTimes}
                    createdTime={assignment?.order_placed_time}
                    createdDate={assignment?.order_placed_date}
                    strokeColor="stroke-blue-500"
                    height={"h-16"}
                    width={"w-16"}
                  />
                  <CircleProgress
                    label={<h2 className="text-sm font-bold">Required Time</h2>}
                    getRemainingPercentage={getRemainingPercentage}
                    totalTimes={assignment?.requiredPreparationTime}
                    createdTime={assignment?.order_placed_time}
                    createdDate={assignment?.order_placed_date}
                    height={"h-16"}
                    width={"w-16"}
                  />
                </div>
              </div>
            </CardBody>

            {/* Action Buttons */}
            <CardFooter className="flex justify-center gap-2">
              {assignment.status === "pending" && (
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => handleStartProcessing(assignment._id)}
                >
                  Start Processing
                </Button>
              )}
              {assignment.status === "processing" && (
                <Button
                  color="success"
                  size="sm"
                  onPress={() => {
                    setSelectedOrder(assignment);
                    setIsUpdateModalOpen(true);
                  }}
                >
                  Mark Served
                </Button>
              )}
              <Button
                color="secondary"
                size="sm"
                onPress={() => handleShowItemDetail(assignment)}
              >
                Item Detail
              </Button>
              {assignment.status !== "pending" && (
                <Button
                  color="danger"
                  size="sm"
                  onPress={() => handleCancelOrder(assignment._id)}
                >
                  Set to Pending
                </Button>
              )}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
