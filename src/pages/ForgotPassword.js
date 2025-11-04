import React, { useState } from "react";
import API from "../api/api";
import logo from "../static/logo.webp";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.post("/api/users/forgot-password", { email });
      setSuccess("Password reset email sent successfully.");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to send password reset email");
    }
  };

  return (
    <main className="mx-48 p-4 h-auto pt-20">
      <section className="py-24">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
          >
            <img className="h-14 mr-2" src={logo} alt="logo" />
          </a>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border border-gray-300 mt-6">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="font-mono text-3xl font-bold text-gray-900 pb-6 pt-3">
                Reset your password
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit}
              >
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-500 text-sm">{success}</div>}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-semibold rounded-full text-base px-5 py-3 text-center"
                >
                  Send reset link
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;

