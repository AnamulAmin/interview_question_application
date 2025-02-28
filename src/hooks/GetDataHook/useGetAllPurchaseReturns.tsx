import { useState, useEffect } from "react";

interface Filters {
  search?: string;
  status?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface UseGetAllPurchaseReturnsProps {
  isEdited: boolean;
  filters: Filters;
}

const useGetAllPurchaseReturns = ({
  isEdited,
  filters,
}: UseGetAllPurchaseReturnsProps) => {
  const [purchaseReturns, setPurchaseReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const fetchPurchaseReturns = async () => {
    setLoading(true);
    try {
      const response = await window.ipcRenderer.invoke("get-purchase-returns", {
        page: currentPage,
        limit,
        ...filters,
      });

      if (response.success) {
        setPurchaseReturns(response.data.purchaseReturns);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching purchase returns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseReturns();
  }, [currentPage, filters.search, filters.status, isEdited]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (status: string) => {
    setCurrentPage(1);
    filters.status = status;
  };

  return {
    purchaseReturns,
    loading,
    pagination,
    handlePageChange,
    handleStatusChange,
    refetch: fetchPurchaseReturns,
  };
};

export default useGetAllPurchaseReturns;
