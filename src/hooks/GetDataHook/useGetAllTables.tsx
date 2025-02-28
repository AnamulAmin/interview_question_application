import { useEffect, useState } from "react";

function useGetAllTables({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any {
  const [tables, setTables] = useState<any>([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true); // Optional: manage a loading state
        const response = await window.ipcRenderer.invoke("get-table", {
          data: null,
        });
        console.log(response, "response table");
        if (response.success) {
          setTables(response.data);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
        throw new Error("Failed to fetch tables");
      } finally {
        setLoading(false); // Optional: stop the loading state
      }
    };
    fetchTables();
  }, [isDeleted, isEdited, isShowModal]);

  return tables;
}

export default useGetAllTables;
