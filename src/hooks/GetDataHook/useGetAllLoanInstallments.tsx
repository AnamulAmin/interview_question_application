import { useEffect, useState } from "react";

interface UseGetAllLoanInstallmentsProps {
  search?: string;
  page?: number;
  limit?: number;
  isRender?: boolean;
  setLoading?: (loading: boolean) => void;
}

interface LoanInstallment {
  _id: string;
  loan_id: {
    _id: string;
    loanNo: string;
  };
  employee_id: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  installmentAmount: number;
  payment: number;
  date: string;
  receiver: string;
  installNo: number;
  notes?: string;
  status: string;
}

interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

function useGetAllLoanInstallments({
  search = "",
  page = 1,
  limit = 25,
  isRender = false,
  setLoading,
}: UseGetAllLoanInstallmentsProps = {}) {
  const [installments, setInstallments] = useState<LoanInstallment[]>([]);
  const [loading, setLoadingState] = useState(false);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        setLoadingState(true);
        if (setLoading) setLoading(true);

        const response = await window.ipcRenderer.invoke(
          "get-loan-installments",
          {
            search,
            page,
            limit,
          }
        );

        if (response.success) {
          setInstallments(response.data);
          setPagination(response.pagination);
        } else {
          console.error("Failed to fetch loan installments:", response.message);
          setInstallments([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching loan installments:", error);
        setInstallments([]);
        setPagination(null);
      } finally {
        setLoadingState(false);
        if (setLoading) setLoading(false);
      }
    };

    fetchInstallments();
  }, [search, page, limit, isRender, setLoading]);

  return {
    installments,
    loading: loading,
    pagination,
  };
}

export default useGetAllLoanInstallments;
