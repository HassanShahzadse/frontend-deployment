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
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        ✅ Payment Successful
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {loading ? "Updating order status..." : message}
      </p>
      <p className="mt-2 text-xs text-gray-400">Redirecting in 3 seconds...</p>
    </div>
  );
}

export default PaymentSuccess;
