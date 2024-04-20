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
              <th>Created at</th>
              <th>Client</th>
              <th>Products</th>
              <th>Payment status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order, index) => (
                <tr key={index}>
                  <td>{order._id}</td>
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
                  <td>{order.paid ? "YES" : "NO"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
