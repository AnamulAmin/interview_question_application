import { useState, useEffect } from "react";

interface LeaveApplication {
  _id: string;
  employeeName: string;
  leaveType: string;
  applicationStartDate: string;
  applicationEndDate: string;
  days: number;
  applicationHardCopy?: string;
  approveStartDate?: string;
  approvedEndDate?: string;
  approvedDay?: number;
  approvedBy?: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
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

export default function useGetAllLeaveApplications({
  search = "",
  page = 1,
  limit = 10,
  isRender = false,
}: Props) {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke(
          "get-leave-applications",
          {
            search,
            page,
            limit,
          }
        );

        if (response.success) {
          setApplications(response.data.applications);
          setPagination(response.data.pagination);
        } else {
          console.error(
            "Failed to fetch leave applications:",
            response.message
          );
          setApplications([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching leave applications:", error);
        setApplications([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, page, limit, isRender]);

  return {
    applications,
    loading,
    pagination,
  };
}
