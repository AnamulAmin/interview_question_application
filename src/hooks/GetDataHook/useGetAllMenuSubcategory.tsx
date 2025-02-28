import { useEffect, useState } from "react";

function useGetAllMenuSubcategory({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any[] {
  const [menuSubcategories, setMenuSubcategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenuSubcategories = async () => {
      try {
        setLoading(true); // Optionally, manage a loading state
        const response = await window.ipcRenderer.invoke(
          "get-menu-subcategory",
          {
            data: null,
          }
        );
        if (response.success) {
          setMenuSubcategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching menuSubcategories:", error);
        throw new Error("Failed to fetch menuSubcategories");
      } finally {
        setLoading(false); // Optionally, stop the loading state
      }
    };

    fetchMenuSubcategories();
  }, [isDeleted, isEdited, isShowModal]);

  return menuSubcategories;
}

export default useGetAllMenuSubcategory;
