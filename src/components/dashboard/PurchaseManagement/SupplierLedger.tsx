import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Card,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import useGetAllSuppliers from "@/hooks/GetDataHook/useGetAllSuppliers";

interface LedgerEntry {
  date: string;
  description: string;
  invoiceNo?: string;
  depositId?: string;
  debit: number;
  credit: number;
  balance: number;
  type: "purchase" | "payment" | "return";
}

interface Supplier {
  _id: string;
  supplierName: string;
}

const SupplierLedger = () => {
  const [supplier, setSupplier] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  // const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([]);

  const {
    suppliers,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
  } = useGetAllSuppliers({});

  // Fetch suppliers
  // useEffect(() => {
  //   const fetchSuppliers = async () => {
  //     try {
  //       const response = await window.ipcRenderer.invoke("get-supplier");
  //       if (response.success) {
  //         setSuppliers(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching suppliers:", error);
  //     }
  //   };
  //   fetchSuppliers();
  // }, []);

  const fetchLedgerData = async () => {
    if (!supplier) {
      Swal.fire({
        title: "Error",
        text: "Please select a supplier",
        icon: "error",
      });
      return;
    }

    setFilterLoading(true);
    try {
      // Fetch purchases with proper data structure
      const purchasesResponse = await window.ipcRenderer.invoke(
        "get-purchases",
        {
          data: {
            supplierId: supplier,
            fromDate,
            toDate,
            page: 1,
            limit: 100, // Get more records for ledger
          },
        }
      );

      // Fetch returns with proper data structure
      const returnsResponse = await window.ipcRenderer.invoke(
        "get-purchase-returns",
        {
          data: {
            supplierId: supplier,
            fromDate,
            toDate,
            page: 1,
            limit: 100,
          },
        }
      );

      // Combine and sort all transactions
      const purchases = purchasesResponse.success
        ? purchasesResponse.data.purchases.map((p: any) => ({
            date: p.purchaseDate,
            description: `Purchase Invoice: ${p.purchaseId}`,
            invoiceNo: p.purchaseId,
            debit: p.totalAmount,
            credit: 0,
            balance: 0,
            type: "purchase" as const,
          }))
        : [];

      const returns = returnsResponse.success
        ? returnsResponse.data.purchaseReturns.map((r: any) => ({
            date: r.returnDate,
            description: `Return against Invoice: ${r.purchaseId}`,
            invoiceNo: r.purchaseId,
            debit: 0,
            credit: r.totalAmount,
            balance: 0,
            type: "return" as const,
          }))
        : [];

      // Combine all transactions and sort by date
      const allTransactions = [...purchases, ...returns].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Calculate running balance
      let runningBalance = 0;
      const ledgerEntries = allTransactions.map((entry) => {
        runningBalance = runningBalance + entry.debit - entry.credit;
        return {
          ...entry,
          balance: runningBalance,
        };
      });

      setLedgerData(ledgerEntries);
    } catch (error) {
      console.error("Error fetching ledger data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch ledger data",
        icon: "error",
      });
    } finally {
      setFilterLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      const selectedSupplier = suppliers.find((s) => s._id === supplier);
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Supplier Ledger</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
              .total-row { font-weight: bold; background-color: #f8f9fa; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Supplier Ledger</h2>
              <p>Supplier: ${selectedSupplier?.supplierName || ""}</p>
              <p>Period: ${fromDate} to ${toDate}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Invoice/Ref</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                ${ledgerData
                  .map(
                    (entry) => `
                  <tr>
                    <td>${entry.date}</td>
                    <td>${entry.description}</td>
                    <td>${entry.invoiceNo || "—"}</td>
                    <td>${entry.debit.toLocaleString()}</td>
                    <td>${entry.credit.toLocaleString()}</td>
                    <td>${entry.balance.toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr class="total-row">
                  <td colspan="3">Total</td>
                  <td>${ledgerData
                    .reduce((sum, entry) => sum + entry.debit, 0)
                    .toLocaleString()}</td>
                  <td>${ledgerData
                    .reduce((sum, entry) => sum + entry.credit, 0)
                    .toLocaleString()}</td>
                  <td>${
                    ledgerData[
                      ledgerData.length - 1
                    ]?.balance.toLocaleString() || 0
                  }</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `;

      await window.ipcRenderer.invoke("print-content", {
        content: printContent,
      });
    } catch (error) {
      console.error("Error printing:", error);
    }
  };

  if (loading || filterLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supplier Ledger</h1>
        <Button color="success" onPress={handlePrint}>
          Print Ledger
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <Select
              label="Select Supplier"
              placeholder="Select Supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              color="primary"
            >
              {suppliers.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.supplierName}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex-1">
            <Input
              type="date"
              label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              color="secondary"
            />
          </div>

          <div className="flex-1">
            <Input
              type="date"
              label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              color="success"
            />
          </div>

          <Button color="danger" variant="flat" onPress={fetchLedgerData}>
            Filter
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <Table aria-label="Supplier Ledger">
          <TableHeader>
            <TableColumn>Date</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Invoice/Ref</TableColumn>
            <TableColumn>Debit</TableColumn>
            <TableColumn>Credit</TableColumn>
            <TableColumn>Balance</TableColumn>
          </TableHeader>
          <TableBody>
            {ledgerData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.invoiceNo || "—"}</TableCell>
                <TableCell>{entry.debit.toLocaleString()}</TableCell>
                <TableCell>{entry.credit.toLocaleString()}</TableCell>
                <TableCell>{entry.balance.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {ledgerData.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">Total Debit:</p>
                <p>
                  {ledgerData
                    .reduce((sum, entry) => sum + entry.debit, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-semibold">Total Credit:</p>
                <p>
                  {ledgerData
                    .reduce((sum, entry) => sum + entry.credit, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-semibold">Current Balance:</p>
                <p>
                  {ledgerData[
                    ledgerData.length - 1
                  ]?.balance.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SupplierLedger;
