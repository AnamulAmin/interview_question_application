import { useState, useEffect, useCallback } from "react";
import { FiEdit } from "react-icons/fi";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Switch,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";

import { Button } from "@nextui-org/react";

import SetAttendance from "./SetAttendance";
import moment from "moment";
import { useParams } from "react-router-dom";

export default function AttendanceInfo(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 15;
  const [attendanceItem, setAttendanceItem] = useState<any[]>([]);
  const { employeeId } = useParams();
  const [sortConfig, setSortConfig] = useState<{
    key: any;
    direction: "asc" | "desc";
  }>({
    key: "_id",
    direction: "asc",
  });
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const [singleData, setSingleData] = useState<any>(null);
  // const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onOpenChange: onCreateModalOpenChange } = useDisclosure();

  // Initialize NeDB
  // const db = new NeDB<MenuType>({ filename: "attendanceItem?.db", autoload: true });

  const sortedattendanceItem = useCallback((): any => {
    const sortedData = [...attendanceItem];
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
  }, [attendanceItem, sortConfig]);

  const paginatedData = useCallback((): any => {
    const offset = currentPage * itemsPerPage;
    return sortedattendanceItem().slice(offset, offset + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedattendanceItem]);

  const handleSort = (key: any): any => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = (pageNumber: number): any => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (data: any): any => {
    setSingleData(data);
    setIsEdited(true);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await window.ipcRenderer.invoke("get-attendance-info", {
        data: { employeeId: employeeId },
      });
      const responseSingle = await window.ipcRenderer.invoke(
        "get-single-employee",
        {
          data: { employeeId: employeeId },
        }
      );

      console.log(response, "response", responseSingle, "resonse single");
      setAttendanceItem(response.data);
      setSingleData(responseSingle.data);
    };
    fetchData();
  }, [employeeId]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto ">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/employ_attendance">Attendance</BreadcrumbItem>
          <BreadcrumbItem>{singleData?.fullName}</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-5">
            {singleData?.fullName} Attendance Info
          </h1>
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
              onClick={() => handleSort("employeeId")}
            >
              Full Name
              {sortConfig.key === "employeeId" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("fullName")}
            >
              Full Name
              {sortConfig.key === "fullName" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Full Name
              {sortConfig.key === "email" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>
            <TableColumn
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("phone")}
            >
              Phone
              {sortConfig.key === "phone" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableColumn>

            <TableColumn className="border p-2 text-right">Action</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedData().map((item: any, index: number) => (
              <TableRow key={item?._id} className="border-b">
                <TableCell className="border p-2">
                  {index + 1 + currentPage * itemsPerPage}
                </TableCell>

                <TableCell className="border p-2">{item?.fullName}</TableCell>
                <TableCell className="border p-2">{item?.email}</TableCell>
                <TableCell className="border p-2">{item?.phone}</TableCell>
                <TableCell className="border p-2">{item?.employeeId}</TableCell>

                <TableCell className="border p-2">
                  <div className="flex space-x-2 justify-end">
                    <Tooltip
                      color={"secondary"}
                      content={"Attendance"}
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
                      color={"success"}
                      content={"Is Attended"}
                      className="capitalize"
                    >
                      <Switch
                        isSelected={moment(item?.attendanceDate).isSame(
                          moment().format("DD-MM-YYYY")
                        )}
                        color="success"
                      />
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
            length: Math.ceil(attendanceItem?.length / itemsPerPage),
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

      <SetAttendance
        // singleData={singleData}
        setIsShowModal={setIsEdited}
        data={singleData}
        isShowModal={isEdited}
      />
    </div>
  );
}
