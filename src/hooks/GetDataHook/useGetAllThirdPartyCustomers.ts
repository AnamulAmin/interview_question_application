import { useState, useEffect } from "react";

interface ThirdPartyCustomer {
  _id: string;
  companyName: string;
  commission: string;
  address: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

interface Options {
  search?: string;
  page?: number;
  limit?: number;
  isEdit?: boolean;
  isShowModal?: boolean;
  isDelete?: boolean;
}

export const useGetAllThirdPartyCustomers = (options: Options = {}) => {
  const [customers, setCustomers] = useState<ThirdPartyCustomer[]>([]);
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
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke(
          "get-all-third-party-customers",
          {
            search: options.search,
            page: options.page,
            limit: options.limit,
          }
        );

        if (response.success) {
          setCustomers(response.data.customers);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
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

export default useGetAllThirdPartyCustomers;
