import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Select,
  SelectItem,
  Pagination,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { FiEdit, FiTrash, FiSearch, FiClock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import useGetAllKitchenAssigns from "@/hooks/GetDataHook/useGetAllKitchenAssigns";
import Swal from "sweetalert2";
import AddKitchenAssign from "./forms/AddKitchenAssign";
import EditKitchenAssign from "./forms/EditKitchenAssign";
import moment from "moment";

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

const KitchenAssignPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isRender, setIsRender] = useState(false);

  const { assignments, loading, pagination } = useGetAllKitchenAssigns({
    search,
    page,
    limit: recordsPerPage,
    status: statusFilter,
    priority: priorityFilter,
    isRender,
  });

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke(
            "delete-kitchen-assign",
            {
              id,
            }
          );

          if (response.success) {
            toast.success(response.message);
            setIsRender((prev) => !prev);
          } else {
            toast.error(response.message);
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to delete assignment");
        }
      }
    });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await window.ipcRenderer.invoke(
        "update-kitchen-assign",
        {
          id,
          data: { status: newStatus },
        }
      );

      if (response.success) {
        toast.success(response.message);
        setIsRender((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kitchen Assignments</h1>
        <Button
          onPress={() => setIsCreateModalOpen(true)}
          color="primary"
          className="font-medium"
        >
          Assign New Order
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(e.target.value)}
            className="w-32"
            label="Per Page"
          >
            <SelectItem key="25" value="25">
              25
            </SelectItem>
            <SelectItem key="50" value="50">
              50
            </SelectItem>
            <SelectItem key="100" value="100">
              100
            </SelectItem>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
            label="Status"
          >
            <SelectItem key="" value="">
              All Status
            </SelectItem>
            <SelectItem key="Pending" value="Pending">
              Pending
            </SelectItem>
            <SelectItem key="Processing" value="Processing">
              Processing
            </SelectItem>
            <SelectItem key="Completed" value="Completed">
              Completed
            </SelectItem>
            <SelectItem key="Cancelled" value="Cancelled">
              Cancelled
            </SelectItem>
          </Select>

          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-40"
            label="Priority"
          >
            <SelectItem key="" value="">
              All Priority
            </SelectItem>
            <SelectItem key="Low" value="Low">
              Low
            </SelectItem>
            <SelectItem key="Medium" value="Medium">
              Medium
            </SelectItem>
            <SelectItem key="High" value="High">
              High
            </SelectItem>
            <SelectItem key="Urgent" value="Urgent">
              Urgent
            </SelectItem>
          </Select>
        </div>

        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startContent={<FiSearch />}
          className="w-64"
        />
      </div>

      <Table aria-label="Kitchen assignments table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Order ID</TableColumn>
          <TableColumn>Kitchen</TableColumn>
          <TableColumn>Items</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Priority</TableColumn>
          <TableColumn>Assigned At</TableColumn>
          <TableColumn>Est. Completion</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={loading ? <Spinner /> : "No assignments found"}
          isLoading={loading}
        >
          {assignments?.map((assignment: any, index: number) => (
            <TableRow key={assignment._id}>
              <TableCell>
                {(page - 1) * parseInt(recordsPerPage) + index + 1}
              </TableCell>
              <TableCell>{assignment.orderId}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {assignment.kitchenId.kitchenName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {assignment.kitchenId.chefName}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-h-20 overflow-y-auto">
                  {assignment.items.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm">
                      {item.quantity}x {item.itemName}
                      {item.notes && (
                        <p className="text-xs text-gray-500">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={assignment.status}
                  onChange={(e) =>
                    handleStatusChange(assignment._id, e.target.value)
                  }
                  className="max-w-[140px]"
                >
                  <SelectItem key="Pending" value="Pending">
                    <Chip color={statusColorMap.Pending as any} size="sm">
                      Pending
                    </Chip>
                  </SelectItem>
                  <SelectItem key="Processing" value="Processing">
                    <Chip color={statusColorMap.Processing as any} size="sm">
                      Processing
                    </Chip>
                  </SelectItem>
                  <SelectItem key="Completed" value="Completed">
                    <Chip color={statusColorMap.Completed as any} size="sm">
                      Completed
                    </Chip>
                  </SelectItem>
                  <SelectItem key="Cancelled" value="Cancelled">
                    <Chip color={statusColorMap.Cancelled as any} size="sm">
                      Cancelled
                    </Chip>
                  </SelectItem>
                </Select>
              </TableCell>
              <TableCell>
                <Chip
                  color={
                    priorityColorMap[
                      assignment.priority as keyof typeof priorityColorMap
                    ] as any
                  }
                  size="sm"
                >
                  {assignment.priority}
                </Chip>
              </TableCell>
              <TableCell>
                {moment(assignment.assignedAt).format("YYYY-MM-DD HH:mm")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <FiClock className="text-gray-500" />
                  {moment(assignment.estimatedCompletionTime).format(
                    "YYYY-MM-DD HH:mm"
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    isIconOnly
                    color="warning"
                    size="sm"
                    onPress={() => handleEdit(assignment)}
                  >
                    <FiEdit />
                  </Button>
                  {assignment.status === "Pending" && (
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onPress={() => handleDelete(assignment._id)}
                    >
                      <FiTrash />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination?.total > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * parseInt(recordsPerPage) + 1} to{" "}
            {Math.min(page * parseInt(recordsPerPage), pagination.total)} of{" "}
            {pagination.total} entries
          </div>
          <Pagination
            total={Math.ceil(pagination.total / parseInt(recordsPerPage))}
            page={page}
            onChange={(newPage) => setPage(newPage)}
            showControls
            color="primary"
            variant="bordered"
          />
        </div>
      )}

      <AddKitchenAssign
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditKitchenAssign
        isShowModal={isEditModalOpen}
        setIsShowModal={setIsEditModalOpen}
        data={selectedData}
        setIsRender={setIsRender}
      />
    </div>
  );
};

export default KitchenAssignPage;
