import { useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { Input, Select, Button, SelectItem } from "@nextui-org/react";

interface FormData {
  transaction_date: string;
  voucher: string;
  payment_method: string;
  transaction_name: string;
  particulars: string;
  amount: string;
}

interface FormErrors {
  transaction_date?: string;
  payment_method?: string;
  transaction_name?: string;
  amount?: string;
}

interface PaymentMethod {
  name: string;
}

const AddNewTransaction: any = ({ setIsShow, isShow }: any): any => {
  const [isNewId, setIsNewId] = useState<boolean>(false);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethod[]>(
    []
  );
  const [transactionTypeData, setTransactionTypeData] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    transaction_date: "",
    voucher: "",
    payment_method: "",
    transaction_name: "",
    particulars: "",
    amount: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): FormErrors => {
    const errors: any = {};
    if (!formData.transaction_date)
      errors.transaction_date = "Date is required";
    if (!formData.amount) errors.amount = "Amount is required";
    if (!formData.payment_method)
      errors.payment_method = "Payment method is required";
    if (!formData.transaction_name)
      errors.transaction_name = "Transaction type is required";
    return errors;
  };

  const handleInputChange = (e: any): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsLoading(true);

    const transactionData = {
      ...formData,
      transaction_date: moment(new Date(formData.transaction_date)).format(
        "YYYY-MM-DD"
      ),
      receipt_no: `#${Date.now()}`,
    };

    try {
      // Simulating API call
      // const response = await axiosSecure.post(`/transaction/post`, transactionData);
      // Simulating success
      setTimeout(() => {
        toast.success("Transaction created successfully!");
        setIsShow(false);
        setIsNewId((prev) => !prev);
        setFormData({
          transaction_date: "",
          voucher: "",
          payment_method: "",
          transaction_name: "",
          particulars: "",
          amount: "",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Request failed!");
      setIsLoading(false);
    }
  };

  return (
    <article
      className={`w-full rounded-xl py-2 md:w-[65%] lg:w-[80%] bg-white my-7 transition-all duration-500 ${
        isShow ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <h2 className="px-5 py-1 border-b border-gray-300 flex justify-between items-center w-full">
        <span className="font-medium">Add New Transaction</span>
      </h2>
      <form className="px-5 py-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Transaction Date"
            type="date"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleInputChange}
            // status={formErrors.transaction_date ? "error" : "default"}
            // helperText={formErrors.transaction_date}
            required
          />
          <Input
            label="Voucher"
            type="text"
            name="voucher"
            value={formData.voucher}
            onChange={handleInputChange}
          />
          <Select
            label="Payment Method"
            name="payment_method"
            value={formData.payment_method}
            onChange={(e: any) =>
              handleInputChange({
                target: { name: "payment_method", value: e as string },
              })
            }
            required
            // helperText={formErrors.payment_method}
          >
            {/* <SelectItem key="">Select Payment Method</SelectItem> */}
            {paymentMethodData.map((item: any, index: number) => (
              <SelectItem value={item.name} key={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Transaction Type"
            name="transaction_name"
            value={formData.transaction_name}
            onChange={(e: any) =>
              handleInputChange({
                target: { name: "transaction_name", value: e as string },
              })
            }
            required
            // helperText={formErrors.transaction_name}
          >
            {/* <SelectItem key="">Select Transaction Type</SelectItem> */}
            {transactionTypeData.map((item: any, index: number) => (
              <SelectItem value={item.label} key={item.label}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Particulars"
            type="text"
            name="particulars"
            value={formData.particulars}
            onChange={handleInputChange}
          />
          <Input
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            // status={formErrors.amount ? "error" : "default"}
            // helperText={formErrors.amount}
            required
          />
        </div>
        <div className="flex justify-end items-center gap-3 mt-9">
          <Button color="danger" onPress={() => setIsShow(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            color="primary"
            // icon={isLoading && <Spinner size="sm" />}
          >
            Save
          </Button>
        </div>
      </form>
    </article>
  );
};

export default AddNewTransaction;
