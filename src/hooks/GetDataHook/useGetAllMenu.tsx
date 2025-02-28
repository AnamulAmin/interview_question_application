import { useCallback, useEffect, useState } from "react";

function useGetAllMenu({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
  filter = null,
}: any): any[] {
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true); // Optionally, you can manage a loading state
        const response = await window.ipcRenderer.invoke("get-menu-items", {
          data: filter,
        });
        console.log(response, "response menu");
        if (response.success) {
          setMenuItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching menuItems:", error);
        throw new Error("Failed to fetch menuItems");
      } finally {
        setLoading(false); // Optionally, stop the loading state
      }
    };

    fetchMenuItems();
  }, [
    isDeleted,
    isEdited,
    isShowModal,
    filter.category,
    filter?.subcategory,
    filter.search,
  ]);

  return menuItems;
}

export default useGetAllMenu;
