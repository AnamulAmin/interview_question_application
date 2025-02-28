import React, { useState } from "react";
import {
  Button,
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import CreateDepartment from "./Forms/CreateDepartment";
import useGetAllDepartment from "@/hooks/GetDataHook/useGetAllDepartment";
import Swal from "sweetalert2";
import EditDepartment from "./Forms/EditDepartment";
import useGetAllDesignation from "@/hooks/GetDataHook/useGetAllDesignation";
import CreateDesignation from "./Forms/CreateDesignation";
import EditDesignation from "./Forms/EditDesignation";

interface Department {
  id: number;
  position: string;
  details: string;
}

const Designation: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState<any>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [singleData, setSingleData] = useState<any>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [formData, setFormData] = useState<Department>({
    id: 0,
    position: "",
    details: "",
  });

  const { designations, loading } = useGetAllDesignation({
    isDeleted,
    isEdited: isEdit,
    isShowModal: isShowModal,
  });
  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEdit(true);
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
          "delete-designation",
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

  console.log(designations, "designations");
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="shadow-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4">Designation Management</h1>
          <Button color="primary" onPress={() => setIsShowModal(true)}>
            Create Department
          </Button>
        </div>

        <Table
          aria-label="Department Table"
          bordered
          shadow={false}
          css={{ height: "auto", minWidth: "100%" }}
        >
          <TableHeader>
            <TableColumn>SL</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Details</TableColumn>
            <TableColumn className="text-right">Action</TableColumn>
          </TableHeader>
          <TableBody>
            {designations.map((designation, index) => (
              <TableRow key={designation.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{designation.name}</TableCell>
                <TableCell>{designation.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      color="secondary"
                      onPress={() => handleEdit(designation)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onPress={() => handleDelete(designation)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!loading && designations?.length === 0 && (
          <div className="text-center p-4">No data available in table</div>
        )}

        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 mt-3 mb-6 rounded"></div>
            <div className="h-4 bg-gray-300 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-300 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
            <div className="h-4 bg-gray-200 mb-6 rounded"></div>
          </div>
        ) : null}
      </Card>

      <CreateDesignation
        setIsShowModal={setIsShowModal}
        isShowModal={isShowModal}
      />
      <EditDesignation
        setIsShowModal={setIsEdit}
        isShowModal={isEdit}
        data={singleData}
      />
    </div>
  );
};

export default Designation;
