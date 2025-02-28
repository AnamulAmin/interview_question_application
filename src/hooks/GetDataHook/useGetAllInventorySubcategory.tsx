import { useEffect, useState } from "react";

function useGetAllInventorySubcategory({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any {
  const [inventorySubcategories, setInventorySubcategories] = useState<any>([]);

  useEffect(() => {
    const fetchInventorySubcategories = async () => {
      try {
        setLoading(true); // Assuming setLoading is used to show a loading indicator
        const response: any = await window.ipcRenderer.invoke(
          "get-inventory-subcategory",
          {
            data: null,
          }
        );
        if (response.success) {
          setInventorySubcategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching inventorySubcategories:", error);
        throw new Error("Failed to fetch inventorySubcategories");
      } finally {
        setLoading(false); // Reset loading state after the fetch
      }
    };

    fetchInventorySubcategories();
  }, [isDeleted, isEdited, isShowModal]);

  return inventorySubcategories;
}

export default useGetAllInventorySubcategory;
