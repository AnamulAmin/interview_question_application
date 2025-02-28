import useGetAllFloors from "@/hooks/GetDataHook/useGetAllFloors";
import useGetAllTables from "@/hooks/GetDataHook/useGetAllTables";
import { Image } from "@nextui-org/image";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";

const Table = ({
  _id,
  type,
  text,
  positionX,
  positionY,
  onDragStop,
  image,
  table_name,
}: any) => {
  return (
    <Draggable
      defaultPosition={{ x: positionX || 0, y: positionY || 0 }} // Set the initial position of the element
      onStop={(e: any, data: any) => {
        console.log(data, "data");
        onDragStop(_id, { x: data.x, y: data.y });
      }}
    >
      <div className="w-20 h-20 bg-gray-100 border-2 cursor-pointer  flex flex-col justify-center items-center gap-1">
        {type === "text" ? (
          text
        ) : (
          <Image
            src={image}
            alt="Table"
            className="w-full h-full object-contain pointer-events-none "
            isZoomed
          />
        )}
        {table_name}
      </div>
    </Draggable>
  );
};

const TableSettingPage = () => {
  const [table, setTable] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState<any>("");
  const [singleFloorData, setSingleFloorData] = useState<any>(null);
  const [selectedTables, setSelectedTables] = useState<any>([]);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const tables: any = useGetAllTables({ isEdited });
  const floors: any = useGetAllFloors({});

  const handleDragStop = async (id: any, position: any) => {
    const currentTable = tables.find((table: any) => table.id === id);

    const receiveData = await window.ipcRenderer.invoke("update-table", {
      data: { positionX: position.x, positionY: position.y, _id: id },
    });

    if (receiveData.success && receiveData.data) {
      setIsEdited((prev: boolean) => !prev);
    }

    console.log(receiveData, "receiveData", {
      positionX: position.x,
      positionY: position.y,
    });
    setTable((prev: any) => ({
      ...prev,
      positionX: position.x,
      positionY: position.y,
    }));
  };

  useEffect(() => {
    if (selectedFloor) {
      const filteredFloor = floors.filter(
        (floor: any) => floor.floorName === selectedFloor
      );
      const filteredTables = tables.filter(
        (table: any) => table.floor.floorName === selectedFloor
      );
      setSingleFloorData(filteredFloor[0]);
      setSelectedTables(filteredTables || []);
    } else {
      const filteredTables = tables.filter(
        (table: any) => table.floor.floorName === floors[0].floorName
      );
      setSingleFloorData(floors[0]);
      setSelectedTables(filteredTables || []);
    }
  }, [selectedFloor, floors]);

  console.log(selectedTables, "selectedTables");

  return (
    <div className="p-4 w-full min-h-dvh bg-white">
      <div className="w-[800px] min-h-[800px]  mx-auto overflow-auto">
        <h1 className="text-xl mb-4">Table Setting Page</h1>
        <Select
          value={selectedFloor}
          selectedKeys={[selectedFloor]}
          onSelectionChange={(e: any) => setSelectedFloor(e.currentKey)}
          placeholder={"Selected Floor"}
          color="primary"
          label="Selected Floor"
          className="w-full mb-4 px-2"
        >
          {floors.map((option: any) => (
            <SelectItem key={option?.floorName}>{option.floorName}</SelectItem>
          ))}
        </Select>
        <div className="w-full  mx-auto h-fit bg-gray-100 border-2 border-black relative z-[1]">
          <div className="relative top-0 right-0 p-2  w-full z-[-1]">
            <img
              src={singleFloorData?.image}
              alt="Floor"
              width={200}
              height={200}
              className="w-full  object-contain pointer-events-none "
            />
          </div>
          {selectedTables.map((table: any) =>
            !table.position ? (
              <Table
                key={table._id}
                {...table}
                type={table.image ? "image" : "text"}
                onDragStop={handleDragStop}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default TableSettingPage;
