import { useState, useEffect } from "react";

interface WeeklyHoliday {
  _id: string;
  weeklyLeaveDay: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Options {
  search?: string;
  page?: number;
  limit?: number;
  isRender?: boolean;
}

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export const useGetAllWeeklyHolidays = (options: Options = {}) => {
  const [holidays, setHolidays] = useState<WeeklyHoliday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 25,
  });

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke(
          "get-weekly-holidays",
          {
            search: options.search,
            page: options.page,
            limit: options.limit,
          }
        );

        if (response.success) {
          setHolidays(response.data.holidays);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching weekly holidays:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [options.search, options.isRender, options.page, options.limit]);

  return { holidays, loading, error, pagination };
};

export default useGetAllWeeklyHolidays;
