import { useEffect, useState } from "react";

interface FetchCandidatesResponse {
  success: boolean;
  data: any;
}

function useGetAllCandidates({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
  filters = {},
}: any): any {
  const [candidates, setCandidates] = useState<any>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      console.log(filters, "filters");
      try {
        setLoading(true); // Assuming setLoading is used to show a loading indicator
        const response: FetchCandidatesResponse =
          await window.ipcRenderer.invoke("get-candidate", {
            data: filters,
          });
        if (response.success) {
          setCandidates(response.data);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        throw new Error("Failed to fetch candidates");
      } finally {
        setLoading(false); // Reset loading state after the fetch
      }
    };

    fetchCandidates();
  }, [
    isDeleted,
    isEdited,
    isShowModal,
    filters?.search,
    filters?.isShortList,
    filters?.selection,
  ]);

  return candidates;
}

export default useGetAllCandidates;
