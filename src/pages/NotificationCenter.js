import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Bell,
  CreditCard,
  AlertTriangle,
  Info,
  XCircle,
  Settings,
  Shield,
  CheckCircle,
  Archive,
  ArchiveRestore,
  Trash2,
} from "lucide-react";

const Container = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 16px 16px;
`;

const Section = styled.section`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const MarkAllButton = styled.button`
  padding: 10px 20px;
  background: white;
  color: #ec4899;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #ec4899;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fce7f3;
  }
`;

const MessageBox = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  ${(props) =>
    props.type === "error" &&
    `
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #991b1b;
  `}

  ${(props) =>
    props.type === "success" &&
    `
    background: #dcfce7;
    border: 1px solid #86efac;
    color: #166534;
  `}
`;

const TabsContainer = styled.div`
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const TabsList = styled.ul`
  display: flex;
  gap: 8px;
  margin-bottom: -1px;
`;

const TabButton = styled.button`
  padding: 12px 20px;
  border-bottom: 2px solid
    ${(props) => (props.active ? "#ec4899" : "transparent")};
  color: ${(props) => (props.active ? "#ec4899" : "#6b7280")};
  font-weight: 600;
  font-size: 14px;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${(props) => (props.active ? "#ec4899" : "#374151")};
  }
`;

const Badge = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => (props.active ? "#fce7f3" : "#f3f4f6")};
  color: ${(props) => (props.active ? "#ec4899" : "#6b7280")};
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: ${(props) => (props.isUnread ? "#fef2f8" : "white")};
  border: 1px solid ${(props) => (props.isUnread ? "#fce7f3" : "#e5e7eb")};
  border-left: 4px solid
    ${(props) => (props.isUnread ? "#ec4899" : "transparent")};
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => (props.isUnread ? "#fce7f3" : "#f3f4f6")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isUnread ? "#ec4899" : "#6b7280")};
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CategoryBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => (props.isAction ? "#fce7f3" : "#f3f4f6")};
  color: ${(props) => (props.isAction ? "#ec4899" : "#6b7280")};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const UnreadDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ec4899;
`;

const DateText = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const NotificationTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

const NotificationMessage = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.5;
`;

const MetadataText = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const ActionButton = styled.button`
  padding: ${(props) => (props.primary ? "10px 20px" : "10px 20px")};
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
      : "white"};
  color: ${(props) => (props.primary ? "white" : "#ec4899")};
  font-weight: 600;
  font-size: 14px;
  border: ${(props) => (props.primary ? "none" : "1px solid #ec4899")};
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.primary
        ? "linear-gradient(135deg, #db2777 0%, #be185d 100%)"
        : "#fce7f3"};
    transform: translateY(-1px);
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.danger ? "#dc2626" : "#6b7280")};
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${(props) => (props.danger ? "#fee2e2" : "#f3f4f6")};
    color: ${(props) => (props.danger ? "#991b1b" : "#111827")};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #9ca3af;
`;

const EmptyText = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
`;

const LoadMoreButton = styled.button`
  width: 100%;
  max-width: 300px;
  margin: 32px auto 0;
  display: block;
  padding: 12px 24px;
  background: white;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #ec4899;
    color: #ec4899;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 48px 0;
`;

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
  const pageRef = useRef(0);

  const fetchNotifications = useCallback(
    async (reset = false, currentPageOverride = null) => {
      try {
        if (reset) {
          setLoading(true);
          setError(null);
          setPage(0);
          pageRef.current = 0;
        } else {
          setLoadingMore(true);
        }

        const currentPage = reset
          ? 0
          : currentPageOverride !== null
          ? currentPageOverride
          : pageRef.current;
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
        if (
          error.code === "ECONNABORTED" ||
          error.message.includes("timeout")
        ) {
          setError(
            "Request timed out. Please check your connection and try again."
          );
        } else if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          setError("Session expired. Please log in again.");
        } else {
          setError(
            error.response?.data?.error ||
              "Failed to load notifications. Please try again."
          );
        }
        if (reset) {
          setNotifications([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
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
      await API.put(`/api/notifications/${notificationId}/archive`);
      setSuccessMessage("Notification archived");
      setTimeout(() => setSuccessMessage(null), 3000);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, archived: true } : n
        )
      );
    } catch (error) {
      setError("Failed to archive notification. Please try again.");
    }
  };

  const handleUnarchive = async (notificationId) => {
    try {
      setError(null);
      await API.put(`/api/notifications/${notificationId}/unarchive`);
      setSuccessMessage("Notification unarchived");
      setTimeout(() => setSuccessMessage(null), 3000);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, archived: false } : n
        )
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

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      setError("Failed to delete notification. Please try again.");
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.seen) {
      await handleMarkAsRead(notification.id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDetailedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (activeFilter === "archived") {
      filtered = notifications.filter((n) => n.archived === true);
    } else {
      filtered = notifications.filter((n) => n.archived === false);
    }

    if (activeFilter === "unread") {
      filtered = filtered.filter((n) => !n.seen);
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });
  }, [notifications, activeFilter]);

  const counts = useMemo(() => {
    const nonArchived = notifications.filter((n) => n.archived === false);
    const all = nonArchived.length;
    const unread = nonArchived.filter((n) => !n.seen).length;
    const archived = notifications.filter((n) => n.archived === true).length;

    return { all, unread, archived };
  }, [notifications]);

  const getIcon = (iconType, isUnread) => {
    const icons = {
      payment: CreditCard,
      warning: AlertTriangle,
      info: Info,
      outage: XCircle,
      settings: Settings,
      security: Shield,
    };
    const IconComponent = icons[iconType] || Info;
    return <IconComponent size={20} />;
  };

  if (loading) {
    return (
      <Container>
        <Section>
          <LoadingState>Loading notifications...</LoadingState>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Header>
          <HeaderContent>
            <Title>Notifications</Title>
            <Subtitle>Stay updated with your latest activities</Subtitle>
          </HeaderContent>
          {activeFilter !== "archived" && (
            <MarkAllButton onClick={handleMarkAllAsRead}>
              Mark all as read
            </MarkAllButton>
          )}
        </Header>

        {error && (
          <MessageBox type="error">
            <AlertTriangle size={18} />
            {error}
          </MessageBox>
        )}

        {successMessage && (
          <MessageBox type="success">
            <CheckCircle size={18} />
            {successMessage}
          </MessageBox>
        )}

        <TabsContainer>
          <TabsList>
            <li>
              <TabButton
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              >
                All
                <Badge active={activeFilter === "all"}>{counts.all}</Badge>
              </TabButton>
            </li>
            <li>
              <TabButton
                active={activeFilter === "unread"}
                onClick={() => setActiveFilter("unread")}
              >
                Unread
                <Badge active={activeFilter === "unread"}>
                  {counts.unread}
                </Badge>
              </TabButton>
            </li>
            <li>
              <TabButton
                active={activeFilter === "archived"}
                onClick={() => setActiveFilter("archived")}
              >
                Archived
                {counts.archived > 0 && (
                  <Badge active={activeFilter === "archived"}>
                    {counts.archived}
                  </Badge>
                )}
              </TabButton>
            </li>
          </TabsList>
        </TabsContainer>

        <NotificationsList>
          {filteredNotifications.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Bell size={32} />
              </EmptyIcon>
              <EmptyText>
                {activeFilter === "archived"
                  ? "No archived notifications."
                  : activeFilter === "unread"
                  ? "No unread notifications."
                  : "No notifications found."}
              </EmptyText>
            </EmptyState>
          ) : (
            filteredNotifications.map((notification) => {
              const isUnread = !notification.seen;
              const isSecurity =
                notification.category === "Security" ||
                notification.icon_type === "security";
              const hasMetadata =
                notification.metadata ||
                notification.ip_address ||
                notification.detailed_timestamp;
              const isActionRequired =
                notification.category === "Action required";

              return (
                <NotificationCard
                  key={notification.id}
                  isUnread={isUnread}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <IconWrapper isUnread={isUnread}>
                    {getIcon(notification.icon_type || "info", isUnread)}
                  </IconWrapper>

                  <NotificationContent>
                    <NotificationHeader>
                      <CategoryBadge isAction={isActionRequired}>
                        {notification.category || "Notification"}
                        {isUnread && <UnreadDot />}
                      </CategoryBadge>
                      <DateText>{formatDate(notification.created_at)}</DateText>
                    </NotificationHeader>

                    <NotificationTitle>{notification.title}</NotificationTitle>
                    <NotificationMessage>
                      {notification.message || notification.description}
                    </NotificationMessage>

                    {isSecurity && hasMetadata && (
                      <MetadataText>
                        {notification.ip_address &&
                          `IP: ${notification.ip_address}`}
                        {notification.ip_address &&
                          notification.detailed_timestamp &&
                          " • "}
                        {notification.detailed_timestamp &&
                          formatDetailedDate(notification.detailed_timestamp)}
                      </MetadataText>
                    )}

                    {notification.actions &&
                      Array.isArray(notification.actions) &&
                      notification.actions.length > 0 && (
                        <ActionsContainer>
                          {notification.actions.map((action, idx) => (
                            <ActionButton
                              key={idx}
                              primary={action.primary}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCTAClick(action, notification);
                              }}
                            >
                              {action.label}
                            </ActionButton>
                          ))}
                        </ActionsContainer>
                      )}

                    <ControlsContainer>
                      {!notification.seen && (
                        <ControlButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          Mark as read
                        </ControlButton>
                      )}
                      {!notification.archived ? (
                        <ControlButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(notification.id);
                          }}
                        >
                          <Archive size={14} />
                          Archive
                        </ControlButton>
                      ) : (
                        <ControlButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnarchive(notification.id);
                          }}
                        >
                          <ArchiveRestore size={14} />
                          Unarchive
                        </ControlButton>
                      )}
                      {!notification.is_global && (
                        <ControlButton
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </ControlButton>
                      )}
                    </ControlsContainer>
                  </NotificationContent>
                </NotificationCard>
              );
            })
          )}
        </NotificationsList>

        {filteredNotifications.length > 0 && hasMore && (
          <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load More Notifications"}
          </LoadMoreButton>
        )}
      </Section>
    </Container>
  );
}

export default NotificationCenter;
