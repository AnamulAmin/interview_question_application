import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Kitchen {
  _id: string;
  kitchenName: string;
  chefName: string;
  speciality: string;
  status: "Active" | "Inactive";
  description: string;
  contactNumber: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

interface UseGetAllKitchensProps {
  page?: number;
  limit?: number | string;
  search?: string;
  isRender?: boolean;
}

export default function useGetAllKitchens({
  page = 1,
  limit = 25,
  search = "",
  isRender = false,
}: UseGetAllKitchensProps = {}) {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("get-kitchens", {
          page,
          limit,
          search,
        });

        if (response.success) {
          setKitchens(response.data);
          setPagination(response.pagination);
        } else {
          toast.error(response.message || "Failed to fetch kitchens");
          setKitchens([]);
          setPagination(null);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch kitchens");
        setKitchens([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchKitchens();
  }, [page, limit, search, isRender]);

  return { kitchens, loading, pagination };
}
