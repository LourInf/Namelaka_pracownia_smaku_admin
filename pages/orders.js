import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Order() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <div className="bg-neutral-50 rounded-lg pt-1 pb-2 px-5 shadow-md">
        <table className="basic cat mt-4">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Paid</th>
              <th>Ordered at</th>
              <th>Client</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order, index) => (
                <tr key={index}>
                  <td>{order._id}</td>
                  <td>
                    {order.paid ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-green-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0Z"
                        />
                      </svg>
                    )}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    {order?.name} {order?.surname} <br />
                    {order?.email} <br />
                    {order?.phone}
                  </td>
                  <td>
                    {order.line_items.map((items) => (
                      <>
                        {items.price_data?.product_data?.name} x{" "}
                        {items.quantity}
                        <br />
                        {/* {JSON.stringify(items)} */}
                        <br />
                      </>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
