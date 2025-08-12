import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import API from "../api/api";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [waitingReply, setWaitingReply] = useState(false);

  const fetchTicket = async () => {
    try {
      const res = await API.get(`/api/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTicket(res.data.ticket);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Failed to load ticket:", err);
      navigate("/tickets");
    } finally {
      setLoading(false);
    }
  };

  const requestChatGPTReply = async () => {
    setWaitingReply(true);
    try {
      await API.post(`/api/tickets/${id}/chatgpt-reply`, {});

      const updated = await API.get(`/api/tickets/${id}`);
      setMessages(updated.data.messages);
    } catch (err) {
      console.error("Failed to get ChatGPT reply:", err);
    } finally {
      setWaitingReply(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchTicket();
      await requestChatGPTReply();
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await API.post(`/api/tickets/${id}/messages`, {
        message: newMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          message: newMessage,
          created_at: new Date().toISOString(),
        },
      ]);

      setNewMessage("");
      await requestChatGPTReply();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <main className="mx-48 p-4 h-auto pt-20">
      <section className="bg-white py-8 lg:py-16 antialiased">
        <div className="max-w-4xl mx-auto px-4">
          <header className="mb-4 lg:mb-6 not-format">
            <button
              onClick={() => navigate(-1)}
              className="text-base text-pink-500 mb-6 block"
            >
              ← Back
            </button>
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
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 lg:mb-6 lg:text-3xl mt-6">
              Ticket: {ticket.title}
            </h1>
            <p className="text-base text-gray-500">
              {dayjs(ticket.created_at).format("MMM D, YYYY")}
            </p>
          </header>

          {messages.map((msg, index) => (
            <article
              key={index}
              className="py-6 text-base bg-white border-b border-gray-300"
            >
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src={
                        msg.sender === "admin"
                          ? "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                          : "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                      }
                      alt={msg.sender}
                    />
                    {msg.sender === "admin" ? "Support" : "You"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {dayjs(msg.created_at).format("MMM D, YYYY")}
                  </p>
                </div>
              </footer>
              <p className="text-gray-800 whitespace-pre-line">{msg.message}</p>
            </article>
          ))}

          {waitingReply && (
            <p className="text-sm text-gray-500 mt-4 italic">
              ChatGPT is typing a reply...
            </p>
          )}

          <form onSubmit={handleSubmit} className="my-6">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg border border-gray-200">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows="6"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="px-0 w-full text-base text-gray-900 border-0 focus:ring-0 focus:outline-none"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-base font-medium text-center text-white bg-pink-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
              disabled={waitingReply}
            >
              {waitingReply ? "Waiting for reply..." : "Post comment"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default TicketDetails;
