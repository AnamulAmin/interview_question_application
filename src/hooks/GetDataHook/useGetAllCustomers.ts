import { useState, useEffect } from "react";

interface Customer {
  _id: string;
  customer_name: string;
  email: string;
  mobile: string;
  address?: string;
  is_vip: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export const useGetAllCustomers = (
  options: {
    search?: string;
    page?: number;
    limit?: number;
    isEdit?: boolean;
    isShowModal?: boolean;
    isDelete?: boolean;
  } = {}
) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 25,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await window.ipcRenderer.invoke("get-customers", {
          data: options,
        });

        if (response.success) {
          setCustomers(response.data.customers);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message || "Failed to fetch customers");
        }
      } catch (err: any) {
        console.error("Error fetching customers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [
    options.search,
    options.page,
    options.limit,
    options.isEdit,
    options.isShowModal,
    options.isDelete,
  ]);

  return { customers, pagination, loading, error };
};

export default useGetAllCustomers;
