import { useEffect, useState } from "react";

interface UseGetAllLoansProps {
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

function useGetAllLoans({
  search = "",
  page = 1,
  limit = 25,
  isRender = false,
  setLoading,
}: UseGetAllLoansProps = {}) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoadingState] = useState(false);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoadingState(true);
        if (setLoading) setLoading(true);

        const response = await window.ipcRenderer.invoke("get-loan", {
          search,
          page,
          limit,
        });

        if (response.success) {
          setLoans(response.data);
          setPagination(response.pagination);
        } else {
          console.error("Failed to fetch loans:", response.message);
          setLoans([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching loans:", error);
        setLoans([]);
        setPagination(null);
      } finally {
        setLoadingState(false);
        if (setLoading) setLoading(false);
      }
    };

    fetchLoans();
  }, [search, page, limit, isRender, setLoading]);

  return {
    loans,
    loading: loading,
    pagination,
  };
}

export default useGetAllLoans;
