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
  Pagination,
} from "@nextui-org/react";

import { Button } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import CreateMenuSubcategoryForm from "./CreateMenuSubcategoryForm";
import ShowMenuSubcategoryDetail from "./ShowMenuSubcategoryDetail";
import EditMenuSubcategoryForm from "./EditMenuSubcategoryForm";

export default function ViewAllMenuSubcategory(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof any;
    direction: "asc" | "desc";
  }>({
    key: "_id",
    direction: "asc",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const [singleData, setSingleData] = useState<any>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onOpenChange: onCreateModalOpenChange } = useDisclosure();

  // Initialize NeDB
  // const db = new NeDB<any>({ filename: "menuItems.db", autoload: true });

  const sortedmenuItems = useCallback((): any[] => {
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
    return sortedmenuItems().slice(offset, offset + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedmenuItems]);

  const handleSort = (key: keyof any): void => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = (pageNumber: number): void => {
    setCurrentPage(pageNumber - 1);
  };

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  const handleDetail = (data: any): void => {
    setSingleData(data);
    onOpen();
  };

  const handleDelete = (data: string): void => {
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
          "delete-menu-subcategory",
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
      const response = await window.ipcRenderer.invoke("get-menu-subcategory", {
        data: null,
      });

      console.log(response, "response");
      setMenuItems(response.data);
    };
    fetchmenuItems();
  }, [isOpen, isCreateModalOpen, isEdited, isDeleted]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-md rounded-md">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-5">Menu Subcategory List</h1>
          <Button onPress={() => setIsCreateModalOpen(true)} color="primary">
            Menu Subcategory
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
              onClick={() => handleSort("slug")}
            >
              Slug
              {sortConfig.key === "slug" &&
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
                <TableCell className="border p-2">{item.category}</TableCell>
                <TableCell className="border p-2">{item.slug}</TableCell>

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
        <Pagination
          // isCompact
          showControls
          initialPage={1}
          total={Math.ceil(menuItems.length / itemsPerPage)}
          onChange={(page) => handlePageClick(page)}
          className="mt-5 flex justify-center space-x-2 !p-0 !mb-0"
          color="secondary"
          siblings={2}
          boundaries={2}
        />
      </div>

      <CreateMenuSubcategoryForm
        setIsShowModal={setIsCreateModalOpen}
        isShowModal={isCreateModalOpen}
      />
      <ShowMenuSubcategoryDetail
        data={singleData}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />

      <EditMenuSubcategoryForm
        // singleData={singleData}
        setIsShowModal={setIsEdited}
        data={singleData}
        isShowModal={isEdited}
      />
    </div>
  );
}
