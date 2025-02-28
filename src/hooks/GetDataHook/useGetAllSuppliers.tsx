import { useEffect, useState } from "react";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface FetchSuppliersResponse {
  success: boolean;
  data: {
    suppliers: any[];
    pagination: Pagination;
  };
}

interface UseGetAllSuppliersProps {
  isEdited?: boolean;
  isDeleted?: boolean;
  isShowModal?: boolean;
  filters: {
    search?: string;
    page?: number;
    limit?: number;
  };
}

function useGetAllSuppliers({
  isEdited = false,
  isDeleted = false,
  isShowModal = false,
  filters,
}: any) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);

        if (filters?.filters) {
        }
        const response: FetchSuppliersResponse =
          await window.ipcRenderer.invoke("get-supplier", {
            data: {
              ...filters,
            },
          });

        if (response.success) {
          setSuppliers(response.data.suppliers);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw new Error("Failed to fetch suppliers");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [
    isDeleted,
    isEdited,
    isShowModal,
    filters?.search,
    filters?.page,
    filters?.limit,
  ]);

  const handlePageChange = (newPage: number) => {
    if (filters?.page !== newPage) {
      filters.page = newPage;
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (filters?.limit !== newLimit) {
      filters.limit = newLimit;
      filters.page = 1; // Reset to first page when changing limit
    }
  };

  return {
    suppliers,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
  };
}

export default useGetAllSuppliers;
