import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const [params] = useSearchParams();
  const key = params.get("key");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Pozivaj backend za ažuriranje statusa narudžbe
    async function updateOrderStatus() {
      try {
        const res = await fetch(
          `${API_BASE}/payment/success?key=${encodeURIComponent(key)}`
        );
        const data = await res.json();

        if (res.ok) {
          setMessage("✅ Payment confirmed and saved.");
        } else {
          setMessage(
            "⚠️ Failed to update payment status: " +
              (data.error || "Unknown error")
          );
        }
      } catch (err) {
        setMessage("⚠️ Error connecting to server.");
      } finally {
        setLoading(false);
      }
    }

    updateOrderStatus();

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [key, navigate]);

  return (
    <div className="flex justify-center w-full p-4 sm:p-8 md:p-12">
      <div className="bg-white p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center rounded-lg">
        <img className="w-32 sm:w-40 md:w-48" src="/img/check.gif"></img>
        <h1 className="text-2xl sm:text-3xl font-bold">Payment Successful</h1>
        <p className="mt-4 text-gray-600 max-w-md">
          Thank you for your purchase. Your payment has been confirmed and your
          order is now being processed.
        </p>
        <p className="mt-4   text-xs text-gray-400">
          Redirecting in 3 seconds...
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
