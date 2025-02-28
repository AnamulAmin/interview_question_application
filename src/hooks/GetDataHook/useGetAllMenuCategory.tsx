import { useEffect, useState } from "react";

function useGetAllany({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any[] {
  const [menuCategories, setMenuCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenuCategories = async () => {
      try {
        setLoading(true); // Optionally, manage a loading state
        const response = await window.ipcRenderer.invoke("get-menu-category", {
          data: null,
        });
        if (response.success) {
          setMenuCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching menuCategories:", error);
        throw new Error("Failed to fetch menuCategories");
      } finally {
        setLoading(false); // Optionally, stop the loading state
      }
    };

    fetchMenuCategories();
  }, [isDeleted, isEdited, isShowModal]);

  return menuCategories;
}

export default useGetAllany;
