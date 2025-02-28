import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface KitchenAssignItem {
  itemName: string;
  quantity: number;
  notes?: string;
}

interface KitchenAssign {
  _id: string;
  kitchenId: {
    _id: string;
    kitchenName: string;
    chefName: string;
  };
  orderId: string;
  items: KitchenAssignItem[];
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignedAt: string;
  estimatedCompletionTime: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

interface useGetAllCountersProps {
  page?: number;
  limit?: number | string;
  search?: string;
  status?: string;
  priority?: string;
  kitchenId?: string;
  isRender?: boolean;
}

export default function useGetAllCounters({
  page = 1,
  limit = 25,
  search = "",
  status,
  priority,
  kitchenId,
  isRender = false,
}: useGetAllCountersProps = {}) {
  const [counters, setCounters] = useState<KitchenAssign[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("get-all-counters", {
          page,
          limit,
          search,
          status,
          priority,
          kitchenId,
        });

        console.log(response, "response kitchen dashboard");

        if (response.success) {
          setCounters(response.data || []);
          setPagination(response?.pagination);
        } else {
          toast.error(response.message || "Failed to fetch counters");
          setCounters([]);
          setPagination(null);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch counters");
        setCounters([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCounters();
  }, [page, limit, search, status, priority, kitchenId, isRender]);

  return { counters, loading, pagination };
}
