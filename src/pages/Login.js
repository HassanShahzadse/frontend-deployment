import React, { useState, useEffect } from "react";
import API from "../api/api";
import "flowbite";
import logo from "../static/logo.webp";

import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/"); // možeš promijeniti na gdje želiš
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
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
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm">{error}</div>}
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
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-pink-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-pink-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-semibold rounded-full text-base px-5 py-3 text-center"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    className="font-medium text-pink-600 hover:underline"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
