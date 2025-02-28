import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Bank {
  _id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  balance: number;
  signaturePicture: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

interface UseGetAllBanksProps {
  page?: number;
  limit?: number | string;
  search?: string;
  isRender?: boolean;
}

export default function useGetAllBanks({
  page = 1,
  limit = 25,
  search = "",
  isRender = false,
}: UseGetAllBanksProps = {}) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("get-banks", {
          page,
          limit,
          search,
        });

        if (response.success) {
          setBanks(response.data);
          setPagination(response.pagination);
        } else {
          toast.error(response.message || "Failed to fetch banks");
          setBanks([]);
          setPagination(null);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch banks");
        setBanks([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, [page, limit, search, isRender]);

  return { banks, loading, pagination };
}
