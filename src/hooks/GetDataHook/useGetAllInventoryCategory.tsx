import { useEffect, useState } from "react";

function useGetAllInventoryCategory({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any {
  const [inventoryCategories, setInventoryCategories] = useState<any>([]);

  useEffect(() => {
    const fetchInventoryCategories = async () => {
      try {
        setLoading(true); // Assuming setLoading is used to show a loading indicator
        const response: any = await window.ipcRenderer.invoke(
          "get-inventory-category",
          {
            data: null,
          }
        );
        if (response.success) {
          setInventoryCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching inventoryCategories:", error);
        throw new Error("Failed to fetch inventoryCategories");
      } finally {
        setLoading(false); // Reset loading state after the fetch
      }
    };

    fetchInventoryCategories();
  }, [isDeleted, isEdited, isShowModal]);

  return inventoryCategories;
}

export default useGetAllInventoryCategory;
