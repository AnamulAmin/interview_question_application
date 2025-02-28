import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Card,
  Select,
  Switch,
  Textarea,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";

interface Settings {
  appTitle: string;
  storeName: string;
  address: string;
  email: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  discountType: string;
  discountRate: number;
  serviceCharge: number;
  vatPercentage: number;
  gstVat: string;
  showVat: boolean;
  currency: string;
  footerText: string;
}

const ApplicationSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    appTitle: "",
    storeName: "",
    address: "",
    email: "",
    phone: "",
    openingTime: "",
    closingTime: "",
    discountType: "Percentage",
    discountRate: 0,
    serviceCharge: 0,
    vatPercentage: 15,
    gstVat: "",
    showVat: true,
    currency: "USD",
    footerText: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await window.ipcRenderer.invoke("get-settings");
      if (response.success) {
        setSettings(response.data || {});
      }
    } catch (error) {
      toast.error("Failed to load settings");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(settings, "settings");
    try {
      const response = await window.ipcRenderer.invoke("update-settings", {
        data: settings,
      });
      if (response.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(response.message || "Failed to update settings");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleChange = (
    field: keyof Settings,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="shadow-lg p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Application Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="appTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Application Title *
            </label>
            <Input
              id="appTitle"
              value={settings.appTitle}
              onChange={(e) => handleChange("appTitle", e.target.value)}
              fullWidth
            />
          </div>

          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-gray-700"
            >
              Store Name
            </label>
            <Input id="storeName" defaultValue="Dhaka Restaurant" fullWidth />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <Textarea
              id="address"
              defaultValue="98 Green Road, Farmgate, Dhaka-1215."
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input id="email" defaultValue="bdtask@gmail.com" fullWidth />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <Input id="phone" defaultValue="0123456789" fullWidth />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="openingTime"
                className="block text-sm font-medium text-gray-700"
              >
                Opening Time
              </label>
              <Input id="openingTime" defaultValue="10:00 AM" fullWidth />
            </div>

            <div>
              <label
                htmlFor="closingTime"
                className="block text-sm font-medium text-gray-700"
              >
                Closing Time
              </label>
              <Input id="closingTime" defaultValue="9:00 PM" fullWidth />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="discountType"
                className="block text-sm font-medium text-gray-700"
              >
                Discount Type
              </label>
              <Select
                id="discountType"
                defaultValue="Percentage"
                options={["Percentage", "Fixed"]}
                fullWidth
              />
            </div>

            <div>
              <label
                htmlFor="discountRate"
                className="block text-sm font-medium text-gray-700"
              >
                Discount Rate
              </label>
              <Input
                id="discountRate"
                defaultValue="0.000"
                type="number"
                fullWidth
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="serviceCharge"
              className="block text-sm font-medium text-gray-700"
            >
              Service Charge
            </label>
            <Input
              id="serviceCharge"
              defaultValue="0.00"
              type="number"
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="vat"
                className="block text-sm font-medium text-gray-700"
              >
                VAT Setting (%)
              </label>
              <Input id="vat" defaultValue="15.00" type="number" fullWidth />
            </div>

            <div>
              <label
                htmlFor="gst"
                className="block text-sm font-medium text-gray-700"
              >
                GST/VAT
              </label>
              <Input id="gst" defaultValue="34182739872" fullWidth />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="showVat"
                isSelected={settings.showVat}
                onValueChange={(value) => handleChange("showVat", value)}
              />
              <label
                htmlFor="showVat"
                className="text-sm font-medium text-gray-700"
              >
                Show/Hide (VAT/TIN)
              </label>
            </div>

            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency
              </label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                fullWidth
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="footerText"
              className="block text-sm font-medium text-gray-700"
            >
              Footer Text
            </label>
            <Textarea
              id="footerText"
              value={settings.footerText}
              onChange={(e) => handleChange("footerText", e.target.value)}
              fullWidth
            />
          </div>

          <div className="text-right">
            <Button color="primary" type="submit">
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ApplicationSettingsPage;
