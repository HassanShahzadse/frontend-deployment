import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import visaLogo from "../static/icons/visa.png";
import mastercardLogo from "../static/icons/mastercard.png";
import bitcoinLogo from "../static/icons/bitcoin.png";

function PaymentSteps() {
  const [step, setStep] = useState(1);
  const [apiCalls, setApiCalls] = useState("");
  const [pricing, setPricing] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleNext = async (e) => {
    e.preventDefault();

    // Očisti formatirani broj
    const cleanApiCalls = Number(apiCalls.replace(/\./g, ""));

    if (step === 1) {
      try {
        const res = await API.post("/api/orders/preview", {
          apiCalls: cleanApiCalls,
        });
        setPricing(res.data);
        setStep(2);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch pricing");
      }
    } else if (step === 2) {
      setStep(3);
      try {
        const res = await API.post(
          "/api/orders",
          {
            amount: 1,
            currency: "EUR",
            price_eur: pricing.total,
            price_btc: pricing.btc,
            api_calls_quantity: cleanApiCalls,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const encryptedKey = res.data.encrypted_key;
        window.location.href = `https://ht-payway.com/?key=${encodeURIComponent(
          encryptedKey
        )}`;
      } catch (err) {
        setError(err.response?.data?.error || "Failed to create order");
      }
    }
  };

  const handleChangeApiCalls = (e) => {
    // Ukloni sve točke i niječe brojeve
    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    const number = Number(rawValue);

    // Ako nije broj, ne mijenjaj
    if (isNaN(number)) return;

    // Formatiraj broj s točkama
    const formatted = number.toLocaleString("de-DE"); // koristi točku kao tisućicu

    setApiCalls(formatted);
  };

  return (
    <main className="mx-4 sm:mx-8 md:mx-16 lg:mx-48 p-4 h-auto pt-20">
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="relative rounded-lg col-span-4 overflow-hidden bg-radial-[at_25%_25%] from-white to-rose-200 to-75% bg-[#160c1e]">
          <div
            class="absolute top-[0%] left-[5%] w-[500px] h-[500px] rounded-full
 bg-pink-500 opacity-40 blur-[150px] z-10"
          ></div>
          <section className="py-8 antialiased">
            <form
              onSubmit={handleNext}
              className="mx-auto max-w-screen-xl px-4 2xl:px-0"
            >
              <div className="my-12 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16 justify-center">
                <div className="min-w-0 flex-1 space-y-8 max-w-lg p-12 rounded-lg bg-white">
                  {step === 1 && (
                    <>
                      <div>
                        <div className="flex gap-2 items-end">
                          <div className="flex items-center w-10 h-10 bg-gray-200 justify-center rounded-full">
                            <span className="font-bold text-base">1</span>
                          </div>
                          <span className="text-xs">/ 3 Steps</span>
                        </div>
                        <h3 className="text-gray-900 text-sm mt-3">
                          Add to credit balance
                        </h3>
                      </div>
                      <div>
                        <div className="flex items-center gap-4 py-12">
                          <label
                            htmlFor="your_name"
                            className="block text-gray-800 text-xl font-medium"
                          >
                            Enter number of API calls you want
                          </label>
                        </div>
                      </div>
                      <div className="pb-12">
                        <input
                          type="text"
                          id="apiCalls"
                          value={apiCalls}
                          onChange={handleChangeApiCalls}
                          required
                          className="text-4xl block w-full text-gray-900 font-bold border-0 focus:border-0 py-4 border-b border-gray-300"
                          placeholder="0"
                        />
                        {error && (
                          <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                      </div>
                    </>
                  )}
                  {step === 2 && pricing && (
                    <>
                      <div className="space-y-4">
                        <div>
                          <div className="flex gap-2 items-end">
                            <div className="flex items-center w-10 h-10 bg-gray-200 justify-center rounded-full">
                              <span className="font-bold text-base">2</span>
                            </div>
                            <span className="text-xs">/ 3 Steps</span>
                          </div>
                          <h3 className="text-gray-900 text-sm mt-3">
                            Add to credit balance
                          </h3>
                        </div>
                        <div>
                          <div className="flex items-center gap-4 py-12">
                            <label
                              htmlFor="your_name"
                              className="block text-gray-800 text-xl font-medium"
                            >
                              Review your order
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                          <div>
                            <label
                              htmlFor="your_name"
                              className="mb-2 block text-sm text-gray-600"
                            >
                              Total to pay
                            </label>
                            <div className="flex">
                              <div className="flex items-center justify-center py-2 gap-2">
                                <img
                                  className="w-5"
                                  src="https://cdn2.iconfinder.com/data/icons/european-flags-3/100/European-512.png"
                                  alt="EU flag"
                                />
                                <span className="text-xl font-bold">EUR</span>
                              </div>
                              <div className="text-4xl block w-full py-3 text-gray-900 font-bold text-right">
                                <span className="text-gray-900">
                                  {pricing.total}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flow-root">
                        <div className="-my-3">
                          <dl className="flex items-center justify-between gap-4 py-2">
                            <dt className="text-base font-normal text-gray-500">
                              API Calls
                            </dt>
                            <dd className="text-base font-normal text-gray-900">
                              {apiCalls}
                            </dd>
                          </dl>
                          <dl className="flex items-center justify-between gap-4 py-2">
                            <dt className="text-base font-normal text-gray-500">
                              Unit price
                            </dt>
                            <dd className="text-base font-normal text-gray-900">
                              0,21 EUR / API Call
                            </dd>
                          </dl>
                          <dl className="flex items-center justify-between gap-2 py-2">
                            <dt className="text-base font-normal text-gray-500">
                              Subtotal
                            </dt>
                            <dd className="text-base font-normal text-gray-900">
                              {pricing.subtotal} EUR
                            </dd>
                          </dl>
                          <dl className="flex items-center justify-between gap-4 py-2">
                            <dt className="text-base font-normal text-gray-500">
                              Tax
                            </dt>
                            <dd className="text-base font-normal text-gray-900">
                              {pricing.taxPercentage}%
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div
                          className="p-3 border rounded-lg w-full flex flex-col cursor-pointer hover:bg-slate-100"
                          onClick={() => setShowModal(true)}
                        >
                          <div className="flex justify-between">
                            <div className="flex gap-2 opacity-40">
                              <img className="h-6" src={visaLogo} alt="Visa" />
                              <img
                                className="h-6"
                                src={mastercardLogo}
                                alt="Mastercard"
                              />
                            </div>
                            <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">
                              Soon
                            </span>
                          </div>
                          <h5 className="text-base font-semibold mt-2 opacity-40">
                            Pay with Credit card
                          </h5>
                        </div>
                        <div className="p-3 border-2 border-black rounded-lg w-full flex flex-col cursor-pointer hover:bg-slate-100">
                          <div className="flex gap-2">
                            <img
                              className="h-6"
                              src={bitcoinLogo}
                              alt="Bitcoin"
                            />
                          </div>
                          <h5 className="text-base font-semibold mt-2">
                            Pay with Bitcoin
                          </h5>
                        </div>
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <div>
                        <div className="flex gap-2 items-end">
                          <div className="flex items-center w-10 h-10 bg-gray-200 justify-center rounded-full">
                            <span className="font-bold text-base">3</span>
                          </div>
                          <span className="text-xs">/ 3 Steps</span>
                        </div>
                        <h3 className="text-gray-900 text-sm mt-3">
                          Add to credit balance
                        </h3>
                      </div>

                      <div>
                        <div className="flex items-center gap-4 py-12">
                          <img className="w-12" src="img/loading.webp"></img>
                          <label
                            htmlFor="your_name"
                            className="block text-gray-800 text-xl font-medium"
                          >
                            Preparing payment details...
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3 pt-6">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-3xl bg-pink-500 hover:bg-pink-600 px-5 py-4 text-lg font-semibold text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                    >
                      {step === 1
                        ? "Next Step"
                        : step === 2
                        ? "Proceed to Payment"
                        : "Redirecting..."}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Coming Soon</h2>
            <p>This payment method will be available soon.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-pink-500 text-white  hover:bg-pink-600 focus:ring-4 focus:ring-gray-300 font-semibold tracking-tighter rounded-3xl text-base px-4 lg:px-6 py-2 lg:py-3 mr-2  focus:outline-none "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default PaymentSteps;
