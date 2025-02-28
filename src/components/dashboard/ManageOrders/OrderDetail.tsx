// /pages/orders/[id].js

import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import CustomImage from "../../../shared/ImageComponents/CustomImage";
import GlobalLoading from "../../../components library/GlobalLoading";
import toast from "react-hot-toast";

export default function OrderDetail({ id, isShow, setIsShow }) {
  const axiosSecure = useAxiosSecure();

  const [order, setOrder] = useState < any > null;
  const [status, setStatus] = useState < any > "";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosSecure.get(`/orders/${id}`);
        setOrder(res?.data?.data);
        setStatus(res?.data?.data?.status);
        console.log(res?.data?.data, "res?.data?.data");
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    if (id) {
      fetchOrder();
      console.log(isShow, "isShow", id);
    }
  }, [id, isShow]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await axiosSecure.put(`/orders/${id}`, { status: newStatus });
      toast.success("Order status updated successfully!");
      setIsShow(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!order) {
    return <GlobalLoading />;
  }

  return (
    <div className="w-full h-screen overflow-auto mx-auto p-6 bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>

      <div className="w-full grid grid-cols-2 gap-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Order Information</h3>
          <p>
            <strong>Order ID:</strong> {order?._id}
          </p>
          <p>
            <strong>Total:</strong> {order?.total} BDT
          </p>
          <p>
            <strong>Payment Method:</strong> {order?.payment_method}
          </p>
          <p>
            <strong>Order Date:</strong>{" "}
            {moment(order?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </p>
          <p>
            <strong>Status:</strong>
            <select
              value={status}
              onChange={handleStatusChange}
              className="ml-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Shipping Address</h3>
          <p>
            <strong>Name:</strong> {order?.shipping_address_id?.recipientName}
          </p>
          <p>
            <strong>Phone:</strong> {order?.shipping_address_id?.contactNumber}
          </p>
          <p>
            <strong>Address:</strong> {order?.shipping_address_id?.address},{" "}
            {order?.shipping_address_id?.area},{" "}
            {order?.shipping_address_id?.district},{" "}
            {order?.shipping_address_id?.postCode}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Products</h3>
        {order?.products.map((product, idx) => (
          <div
            key={idx}
            className="border py-2 rounded-md mb-4 flex gap-4 items-center"
          >
            <div className="relative w-[300px]">
              <CustomImage
                imageKey={product?.thumbnail}
                alt={"image"}
                className="h-[350px] w-full object-cover"
                width={600}
                height={500}
              />
            </div>

            <div>
              <p>
                <strong>Product Name:</strong> {product?.productTitle}
              </p>
              <p>
                <strong>Color:</strong> {order?.productColorValue || "N/A"}
              </p>
              <p>
                <strong>Size:</strong> {order?.productSizeValue || "N/A"}
              </p>
              <p>
                <strong>Quantity:</strong> {product?.quantity}
              </p>
              <p>
                <strong>subtotal:</strong> ${product?.price * product?.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
