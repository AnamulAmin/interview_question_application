import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export default function ItemCard({ data }: any) {
  const [arrayData, setArrayData] = useState<any[]>([]);

  useEffect(() => {
    const newArrayData: any[] = Object.entries(data).map(
      ([key, value]: any): any => ({
        name: key,
        value,
      })
    );
    const imageIndex = newArrayData.findIndex(
      (item: any) => item.name === "image"
    );
    const IdIndex = newArrayData.findIndex((item: any) => item.name === "_id");
    const createdAtIndex = newArrayData.findIndex(
      (item: any) => item.name === "createdAt"
    );
    const updatedAtIndex = newArrayData.findIndex(
      (item: any) => item.name === "updatedAt"
    );
    const inventoriesIndex = newArrayData.findIndex(
      (item: any) => item.name === "inventories"
    );
    delete newArrayData[inventoriesIndex];
    delete newArrayData[imageIndex];
    delete newArrayData[IdIndex];
    delete newArrayData[createdAtIndex];
    delete newArrayData[updatedAtIndex];
    setArrayData(newArrayData);
  }, [data]);

  const formateName = (name: string) => {
    switch (name) {
      case "isAvailable":
        return "Available";

      case "preparationTime":
        return "Preparation Time";

      default:
        return name.replaceAll("_", " ");
    }
  };

  return (
    <Card
      shadow="md"
      className="w-full max-w-lg bg-gray-300 text-black p-4 rounded-xl border-2  shadow-xl border-gray-300 hover:bg-gray-700 hover:text-white "
      isPressable
    >
      {/* Body */}
      <CardBody className="space-y-6">
        {/* Image Section */}
        <div className="w-full flex justify-center">
          <Image
            src={data.image}
            alt="Food Image"
            className="w-64 h-64 object-cover rounded-lg"
            isZoomed
          />
        </div>

        <div className="border-t border-gray-400 ">
          {/* Food Details List */}
          <Listbox aria-label="Food Details pb-4">
            {arrayData.map((item: any) => (
              <ListboxItem
                key={item.name}
                className="flex justify-between text-xl gap-3 w-full"
              >
                <span className=" capitalize mr-2 text-lg font-bold">
                  {formateName(item.name)}:
                </span>
                <span className="text-lg">
                  {Array.isArray(item.value)
                    ? item.value.join(", ")
                    : item.value.toString()}
                </span>
              </ListboxItem>
            ))}
          </Listbox>

          {/* Inventory List */}
          {data?.inventories?.length > 0 && (
            <div className=" text-lg border-t border-gray-400 pt-3">
              <h3 className="font-semibold mb-1">Inventory:</h3>
              {data.inventories.map((item: any, index: number) => (
                <p key={item.inventoryItemName} className="text-lg font-bold">
                  {index + 1}. {item.inventoryItemName} -{" "}
                  <span className="font-normal">
                    {item.usagePerItem} {item.unitType}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
