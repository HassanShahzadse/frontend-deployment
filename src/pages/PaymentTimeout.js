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
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Timed Out</h1>
      <p className="mt-4 text-gray-700">Key: {key}</p>
      <p className="mt-2 text-sm text-gray-500">
        {loading ? "Resetting invoice..." : message}
      </p>
      {!loading && (
        <p className="mt-2 text-xs text-gray-400">
          Redirecting to homepage in 3 seconds...
        </p>
      )}
    </div>
  );
}

export default PaymentTimeout;
