import { useEffect, useState } from "react";

interface UseGetTransactionProps {
  query?: any;
  id?: string;
  isShowAddTransaction?: boolean;
  isShowEdit?: boolean;
  isDeleteTransaction?: boolean;
  isSubmit?: boolean;
  slashQuery?: string;
  isShowAddPackage?: boolean;
  isShowEditMember?: boolean;
  isDeleteInvoice?: boolean;
}

function useGetTransaction({
  query = {},
  id = "",
  isShowAddTransaction = false,
  isShowEdit = false,
  isDeleteTransaction = false,
  isSubmit = false,
  slashQuery = "",
  isShowAddPackage = false,
  isShowEditMember = false,
  isDeleteInvoice = false,
}: UseGetTransactionProps) {
  const [transactionData, setTransactionData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [receivers, setReceivers] = useState<any[]>([]);
  const [method_summary, setMethod_summary] = useState<any[]>([]);
  const [cumulativeBalance, setCumulativeBalance] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res: any = await window.ipcRenderer.invoke(
          "get-inventory-category",
          {
            data: { ...query },
          }
        );

        if (res) {
          console.log("res 16561", res?.data, res?.data?.data);
          if (res?.data?.length > 0) {
            setTransactionData(res?.data);
          } else if (
            res?.data?.data?.length === 0 ||
            res?.data?.data?.length > 0
          ) {
            setTransactionData(res?.data?.data);
          }
          setSummary(res?.data?.summary);
          setReceivers(res?.data?.receivers);
          setMethod_summary(res?.data?.method_summary);
          setCumulativeBalance(res?.data?.cumulativeBalance);
        }

        // setCurrentPage(res?.data?.currentPage);
        // setTotalItems(res?.data?.totalItems);
      } catch (error) {
        console.error("res 16561", error);
      }
    }
    // fetchData();
  }, [
    id,
    query,
    isShowEdit,
    isShowAddTransaction,
    isDeleteTransaction,
    isSubmit,
    slashQuery,
    isShowAddPackage,
    isShowEditMember,
    isDeleteInvoice,
  ]);

  return {
    transactionData,
    summary,
    receivers,
    method_summary,
    cumulativeBalance,
  };
}

export default useGetTransaction;
