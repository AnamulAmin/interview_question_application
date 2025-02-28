import { useEffect, useState } from "react";

function useGetAllFloors({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any {
  const [floors, setFloors] = useState<any>([]);

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        setLoading(true); // Optional: manage a loading state
        const response = await window.ipcRenderer.invoke("get-floor", {
          data: null,
        });
        console.log(response, "response table");
        if (response.success) {
          setFloors(response.data);
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
        throw new Error("Failed to fetch floors");
      } finally {
        setLoading(false); // Optional: stop the loading state
      }
    };

    fetchFloors();
  }, [isDeleted, isEdited, isShowModal]);

  return floors;
}

export default useGetAllFloors;
