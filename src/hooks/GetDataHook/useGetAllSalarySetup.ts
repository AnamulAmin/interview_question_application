import { useEffect, useState } from "react";

interface useGetAllSalarySetupProps {
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

function useGetAllSalarySetup({
  search = "",
  page = 1,
  limit = 25,
  isRender = false,
  setLoading,
}: any = {}) {
  const [salarySetups, setSalarySetups] = useState<Loan[]>([]);
  const [loading, setLoadingState] = useState(false);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    const fetchSalarySetups = async () => {
      try {
        setLoadingState(true);
        if (setLoading) setLoading(true);

        const response = await window.ipcRenderer.invoke("get-salary-setups", {
          search,
          page,
          limit,
        });

        console.log(response, "response");

        if (response.success) {
          setSalarySetups(response?.data?.salarySetups || []);
          setPagination(response.pagination);
        } else {
          console.error("Failed to fetch salary setups:", response.message);
          setSalarySetups([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching loans:", error);
        setSalarySetups([]);
        setPagination(null);
      } finally {
        setLoadingState(false);
        if (setLoading) setLoading(false);
      }
    };

    fetchSalarySetups();
  }, [search, page, limit, isRender, setLoading]);

  return {
    salarySetups,
    loading: loading,
    pagination,
  };
}

export default useGetAllSalarySetup;
