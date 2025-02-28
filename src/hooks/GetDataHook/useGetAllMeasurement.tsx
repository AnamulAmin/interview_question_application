import { useEffect, useState } from "react";
import axios from "axios";

// Define the type for the measurement data (adjust fields as needed)
interface Measurement {
  id: string;
  name: string;
  // Add any other fields that your measurement data contains
}

function useGetAllMeasurement({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): Measurement[] {
  const [measurement, setMeasurement] = useState<Measurement[]>([]);

  useEffect(() => {
    const fetchMeasurement = async () => {
      try {
        setLoading(true); // Optionally use setLoading to show a loading state
        const res = await axios.get("/apis/measurement.json");

        if (res.status === 200 || res.status === 201) {
          setMeasurement(res.data);
        }
      } catch (error) {
        console.error("Error fetching Measurement:", error);
        throw new Error("Failed to fetch Measurement");
      } finally {
        setLoading(false); // Reset the loading state after fetching
      }
    };

    fetchMeasurement();
  }, [isDeleted, isEdited, isShowModal]);

  return measurement;
}

export default useGetAllMeasurement;
