import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  Table,
  TableColumn,
  TableCell,
  TableRow,
  TableBody,
  TableHeader,
} from "@nextui-org/react";
import AddCommissionSettings from "./forms/AddCommissionSettings";
import { FaSearch } from "react-icons/fa";
import EditCommissionSettings from "./forms/EditCommissionSettings";

const CommissionSettingsPage: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<any>(null);
  const data = [
    { id: 1, designation: "Chef", commission: "2%" },
    { id: 2, designation: "Waiter", commission: "15%" },
    { id: 3, designation: "Kitchen Manager", commission: "8%" },
    { id: 4, designation: "HRM", commission: "10%" },
    { id: 5, designation: "Accounts", commission: "10%" },
    { id: 6, designation: "Counter Server", commission: "2%" },
  ];

  const handleEdit = (data: any): void => {
    setSingleData(data);
    setIsEditModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="shadow-lg p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Commission Settings</h1>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Payroll Commission Settings</h2>
          <div className="flex  w-1/2">
            <Input
              placeholder="Search by Designation"
              type="search"
              color="primary"
            />

            <Button
              onPress={() => setIsShowModal(true)}
              color="success"
              className="ml-2 w-[200px]"
            >
              Add Commission
            </Button>
          </div>
        </div>

        <Table
          aria-label="Commission Table"
          bordered
          shadow={false}
          css={{ height: "auto", minWidth: "100%" }}
        >
          <TableHeader>
            <TableColumn>SL</TableColumn>
            <TableColumn>DESIGNATION</TableColumn>
            <TableColumn>COMMISSION</TableColumn>
            <TableColumn>ACTION</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.designation}</TableCell>
                <TableCell>{item.commission}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    color="secondary"
                    onPress={() => handleEdit(item)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddCommissionSettings
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
      />
      <EditCommissionSettings
        isShowModal={isEditModal}
        setIsShowModal={setIsEditModal}
        data={singleData}
      />
    </div>
  );
};

export default CommissionSettingsPage;
