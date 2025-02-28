import { Button, Checkbox, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VatForm() {
  const [vatPercentage, setVatPercentage] = useState<any>(0);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const handleSubmit = () => {
    console.log("vatPercentage", vatPercentage);

    const vatData = {
      vatPercentage,
      isEnabled,
    };
    localStorage.setItem("vat", JSON.stringify(vatData));
    toast.success("Vat updated successfully!");
  };

  useEffect(() => {
    const fetchVat = async () => {
      const storedVatData = localStorage.getItem("vat");
      const vatData = storedVatData ? JSON.parse(storedVatData) : null;

      if (vatData) {
        setVatPercentage(vatData?.vatPercentage);
        setIsEnabled(vatData?.isEnabled);
      }
    };

    fetchVat();
  }, []);

  return (
    <div className="mb-8 border-b pb-5">
      <h2 className="text-lg font-semibold text-black">VAT Percentage</h2>
      <p className="mb-3 text-black text-sm">
        Set the VAT percentage to be applied to orders.
      </p>
      <div className="flex items-center gap-4">
        <label className="text-black">
          <Checkbox
            isSelected={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
          />
          Enable
        </label>
        <Input
          type="number"
          name="vatPercentage"
          label="Enter VAT Percentage"
          value={vatPercentage}
          onChange={(e) => setVatPercentage(Number(e.target.value))}
          className="rounded p-2"
          placeholder="Percentage (%)"
        />
      </div>

      <Button
        onPress={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block ml-auto"
      >
        Save VAT
      </Button>
    </div>
  );
}
