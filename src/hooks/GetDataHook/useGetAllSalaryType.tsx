import { useEffect, useState } from "react";

interface useGetAllSalaryTypeProps {
  search?: string;
  page?: number;
  limit?: number;
  isRender?: boolean;
  setLoading?: (loading: boolean) => void;
}

interface Loan {
  _id: string;
  name: string;
  permittedBy: string;
  loanNo: string;
  amount: number;
  interestPercentage: number;
  installmentPeriod: string;
  repaymentTotal: number;
  approveDate: string;
  repaymentFrom: string;
  loanDetails?: string;
  status: string;
}

interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

function useGetAllSalaryType({
  search = "",
  page = 1,
  limit = 25,
  isRender = false,
  setLoading,
}: any = {}) {
  const [salaryTypes, setSalaryTypes] = useState<Loan[]>([]);
  const [loading, setLoadingState] = useState(false);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    const fetchSalaryTypes = async () => {
      try {
        setLoadingState(true);
        if (setLoading) setLoading(true);

        const response = await window.ipcRenderer.invoke("get-salary-types", {
          search,
          page,
          limit,
        });

        if (response.success) {
          setSalaryTypes(response.data.salaryTypes);
          setPagination(response.data.pagination);
        } else {
          console.error("Failed to fetch salaryTypes:", response.message);
          setSalaryTypes([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching salaryTypes:", error);
        setSalaryTypes([]);
        setPagination(null);
      } finally {
        setLoadingState(false);
        if (setLoading) setLoading(false);
      }
    };

    fetchSalaryTypes();
  }, [search, page, limit, isRender, setLoading]);

  return {
    salaryTypes,
    loading: loading,
    pagination,
  };
}

export default useGetAllSalaryType;
