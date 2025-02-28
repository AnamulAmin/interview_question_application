import { useState, useEffect, useCallback, useRef } from "react";
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
  Image,
} from "@nextui-org/react";

import { Button } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import CreateInventoryTrackingForm from "./CreateInventoryTrackingForm";
import ShowInventoryTrackingDetail from "./ShowInventoryTrackingDetail";
import EditInventoryTrackingForm from "./EditInventoryTrackingForm";
import Pagination from "../../../shared/Pagination/Pagination";
import { RiRecordMailFill } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";
import RecordUsageOfInventory from "./RecordUsageOfInventory/RecordUsageOfInventory";

interface singleData {
  ingredientName: string;
  currentStock: number;
  unitType: string;
  minThreshold: 5;
  restockFrequency: string;
  lastRestocked: string;
  expiryDate: string;
  linkedItems: string[];
  usagePerItem: number;
  totalConsumed: number;
  totalWasted: number;
}

export default function ViewAllInventoryTracking(): JSX.Element {
  const tableRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 20;
  const [menuItems, setMenuItems] = useState<any[]>([]);
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
  const [isShowRecord, setIsShowRecord] = useState<boolean>(false);
  const [tableHeight, setTableHeight] = useState<any>(0);

  const [singleData, setSingleData] = useState<singleData | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onOpenChange: onCreateModalOpenChange } = useDisclosure();

  // Initialize NeDB
  // const db = new NeDB<any>({ filename: "menuItems.db", autoload: true });

  const sortedmenuItems = useCallback((): any[] => {
    const sortedData = [...menuItems];
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
  }, [menuItems, sortConfig]);

  const paginatedData = useCallback((): any[] => {
    const offset = currentPage * itemsPerPage;
    return sortedmenuItems().slice(offset, offset + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedmenuItems]);

  const handleSort = (key: any): void => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // const handlePageClick = (pageNumber: number): void => {
  //   setCurrentPage(pageNumber);
  // };

  const handleEdit = (data: singleData): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const handleDetail = (data: singleData): void => {
    setSingleData(data);
    onOpen();
  };

  const handleDelete = (data: any): void => {
    Swal.fire({
      title: "Are you sure you want to delete this any?",
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
          "delete-inventory-item",
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

  useEffect(() => {
    const fetchmenuItems = async (): Promise<void> => {
      const response = await window.ipcRenderer.invoke("get-inventory-item", {
        data: {},
      });

      console.log(response.data, "response");
      setMenuItems(response?.data || []);
    };
    fetchmenuItems();
  }, [isOpen, isCreateModalOpen, isEdited, isDeleted]);

  useEffect(() => {
    const height = tableRef.current?.clientHeight;
    setTableHeight(height);
  }, []);

  return (
    <div className="min-h-screen p-10 relative w-full ">
      <div
        className={`mx-auto  p-8 rounded-md absolute top-0 w-full h-full z-10 transition-all duration-500 pl-20 pt-20 ${
          isShowRecord ? "left-full" : "left-0"
        }`}
        ref={tableRef}
      >
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-5">Inventory List</h1>
          <Button onPress={() => setIsCreateModalOpen(true)} color="primary">
            Create
          </Button>
        </div>
        <Table className="min-w-full table-auto border-collapse">
          <TableHeader className="bg-gray-100">
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("_id")}
            >
              SL{" "}
              {sortConfig.key === "_id" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>

            <TableColumn className="border p-2 text-left cursor-pointer">
              Image
            </TableColumn>

            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name
              {sortConfig.key === "name" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("category")}
            >
              Category
              {sortConfig.key === "category" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>

            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("currentStock")}
            >
              Current Stock
              {sortConfig.key === "currentStock" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("unitType")}
            >
              Unit Type
              {sortConfig.key === "unitType" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("totalWasted")}
            >
              Total Wasted
              {sortConfig.key === "totalWasted" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("totalConsumed")}
            >
              Total Consumed
              {sortConfig.key === "totalConsumed" &&
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

                <TableCell className="border p-2">
                  <Image
                    src={item.image}
                    width={100}
                    height={100}
                    alt="image"
                    className="object-contain"
                  />
                </TableCell>
                <TableCell className="border p-2">{item.name}</TableCell>
                <TableCell className="border p-2">{item.category}</TableCell>
                <TableCell className="border p-2 text-center">
                  {item.currentStock}
                </TableCell>
                <TableCell className="border p-2 text-center">
                  {item.unitType || 0}
                </TableCell>
                <TableCell className="border p-2 text-center">
                  {item.totalWasted || 0}
                </TableCell>
                <TableCell className="border p-2 text-center">
                  {item.totalUtilized || 0}
                </TableCell>

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
                    <Tooltip
                      color={"secondary"}
                      content={"Record Usage"}
                      className="capitalize"
                    >
                      <Button
                        onPress={() => {
                          setIsShowRecord(true);
                          setSingleData(item);
                        }}
                        isIconOnly
                        color="success"
                      >
                        <RiRecordMailFill />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      color={"secondary"}
                      content={"View Usage"}
                      className="capitalize"
                    >
                      <Button
                        onPress={() => {
                          handleDelete(item);
                          setSingleData(item);
                        }}
                        isIconOnly
                        color="warning"
                      >
                        <IoMdAnalytics />
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
        {/* <div className="mt-5 flex justify-center space-x-2">
          {Array.from({
            length: Math.ceil(menuItems.length / itemsPerPage),
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
        </div> */}

        <Pagination
          // isCompact
          // initialPage={1}
          items={menuItems}
          totalItems={menuItems.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          // className="mt-5 flex justify-center space-x-2 p-0 mb-0 "
          // color="secondary"
          limit={itemsPerPage}
        />
      </div>

      <div
        className={`absolute top-0 w-full h-full transition-all duration-500 pl-20 pt-20 z-10 ${
          isShowRecord ? "left-0" : "left-full"
        }`}
        style={{ height: tableHeight + "px" }}
      >
        <RecordUsageOfInventory
          isShow={isShowRecord}
          setIsShow={setIsShowRecord}
          inventoryData={singleData}
          tableHeight={tableHeight}
        />
      </div>

      <CreateInventoryTrackingForm
        setIsShowModal={setIsCreateModalOpen}
        isShowModal={isCreateModalOpen}
      />
      <ShowInventoryTrackingDetail
        data={singleData}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />

      <EditInventoryTrackingForm
        // singleData={singleData}
        setIsShowModal={setIsEdited}
        data={singleData}
        isShowModal={isEdited}
      />
    </div>
  );
}
