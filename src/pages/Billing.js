import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronRight,
  CreditCard,
  RefreshCw,
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

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

const PageDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.active ? "#ec4899" : "#6b7280")};
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? "#ec4899" : "transparent")};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;

  &:hover {
    color: #ec4899;
  }
`;

const TabBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: ${(props) => (props.active ? "#fce7f3" : "#f3f4f6")};
  color: ${(props) => (props.active ? "#ec4899" : "#6b7280")};
`;

const SectionHeader = styled.div`
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.5px;
`;

const ItemCount = styled.span`
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

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.article`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  align-items: center;
  padding: 20px 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
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

const Column = styled.div`
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

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.div`
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

const PrimaryText = styled.span`
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
      case "credited":
        return "background: #dcfce7; color: #166534;";
      case "pending":
        return "background: #fef3c7; color: #92400e;";
      case "canceled":
      case "failed":
        return "background: #fee2e2; color: #991b1b;";
      case "timeout":
        return "background: #fed7aa; color: #9a3412;";
      case "settled":
        return "background: #f3f4f6; color: #374151;";
      case "payment_required":
        return "background: #fef3c7; color: #92400e;";
      default:
        return "background: #e0e7ff; color: #3730a3;";
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

const ActionLink = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ec4899;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s ease;

  &:hover {
    color: #db2777;
  }
`;

const DifferenceValue = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.positive ? "#16a34a" : "#dc2626")};
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

// Helper functions
const getOrderStatusIcon = (status) => {
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

const getOrderStatusLabel = (status) => {
  const labels = {
    paid: "Order paid",
    canceled: "Order canceled",
    pending: "Order pending",
    timeout: "Order expired",
    failed: "Order failed",
  };
  return labels[status] || "Order canceled";
};

const getReconciliationStatusIcon = (status) => {
  switch (status) {
    case "credited":
    case "settled":
      return <CheckCircle size={14} />;
    case "payment_required":
      return <AlertCircle size={14} />;
    default:
      return <Clock size={14} />;
  }
};

const getReconciliationStatusLabel = (status) => {
  const labels = {
    credited: "Credits added",
    settled: "Settled",
    payment_required: "Payment required",
    pending: "Processing",
  };
  return labels[status] || "Processing";
};

const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split("-");
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

function Billing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "orders"
  );
  const navigate = useNavigate();

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  // Reconciliations state
  const [reconciliations, setReconciliations] = useState([]);
  const [reconciliationsLoading, setReconciliationsLoading] = useState(true);

  // User state
  const [user, setUser] = useState(null);

  const LIMIT = 20;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Fetch orders
  const fetchOrders = async (currentPage, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setOrdersLoading(true);
      }

      const res = await API.get("/api/orders");

      const allOrders = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.orders)
        ? res.data.orders
        : [];

      const sorted = allOrders.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      const startIndex = 0;
      const endIndex = (currentPage + 1) * LIMIT;
      const paginatedOrders = sorted.slice(startIndex, endIndex);
      const total = sorted.length;
      const hasMoreOrders = endIndex < total;

      setOrders(paginatedOrders);
      setTotalOrders(total);
      setHasMore(hasMoreOrders);
      setPage(currentPage);

      if (!isLoadMore) {
        sessionStorage.setItem("allOrders", JSON.stringify(sorted));
      }
    } catch (err) {
      console.error(
        "Failed to fetch orders:",
        err.response?.data || err.message
      );
      if (!isLoadMore) {
        setOrders([]);
      }
    } finally {
      setOrdersLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch reconciliations
  const fetchReconciliations = async () => {
    try {
      setReconciliationsLoading(true);
      const res = await API.get("/api/reconciliations");
      setReconciliations(res.data);
    } catch (err) {
      console.error("Failed to fetch reconciliations:", err);
    } finally {
      setReconciliationsLoading(false);
    }
  };

  // Fetch user
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

  useEffect(() => {
    fetchOrders(0);
    fetchReconciliations();
    fetchUser();
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOrders(page + 1, true);
    }
  };

  const handleReconciliationClick = (id) => {
    navigate(`/reconciliations/${id}`);
  };

  const isLoading =
    activeTab === "orders" ? ordersLoading || !user : reconciliationsLoading;

  return (
    <Container>
      <Section>
        <PageHeader>
          <PageTitle>Billing</PageTitle>
          <PageDescription>
            Manage your orders and monthly reconciliations
          </PageDescription>
        </PageHeader>

        <TabsContainer>
          <Tab
            active={activeTab === "orders"}
            onClick={() => handleTabChange("orders")}
          >
            <CreditCard size={18} />
            Orders
            {totalOrders > 0 && (
              <TabBadge active={activeTab === "orders"}>{totalOrders}</TabBadge>
            )}
          </Tab>
          <Tab
            active={activeTab === "reconciliations"}
            onClick={() => handleTabChange("reconciliations")}
          >
            <RefreshCw size={18} />
            Reconciliations
            {reconciliations.length > 0 && (
              <TabBadge active={activeTab === "reconciliations"}>
                {reconciliations.length}
              </TabBadge>
            )}
          </Tab>
        </TabsContainer>

        {isLoading ? (
          <LoadingState>
            Loading {activeTab === "orders" ? "orders" : "reconciliations"}...
          </LoadingState>
        ) : activeTab === "orders" ? (
          <>
            <SectionHeader>
              <SectionTitle>Order list</SectionTitle>
              {totalOrders > 0 && (
                <ItemCount>
                  Showing {orders.length} of {totalOrders} orders
                </ItemCount>
              )}
            </SectionHeader>

            {orders.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <FileText size={32} />
                </EmptyIcon>
                <EmptyText>No orders found.</EmptyText>
              </EmptyState>
            ) : (
              <>
                <TableContainer>
                  {orders.map((order) => (
                    <Row key={order.id}>
                      <Column>
                        <ColumnLabel>Order ID</ColumnLabel>
                        <IconContainer>
                          <IconWrapper>
                            <FileText size={16} />
                          </IconWrapper>
                          <PrimaryText>{order.order_number}</PrimaryText>
                        </IconContainer>
                      </Column>

                      <Column>
                        <ColumnLabel>Invoice</ColumnLabel>
                        {order.status === "paid" ? (
                          <ColumnValue>{order.invoice_number}</ColumnValue>
                        ) : (
                          <ItalicText>Invoice not available</ItalicText>
                        )}
                      </Column>

                      <Column>
                        <ColumnLabel>Status</ColumnLabel>
                        <StatusBadge status={order.status}>
                          {getOrderStatusIcon(order.status)}
                          {getOrderStatusLabel(order.status)}
                        </StatusBadge>
                      </Column>

                      <Column>
                        <ColumnLabel>Date</ColumnLabel>
                        <ColumnValue>
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </ColumnValue>
                      </Column>

                      <Column>
                        <ColumnLabel>Amount</ColumnLabel>
                        <ColumnValue bold>
                          €{parseFloat(order.price_eur).toFixed(2)}
                        </ColumnValue>
                      </Column>

                      <Column>
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
                      </Column>
                    </Row>
                  ))}
                </TableContainer>

                {hasMore && (
                  <LoadMoreContainer>
                    <LoadMoreButton
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Orders"
                      )}
                    </LoadMoreButton>
                  </LoadMoreContainer>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <SectionHeader>
              <SectionTitle>Monthly Reconciliations</SectionTitle>
              {reconciliations.length > 0 && (
                <ItemCount>
                  {reconciliations.length} reconciliation
                  {reconciliations.length !== 1 ? "s" : ""}
                </ItemCount>
              )}
            </SectionHeader>

            {reconciliations.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <Calendar size={32} />
                </EmptyIcon>
                <EmptyText>No reconciliations available yet.</EmptyText>
              </EmptyState>
            ) : (
              <TableContainer>
                {reconciliations.map((rec) => {
                  const differenceEur = parseFloat(rec.total_difference_eur);
                  const isPositive = differenceEur >= 0;

                  return (
                    <Row
                      key={rec.id}
                      clickable
                      onClick={() => handleReconciliationClick(rec.id)}
                    >
                      <Column>
                        <ColumnLabel>Period</ColumnLabel>
                        <IconContainer>
                          <IconWrapper>
                            <FileText size={16} />
                          </IconWrapper>
                          <PrimaryText>{formatMonth(rec.month)}</PrimaryText>
                        </IconContainer>
                      </Column>

                      <Column>
                        <ColumnLabel>Orders</ColumnLabel>
                        <ColumnValue>{rec.total_orders} orders</ColumnValue>
                      </Column>

                      <Column>
                        <ColumnLabel>Total EUR</ColumnLabel>
                        <ColumnValue>
                          €
                          {parseFloat(rec.total_order_eur).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </ColumnValue>
                      </Column>

                      <Column>
                        <ColumnLabel>Status</ColumnLabel>
                        <StatusBadge status={rec.status}>
                          {getReconciliationStatusIcon(rec.status)}
                          {getReconciliationStatusLabel(rec.status)}
                        </StatusBadge>
                      </Column>

                      <Column>
                        <ColumnLabel>Adjustment</ColumnLabel>
                        <DifferenceValue positive={isPositive}>
                          {isPositive ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          {isPositive ? "+" : ""}€
                          {differenceEur.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </DifferenceValue>
                      </Column>

                      <Column>
                        <ColumnLabel>Action</ColumnLabel>
                        <ActionLink>
                          <ChevronRight size={18} />
                          View Details
                        </ActionLink>
                      </Column>
                    </Row>
                  );
                })}
              </TableContainer>
            )}
          </>
        )}
      </Section>
    </Container>
  );
}

export default Billing;
