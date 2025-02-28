import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DiscountForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [targetData, setTargetData] = useState<any>(null);
  const [discounts, setDiscounts] = useState<any>({
    percentageDiscountActive: false,
    percentageDiscount: 0,
    orderAboveForPercentageDiscount: 0,

    flatDiscountActive: false,
    flatDiscount: 0,
    orderAboveForFlatDiscount: 0,

    itemDiscountsActive: false,
    itemDiscounts: [{ id: "item1", buy: 2, free: 1 }],

    happyHourActive: false,
    happyHourStart: "17:00",
    happyHourEnd: "19:00",
    happyHourDiscount: 0,

    loyaltyDiscountActive: false,
    loyaltyDiscount: 0,

    promoCodeActive: false,
    promoCode: "",
    promoCodeDiscount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDiscounts((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleItemDiscountChange = (
  //   index: number,
  //   field: keyof ItemDiscount,
  //   value: number | string
  // ) => {
  //   setDiscounts((prev: any) => {
  //     const updatedItemDiscounts = [...prev.itemDiscounts];
  //     updatedItemDiscounts[index][field] = value;
  //     return { ...prev, itemDiscounts: updatedItemDiscounts };
  //   });
  // };

  const handleSubmit = async () => {
    setLoading(true);
    let receiveData: any;

    console.log(discounts, "discounts", {
      _id: targetData,
      updateData: discounts,
    });

    try {
      if (targetData) {
        receiveData = await window.ipcRenderer.invoke("update-discount", {
          data: { _id: targetData, updateData: discounts },
        });
      } else {
        receiveData = await window.ipcRenderer.invoke("create-discount", {
          data: discounts,
        });
      }

      if (receiveData.success) {
        Swal.fire({
          title: "Success!",
          text: receiveData.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while saving the discounts?.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchDiscounts = async () => {
      const response = await window.ipcRenderer.invoke("get-discount", {
        data: null,
      });

      console.log(response, "discount");

      if (response?.success && response?.data?.length > 0) {
        setDiscounts(response.data[0]);
        setTargetData(response.data[0]?._id || null);
      }
    };
    fetchDiscounts();
  }, [loading]);

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">Manage Discounts</h1>

      {/* Percentage Discount */}
      <div className="mb-8 border-b pb-5 ">
        <h2 className="text-lg font-semibold text-black">
          Percentage Discount
        </h2>
        <p className="mb-3 text-black text-sm">
          Set a percentage discount for orders above a certain value.
        </p>
        <div className="flex items-center gap-4">
          <label className="text-black">
            <Checkbox
              type="checkbox"
              name="percentageDiscountActive"
              isSelected={discounts?.percentageDiscountActive}
              onChange={handleChange}
            />
            Enable
          </label>
          <Input
            type="number"
            name="percentageDiscount"
            label="Enter Percentage Discount"
            value={discounts?.percentageDiscount}
            onChange={handleChange}
            className="rounded p-2"
            placeholder="Percentage (%)"
          />
          <Input
            type="number"
            name="orderAboveForPercentageDiscount"
            label="Enter Order Above Discount"
            value={discounts?.orderAboveForPercentageDiscount}
            onChange={handleChange}
            className="rounded p-2"
            placeholder="Order Above ($)"
          />
        </div>
      </div>

      {/* Flat Discount */}
      <div className="mb-8 border-b pb-5 ">
        <h2 className="text-lg font-semibold text-black">Flat Discount</h2>
        <p className="mb-3 text-black text-sm">
          Set a flat discount for orders above a certain value.
        </p>
        <div className="flex items-center gap-4">
          <label className="text-black">
            <Checkbox
              type="checkbox"
              name="flatDiscountActive"
              isSelected={discounts?.flatDiscountActive}
              onChange={handleChange}
            />
            Enable
          </label>
          <Input
            type="number"
            name="flatDiscount"
            label="Enter Flat Discount"
            value={discounts?.flatDiscount}
            onChange={handleChange}
            className="rounded p-2"
            placeholder="Flat Discount ($)"
          />
          <Input
            type="number"
            name="orderAboveForFlatDiscount"
            label="Enter Order Above Number"
            value={discounts?.orderAboveForFlatDiscount}
            onChange={handleChange}
            className="rounded p-2"
            placeholder="Order Above ($)"
          />
        </div>
      </div>

      {/* Happy Hour Discount */}
      <div className="mb-8 border-b pb-5 ">
        <h2 className="text-lg font-semibold text-black">
          Happy Hour Discount
        </h2>
        <p className="mb-3 text-black text-sm">
          Set a discount for specific times (e.g., 5 PM to 7 PM).
        </p>

        <div className="flex items-center gap-4">
          <label className="text-black">
            <Checkbox
              type="checkbox"
              name="happyHourActive"
              isSelected={discounts?.happyHourActive}
              onChange={handleChange}
            />
            Enable
          </label>
          <Input
            type="time"
            name="happyHourStart"
            value={discounts?.happyHourStart}
            onChange={handleChange}
            className="rounded p-2"
          />
          <Input
            type="time"
            name="happyHourEnd"
            value={discounts?.happyHourEnd}
            onChange={handleChange}
            className="rounded p-2"
          />
          <Input
            type="number"
            name="happyHourDiscount"
            label="Enter Discount"
            value={discounts?.happyHourDiscount}
            onChange={handleChange}
            className="rounded p-2"
            placeholder="Percentage (%)"
          />
        </div>
      </div>

      {/* Loyalty Discount */}
      <div className="mb-8 border-b pb-5 ">
        <h2 className="text-lg font-semibold text-black">Loyalty Discount</h2>
        <p className="mb-3 text-black text-sm">
          Set a percentage discount for repeat customers.
        </p>

        <div className="flex items-center gap-4">
          <label className="text-black">
            <Checkbox
              type="checkbox"
              name="loyaltyDiscountActive"
              isSelected={discounts?.loyaltyDiscountActive}
              onChange={handleChange}
            />
            Enable
          </label>
          <Input
            type="number"
            name="loyaltyDiscount"
            label="Enter Percentage Discount"
            value={discounts?.loyaltyDiscount}
            onChange={handleChange}
            className="rounded p-2"
            placeholder="Percentage (%)"
          />
        </div>
      </div>

      {/* Promo Code Discount */}
      <div className="mb-8 border-b pb-5 ">
        <h2 className="text-lg font-semibold text-black">Promo Code</h2>
        <div className="flex items-center gap-4">
          <label className="text-black ">
            <Checkbox
              type="checkbox"
              name="promoCodeActive"
              isSelected={discounts?.promoCodeActive}
              onChange={handleChange}
            />
            Enable
          </label>
          <div className="w-full">
            <h2 className="text-lg font-semibold">Promo Codes</h2>
            <p className="mb-3 text-black text-sm">
              Set a promo code and its associated discount.
            </p>
            <div className="grid grid-cols-2 w-full gap-3">
              <Input
                label="Promo Code"
                name="promoCode"
                type="text"
                value={discounts?.promoCode}
                onChange={handleChange}
              />
              <Input
                label="Promo Code Discount"
                name="promoDiscount"
                type="number"
                value={discounts?.promoCodeDiscount}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block ml-auto"
        onClick={handleSubmit}
        disabled={loading}
      >
        Save Discounts
      </button>
    </div>
  );
};

export default DiscountForm;
