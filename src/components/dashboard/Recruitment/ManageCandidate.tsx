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
} from "@nextui-org/react";
import AddCandidate from "./forms/AddCandidate/AddCandidate";
import useGetAllCandidates from "@/hooks/GetDataHook/useGetAllCandidates";
import CellImage from "@/shared/ImageComponents/CellImage";
import CandidateDetail from "./forms/CandidateDetail";
import Swal from "sweetalert2";
import { FaEye } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface ThirdPartyCustomer {
  id: number;
  companyName: string;
  commission: string;
  address: string;
}

const ManageCandidate: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any>(null); // Corrected type
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const candidates: any = useGetAllCandidates({
    isEdited,
    isDeleted,
    isShowModal: isCreateModalOpen,
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
      title: "Are you sure you want to delete ?",
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
          "delete-candidate",
          {
            data: {
              _id: id,
            },
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
      <h1 className="text-2xl font-semibold mb-4">Third-Party candidates</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
          color="primary"
        />
        <Button onPress={() => setIsCreateModalOpen(true)} color="success">
          Create Third-Party Customer
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
            Email
          </TableColumn>
          <TableColumn className=" p-2 text-left cursor-pointer">
            Phone
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
              <TableCell className="border">{customer.email}</TableCell>
              <TableCell className="border">{customer.phone}</TableCell>
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

                  <Tooltip
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
                  </Tooltip>

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

      <AddCandidate
        setIsShowModal={setIsCreateModalOpen}
        isShowModal={isCreateModalOpen}
        setIsEdit={setIsEdited}
        singleEmployee={singleData}
        isEdit={isEdited}
      />

      <CandidateDetail
        data={singleData}
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />

      {/* <EditCandidate
        setIsShowModal={setIsEdited}
        data={singleData}
        isShowModal={isEdited}
      /> */}
    </div>
  );
};

export default ManageCandidate;
