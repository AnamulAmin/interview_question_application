import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface BankTransaction {
  _id: string;
  date: string;
  accountType: "Debit" | "Credit";
  bankId: string;
  bankName: string;
  transactionId: string;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

interface UseGetAllBankTransactionsProps {
  page?: number;
  limit?: number | string;
  search?: string;
  isRender?: boolean;
}

export default function useGetAllBankTransactions({
  page = 1,
  limit = 25,
  search = "",
  isRender = false,
}: UseGetAllBankTransactionsProps = {}) {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("get-bank-transactions", {
          page,
          limit,
          search,
        });

        if (response.success) {
          setTransactions(response.data);
          setPagination(response.pagination);
        } else {
          toast.error(response.message || "Failed to fetch transactions");
          setTransactions([]);
          setPagination(null);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch transactions");
        setTransactions([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, limit, search, isRender]);

  return { transactions, loading, pagination };
}
