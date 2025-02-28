import { useState, useEffect } from "react";

interface CardTerminal {
  _id: string;
  card_terminal_name: string;
  createdAt: string;
  updatedAt: string;
}

interface Options {
  search?: string;
  isEdit?: boolean;
  isShowModal?: boolean;
  isDelete?: boolean;
}

export const useGetAllCardTerminals = (options: Options = {}) => {
  const [terminals, setTerminals] = useState<CardTerminal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        setLoading(true);
        const response = await window.ipcRenderer.invoke(
          "get-all-card-terminals",
          {
            search: options.search,
          }
        );

        if (response.success) {
          setTerminals(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching card terminals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerminals();
  }, [options.search, options.isEdit, options.isShowModal, options.isDelete]);

  return { terminals, loading, error };
};

export default useGetAllCardTerminals;
