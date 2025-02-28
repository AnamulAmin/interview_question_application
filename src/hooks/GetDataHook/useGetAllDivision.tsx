import { useEffect, useState } from "react";

interface FetchDivisionResponse {
  success: boolean;
  data: any;
}

function useGetAllDivision({
  isEdited = false,
  isDeleted = false,
  isShowModal = false,
  role,
}: any): any {
  const [divisions, setDivisions] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDivision = async () => {
      try {
        setLoading(true); // Assuming setLoading is used to show a loading indicator
        const response: FetchDivisionResponse = await window.ipcRenderer.invoke(
          "get-division",
          { data: { role } }
        );
        if (response.success) {
          setDivisions(response.data);
        }
      } catch (error) {
        console.error("Error fetching division:", error);
        throw new Error("Failed to fetch division");
      } finally {
        setLoading(false); // Reset loading state after the fetch
      }
    };

    fetchDivision();
  }, [isDeleted, isEdited, isShowModal, role]);

  return { divisions, loading };
}

export default useGetAllDivision;
