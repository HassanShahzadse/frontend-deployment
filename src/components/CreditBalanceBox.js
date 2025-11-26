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
    <div className="relative rounded-lg col-span-12 lg:col-span-4 text-white overflow-hidden bg-radial-[at_25%_25%] from-white to-rose-200 to-75% bg-[#160c1e]">
      {/* Glow krug kao poseban element */}
      <div
        className="absolute top-[5%] left-[5%] w-[250px] h-[250px] rounded-full
               bg-pink-500 opacity-40 blur-[65px] z-10"
      />

      {/* Content */}
      <div className="relative flex flex-col p-6 z-10">
        <div className="pb-3 mb-3 border-b border-gray-300">
          <h3 className="font-bold uppercase text-sm">Pay as you go</h3>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold mt-2">Credit balance</span>
          <span className="text-6xl font-semibold my-3">
            {loading ? "Loading..." : balance.toLocaleString("de-DE")}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <a
            href="/payment"
            className="py-4 px-5 bg-pink-500 hover:bg-pink-600 font-semibold text-sm rounded-3xl text-white"
          >
            Add to credit balance
          </a>
        </div>
        <div className="flex flex-col mt-3">
          <p className="text-xs text-pink-100 mt-2">
            When your credit balance reaches 0, your API requests will stop
            working.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreditBalanceBox;
