import { useEffect, useState } from "react";
import axios from "axios";

// Define the type for the RestockFrequency item (adjust fields as needed)
interface RestockFrequency {
  id: string;
  name: string;
  // Add other fields based on the structure of your RestockFrequency data
}

function useGetAllRestockFrequency({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any {
  const [RestockFrequency, setRestockFrequency] = useState<RestockFrequency[]>(
    []
  );

  useEffect(() => {
    const fetchRestockFrequency = async () => {
      try {
        setLoading(true); // Optional: manage a loading state
        const res = await axios.get("/apis/RestockFrequency.json");

        if (res.status === 200 || res.status === 201) {
          setRestockFrequency(res.data);
        }
      } catch (error) {
        console.error("Error fetching RestockFrequency:", error);

        throw new Error("Failed to fetch RestockFrequency");
      } finally {
        setLoading(false); // Optional: stop the loading state
      }
    };

    fetchRestockFrequency();
  }, [isDeleted, isEdited, isShowModal]);

  return RestockFrequency;
}

export default useGetAllRestockFrequency;
