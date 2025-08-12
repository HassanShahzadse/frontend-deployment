import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import API from "../api/api";

function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "" });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get("/api/tickets", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Tickets loaded:", res.data); // 👈 dodano
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;

    try {
      const res = await API.post(
        "/api/tickets",
        { title: form.title, message: form.message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTickets((prev) => [res.data.ticket, ...prev]);
      setForm({ title: "", message: "" });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Ticket creation failed:", err);
      alert("Failed to create ticket.");
    }
  };

  return (
    <main className="mx-48 p-4 h-auto pt-20">
      <section className="bg-white py-8 lg:py-16 antialiased">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-bold text-gray-900">Tickets</h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
            >
              Open New Ticket
            </button>
          </div>

          {isModalOpen && (
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Create New Ticket
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
                      placeholder="Enter subject"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      required
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
                      placeholder="Describe your issue..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-pink-700 text-white px-4 py-2 rounded-lg hover:bg-pink-800 transition"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <p className="mt-8 text-gray-500">Loading...</p>
          ) : tickets.length === 0 ? (
            <p className="mt-8 text-gray-500">You have no tickets yet.</p>
          ) : (
            Array.isArray(tickets) &&
            tickets.map((ticket) => (
              <Link to={`/tickets/${ticket.id}`} key={ticket.id}>
                <article className="py-6 text-base bg-white border rounded-lg border-gray-300 px-8 my-4 grid grid-cols-12 gap-2 hover:bg-gray-100 cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Ticket ID</span>
                    <span className="mt-2">#{ticket.id.slice(0, 6)}</span>
                  </div>
                  <div className="flex flex-col col-span-4">
                    <span className="text-xs text-gray-400">Title</span>
                    <span className="mt-2 font-medium">{ticket.title}</span>
                  </div>
                  <div className="flex flex-col col-span-2 pr-6">
                    <span className="text-xs text-gray-400">Status</span>
                    <div className="mt-2">
                      <span
                        className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm border
    ${
      ticket.status === "closed"
        ? "bg-gray-200 text-gray-700 border-gray-400"
        : ticket.status === "resolved"
        ? "bg-green-100 text-green-800 border-green-400"
        : "bg-yellow-100 text-yellow-800 border-yellow-300"
    }`}
                      >
                        {ticket.status
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-xs text-gray-400">Date Created</span>
                    <span className="mt-2">
                      {dayjs(ticket.created_at).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-xs text-gray-400">Last Updated</span>
                    <span className="mt-2">
                      {dayjs(ticket.updated_at).format("MMM D, YYYY")}
                    </span>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default TicketsList;
