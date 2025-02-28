import { useEffect, useState } from "react";

function useGetCompanyData({
  isEdited = false,
  isDeleted = false,
  setLoading = () => {},
  isShowModal = false,
}: any): any | null {
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true); // Optional: manage a loading state
        const response = await window.ipcRenderer.invoke(
          "get-company-profile",
          {
            data: null,
          }
        );
        if (response.success) {
          setCompanyData(response.data[0]); // Assuming response.data is an array
        }
      } catch (error) {
        console.error("Error fetching companyData:", error);
      } finally {
        setLoading(false); // Optional: stop the loading state
      }
    };

    fetchCompanyData();
  }, [isDeleted, isEdited, isShowModal]);

  return companyData;
}

export default useGetCompanyData;
