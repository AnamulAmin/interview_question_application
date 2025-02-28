import { useState, useEffect } from "react";

interface ShippingMethod {
  _id: string;
  name: string;
  rate: number;
  paymentMethod: string;
  shippingType: string;
  status: string;
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

export const useGetAllShippingMethods = (options: Options = {}) => {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 25,
  });

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke(
          "get-shipping-methods",
          {
            search: options.search,
            page: options.page,
            limit: options.limit,
          }
        );

        if (response.success) {
          setMethods(response.data.methods);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching shipping methods:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [options.search, options.isRender, options.page, options.limit]);

  return { methods, loading, error, pagination };
};

export default useGetAllShippingMethods;
