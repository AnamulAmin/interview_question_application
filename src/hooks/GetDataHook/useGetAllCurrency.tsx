import { useEffect, useState } from "react";
import axios from "axios";

// Define types for the hook parameters and currency data
interface CurrencyData {
  // Adjust these fields based on the actual shape of the currency data
  id: string;
  name: string;
  code: string;
  symbol: string;
}

function useGetAllCurrency({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any[] {
  const [currency, setCurrency] = useState<CurrencyData[]>([]);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        setLoading(true); // Assuming setLoading is used to show a loading indicator
        const res = await axios.get("/apis/currency.json");

        if (res.status === 200 || res.status === 201) {
          setCurrency(res.data);
        }
      } catch (error) {
        console.error("Error fetching currency:", error);
        throw new Error("Failed to fetch currency");
      } finally {
        setLoading(false); // Reset loading state after the fetch
      }
    };

    fetchCurrency();
  }, [isDeleted, isEdited, isShowModal]);

  return currency;
}

export default useGetAllCurrency;
