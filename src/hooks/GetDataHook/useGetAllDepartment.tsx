import { useEffect, useState } from "react";

interface FetchDepartmentsResponse {
  success: boolean;
  data: any;
}

function useGetAllDepartment({
  isEdited = false,
  isDeleted = false,
  isShowModal = false,
  role,
}: any): any {
  const [departments, setDepartments] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true); // Assuming setLoading is used to show a loading indicator
        const response: FetchDepartmentsResponse =
          await window.ipcRenderer.invoke("get-department", { data: { role } });
        if (response.success) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        throw new Error("Failed to fetch departments");
      } finally {
        setLoading(false); // Reset loading state after the fetch
      }
    };

    fetchDepartments();
  }, [isDeleted, isEdited, isShowModal, role]);

  return { departments, loading };
}

export default useGetAllDepartment;
