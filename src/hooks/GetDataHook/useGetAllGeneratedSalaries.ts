import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface GeneratedSalary {
  _id: string;
  employee_id: string;
  employeeName: string;
  name: string;
  generateDate: string;
  startDate: string;
  endDate: string;
  generatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  search?: string;
  page?: number;
  limit?: string | number;
  isRender?: boolean;
}

export default function useGetAllGeneratedSalaries({
  search = "",
  page = 1,
  limit = 25,
  isRender = false,
}: Props) {
  const [generatedSalaries, setGeneratedSalaries] = useState<GeneratedSalary[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 25,
  });

  useEffect(() => {
    const fetchGeneratedSalaries = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke(
          "get-generated-salaries",
          {
            search,
            page,
            limit,
          }
        );

        if (response.success) {
          setGeneratedSalaries(response.data.generatedSalaries);
          setPagination(response.data.pagination);
        } else {
          toast.error(response.message || "Failed to fetch generated salaries");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch generated salaries");
        setGeneratedSalaries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratedSalaries();
  }, [search, page, limit, isRender]);

  return {
    generatedSalaries,
    loading,
    pagination,
  };
}
