import React from "react";
import "flowbite";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await API.get("/api/orders");

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.orders)
          ? res.data.orders
          : [];

        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setOrders(sorted); // više nema .slice(0, 3)
      } catch (err) {
        console.error(
          "❌ Failed to fetch orders:",
          err.response?.data || err.message
        );
        setOrders([]);
      }
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  if (loading || !user) {
    return <p className="p-4 text-sm text-gray-600">Loading user data...</p>;
  }
  return (
    <main className="mx-48 p-4 h-auto pt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-4">
        <div className="col-span-12 h-full">
          <div className="border rounded-lg border-gray-300 col-span-3 p-6">
            <div className="pb-3 mb-3 border-b border-gray-300">
              <h3 className="font-bold uppercase text-sm text-gray-700">
                Pay as you go
              </h3>
            </div>

            {orders.map((order) => (
              <article
                key={order.id}
                className="py-6 text-base py-3 grid grid-cols-12 gap-2 border-b border-gray-300"
              >
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-gray-400">Order ID</span>
                  <span className="mt-2 font-medium">{order.order_number}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-gray-400">Invoice</span>
                  <span className="mt-2">{order.invoice_number}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-gray-400">Status</span>
                  <div className="flex items-center justify-start mt-2">
                    <span
                      className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm border mt-0.5 ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                          : order.status === "paid"
                          ? "bg-green-100 text-green-800 border-green-400"
                          : order.status === "timeout"
                          ? "bg-red-100 text-red-800 border-red-400"
                          : "bg-gray-100 text-gray-800 border-gray-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-gray-400">Date</span>
                  <span className="mt-2">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-gray-400">Amount</span>
                  <span className="mt-2">
                    €{parseFloat(order.price_eur).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-gray-400">Invoice</span>
                  {order.status === "paid" ? (
                    <a
                      target="_blank"
                      href={`https://test.createyourinvoice.online/index-invoice.php?key=${encodeURIComponent(
                        order.encrypted_key
                      )}`}
                      className="font-semibold text-rose-700"
                    >
                      Download
                    </a>
                  ) : order.status === "pending" ? (
                    <span className="text-gray-400 italic">
                      Invoice not available
                    </span>
                  ) : order.status === "timeout" ? (
                    <span className="text-gray-400 italic">
                      Invoice not available
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Orders;
