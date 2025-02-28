import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface PurchaseReturnDetailProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  returnData: any;
}

const PurchaseReturnDetail: React.FC<PurchaseReturnDetailProps> = ({
  isShowModal,
  setIsShowModal,
  returnData,
}) => {
  const [returnDetails, setReturnDetails] = useState<any>(null);

  useEffect(() => {
    const fetchReturnDetails = async () => {
      if (returnData?._id) {
        try {
          const response = await window.ipcRenderer.invoke(
            "get-purchase-return",
            {
              _id: returnData._id,
            }
          );

          if (response.success) {
            setReturnDetails(response.data);
          }
        } catch (error) {
          console.error("Error fetching return details:", error);
        }
      }
    };

    fetchReturnDetails();
  }, [returnData]);

  const handlePrint = async () => {
    try {
      // Create print content with a more printer-friendly layout
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Purchase Return - ${returnDetails?.purchaseId}</title>
            <style>
              body {
                padding: 20px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.4;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
              }
              .header h1 {
                margin: 0;
                font-size: 18px;
                color: #333;
              }
              .info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                gap: 20px;
              }
              .info-box {
                flex: 1;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 4px;
              }
              .info-box h3 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #333;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
              }
              .info-box p {
                margin: 5px 0;
                font-size: 12px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background-color: white;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                font-size: 12px;
              }
              th {
                background-color: #f8f9fa;
                font-weight: bold;
                color: #333;
              }
              tr:nth-child(even) {
                background-color: #f8f9fa;
              }
              .total-section {
                text-align: right;
                margin-top: 20px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 4px;
              }
              .total-section p {
                margin: 0;
                font-size: 14px;
                font-weight: bold;
                color: #333;
              }
              .status-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 3px;
                font-size: 12px;
              }
              .status-completed { background: #e8f5e9; color: #2e7d32; }
              .status-pending { background: #fff3e0; color: #f57c00; }
              .status-rejected { background: #ffebee; color: #c62828; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
                .info-box, .total-section { 
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Purchase Return Details</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="info-section">
              <div class="info-box">
                <h3>Return Information</h3>
                <p><strong>Return ID:</strong> ${
                  returnDetails?.purchaseId || ""
                }</p>
                <p><strong>Return Date:</strong> ${
                  returnDetails?.returnDate || ""
                }</p>
                <p><strong>Status:</strong> 
                  <span class="status-badge status-${returnDetails?.status?.toLowerCase()}">
                    ${returnDetails?.status || ""}
                  </span>
                </p>
              </div>
              <div class="info-box">
                <h3>Supplier Details</h3>
                <p><strong>Name:</strong> ${
                  returnDetails?.supplierName || ""
                }</p>
                <p><strong>Reason:</strong> ${returnDetails?.reason || ""}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Return Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${returnDetails?.items
                  ?.map(
                    (item: any) => `
                  <tr>
                    <td>${item.inventoryName}</td>
                    <td>${item.returnQty}</td>
                    <td>$${item.rate.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="total-section">
              <p>Total Return Amount: $${
                returnDetails?.totalAmount?.toFixed(2) || "0.00"
              }</p>
            </div>
          </body>
        </html>
      `;

      const response = await window.ipcRenderer.invoke("print-content", {
        content: printContent,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to print");
      }
    } catch (error) {
      console.error("Error printing:", error);
      // You might want to show an error message to the user
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      size="2xl"
      scrollBehavior="inside"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Purchase Return Details</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Return Information
                  </h3>
                  <p>Return ID: {returnDetails?.purchaseId}</p>
                  <p>Return Date: {returnDetails?.returnDate}</p>
                  <p>
                    Status:{" "}
                    <Chip
                      color={
                        returnDetails?.status === "Completed"
                          ? "success"
                          : returnDetails?.status === "Rejected"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {returnDetails?.status}
                    </Chip>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Supplier Details
                  </h3>
                  <p>Name: {returnDetails?.supplierName}</p>
                  <p>Reason: {returnDetails?.reason}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <Table aria-label="Return Items">
                <TableHeader>
                  <TableColumn>Item Name</TableColumn>
                  <TableColumn>Return Quantity</TableColumn>
                  <TableColumn>Unit Price</TableColumn>
                  <TableColumn>Total</TableColumn>
                </TableHeader>
                <TableBody>
                  {returnDetails?.items?.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.inventoryName}</TableCell>
                      <TableCell>{item.returnQty}</TableCell>
                      <TableCell>${item.rate.toFixed(2)}</TableCell>
                      <TableCell>${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  Total Return Amount:
                </span>
                <span className="text-lg">
                  ${returnDetails?.totalAmount?.toFixed(2)}
                </span>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button color="primary" onPress={handlePrint}>
                Print Return
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseReturnDetail;
