import { useEffect, useState } from "react";

function useGetExpanseData({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
  query,
}: any): any {
  const [expenseData, setExpenseData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true); // Optional: manage a loading state
        const response = await window.ipcRenderer.invoke("get-table", {
          data: { ...query },
        });
        console.log(response, "response table");
        if (response.success) {
          setExpenseData(response.data);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
        throw new Error("Failed to fetch tables");
      } finally {
        setLoading(false); // Optional: stop the loading state
      }
    };

    // fetchTables();
  }, [isDeleted, isEdited, isShowModal]);

  return expenseData;
}

export default useGetExpanseData;
