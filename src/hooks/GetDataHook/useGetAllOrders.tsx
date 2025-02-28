import { useEffect, useState } from "react";

interface Order {
  id: string;
  status: string;
  customerName: string;
  orderNumber: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface UseGetAllOrdersProps {
  isEdited?: boolean;
  isRender?: boolean;
  setLoading?: (loading: boolean) => void;
  isShowModal?: boolean;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  isAssigned: boolean | undefined;
}

function useGetAllOrders({
  isEdited = false,
  isRender = false,
  isShowModal = false,
  status,
  page = 1,
  limit = 10,
  search = "",
  startDate = "",
  isAssigned,
}: UseGetAllOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoadingState] = useState(false);

  useEffect(() => {
    const initialFilter: any = { status, page, limit, search, startDate };

    if (isAssigned) {
      initialFilter.isAssigned = isAssigned;
    }
    const fetchOrders = async () => {
      try {
        setLoadingState(true);

        const response = await window.ipcRenderer.invoke("get-order", {
          data: initialFilter,
        });

        if (response.success) {
          setOrders(response.data || []);
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
      } finally {
        setLoadingState(false);
      }
    };

    fetchOrders();
  }, [
    isRender,
    isEdited,
    isShowModal,
    status,
    page,
    limit,
    search,
    startDate,
    isAssigned,
  ]);

  return {
    orders,
    pagination,
    loading: loading,
  };
}

export default useGetAllOrders;
