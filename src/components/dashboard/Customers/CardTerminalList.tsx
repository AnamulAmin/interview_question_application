import { useState } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";
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
  Skeleton,
} from "@nextui-org/react";
import { utils, writeFile } from "xlsx";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AddCardTerminal from "./forms/AddCardTerminal";
import EditCardTerminal from "./forms/EditCardTerminal";
import useDebounce from "@/hooks/useDebounce";
import useGetAllCardTerminals from "@/hooks/GetDataHook/useGetAllCardTerminals";

export default function CardTerminalList(): JSX.Element {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any>(null);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search, 500);

  const { terminals: cardTerminals, loading } = useGetAllCardTerminals({
    search: debouncedSearch,
    isEdit: isEdited,
    isShowModal: isCreateModalOpen,
    isDelete: isDelete,
  });

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        setIsDelete(true);
        const response = await window.ipcRenderer.invoke(
          "delete-card-terminal",
          { id }
        );
        if (response.success) {
          toast.success(response.message);
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setIsDelete(false);
    }
  };

  const exportData = async (type: string) => {
    try {
      const exportData = cardTerminals.map((terminal, index) => ({
        SI: index + 1,
        "Card Terminal Name": terminal.card_terminal_name,
      }));

      switch (type) {
        case "copy":
          const text = exportData
            .map((row) => Object.values(row).join("\t"))
            .join("\n");
          await navigator.clipboard.writeText(text);
          toast.success("Data copied to clipboard");
          break;

        case "csv":
          const ws = utils.json_to_sheet(exportData);
          const csv = utils.sheet_to_csv(ws);
          const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const csvUrl = URL.createObjectURL(csvBlob);
          const link = document.createElement("a");
          link.href = csvUrl;
          link.setAttribute("download", "card-terminals.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;

        case "excel":
          const wb = utils.book_new();
          const excelWs = utils.json_to_sheet(exportData);
          utils.book_append_sheet(wb, excelWs, "Card Terminals");
          writeFile(wb, "card-terminals.xlsx");
          break;

        case "pdf":
          const pdf = new jsPDF();
          pdf.setFontSize(16);
          pdf.text("Card Terminals", 14, 15);
          pdf.setFontSize(10);
          pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

          pdf.autoTable({
            head: [Object.keys(exportData[0])],
            body: exportData.map((row) => Object.values(row)),
            startY: 30,
            theme: "grid",
            styles: {
              fontSize: 8,
              cellPadding: 2,
            },
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontSize: 9,
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          });

          pdf.save("card-terminals.pdf");
          break;

        default:
          toast.error("Invalid export type");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="flex gap-2">
          <Button className="py-7" onPress={() => exportData("copy")}>
            Copy
          </Button>
          <Button className="py-7" onPress={() => exportData("csv")}>
            CSV
          </Button>
          <Button className="py-7" onPress={() => exportData("excel")}>
            Excel
          </Button>
          <Button className="py-7" onPress={() => exportData("pdf")}>
            Pdf
          </Button>
          <Button className="py-7" onPress={() => window.print()}>
            Print
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
            color={"primary"}
            label={
              <div className="flex items-center gap-2">
                <FiSearch className="text-2xl" />
                Search...
              </div>
            }
          />

          <Button
            onPress={() => setIsCreateModalOpen(true)}
            color="primary"
            className="py-7 text-3xl"
          >
            +
          </Button>
        </div>
      </div>

      <Table aria-label="Card terminals table">
        <TableHeader>
          <TableColumn>SI</TableColumn>
          <TableColumn>Card terminal name</TableColumn>
          <TableColumn align="center">Action</TableColumn>
        </TableHeader>
        <TableBody>
          {loading
            ? [...Array(parseInt(recordsPerPage))].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : cardTerminals.map((terminal, index) => (
                <TableRow key={terminal._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{terminal.card_terminal_name}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        onPress={() => handleEdit(terminal)}
                      >
                        <FiEdit />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(terminal._id)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {cardTerminals.length === 0 && (
        <div className="flex justify-center items-center h-full mt-10">
          <p className="text-2xl font-bold">No card terminals found</p>
        </div>
      )}

      <AddCardTerminal
        isShowModal={isCreateModalOpen}
        setIsShowModal={setIsCreateModalOpen}
      />

      <EditCardTerminal
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
        data={singleData}
      />
    </div>
  );
}
