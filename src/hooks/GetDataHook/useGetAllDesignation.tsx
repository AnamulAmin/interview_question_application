import { useEffect, useState } from "react";

interface FetchDesignationsResponse {
  success: boolean;
  data: any;
}

function useGetAllDesignation({
  isEdited = false,
  isDeleted = false,
  isShowModal = false,
  role,
}: any): any {
  const [designations, setDesignations] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        setLoading(true); // Assuming setLoading is used to show a loading indicator
        const response: FetchDesignationsResponse =
          await window.ipcRenderer.invoke("get-designation", {
            data: { role },
          });
        if (response.success) {
          setDesignations(response.data);
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
        throw new Error("Failed to fetch designations");
      } finally {
        setLoading(false); // Reset loading state after the fetch
      }
    };

    fetchDesignations();
  }, [isDeleted, isEdited, isShowModal, role]);

  return { designations, loading };
}

export default useGetAllDesignation;
