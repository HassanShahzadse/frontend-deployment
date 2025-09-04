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
          <div className="rounded-lg col-span-3 p-6 bg-white">
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
                  <div className="flex gap-2 items-center mt-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                      <svg
                        class="w-4 h-4 text-gray-800 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">{order.order_number}</span>
                  </div>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-gray-400">Invoice</span>
                  {order.status === "paid" ? (
                    <span className="mt-2">{order.invoice_number}</span>
                  ) : (
                    <span className="mt-2 text-gray-400 italic">
                      Invoice not available
                    </span>
                  )}
                </div>

                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-gray-400">Status</span>
                  <div className="flex items-center justify-start mt-2">
                    {(() => {
                      const metaByStatus = {
                        paid: {
                          label: "Order paid",
                          ring: "bg-green-100 text-green-800",
                          iconPath: "M5 11.917 9.724 16.5 19 7.5", // check
                        },
                        canceled: {
                          label: "Order canceled",
                          ring: "bg-red-100 text-red-800",
                          iconPath: "M6 18 17.94 6M18 18 6.06 6", // x
                        },
                        pending: {
                          label: "Order pending",
                          ring: "bg-yellow-100 text-yellow-800",
                          iconPath:
                            "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", // clock
                        },
                        timeout: {
                          label: "Order expired",
                          ring: "bg-orange-100 text-orange-800",
                          iconPath:
                            "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", // clock (narančasto)
                        },
                        failed: {
                          label: "Order failed",
                          ring: "bg-pink-100 text-pink-800",
                          iconPath: "M6 18 17.94 6M18 18 6.06 6", // x (rozo)
                        },
                      };

                      const meta = metaByStatus[order.status] ?? {
                        label: "Order canceled",
                        ring: "bg-red-100 text-red-800",
                        iconPath: "M6 18 17.94 6M18 18 6.06 6", // x
                      }; // fallback

                      return (
                        <div className="flex gap-2 items-center mt-2">
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full ${meta.ring}`}
                          >
                            <svg
                              className="w-4 h-4"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={meta.iconPath}
                              />
                            </svg>
                          </div>
                          <span>{meta.label}</span>
                        </div>
                      );
                    })()}
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
                    <div className="flex gap-2 items-center mt-2">
                      <svg
                        class="w-6 h-6 text-pink-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
                        />
                      </svg>
                      <a
                        target="_blank"
                        href={`http://ht-payway.com/index-invoice.php?key=${encodeURIComponent(
                          order.encrypted_key
                        )}`}
                        className="font-semibold text-pink-700"
                      >
                        Download
                      </a>
                    </div>
                  ) : order.status === "pending" ? (
                    <span className="text-gray-400 italic">
                      Invoice not available
                    </span>
                  ) : order.status === "timeout" ? (
                    <span className="text-gray-400 italic">
                      Invoice not available
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">
                      Invoice not available
                    </span>
                  )}
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
