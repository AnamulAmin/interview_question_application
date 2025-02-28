import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Input,
  Button,
  Table,
  Modal,
  Pagination,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { TfiSearch } from "react-icons/tfi";
import { GoPlus } from "react-icons/go";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Department {
  _id: string;
  Role: string;
}

const EmployeeRole: React.FC = () => {
  // const axiosSecure = useAxiosSecure();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newDepartment, setNewDepartment] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;

  // useEffect(() => {
  //   fetchDepartments();
  // }, []);

  useEffect(() => {
    setFilteredDepartments(
      departments.filter((department) =>
        department.Role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, departments]);

  // const fetchDepartments = async () => {
  //   try {
  //     const response = await axiosSecure.get(`/departments/${branch}/get-all`);
  //     setDepartments(response.data);
  //     setFilteredDepartments(response.data);
  //   } catch (error) {
  //     console.error("Error fetching the departments!", error);
  //   }
  // };

  // const handleAddOrEditDepartment = async () => {
  //   try {
  //     if (editId) {
  //       // Update the department
  //       await axiosSecure.put(`/departments/put/${editId}`, {
  //         Role: newDepartment,
  //       });
  //       Swal.fire("Success", "Department updated successfully!", "success");
  //       setEditId(null);
  //     } else {
  //       // Add new department
  //       await axiosSecure.post("/departments/post", {
  //         Role: newDepartment,
  //         branch,
  //       });
  //       Swal.fire("Success", "Department added successfully!", "success");
  //     }
  //     fetchDepartments();
  //     setIsModalOpen(false);
  //     setNewDepartment("");
  //   } catch (error) {
  //     console.error("Error saving the department!", error);
  //     Swal.fire("Error", "There was an error saving the department!", "error");
  //   }
  // };

  const handleEdit = (id: string) => {
    const department = departments.find((dep) => dep._id === id);
    setEditId(id);
    setNewDepartment(department?.Role || "");
    setIsModalOpen(true);
  };

  // const handleRemove = (id: string) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       axiosSecure
  //         .delete(`/departments/delete/${id}`)
  //         .then(() => {
  //           fetchDepartments();
  //           Swal.fire(
  //             "Deleted!",
  //             "The department has been deleted.",
  //             "success"
  //           );
  //         })
  //         .catch((error) => {
  //           console.error("Error deleting the department!", error);
  //           Swal.fire(
  //             "Error!",
  //             "There was an error deleting the department.",
  //             "error"
  //           );
  //         });
  //     }
  //   });
  // };

  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
        <Button color="warning" onPress={() => setIsModalOpen(true)}>
          New
        </Button>
      </div>

      <Table aria-label="Departments Table">
        <TableHeader>
          <TableColumn>Departments</TableColumn>
          <TableColumn align="center">Action</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedDepartments.map((department) => (
            <TableRow key={department._id}>
              <TableCell>{department.Role}</TableCell>
              <TableCell>
                <div className="flex justify-center space-x-4">
                  <Button>edit</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        <Pagination
          total={Math.ceil(filteredDepartments.length / rowsPerPage)}
          initialPage={1}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        motionProps={{
          initial: { y: "-100%" }, // Drawer initially slides down from the top
          animate: { y: 0 }, // Slides into position
          exit: { y: "100%" }, // Slides back up when closed
          transition: { duration: 0.3, ease: "easeInOut" }, // Smooth animation
        }}
      >
        <ModalHeader>
          <p id="modal-title">
            {editId ? "Edit Department" : "Add Department"}
          </p>
        </ModalHeader>
        <ModalBody>
          <Input
            label="Department Name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="Enter department name"
            fullWidth
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          {/* <Button auto onPress={handleAddOrEditDepartment}>
            {editId ? "Save" : "Add"}
          </Button> */}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EmployeeRole;
