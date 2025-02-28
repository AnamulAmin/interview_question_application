import { useEffect, useState } from "react";

interface FetchInventoriesResponse {
  success: boolean;
  data: any;
}

function useGetAllInventories({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
  filters = {},
}: any): any {
  const [inventories, setInventories] = useState<any>([]);

  useEffect(() => {
    const fetchInventories = async () => {
      console.log(filters, "filters");
      try {
        setLoading(true);
        const response: FetchInventoriesResponse =
          await window.ipcRenderer.invoke("get-inventory-item", {
            data: filters,
          });
        if (response.success) {
          setInventories(response.data);
        }
      } catch (error) {
        console.error("Error fetching inventories:", error);
        throw new Error("Failed to fetch inventories");
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, [
    isDeleted,
    isEdited,
    isShowModal,
    filters?.search,
    filters?.isShortList,
    filters?.selection,
  ]);

  return inventories;
}

export default useGetAllInventories;
