import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "flowbite";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const pageRef = useRef(0); // Track page value without causing re-renders

  const fetchNotifications = useCallback(async (reset = false, currentPageOverride = null) => {
    try {
      if (reset) {
      setLoading(true);
        setError(null);
        setPage(0);
        pageRef.current = 0;
      } else {
        setLoadingMore(true);
      }

      // Calculate current page - use override if provided, otherwise use ref
      const currentPage = reset ? 0 : (currentPageOverride !== null ? currentPageOverride : pageRef.current);
      const limit = 20;
      const offset = currentPage * limit;

      const response = await API.get("/api/notifications", {
        params: {
          limit,
          offset,
          include_archived: "true",
        },
      });

      const data = response.data?.notifications || response.data || [];
      const responseHasMore = response.data?.hasMore || false;
      const responseTotal = response.data?.total || 0;

      if (reset) {
      setNotifications(data);
        setPage(1);
        pageRef.current = 1;
      } else {
        setNotifications((prev) => [...prev, ...data]);
        setPage((prev) => {
          const newPage = prev + 1;
          pageRef.current = newPage;
          return newPage;
        });
      }

      setHasMore(responseHasMore);
      setTotal(responseTotal);
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setError("Request timed out. Please check your connection and try again.");
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        // Auth error - API interceptor will handle redirect
        setError("Session expired. Please log in again.");
      } else {
        setError(error.response?.data?.error || "Failed to load notifications. Please try again.");
      }
      if (reset) {
      setNotifications([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []); // No dependencies - function is stable

  useEffect(() => {
    // Reset and fetch when filter changes
    fetchNotifications(true, 0);
  }, [activeFilter, fetchNotifications]);


  const handleMarkAllAsRead = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      await API.put("/api/notifications/mark-all-read");
      setSuccessMessage("All notifications marked as read");
      await fetchNotifications(true);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError("Failed to mark all notifications as read. Please try again.");
    }
  };

  const handleCTAClick = async (action, notification) => {
    if (!action || !action.url) {
      return;
    }

    // Navigation handling
    if (action.url.startsWith("http://") || action.url.startsWith("https://")) {
      window.open(action.url, "_blank");
    } else {
      navigate(action.url);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNotifications(false, pageRef.current);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setError(null);
      await API.put(`/api/notifications/${notificationId}/seen`);
      
      // Update state immediately without refetching
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, seen: true } : n))
      );
    } catch (error) {
      setError("Failed to mark notification as read. Please try again.");
    }
  };

  const handleArchive = async (notificationId) => {
    try {
      setError(null);
      const response = await API.put(`/api/notifications/${notificationId}/archive`);
      setSuccessMessage("Notification archived");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Update state immediately without refetching
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, archived: true } : n))
      );
    } catch (error) {
      setError("Failed to archive notification. Please try again.");
    }
  };

  const handleUnarchive = async (notificationId) => {
    try {
      setError(null);
      const response = await API.put(`/api/notifications/${notificationId}/unarchive`);
      setSuccessMessage("Notification unarchived");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Update state immediately without refetching
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, archived: false } : n))
      );
    } catch (error) {
      setError("Failed to unarchive notification. Please try again.");
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }
    try {
      setError(null);
      await API.delete(`/api/notifications/${notificationId}`);
      setSuccessMessage("Notification deleted");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Update state immediately without refetching
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      setError("Failed to delete notification. Please try again.");
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read when clicked (if unread)
    if (!notification.seen) {
      await handleMarkAsRead(notification.id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  const formatDetailedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };

  // Memoize filtered notifications to avoid recalculating on every render
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    
    // First filter by archived status based on active filter
    if (activeFilter === "archived") {
      filtered = notifications.filter((n) => n.archived === true);
    } else {
      // For "all" and "unread", show only non-archived
      filtered = notifications.filter((n) => n.archived === false);
    }
    
    // Then filter by read status if needed
    if (activeFilter === "unread") {
      filtered = filtered.filter((n) => !n.seen);
    }
    
    return filtered;
  }, [notifications, activeFilter]);

  // Memoize counts to avoid recalculating on every render
  const counts = useMemo(() => {
    // Count only non-archived notifications for "All" and "Unread" tabs
    const nonArchived = notifications.filter((n) => n.archived === false);
    const all = nonArchived.length;
    const unread = nonArchived.filter((n) => !n.seen).length;
    const archived = notifications.filter((n) => n.archived === true).length;
    
    return { all, unread, archived };
  }, [notifications]);

  const getIconSVG = (iconType, isUnread) => {
    const iconColor = isUnread ? "text-pink-600" : "text-gray-600";
    const icons = {
      payment: (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      warning: (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      info: (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      outage: (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
      settings: (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      security: (
        <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
    return icons[iconType] || icons.info;
  };

  const renderNotificationItem = (notification) => {
    const isUnread = !notification.seen;
    const bgColor = isUnread ? "bg-pink-50 border-l-4 border-pink-500" : "bg-white border border-gray-200";
    const iconBg = isUnread ? "bg-pink-100" : "bg-gray-100";
    const isSecurity = notification.category === "Security" || notification.icon_type === "security";
    const hasMetadata = notification.metadata || notification.ip_address || notification.detailed_timestamp;

    return (
      <div 
        key={notification.id} 
        className={`flex gap-4 p-5 ${bgColor} rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>
            {getIconSVG(notification.icon_type || "info", isUnread)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`${
                  notification.category === "Action required"
                    ? "bg-pink-100 text-pink-800"
                    : "bg-gray-100 text-gray-800"
                } text-xs font-semibold px-2.5 py-0.5 rounded`}
              >
                {notification.category || "Notification"}
              </span>
              {isUnread && <span className="w-2 h-2 bg-pink-500 rounded-full"></span>}
            </div>
            <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{notification.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{notification.message || notification.description}</p>
          
          {/* Security notification metadata */}
          {isSecurity && hasMetadata && (
            <p className="text-xs text-gray-500 mb-3">
              {notification.ip_address && `IP: ${notification.ip_address}`}
              {notification.ip_address && notification.detailed_timestamp && " • "}
              {notification.detailed_timestamp && formatDetailedDate(notification.detailed_timestamp)}
            </p>
          )}
          
          {notification.actions && Array.isArray(notification.actions) && notification.actions.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {notification.actions.map((action, idx) => {
                if (action.type === "link") {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCTAClick(action, notification);
                      }}
                      className="text-sm font-medium text-pink-500 hover:text-pink-600"
                    >
                      {action.label}
                    </button>
                  );
                }
                return (
                <button
                  key={idx}
                  type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCTAClick(action, notification);
                    }}
                  className={
                    action.primary
                      ? "text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-semibold rounded-full text-sm px-5 py-2.5 text-center"
                      : "font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 text-sm px-5 py-2.5 text-center"
                  }
                >
                  {action.label}
                </button>
                );
              })}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-2 items-center">
            {!notification.seen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(notification.id);
                }}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
              >
                Mark as read
              </button>
            )}
            {!notification.archived ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive(notification.id);
                }}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
              >
                Archive
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnarchive(notification.id);
                }}
                className="text-xs text-gray-600 hover:text-gray-900 font-medium"
              >
                Unarchive
              </button>
            )}
            {!notification.is_global && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(notification.id);
                }}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-4 h-auto pt-20">
        <section className="bg-white py-8 lg:py-16 antialiased rounded-lg shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-center text-gray-600">Loading notifications...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-4 h-auto pt-20">
      <section className="bg-white py-8 lg:py-16 antialiased rounded-lg shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Stay updated with your latest activities</p>
            </div>
            <div className="flex gap-3">
              {activeFilter !== "archived" && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-pink-500 hover:text-pink-600 focus:outline-none"
              >
                Mark all as read
              </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
              <li className="mr-2" role="presentation">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeFilter === "all"
                      ? "border-pink-500 text-pink-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                  type="button"
                  role="tab"
                >
                  All{" "}
                  <span className="ml-1 text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                    {counts.all}
                  </span>
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  onClick={() => setActiveFilter("unread")}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeFilter === "unread"
                      ? "border-pink-500 text-pink-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                  type="button"
                  role="tab"
                >
                  Unread{" "}
                  <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {counts.unread}
                  </span>
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  onClick={() => setActiveFilter("archived")}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeFilter === "archived"
                      ? "border-pink-500 text-pink-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                  type="button"
                  role="tab"
                >
                  Archived
                  {counts.archived > 0 && (
                    <span className="ml-1 text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                      {counts.archived}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {activeFilter === "archived" 
                    ? "No archived notifications." 
                    : activeFilter === "unread"
                    ? "No unread notifications."
                    : "No notifications found."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => renderNotificationItem(notification))
            )}
          </div>

          {/* Load More */}
          {filteredNotifications.length > 0 && hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="font-semibold text-gray-900 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 text-base px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? "Loading..." : "Load More Notifications"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default NotificationCenter;

