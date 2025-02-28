import { useState, useEffect, useMemo } from "react";

interface PaymentSetup {
  _id: string;
  name: string;
  email: string;
  merchantId: string;
  currency: string;
  mode: "Live Mode" | "Test Mode";
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

interface Options {
  search?: string;
  isEdit?: boolean;
  isShowModal?: boolean;
  isDelete?: boolean;
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

export const useGetAllPaymentSetups = (options: Options = {}) => {
  const [setups, setSetups] = useState<PaymentSetup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 25,
  });

  useMemo(() => {
    const fetchSetups = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("get-payment-setup", {
          search: options.search,
          page: options.page,
          limit: options.limit,
        });

        if (response.success) {
          setSetups(response.data.setups);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching payment setups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSetups();
  }, [options.search, options.isRender, options.page, options.limit]);

  return { setups, loading, error, pagination };
};

export default useGetAllPaymentSetups;
