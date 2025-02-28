import { useEffect, useState } from "react";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PurchaseItem {
  inventoryName: string;
  inventoryId: string;
  stock: number;
  qty: number;
  rate: number;
  total: number;
}

interface Purchase {
  _id: string;
  supplierName: string;
  purchaseDate: string;
  expiryDate: string;
  invoiceNo: string;
  paymentType: string;
  details: string;
  items: PurchaseItem[];
  paidAmount: number;
  totalAmount: number;
  dueAmount: number;
  status: string;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
}

interface FetchPurchasesResponse {
  success: boolean;
  data: {
    purchases: Purchase[];
    pagination: Pagination;
  };
}

interface UseGetAllPurchasesProps {
  isEdited?: boolean;
  isDeleted?: boolean;
  isShowModal?: boolean;
  filters: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
    paymentType?: string;
    dateRange?: {
      startDate: string;
      endDate: string;
    };
  };
}

function useGetAllPurchases({
  isEdited = false,
  isDeleted = false,
  isShowModal = false,
  filters,
}: UseGetAllPurchasesProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
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
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response: FetchPurchasesResponse =
          await window.ipcRenderer.invoke("get-purchases", {
            data: {
              ...filters,
              page: filters.page || 1,
              limit: filters.limit || 10,
            },
          });

        if (response.success) {
          setPurchases(response.data.purchases);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
        throw new Error("Failed to fetch purchases");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [
    isDeleted,
    isEdited,
    isShowModal,
    filters.search,
    filters.page,
    filters.limit,
    filters.status,
    filters.paymentType,
    filters.dateRange,
  ]);

  const handlePageChange = (newPage: number) => {
    if (filters.page !== newPage) {
      filters.page = newPage;
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (filters.limit !== newLimit) {
      filters.limit = newLimit;
      filters.page = 1; // Reset to first page when changing limit
    }
  };

  const handleStatusChange = (status: string) => {
    filters.status = status;
    filters.page = 1; // Reset to first page when changing status
  };

  const handlePaymentTypeChange = (paymentType: string) => {
    filters.paymentType = paymentType;
    filters.page = 1; // Reset to first page when changing payment type
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    filters.dateRange = { startDate, endDate };
    filters.page = 1; // Reset to first page when changing date range
  };

  return {
    purchases,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleStatusChange,
    handlePaymentTypeChange,
    handleDateRangeChange,
  };
}

export default useGetAllPurchases;
