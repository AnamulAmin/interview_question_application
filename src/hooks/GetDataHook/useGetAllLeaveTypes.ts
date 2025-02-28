import { useState, useEffect } from "react";

interface LeaveType {
  _id: string;
  name: string;
  description?: string;
  maxDays: number;
  status: "Active" | "Inactive";
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

interface Props {
  search?: string;
  page?: number;
  limit?: number;
  isRender?: boolean;
}

export default function useGetAllLeaveTypes({
  search = "",
  page = 1,
  limit = 10,
  isRender = false,
}: Props) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("get-leave-types", {
          search,
          page,
          limit,
        });

        if (response.success) {
          setLeaveTypes(response.data.leaveTypes);
          setPagination(response.data.pagination);
        } else {
          console.error("Failed to fetch leave types:", response.message);
          setLeaveTypes([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching leave types:", error);
        setLeaveTypes([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, page, limit, isRender]);

  return {
    leaveTypes,
    loading,
    pagination,
  };
}
