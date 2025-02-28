import useGetAllCurrency from "../../../hooks/GetDataHook/useGetAllCurrency";
import CompanyProfile from "./ApplicationSettingsPage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function InfoAndCurrency() {
  const [currencyData, setCurrencyData] = useState<any>({});
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);

  const currency = useGetAllCurrency({});

  useEffect(() => {
    const fetchCurrency = async () => {
      const storedCurrency: any = localStorage.getItem("currency");

      if (storedCurrency) {
        const parseData: any = JSON.parse(storedCurrency);
        setCurrencyData(parseData);
        setSelectedCurrency(parseData?.code);
      }
    };

    fetchCurrency();
  }, []);

  const handleChange = async (data: any) => {
    if (data) {
      setSelectedCurrency(data.name);
      setCurrencyData(data);

      // Update localStorage to persist selected currency
      localStorage.setItem("currency", JSON.stringify(data));

      toast.success("Currency updated successfully!");
    } else {
      toast.error("Currency not found!");
    }
  };

  console.log(currency, "currency");

  return (
    <>
      <CompanyProfile />
      <div className="grid grid-cols-2 gap-4 justify-start px-5 relative z-50">
        <Autocomplete
          aria-label="Select an employee"
          classNames={{
            base: "max-w-xs",
            listboxWrapper: "max-h-[320px]",
            selectorButton: "text-default-500",
          }}
          defaultItems={currency}
          value={selectedCurrency}
          radius="full"
          variant="bordered"
          menuTrigger="manual"
          onChange={handleChange}
        >
          {(item: any) => (
            <AutocompleteItem key={item.name}>
              {item.name} - {item.code} ({item.symbol})
            </AutocompleteItem>
          )}
        </Autocomplete>

        <ul>
          <h2 className="text-lg font-semibold text-black border-b">
            Default Currency
          </h2>
          <li>Currency: {currencyData?.name}</li>
          <li>Symbol: {currencyData?.symbol}</li>
          <li>Code: {currencyData?.code}</li>
        </ul>
      </div>
    </>
  );
}
