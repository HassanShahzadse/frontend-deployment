import React, { useEffect, useState } from "react";
import API from "../api/api";

function CreditBalanceBox() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await API.get("/api/credit-balance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(res.data);
        const { totalRemaining } = res.data;
        setBalance(totalRemaining >= 0 ? totalRemaining : 0);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, []);

  return (
    <div className="border rounded-lg border-gray-300 col-span-4 bg-radial-[at_25%_25%] from-white to-rose-200 to-75%">
      <div className="flex flex-col p-6">
        <div className="pb-3 mb-3 border-b border-gray-300">
          <h3 className="font-bold uppercase text-sm text-gray-900">
            Pay as you go
          </h3>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">Credit balance</span>
          <span className="text-5xl font-semibold my-3">
            {loading ? "Loading..." : balance.toLocaleString("de-DE")}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <a
            href="/payment"
            className="py-4 px-5 bg-black hover:bg-gray-800 font-semibold text-sm rounded-lg text-white"
          >
            Add to credit balance
          </a>
        </div>
        <div className="flex flex-col mt-3">
          <p className="text-xs text-gray-600">
            When your credit balance reaches €0, your API requests will stop
            working.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreditBalanceBox;
