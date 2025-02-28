import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Select,
  SelectItem,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import useGetAllEmploys from "@/hooks/GetDataHook/useGetAllEmploys";
import LoanReportDetail from "./forms/LoanReportDetail";
import { FaEye } from "react-icons/fa";
import moment from "moment";

interface LoanReportData {
  employeeName: string;
  employee_id: string;
  totalLoans: number;
  totalLoanAmount: number;
  totalRepayment: number;
  totalPayment: number;
}

export default function LoanReport() {
  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [employeeId, setEmployeeId] = useState("");
  const [reportData, setReportData] = useState<LoanReportData[]>([]);
  const [recordsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { employees, loading: employeesLoading } = useGetAllEmploys({
    search: "",
    page: 1,
    limit: 100,
    isRender: false,
  });

  const handleFilter = async () => {
    try {
      setLoading(true);
      const response = await window.ipcRenderer.invoke("get-loan-report", {
        fromDate,
        toDate,
        employeeId,
      });

      if (response.success) {
        setReportData(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch loan report");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch loan report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, []);

  const handleViewDetail = async (employeeId: string) => {
    try {
      setSelectedEmployee(employeeId);
      onOpen();
    } catch (error: any) {
      toast.error(error.message || "Failed to view loan details");
    }
  };

  const handleExport = (type: string) => {
    // Implement export functionality based on type (Copy, CSV, Excel, PDF, Print)
    toast.success(`Export to ${type} coming soon!`);
  };

  const calculateTotals = () => {
    return reportData.reduce(
      (acc, curr) => ({
        totalLoans: acc.totalLoans + curr.totalLoans,
        totalLoanAmount: acc.totalLoanAmount + curr.totalLoanAmount,
        totalRepayment: acc.totalRepayment + curr.totalRepayment,
        totalPayment: acc.totalPayment + (curr.totalPayment || 0),
      }),
      { totalLoans: 0, totalLoanAmount: 0, totalRepayment: 0, totalPayment: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Select
            label="Select Employee"
            placeholder="All Employees"
            className="max-w-xs"
            onChange={(e) => setEmployeeId(e.target.value)}
            isLoading={employeesLoading}
          >
            {employees.map((employee) => (
              <SelectItem
                key={employee._id}
                value={employee._id}
                textValue={`${employee.properties?.firstName} ${
                  employee.properties?.lastName || ""
                }`}
              >
                {employee.properties?.firstName}{" "}
                {employee.properties?.lastName || ""}
              </SelectItem>
            ))}
          </Select>
          <Input
            type="date"
            label="From Date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            type="date"
            label="To Date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Button
            color="primary"
            onPress={handleFilter}
            isLoading={loading}
            className="mt-7"
          >
            Filter
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Display</span>
            <Select
              value={recordsPerPage.toString()}
              className="w-20"
              onChange={(e) => {}}
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
            <span>records per page</span>
          </div>

          <div className="flex gap-2">
            {["Copy", "CSV", "Excel", "PDF", "Print"].map((type) => (
              <Button
                key={type}
                size="sm"
                variant="flat"
                onPress={() => handleExport(type.toLowerCase())}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <Table
          aria-label="Loan report table"
          bottomContent={
            <div className="flex justify-end px-2 py-2">
              <div className="flex gap-4">
                <div>
                  <strong>Total Loans:</strong> {totals.totalLoans}
                </div>
                <div>
                  <strong>Total Amount:</strong> ${totals.totalLoanAmount}
                </div>
                <div>
                  <strong>Total Repayment:</strong> ${totals.totalRepayment}
                </div>
                <div>
                  <strong>Total Payment:</strong> ${totals.totalPayment}
                </div>
              </div>
            </div>
          }
        >
          <TableHeader>
            <TableColumn>SI</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Total Loan</TableColumn>
            <TableColumn>Total Amount</TableColumn>
            <TableColumn>Repayment Total</TableColumn>
            <TableColumn>Total Payment</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={loading ? <Spinner /> : "No loan records found"}
            isLoading={loading}
          >
            {reportData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.employeeName}</TableCell>
                <TableCell>{item.totalLoans}</TableCell>
                <TableCell>${item.totalLoanAmount}</TableCell>
                <TableCell>${item.totalRepayment}</TableCell>
                <TableCell>${item.totalPayment || 0}</TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => handleViewDetail(item.employee_id)}
                  >
                    <FaEye className="text-lg" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedEmployee && (
          <LoanReportDetail
            isOpen={isOpen}
            onOpenChange={onClose}
            employeeId={selectedEmployee}
          />
        )}
      </div>
    </div>
  );
}
