import { useEffect, useState } from "react";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  [key: string]: any; // for other potential properties
}

interface UseGetAllEmploysProps {
  isEdited?: boolean;
  isDeleted?: boolean;
  setLoading?: (loading: boolean) => void;
  isShowModal?: boolean;
  role?: string;
}

interface UseGetAllEmploysReturn {
  employees: Employee[];
  error: Error | null;
  isLoading: boolean;
}

function useGetAllEmploys({
  isEdited = false,
  isDeleted = false,
  setLoading,
  isShowModal = false,
  role,
}: UseGetAllEmploysProps = {}): UseGetAllEmploysReturn {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setError(null);
        setIsLoading(true);
        if (setLoading) setLoading(true);

        const response = await window.ipcRenderer.invoke("get-employee", {
          data: { role },
        });

        console.log(
          response.data.map((item: any) => ({
            ...item.properties,
            _id: item._id,
          })),
          "response"
        );

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch employees");
        }

        setEmployees(
          response.data.map((item: any) => ({
            ...item.properties,
            _id: item._id,
          }))
        );
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch employees")
        );
      } finally {
        setIsLoading(false);
        if (setLoading) setLoading(false);
      }
    };

    fetchEmployees();
  }, [isDeleted, isEdited, isShowModal, role, setLoading]);

  return { employees, error, isLoading };
}

export default useGetAllEmploys;
