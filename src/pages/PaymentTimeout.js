import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentTimeout() {
  const [params] = useSearchParams();
  const key = params.get("key");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Pozovi backend kako bi se obrisao samo invoice_number
    async function resetInvoiceNumber() {
      try {
        const res = await fetch(
          `${API_BASE}/api/orders/reset-invoice?key=${encodeURIComponent(key)}`,
          {
            method: "PATCH",
          }
        );
        const data = await res.json();

        if (res.ok) {
          setMessage("❌ Payment not received. Invoice number removed.");
        } else {
          setMessage(
            "⚠️ Failed to reset invoice number: " +
              (data.error || "Unknown error")
          );
        }
      } catch (err) {
        setMessage("⚠️ Error connecting to server.");
      } finally {
        setLoading(false);
      }
    }

    resetInvoiceNumber();
  }, [key, API_BASE]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, navigate]);

  return (
    <div className="flex justify-center w-full p-4 sm:p-8 md:p-12">
      <div className="bg-white p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center rounded-lg">
        <img className="w-32 sm:w-40 md:w-48" src="/img/cross.gif"></img>
        <h1 className="text-2xl sm:text-3xl font-bold">Payment Timeout</h1>
        <p className="mt-4 text-gray-600 max-w-md">
          The payment window has expired. Unfortunately, your order was canceled
          because the payment was not received on time.
        </p>
        <p className="mt-4   text-xs text-gray-400">
          Redirecting in 3 seconds...
        </p>
      </div>
    </div>
  );
}

export default PaymentTimeout;
