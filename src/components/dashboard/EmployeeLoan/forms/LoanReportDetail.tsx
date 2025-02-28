import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";

interface LoanReportDetailProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  employeeId: string;
}

interface EmployeeDetails {
  name: string;
  id: string;
  designation: string;
  image?: string;
}

interface LoanDetail {
  sl: number;
  loanIssueId: string;
  date: string;
  amount: number;
  repayment: number;
  installment: number;
  totalPayment: number;
}

export default function LoanReportDetail({
  isOpen,
  onOpenChange,
  employeeId,
}: LoanReportDetailProps) {
  const [loading, setLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] =
    useState<EmployeeDetails | null>(null);
  const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke(
          "get-loan-report-detail",
          {
            employeeId,
          }
        );

        console.log(response, "employ details");

        if (response.success) {
          setEmployeeDetails(response.data.employeeDetails);
          setLoanDetails(response.data.loanDetails);
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch loan details");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && employeeId) {
      fetchLoanDetails();
    }
  }, [isOpen, employeeId]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Loan Report
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  Loading...
                </div>
              ) : (
                <div className="p-4">
                  <h1 className="text-center text-3xl text-green-600 font-serif mb-8">
                    Loan Report
                  </h1>

                  <div className="flex gap-8 mb-8">
                    {/* Employee Image */}
                    <div className="w-48 h-48 border border-gray-300">
                      {employeeDetails?.image ? (
                        <img
                          src={employeeDetails.image}
                          alt={employeeDetails.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Employee Details */}
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl font-serif">
                        {employeeDetails?.name}
                      </h2>
                      <p className="font-medium">
                        ID NO:{" "}
                        <span className="font-normal">
                          {employeeDetails?.id}
                        </span>
                      </p>
                      <p className="font-medium">
                        Designation:{" "}
                        <span className="font-normal">
                          {employeeDetails?.designation}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Loan Details Table */}
                  <Table aria-label="Loan details table">
                    <TableHeader>
                      <TableColumn>SI</TableColumn>
                      <TableColumn>Loan Issue ID</TableColumn>
                      <TableColumn>Date</TableColumn>
                      <TableColumn>Amount</TableColumn>
                      <TableColumn>Re-payment</TableColumn>
                      <TableColumn>Total Payment</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {loanDetails.map((loan) => (
                        <TableRow key={loan.sl}>
                          <TableCell>{loan.sl}</TableCell>
                          <TableCell>{loan.loanIssueId}</TableCell>
                          <TableCell>{loan.date}</TableCell>
                          <TableCell>${loan.amount}</TableCell>
                          <TableCell>${loan.repayment}</TableCell>
                          <TableCell>${loan.totalPayment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
