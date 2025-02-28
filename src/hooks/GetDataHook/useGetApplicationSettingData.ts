import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface useGetApplicationSettingDataProps {
  page?: number;
  limit?: number | string;
  search?: string;
  isRender?: boolean;
}

export default function useGetApplicationSettingData({
  page = 1,
  limit = 25,
  search = "",
  isRender = false,
}: useGetApplicationSettingDataProps = {}) {
  const [settingData, setSettingData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettingData = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke("get-settings", {
          page,
          limit,
          search,
        });

        if (response.success) {
          setSettingData(response.data);
        } else {
          toast.error(response.message || "Failed to fetch settingData");
          setSettingData([]);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch settingData");
        setSettingData({});
      } finally {
        setLoading(false);
      }
    };

    fetchSettingData();
  }, [page, limit, search, isRender]);

  return { settingData, loading };
}
