import { useState, useEffect } from "react";

interface CustomerType {
  _id: string;
  type_name: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export const useGetAllCustomerTypes = (
  options: {
    search?: string;
    page?: number;
    limit?: number;
    isEdit?: boolean;
    isShowModal?: boolean;
    isDelete?: boolean;
  } = {}
) => {
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 25,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerTypes = async () => {
      setLoading(true);
      try {
        const response = await window.ipcRenderer.invoke("get-customer-types", {
          data: options,
        });

        if (response.success) {
          setCustomerTypes(response.data.customerTypes);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message || "Failed to fetch customer types");
        }
      } catch (err: any) {
        console.error("Error fetching customer types:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerTypes();
  }, [
    options.search,
    options.page,
    options.limit,
    options.isEdit,
    options.isShowModal,
    options.isDelete,
  ]);

  return { customerTypes, pagination, loading, error };
};

export default useGetAllCustomerTypes;
