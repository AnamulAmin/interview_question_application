import { useState, useEffect, useMemo } from "react";

interface PaymentMethod {
  _id: string;
  payment_method_name: string;
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

export const useGetAllPaymentMethods = (options: Options = {}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 25,
  });

  useMemo(() => {
    const fetchMethods = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("get-payment-method", {
          search: options.search,
          page: options.page,
          limit: options.limit,
        });

        if (response.success) {
          setMethods(response.data.methods);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching payment methods:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [options.search, options.isRender, options.page, options.limit]);

  return { methods, loading, error, pagination };
};

export default useGetAllPaymentMethods;
