import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@nextui-org/react";

const KitchenSettingDashboard: React.FC = () => {
  const [refreshTime, setRefreshTime] = useState<number>(45);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setRefreshTime(value);
    }
  };

  const handleSave = () => {
    setIsSaving(true);

    // Simulating an API call to save the refresh time
    setTimeout(() => {
      alert(`Refresh time set to ${refreshTime} seconds.`);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="text-xl font-bold">
          Kitchen Setting Dashboard
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Kitchen Refresh Time in Seconds *
            </label>
            <Input
              type="number"
              value={refreshTime}
              onChange={handleInputChange}
              className="w-full"
              min={0}
              placeholder="Enter refresh time in seconds"
            />
          </div>
        </CardBody>
        <CardFooter className="flex justify-end space-x-2">
          <Button color="primary" onPress={handleSave} isDisabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default KitchenSettingDashboard;
