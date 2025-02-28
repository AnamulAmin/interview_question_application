import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  Input,
  TableColumn,
  Button,
  Tooltip,
  Select,
  SelectItem,
} from "@nextui-org/react";
import useGetAllCandidates from "@/hooks/GetDataHook/useGetAllCandidates";
import CellImage from "@/shared/ImageComponents/CellImage";
import CandidateDetail from "./forms/CandidateDetail";
import Swal from "sweetalert2";
import { FaEye, FaSearch } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AddInterview from "./forms/AddInterview";
import EditInterview from "./forms/EditInterview";
import useDebounce from "@/hooks/useDebounce";
import { CiSearch } from "react-icons/ci";

const Interview: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any>(null); // Corrected type
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selection, setSelection] = useState<any>(null);
  const debouncedValue = useDebounce(search, 500);

  const candidates: any = useGetAllCandidates({
    isEdited,
    isDeleted,
    isShowModal: isCreateModalOpen,
    filters: { is_interviewed: true, search: debouncedValue, selection },
  });

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdited(true);
  };

  console.log(singleData, "singleData");

  const handleDetail = (data: any): void => {
    setSingleData(data);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (id: any): void => {
    Swal.fire({
      title: "Are you sure you want to remove ?",
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
          "update-candidate",
          {
            updateData: JSON.parse(JSON.stringify({ isSelected: false })),
            _id: id,
          }
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

  return (
    <div className="p-4 mt-16">
      <h1 className="text-2xl font-semibold mb-4"> Candidates Interview</h1>
      <div className="flex justify-between mb-4 gap-4">
        <Input
          type="text"
          label={
            <div className="flex items-center gap-2">
              <CiSearch size={20} /> <span>Search ...</span>
            </div>
          }
          // placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
          color="primary"
        />
        <Select
          value={selection}
          defaultSelectedKeys={[selection]}
          onSelectionChange={(e: any) => setSelection(e.currentKey)}
          label={"Select Selection"}
          className="w-1/3 h-full"
          color="secondary"
        >
          {[
            // { name: "Select Selection", value: "" },
            { name: "Selected", value: "Selected" },
            { name: "Not Selected", value: "Not Selected" },
            { name: "On Hold", value: "On Hold" },
          ].map((option: any) => (
            <SelectItem key={option.value}>{option.name}</SelectItem>
          ))}
        </Select>
        <Button
          onPress={() => setIsCreateModalOpen(true)}
          className={"w-1/3 py-7"}
          color="success"
        >
          Create Candidate Interview
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableColumn className=" p-2 text-left cursor-pointer ">
            Sl
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Image
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Candidate Id
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Name
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Interview Date
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Viva Marks
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Written Marks
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            MCQ Marks
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Total Marks
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Action
          </TableColumn>
        </TableHeader>
        <TableBody>
          {candidates.map((customer, index) => (
            <TableRow key={customer.id}>
              <TableCell className="border">
                {(currentPage - 1) * recordsPerPage + index + 1}
              </TableCell>
              <TableCell className="border">
                <CellImage src={customer.picture} alt="image" />
              </TableCell>
              <TableCell className="border">{customer.candidateId}</TableCell>
              <TableCell className="border">{customer.firstName}</TableCell>
              <TableCell className="border">
                {customer.interviewDate || 0}
              </TableCell>
              <TableCell className="border">
                {customer.viva_marks || 0}
              </TableCell>
              <TableCell className="border">
                {customer.written_total_marks || 0}
              </TableCell>
              <TableCell className="border">
                {customer.mcq_total_marks || 0}
              </TableCell>
              <TableCell className="border">
                {customer.total_marks || 0}
              </TableCell>
              <TableCell className="border">
                {/* <Button
                  onPress={() => handleDetail(customer)}
                  color="primary"
                  className="mr-3"
                >
                  Details
                </Button>
                <Button
                  onPress={() => handleEdit(customer)}
                  color="secondary"
                  className="mr-3"
                >
                  Edit
                </Button>
                <Button
                  onPress={() => handleDelete(customer._id)}
                  color="danger"
                >
                  Delete
                </Button> */}

                <div className="flex space-x-2 justify-end">
                  <Tooltip
                    color={"secondary"}
                    content={"View"}
                    className="capitalize"
                  >
                    <Button
                      onPress={() => handleDetail(customer)}
                      color="primary"
                      isIconOnly
                    >
                      <FaEye />
                    </Button>
                  </Tooltip>

                  {/* <Tooltip
                    color={"danger"}
                    content={"Edit"}
                    className="capitalize"
                  >
                    <Button
                      onPress={() => handleEdit(customer)}
                      color="secondary"
                      isIconOnly
                    >
                      <FiEdit />
                    </Button>
                  </Tooltip> */}

                  <Tooltip
                    color={"primary"}
                    content={"Delete"}
                    className="capitalize"
                  >
                    <Button
                      onPress={() => handleDelete(customer._id)}
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

      {/* <div className="flex justify-between items-center mt-4">
        <span>Total Records: {filteredcandidates.length}</span>
        <Pagination
          total={totalPages}
          initialPage={currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div> */}

      <CandidateDetail
        data={singleData}
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />

      <AddInterview
        setIsShowModal={setIsCreateModalOpen}
        isShowModal={isCreateModalOpen}
      />

      <EditInterview
        setIsShowModal={setIsEdited}
        data={singleData}
        isShowModal={isEdited}
      />
    </div>
  );
};

export default Interview;
