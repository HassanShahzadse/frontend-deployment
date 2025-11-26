import React, { useState, useEffect } from "react";
import API from "../api/api";
import logo from "../static/logo.webp";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();

  // Decode the token from URL and validate on mount
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. No token provided.");
      setTokenValid(false);
      return;
    }

    try {
      // Decode the URL-encoded token
      const decodedToken = decodeURIComponent(token);
      // Basic validation - check if it looks like a JWT (has 3 parts separated by dots)
      if (decodedToken && decodedToken.split('.').length === 3) {
        setTokenValid(true);
      } else {
        setError("Invalid reset token format.");
        setTokenValid(false);
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Invalid reset link. Please request a new password reset.");
      setTokenValid(false);
    }
  }, [token]);

  const getPasswordStrength = (password) => {
    if (!password) return { strength: "", color: "" };
    if (password.length < 6) return { strength: "Weak", color: "text-red-500" };
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      return { strength: "Medium", color: "text-yellow-500" };
    return { strength: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !tokenValid) {
      setError("Invalid reset token. Please request a new password reset link.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      // Decode token before sending to API
      const decodedToken = decodeURIComponent(token);
      await API.post(`/api/users/reset-password/${decodedToken}`, {
        password: newPassword,
      });
      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = err.response?.data?.error || "Failed to reset password. The link may have expired.";
      setError(errorMessage);
      if (err.response?.status === 400 && errorMessage.includes("expired")) {
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while validating token
  if (tokenValid === null) {
    return (
      <main className="mx-4 sm:mx-8 md:mx-16 lg:mx-48 p-4 h-auto pt-20">
        <section className="py-12 sm:py-24">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border border-gray-300 mt-6">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  <p className="mt-4 text-gray-600">Validating reset link...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <main className="mx-4 sm:mx-8 md:mx-16 lg:mx-48 p-4 h-auto pt-20">
        <section className="py-12 sm:py-24">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <a
              href="/"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
            >
              <img className="h-14 mr-2" src={logo} alt="logo" />
            </a>
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border border-gray-300 mt-6">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="font-mono text-2xl sm:text-3xl font-bold text-gray-900 pb-6 pt-3">
                  Invalid Reset Link
                </h1>
                <div className="text-red-500 text-sm mb-4">{error}</div>
                <p className="text-gray-600 mb-4">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="w-full text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-semibold rounded-full text-base px-5 py-3 text-center"
                >
                  Request New Reset Link
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-4 sm:mx-8 md:mx-16 lg:mx-48 p-4 h-auto pt-20">
      <section className="py-12 sm:py-24">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <a
            href="/"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
          >
            <img className="h-14 mr-2" src={logo} alt="logo" />
          </a>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border border-gray-300 mt-6">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="font-mono text-2xl sm:text-3xl font-bold text-gray-900 pb-6 pt-3">
                Reset your password
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit}
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                    {success}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  {newPassword && (
                    <p className={`mt-1 text-xs ${passwordStrength.color}`}>
                      Password strength: {passwordStrength.strength}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-semibold rounded-full text-base px-5 py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;


