import React from "react";
import { useEffect, useState } from "react";
import API from "../api/api";
import styled from "styled-components";
import {
  FileText,
  HelpCircle,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Bell,
  CreditCard,
  AlertTriangle,
  Info,
  Settings,
  Shield,
  ArrowRight,
} from "lucide-react";

import CreditBalanceBox from "../components/CreditBalanceBox";
import { useNavigate } from "react-router-dom";

const Container = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 16px 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  margin-bottom: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  grid-column: span ${(props) => props.span || 4};

  @media (max-width: 1024px) {
    grid-column: span 12;
  }
`;

const WelcomeCard = styled(Card)`
  grid-column: span 8;

  @media (max-width: 1024px) {
    grid-column: span 12;
  }
`;

const CardHeader = styled.div`
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.5px;
`;

const ViewAllLink = styled.a`
  font-size: 12px;
  font-weight: 600;
  color: #ec4899;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #db2777;
  }
`;

const WelcomeTitle = styled.h3`
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
`;

const WelcomeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #6b7280;
`;

const SectionTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

const SectionDescription = styled.span`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  border-radius: 24px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(236, 72, 153, 0.25);
  width: fit-content;

  &:hover {
    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(236, 72, 153, 0.3);
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const InfoDescription = styled.span`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const InfoValue = styled.div`
  padding: 10px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BitcoinIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const APICard = styled(Card)`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0e7490 0%, #155e75 100%);
  color: white;

  &::before {
    content: "";
    position: absolute;
    top: 10%;
    left: 10%;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: #10b981;
    opacity: 0.3;
    filter: blur(65px);
    pointer-events: none;
  }
`;

const APIContent = styled.div`
  position: relative;
  z-index: 1;
`;

const APIHeader = styled(CardHeader)`
  border-bottom-color: rgba(255, 255, 255, 0.2);
`;

const APITitle = styled(CardTitle)`
  color: white;
`;

const APIImage = styled.img`
  height: 80px;
  width: auto;
  margin: 24px 0;
`;

const APIDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const APIButton = styled(Button)`
  background: #06b6d4;
  margin: 0 auto;

  &:hover {
    background: #0e7490;
  }
`;

const OrdersCard = styled(Card)`
  grid-column: span 12;
`;

const OrderRow = styled.article`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const OrderColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderLabel = styled.span`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
`;

const OrderValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #111827;
`;

const OrderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  width: fit-content;

  ${(props) => {
    switch (props.status) {
      case "paid":
        return "background: #dcfce7; color: #166534;";
      case "pending":
        return "background: #fef3c7; color: #92400e;";
      case "canceled":
        return "background: #fee2e2; color: #991b1b;";
      case "timeout":
        return "background: #fed7aa; color: #9a3412;";
      case "failed":
        return "background: #fce7f3; color: #9f1239;";
      default:
        return "background: #f3f4f6; color: #374151;";
    }
  }}
`;

const DownloadLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ec4899;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #db2777;
  }
`;

const ItalicText = styled.span`
  font-style: italic;
  color: #9ca3af;
  font-size: 14px;
`;

const LoadingSkeleton = styled.div`
  background: #f3f4f6;
  border-radius: 8px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// Notifications Styles
const NotificationsCard = styled(Card)`
  grid-column: span 12;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: ${(props) => (props.isUnread ? "#fef2f8" : "#f9fafb")};
  border: 1px solid ${(props) => (props.isUnread ? "#fce7f3" : "#e5e7eb")};
  border-left: 3px solid
    ${(props) => (props.isUnread ? "#ec4899" : "transparent")};
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const NotificationIcon = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
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
  margin-bottom: 4px;
`;

const NotificationTitle = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NotificationDate = styled.span`
  font-size: 11px;
  color: #9ca3af;
`;

const NotificationMessage = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
`;

const UnreadDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ec4899;
`;

const EmptyNotifications = styled.div`
  text-align: center;
  padding: 32px 0;
  color: #9ca3af;
`;

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await API.get("/api/orders");
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.orders)
          ? res.data.orders
          : [];
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sorted.slice(0, 3));
      } catch (err) {
        console.error(
          "❌ Failed to fetch orders:",
          err.response?.data || err.message
        );
        setOrders([]);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/api/notifications", {
          params: {
            limit: 5,
            offset: 0,
          },
        });
        const data = response.data?.notifications || response.data || [];
        // Filter out archived notifications and take only first 5
        const filtered = data.filter((n) => !n.archived).slice(0, 5);
        setNotifications(filtered);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={16} />;
      case "canceled":
      case "failed":
        return <XCircle size={16} />;
      case "pending":
      case "timeout":
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      paid: "Order paid",
      canceled: "Order canceled",
      pending: "Order pending",
      timeout: "Order expired",
      failed: "Order failed",
    };
    return labels[status] || "Order canceled";
  };

  const getNotificationIcon = (iconType, isUnread) => {
    const icons = {
      payment: CreditCard,
      warning: AlertTriangle,
      info: Info,
      outage: XCircle,
      settings: Settings,
      security: Shield,
    };
    const IconComponent = icons[iconType] || Bell;
    return <IconComponent size={18} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleNotificationClick = (notification) => {
    navigate("/notifications");
  };

  if (loading) {
    return (
      <Container>
        <Grid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} span={4}>
              <LoadingSkeleton style={{ height: "150px" }} />
            </Card>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          Loading user data...
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Grid>
        <CreditBalanceBox />

        <WelcomeCard>
          <WelcomeTitle>Welcome back, FoodBeyonders d.o.o. 👋</WelcomeTitle>
          <WelcomeGrid>
            <WelcomeSection>
              <IconCircle>
                <FileText size={24} />
              </IconCircle>
              <SectionTitle>Stay on top of billing</SectionTitle>
              <SectionDescription>
                Easily track invoices, payment methods, and tax information to
                make sure your usage never gets interrupted.
              </SectionDescription>
              <Button href="/orders">View Billing</Button>
            </WelcomeSection>

            <WelcomeSection>
              <IconCircle>
                <HelpCircle size={24} />
              </IconCircle>
              <SectionTitle>Need assistance?</SectionTitle>
              <SectionDescription>
                If you encounter issues with billing, API usage, or account
                settings, our support team is ready to help. Open a ticket and
                we'll get back to you as soon as possible.
              </SectionDescription>
              <Button href="/tickets">Open a Support Ticket</Button>
            </WelcomeSection>
          </WelcomeGrid>
        </WelcomeCard>

        {/* Notifications Card */}
        <NotificationsCard>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <ViewAllLink href="/notifications">
              View all
              <ArrowRight size={14} />
            </ViewAllLink>
          </CardHeader>

          {notifications.length === 0 ? (
            <EmptyNotifications>
              <Bell size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
              <p>No new notifications</p>
            </EmptyNotifications>
          ) : (
            <NotificationsList>
              {notifications.map((notification) => {
                const isUnread = !notification.seen;
                return (
                  <NotificationItem
                    key={notification.id}
                    isUnread={isUnread}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <NotificationIcon isUnread={isUnread}>
                      {getNotificationIcon(notification.icon_type, isUnread)}
                    </NotificationIcon>
                    <NotificationContent>
                      <NotificationHeader>
                        <NotificationTitle>
                          {notification.title}
                          {isUnread && <UnreadDot />}
                        </NotificationTitle>
                        <NotificationDate>
                          {formatDate(notification.created_at)}
                        </NotificationDate>
                      </NotificationHeader>
                      <NotificationMessage>
                        {notification.message || notification.description}
                      </NotificationMessage>
                    </NotificationContent>
                  </NotificationItem>
                );
              })}
            </NotificationsList>
          )}
        </NotificationsCard>

        <OrdersCard>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>

          {orders.map((order) => (
            <OrderRow key={order.id}>
              <OrderColumn>
                <OrderLabel>Order ID</OrderLabel>
                <OrderValue>
                  <OrderIcon>
                    <FileText size={16} />
                  </OrderIcon>
                  <span style={{ fontWeight: 500 }}>{order.order_number}</span>
                </OrderValue>
              </OrderColumn>

              <OrderColumn>
                <OrderLabel>Invoice</OrderLabel>
                <OrderValue>
                  {order.status === "paid" ? (
                    order.invoice_number
                  ) : (
                    <ItalicText>Invoice not available</ItalicText>
                  )}
                </OrderValue>
              </OrderColumn>

              <OrderColumn>
                <OrderLabel>Status</OrderLabel>
                <StatusBadge status={order.status}>
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </StatusBadge>
              </OrderColumn>

              <OrderColumn>
                <OrderLabel>Date</OrderLabel>
                <OrderValue>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </OrderValue>
              </OrderColumn>

              <OrderColumn>
                <OrderLabel>Amount</OrderLabel>
                <OrderValue style={{ fontWeight: 600 }}>
                  €{parseFloat(order.price_eur).toFixed(2)}
                </OrderValue>
              </OrderColumn>

              <OrderColumn>
                <OrderLabel>Invoice</OrderLabel>
                {order.status === "paid" ? (
                  <DownloadLink
                    target="_blank"
                    href={`http://ht-payway.com/index-invoice.php?key=${encodeURIComponent(
                      order.encrypted_key
                    )}`}
                  >
                    <Download size={18} />
                    Download
                  </DownloadLink>
                ) : (
                  <ItalicText>Invoice not available</ItalicText>
                )}
              </OrderColumn>
            </OrderRow>
          ))}
        </OrdersCard>

        <Card span={4}>
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
          </CardHeader>
          <InfoRow>
            <InfoItem>
              <InfoLabel>Company name</InfoLabel>
              <InfoDescription>
                If specified, this name will appear on invoices instead of your
                organization name.
              </InfoDescription>
              <InfoValue>{user.company_name || "Not specified"}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Primary business address</InfoLabel>
              <InfoDescription>
                This is the physical address of the company purchasing services.
              </InfoDescription>
              <InfoValue>{user.primary_address || "Not specified"}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Billing email</InfoLabel>
              <InfoDescription>
                Invoices and other billing notifications will be sent here.
              </InfoDescription>
              <InfoValue>{user.billing_email || user.email}</InfoValue>
            </InfoItem>
          </InfoRow>
        </Card>

        <Card span={4}>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <InfoRow>
            <InfoItem>
              <InfoLabel>Payment settings</InfoLabel>
              <InfoDescription>
                Selected option to complete transactions.
              </InfoDescription>
              <InfoValue>
                <BitcoinIcon
                  src="https://assets.coingecko.com/coins/images/1/standard/bitcoin.png"
                  alt="Bitcoin"
                />
                Bitcoin
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Payment Provider</InfoLabel>
              <InfoDescription>
                Currently selected method to handle payments.
              </InfoDescription>
              <InfoValue>{user.payment_provider || "Not specified"}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Tax</InfoLabel>
              <InfoDescription>
                Tax rate based on your company's location.
              </InfoDescription>
              <InfoValue>
                {user.tax_percentage
                  ? `Croatia HR - ${user.tax_percentage}%`
                  : "Not specified"}
              </InfoValue>
            </InfoItem>
          </InfoRow>
        </Card>

        <APICard span={4}>
          <APIContent>
            <APIHeader>
              <APITitle>API Documentation</APITitle>
            </APIHeader>
            <div style={{ textAlign: "center" }}>
              <APIImage src="img/Search.gif" alt="Search animation" />
              <APIDescription>
                Step-by-step guides, API references and examples to get you
                started quickly.
              </APIDescription>
              <APIButton
                href="https://docs.blocklytics.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore our Docs
              </APIButton>
            </div>
          </APIContent>
        </APICard>
      </Grid>
    </Container>
  );
}

export default Dashboard;
