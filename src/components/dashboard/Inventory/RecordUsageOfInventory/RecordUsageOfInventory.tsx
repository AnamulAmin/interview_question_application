import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";

import { Button } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import CellImage from "../../../../shared/ImageComponents/CellImage";
import { IoIosArrowRoundBack } from "react-icons/io";
import AddInventoryToTheItem from "./AddInventoryToTheItem";

export default function RecordUsageOfInventory({
  isShow,
  setIsShow,
  inventoryData,
  tableHeight,
}: any): JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any | null>(null);
  const itemsPerPage = 20;
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof any;
    direction: "asc" | "desc";
  }>({
    key: "_id",
    direction: "asc",
  });

  // Initialize NeDB
  // const db = new NeDB<any>({ filename: "menuItems.db", autoload: true });

  const sortedMenuItems = useCallback((): any[] => {
    const sortedData = [...menuItems];
    sortedData.sort((a, b) => {
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
    return sortedMenuItems().slice(offset, offset + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedMenuItems]);

  const handleSort = (key: keyof any): void => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchMenuItems = async (): Promise<void> => {
      const response = await window.ipcRenderer.invoke("get-menu-items", {
        data: {},
      });

      console.log(response, "response");
      setMenuItems(response.data || []);
    };
    fetchMenuItems();
  }, [isShow, setIsShow]);

  return (
    <div className="min-h-screen p-10 " style={{ height: tableHeight + "px" }}>
      <div className=" mx-auto bg-white p-8 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-5 flex items-center gap-4">
          <Button onPress={() => setIsShow(false)}>
            <IoIosArrowRoundBack size={30} />
          </Button>{" "}
          Menu Item List
        </h1>
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
              Name{" "}
              {sortConfig.key === "name" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>

            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("price")}
            >
              Price{" "}
              {sortConfig.key === "price" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("discout")}
            >
              Discount
              {sortConfig.key === "discout" &&
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
                  {<CellImage src={item.image} />}
                </TableCell>
                <TableCell className="border p-2">{item.name}</TableCell>
                <TableCell className="border p-2">{item.price}</TableCell>
                <TableCell className="border p-2">
                  {item.discountPrice}
                </TableCell>

                <TableCell className="border p-2">
                  <div className="flex space-x-2 justify-end">
                    <Tooltip
                      color={"primary"}
                      content={"View"}
                      className="capitalize"
                    >
                      <Button
                        // onPress={() => handleShowDetail(item)}
                        color="primary"
                        isIconOnly
                        onPress={() => {
                          setShowForm(true);
                          setSingleData(item);
                        }}
                      >
                        <FaPlus />
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
        </div>
      </div>
      <AddInventoryToTheItem
        setIsShowModal={setShowForm}
        isShowModal={showForm}
        inventoryData={inventoryData}
        menuItemData={singleData}
      />
    </div>
  );
}
