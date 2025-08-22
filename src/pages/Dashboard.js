import React from "react";
import "flowbite";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/api";

import CreditBalanceBox from "../components/CreditBalanceBox";

function Dashboard() {
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

        setOrders(sorted.slice(0, 3));
      } catch (err) {
        console.error(
          "❌ Failed to fetch orders:",
          err.response?.data || err.message
        );
        setOrders([]); // fallback ako API padne
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
    <main className="mx-48 p-4 h-auto pt-20 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-4">
        <CreditBalanceBox />
        <div className="rounded-lg  col-span-8 bg-white">
          <div className="flex flex-col p-6">
            <h3 className="text-3xl font-semibold">
              Welcome back, FoodBeyonders d.o.o. 👋
            </h3>
            <div className="flex gap-12 mt-6">
              <div>
                <div class="flex flex-col">
                  <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200">
                    <svg
                      class="w-6 h-6 text-gray-800 "
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
                        d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                      />
                    </svg>
                  </div>
                  <span class="text-base font-semibold mt-3">
                    Stay on top of billing
                  </span>
                  <span class="text-sm text-gray-600">
                    Easily track invoices, payment methods, and tax information
                    to make sure your usage never gets interrupted.
                  </span>
                </div>
                <div class="flex gap-2 mt-3">
                  <a
                    href="/orders"
                    class="py-4 px-5 bg-pink-500 hover:bg-pink-600 font-semibold text-sm rounded-3xl text-white"
                  >
                    View Billing
                  </a>
                </div>
              </div>
              <div>
                <div class="flex flex-col">
                  <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200">
                    <svg
                      class="w-6 h-6 text-gray-800 "
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
                        d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <span class="text-base font-semibold mt-3">
                    Need assistance?
                  </span>
                  <span class="text-sm text-gray-600">
                    If you encounter issues with billing, API usage, or account
                    settings, our support team is ready to help. Open a ticket
                    and we’ll get back to you as soon as possible.
                  </span>
                </div>
                <div class="flex gap-2 mt-3">
                  <a
                    href="/tickets"
                    class="py-4 px-5 bg-pink-500 hover:bg-pink-600 font-semibold text-sm rounded-3xl text-white"
                  >
                    Open a Support Ticket
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg  col-span-4 bg-white">
          <div className="flex flex-col p-6">
            <div className="pb-3 mb-3 border-b border-gray-300">
              <h3 className="font-bold uppercase text-sm text-gray-700">
                Account preferences
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Company name</span>
                <span className="text-xs text-gray-600">
                  If specified, this name will appear on invoices instead of
                  your organization name.
                </span>
                <span className="border border-gray-300 rounded-lg p-2 mt-2 text-sm">
                  {user.company_name || "Not specified"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  Primary business address
                </span>
                <span className="text-xs text-gray-600">
                  This is the physical address of the company purchasing OpenAI
                  services and is used to calculate any applicable sales tax.
                </span>
                <span className="border border-gray-300 rounded-lg p-2 mt-2 text-sm">
                  {user.primary_address || "Not specified"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Billing email</span>
                <span className="text-xs text-gray-600">
                  Invoices and other billing notifications will be sent here.
                </span>
                <span className="border border-gray-300 rounded-lg p-2 mt-2 text-sm">
                  {user.billing_email || user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className=" rounded-lg  col-span-4 bg-white">
          <div className="flex flex-col p-6">
            <div className="pb-3 mb-3 border-b border-gray-300">
              <h3 className="font-bold uppercase text-sm text-gray-700">
                Payment methods
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Payment settings</span>
                <span className="text-xs text-gray-600">
                  Selected option to complete transactions.
                </span>
                <div className="flex border border-gray-300 rounded-lg p-2 mt-2 items-center gap-2">
                  <img
                    className="w-5"
                    src="https://assets.coingecko.com/coins/images/1/standard/bitcoin.png"
                    alt="Bitcoin"
                  />
                  <span className="text-sm">Bitcoin</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Payment Provider</span>
                <span className="text-xs text-gray-600">
                  Currently selected method to handle payments.
                </span>
                <span className="border border-gray-300 rounded-lg p-2 mt-2 text-sm">
                  {user.payment_provider || "Not specified"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Tax</span>
                <span className="text-xs text-gray-600">
                  Tax rate based on your company's location.
                </span>
                <span className="border border-gray-300 rounded-lg p-2 mt-2 text-sm">
                  {user.tax_percentage
                    ? `Croatia HR - ${user.tax_percentage}%`
                    : "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative rounded-lg col-span-4 text-white overflow-hidden bg-radial-[at_25%_25%] from-white to-rose-200 to-75% bg-cyan-800">
          {/* Glow krug kao poseban element */}
          <div
            className="absolute top-[5%] left-[5%] w-[250px] h-[250px] rounded-full
               bg-emerald-500 opacity-40 blur-[65px] z-10"
          />

          {/* Content */}
          <div className="relative flex flex-col p-6 z-10">
            <div className="pb-3 mb-3 border-b border-gray-300">
              <h3 className="font-bold uppercase text-sm">API Documentation</h3>
            </div>
            <div className="flex flex-col justify-start mt-6">
              <img
                src="img/Search.gif"
                alt="Search animation"
                className="mt-2 h-20 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col mt-3 justify-center text-center">
              <p className="text-base text-pink-100 mt-2">
                Step-by-step guides, API references and examples to get you
                started quickly.
              </p>
            </div>
            <div className="flex gap-2 mt-6 justify-center text-center">
              <a
                href="https://www.docs.blocklytics.net/"
                target="_blank"
                className="py-4 px-5 bg-cyan-500 hover:bg-cyan-950 font-semibold text-sm rounded-3xl text-white"
              >
                Explore our Docs
              </a>
            </div>
          </div>
        </div>
        <div className="col-span-12 h-full">
          <div className="rounded-lg  col-span-3 p-6 bg-white">
            <div className="pb-3 mb-3 border-b border-gray-300">
              <h3 className="font-bold uppercase text-sm text-gray-700">
                Order history
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
                  <span className="mt-2">{order.invoice_number}</span>
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
                        href={`https://ht-payway.com/index-invoice.php?key=${encodeURIComponent(
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

export default Dashboard;
