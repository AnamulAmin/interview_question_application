import { useState, useEffect, useCallback } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

import { Button } from "@nextui-org/react";

import { FaEye } from "react-icons/fa";
import EmployCreate from "./EmployCreate";
import EmployDetail from "./EmployeeDetail";
import EmployEdit from "./EmployeeEdit";
import useGetAllEmploys from "../../../hooks/GetDataHook/useGetAllEmploys";
import CreateExpenseItem from "./Forms/CreateExpenseItem";
import EditExpenseItem from "./Forms/EditExpenseItem";

interface singleData {
  tableNumber: number;
  seatingCapacity: number;
  isAvailable: boolean;
}

export default function ManageExpenseItem(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 15;
  // const [employs, setemploys] = useState<MenuType[]>([]);
  const [stuffRoles, setStuffRoles] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<any>("");
  const [sortConfig, setSortConfig] = useState<{
    key: any;
    direction: "asc" | "desc";
  }>({
    key: "_id",
    direction: "asc",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const [singleData, setSingleData] = useState<singleData | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onOpenChange: onCreateModalOpenChange } = useDisclosure();

  // Initialize NeDB
  // const db = new NeDB<MenuType>({ filename: "employs.db", autoload: true });

  const employs = useGetAllEmploys({
    role: selectedRoles,
    isEdited,
    isShowModal: isCreateModalOpen,
    isDeleted,
  });

  console.log(employs, "employs");

  const sortedEmploys = useCallback((): any => {
    const sortedData = [...employs];
    sortedData.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  }, [employs, sortConfig]);

  const paginatedData = useCallback((): any[] => {
    const offset = currentPage * itemsPerPage;
    return sortedEmploys().slice(offset, offset + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedEmploys]);

  const handleSort = (key: any): void => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const handleDetail = (data: any): void => {
    setSingleData(data);
    onOpen();
  };

  const handleDelete = (data: any): void => {
    Swal.fire({
      title: "Are you sure you want to delete this MenuType?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        interface editMenuResponse {
          success: boolean;
          message: string;
        }

        const receiveData: editMenuResponse = await window.ipcRenderer.invoke(
          "delete-employee",
          { data: data }
        );

        console.log(receiveData, "receiveData");

        if (receiveData.success) {
          setIsDeleted(true);
          Swal.fire({
            title: "Success!",
            text: receiveData.message,
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            setIsDeleted(false);
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: receiveData.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  // useEffect(() => {
  //   const fetchEmploys = async (): Promise<void> => {
  //     const response = await window.ipcRenderer.invoke("get-employee", {
  //       data: { role: selectedRoles },
  //     });

  //     console.log(response, "response");
  //     setemploys(response.data);
  //   };
  //   fetchEmploys();
  // }, [isOpen, isCreateModalOpen, isEdited, isDeleted, selectedRoles]);

  useEffect(() => {
    const fetchEmploys = async (): Promise<void> => {
      const response = await window.ipcRenderer.invoke("get-stuff-role", {
        data: null,
      });

      console.log(response, "response");
      setStuffRoles(response.data);
    };
    fetchEmploys();
  }, []);

  console.log(selectedRoles, "selectedRoles");

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-md rounded-md">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-5">Manage Expense Item</h1>
          <div className="flex gap-3 items-center">
            <Button onPress={() => setIsCreateModalOpen(true)} color="primary">
              Create Expense Item
            </Button>
          </div>
        </div>
        <Table className="min-w-full table-auto border-collapse">
          <TableHeader className="bg-gray-100">
            <TableColumn className="border p-2 text-left cursor-pointer">
              SL{" "}
              {sortConfig.key === "_id" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>

            <TableColumn className="border p-2 text-left cursor-pointer">
              <span onClick={() => handleSort("fullName")}>
                Expense Item Name
              </span>
              {sortConfig.key === "fullName" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>

            <TableColumn className="border p-2 text-right">Action</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedData().map((item: any, index: number) => (
              <TableRow key={item._id} className="border-b">
                <TableCell className="border p-2">
                  {index + 1 + currentPage * itemsPerPage}
                </TableCell>

                <TableCell className="border p-2">{item.name}</TableCell>

                <TableCell className="border p-2">
                  <div className="flex space-x-2 justify-end">
                    <Tooltip
                      color={"primary"}
                      content={"View"}
                      className="capitalize"
                    >
                      <Button
                        onPress={() => handleDetail(item)}
                        color="primary"
                        isIconOnly
                      >
                        <FaEye />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      color={"secondary"}
                      content={"Edit"}
                      className="capitalize"
                    >
                      <Button
                        onPress={() => handleEdit(item)}
                        color="secondary"
                        isIconOnly
                      >
                        <FiEdit />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      color={"secondary"}
                      content={"Delete"}
                      className="capitalize"
                    >
                      <Button
                        onPress={() => handleDelete(item)}
                        isIconOnly
                        color="danger"
                      >
                        <FiTrash2 />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {paginatedData().length === 0 && (
          <p className="text-center text-gray-600 font-bold text-3xl mt-16">
            No data found
          </p>
        )}

        {/* Pagination */}
        <div className="mt-5 flex justify-center space-x-2">
          {Array.from({
            length: Math.ceil(employs.length / itemsPerPage),
          }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => handlePageClick(pageIndex)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === pageIndex
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {pageIndex + 1}
            </button>
          ))}
        </div>
      </div>

      <CreateExpenseItem
        setIsShowModal={setIsCreateModalOpen}
        isShowModal={isCreateModalOpen}
      />
      <EditExpenseItem
        data={singleData}
        isShowModal={isEdited}
        setIsShowModal={setIsEdited}
      />

      {/* <EmployEdit
        // singleData={singleData}
        setIsShowModal={setIsEdited}
        data={singleData}
        isShowModal={isEdited}
      /> */}
    </div>
  );
}
