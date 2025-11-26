import React, { useEffect, useState } from "react";
import API from "../api/api";
import styled from "styled-components";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader,
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
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.5px;
`;

const OrderCount = styled.span`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
`;

const LoadingState = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 48px 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
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

const OrdersTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderRow = styled.article`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  align-items: center;
  padding: 20px 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #ec4899;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const OrderColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const ColumnLabel = styled.span`
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const ColumnValue = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OrderID = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
  flex-shrink: 0;
`;

const OrderNumber = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 600;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
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

const ItalicText = styled.span`
  font-style: italic;
  color: #9ca3af;
  font-size: 14px;
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

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const LoadMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #ec4899;
    color: #ec4899;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const getStatusIcon = (status) => {
  switch (status) {
    case "paid":
      return <CheckCircle size={14} />;
    case "canceled":
    case "failed":
      return <XCircle size={14} />;
    case "pending":
    case "timeout":
      return <Clock size={14} />;
    default:
      return <AlertCircle size={14} />;
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

function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const LIMIT = 20;

  const fetchOrders = async (currentPage, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await API.get("/api/orders");

      // Dohvati sve ordere
      const allOrders = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.orders)
        ? res.data.orders
        : [];

      // Sortiraj po datumu
      const sorted = allOrders.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // Implementiraj client-side paginaciju
      const startIndex = 0;
      const endIndex = (currentPage + 1) * LIMIT;
      const paginatedOrders = sorted.slice(startIndex, endIndex);
      const totalOrders = sorted.length;
      const hasMoreOrders = endIndex < totalOrders;

      setOrders(paginatedOrders);
      setTotal(totalOrders);
      setHasMore(hasMoreOrders);
      setPage(currentPage);

      // Spremi sve ordere u state za client-side paginaciju
      if (!isLoadMore) {
        sessionStorage.setItem("allOrders", JSON.stringify(sorted));
      }
    } catch (err) {
      console.error(
        "❌ Failed to fetch orders:",
        err.response?.data || err.message
      );
      if (!isLoadMore) {
        setOrders([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
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
      }
    };

    fetchUser();
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOrders(page + 1, true);
    }
  };

  if (loading || !user) {
    return (
      <Container>
        <Section>
          <LoadingState>Loading orders...</LoadingState>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Header>
          <Title>Pay as you go</Title>
          {total > 0 && (
            <OrderCount>
              Showing {orders.length} of {total} orders
            </OrderCount>
          )}
        </Header>

        {orders.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FileText size={32} />
            </EmptyIcon>
            <EmptyText>No orders found.</EmptyText>
          </EmptyState>
        ) : (
          <>
            <OrdersTable>
              {orders.map((order) => (
                <OrderRow key={order.id}>
                  <OrderColumn>
                    <ColumnLabel>Order ID</ColumnLabel>
                    <OrderID>
                      <OrderIcon>
                        <FileText size={16} />
                      </OrderIcon>
                      <OrderNumber>{order.order_number}</OrderNumber>
                    </OrderID>
                  </OrderColumn>

                  <OrderColumn>
                    <ColumnLabel>Invoice</ColumnLabel>
                    {order.status === "paid" ? (
                      <ColumnValue>{order.invoice_number}</ColumnValue>
                    ) : (
                      <ItalicText>Invoice not available</ItalicText>
                    )}
                  </OrderColumn>

                  <OrderColumn>
                    <ColumnLabel>Status</ColumnLabel>
                    <StatusBadge status={order.status}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </StatusBadge>
                  </OrderColumn>

                  <OrderColumn>
                    <ColumnLabel>Date</ColumnLabel>
                    <ColumnValue>
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </ColumnValue>
                  </OrderColumn>

                  <OrderColumn>
                    <ColumnLabel>Amount</ColumnLabel>
                    <ColumnValue bold>
                      €{parseFloat(order.price_eur).toFixed(2)}
                    </ColumnValue>
                  </OrderColumn>

                  <OrderColumn>
                    <ColumnLabel>Invoice</ColumnLabel>
                    {order.status === "paid" ? (
                      <DownloadLink
                        target="_blank"
                        rel="noopener noreferrer"
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
            </OrdersTable>

            {hasMore && (
              <LoadMoreContainer>
                <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More Orders`
                  )}
                </LoadMoreButton>
              </LoadMoreContainer>
            )}
          </>
        )}
      </Section>
    </Container>
  );
}

export default Orders;
