import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Selection,
  ChipProps,
  Chip,
  Select,
  SelectItem,
  Input,
  Skeleton,
} from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AddLoanInstallment from "./forms/AddLoanInstallment";
import EditLoanInstallment from "./forms/EditLoanInstallment";
import useGetAllLoanInstallments from "@/hooks/GetDataHook/useGetAllLoanInstallments";
import { exportUtils } from "@/utils/exportUtils";
import Swal from "sweetalert2";

export default function LoanInstallment(): JSX.Element {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [page, setPage] = useState(1);
  const [isRender, setIsRender] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [search, setSearch] = useState("");

  const { installments, loading, pagination } = useGetAllLoanInstallments({
    search,
    page,
    limit: parseInt(recordsPerPage),
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await window.ipcRenderer.invoke(
            "delete-loan-installment",
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
          toast.error(error.message || "Failed to delete loan installment");
        }
      }
    });
  };

  const handleExport = async (type: string) => {
    const headers = [
      "SL",
      "Employee Name",
      "Loan No",
      "Installment Amount",
      "Payment",
      "Date",
      "Receiver",
      "Install No",
      "Notes",
      "Status",
    ];

    const data = installments.map((item: any, index: number) => [
      (page - 1) * parseInt(recordsPerPage) + index + 1,
      item.employee_id.firstName,
      item.loan_id.loanNo,
      item.installmentAmount,
      item.payment,
      item.date,
      item.receiver,
      item.installNo,
      item.notes,
      item.status,
    ]);

    exportUtils({ headers, data, type, fileName: "loan-installments" });
  };

  const statusColorMap: Record<string, ChipProps["color"]> = {
    Paid: "success",
    Pending: "warning",
  };

  console.log(installments, "installments");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Loan Installments</h1>
        <div className="flex gap-2">
          <Button
            onPress={() => setIsCreateModalOpen(true)}
            color="primary"
            className="font-medium"
          >
            Add Installment
          </Button>
          <Button
            color="primary"
            variant="bordered"
            onPress={() => handleExport("copy")}
          >
            Copy
          </Button>
          <Button
            color="primary"
            variant="bordered"
            onPress={() => handleExport("csv")}
          >
            CSV
          </Button>
          <Button
            color="primary"
            variant="bordered"
            onPress={() => handleExport("excel")}
          >
            Excel
          </Button>
          <Button
            color="primary"
            variant="bordered"
            onPress={() => handleExport("pdf")}
          >
            PDF
          </Button>
          <Button
            color="primary"
            variant="bordered"
            onPress={() => handleExport("print")}
          >
            Print
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 gap-3">
        <Select
          label="Records per page"
          className="w-40"
          value={recordsPerPage}
          onChange={(e) => setRecordsPerPage(e.target.value)}
        >
          <SelectItem key="10" value="10">
            10
          </SelectItem>
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

        <Input
          isClearable
          className="w-80"
          placeholder="Search..."
          value={search}
          onValueChange={setSearch}
        />
      </div>

      <Table
        aria-label="Loan installments table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pagination?.totalPages || 1}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>Employee Name</TableColumn>
          <TableColumn>Loan No</TableColumn>
          <TableColumn>Installment Amount</TableColumn>
          <TableColumn>Payment</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Receiver</TableColumn>
          <TableColumn>Install No</TableColumn>
          <TableColumn>Notes</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={loading ? " " : "No loan installments found"}
          items={loading ? [] : installments}
        >
          {loading ? (
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            installments.map((installment: any, index: number) => (
              <TableRow key={installment._id}>
                <TableCell>
                  {(page - 1) * parseInt(recordsPerPage) + index + 1}
                </TableCell>
                <TableCell>{installment.employeeName}</TableCell>
                <TableCell>{installment.loanNo}</TableCell>
                <TableCell>${installment.installmentAmount}</TableCell>
                <TableCell>${installment.payment}</TableCell>
                <TableCell>{installment.date}</TableCell>
                <TableCell>{installment.receiver}</TableCell>
                <TableCell>{installment.installNo}</TableCell>
                <TableCell>{installment.notes}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={statusColorMap[installment.status]}
                    size="sm"
                    variant="flat"
                  >
                    {installment.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      isIconOnly
                      color="warning"
                      size="sm"
                      onPress={() => handleEdit(installment)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onPress={() => handleDelete(installment._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AddLoanInstallment
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
        setIsRender={setIsRender}
      />

      <EditLoanInstallment
        isShowModal={isEditModalOpen}
        setIsShowModal={setIsEditModalOpen}
        setIsRender={setIsRender}
        data={selectedData}
      />
    </div>
  );
}
