import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import styled from "styled-components";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Info,
  Printer,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Coins,
} from "lucide-react";

const Container = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 16px 16px;

  @media print {
    padding: 0;
    max-width: 100%;
  }
`;

const Section = styled.section`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media print {
    box-shadow: none;
    border-radius: 0;
    padding: 20px;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media print {
    display: none;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    color: #111827;
    border-color: #d1d5db;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${(props) => (props.primary ? "#111827" : "white")};
  color: ${(props) => (props.primary ? "white" : "#6b7280")};
  font-weight: 500;
  font-size: 14px;
  border: 1px solid ${(props) => (props.primary ? "#111827" : "#e5e7eb")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: ${(props) => (props.primary ? "#1f2937" : "#f9fafb")};
    color: ${(props) => (props.primary ? "white" : "#111827")};
    border-color: ${(props) => (props.primary ? "#1f2937" : "#d1d5db")};
  }
`;

const ActionLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: #f9fafb;
    color: #111827;
    border-color: #d1d5db;
  }
`;

const PrintHeader = styled.div`
  display: none;

  @media print {
    display: block;
    text-align: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #111827;
  }
`;

const PrintLogo = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const PrintSubtitle = styled.p`
  font-size: 12px;
  color: #6b7280;
`;

const Header = styled.header`
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;

  @media print {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: #f3f4f6;
  color: #374151;

  @media print {
    border: 1px solid currentColor;
  }
`;

const InfoBox = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 24px;

  @media print {
    display: none;
  }
`;

const InfoIcon = styled.div`
  color: #9ca3af;
  flex-shrink: 0;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  @media print {
    background: white;
  }
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;

  @media print {
    font-size: 20px;
  }
`;

const SummaryIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => (props.positive ? "#dcfce7" : "#fee2e2")};
  color: ${(props) => (props.positive ? "#16a34a" : "#dc2626")};
`;

const SummaryNote = styled.div`
  font-size: 13px;
  color: #6b7280;
  max-width: 200px;
  text-align: right;

  @media (max-width: 640px) {
    text-align: center;
    max-width: none;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #e5e7eb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media print {
    border-radius: 0;
  }
`;

const DetailCard = styled.div`
  padding: 20px;
  background: white;

  @media print {
    padding: 12px;
  }
`;

const DetailLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const DetailValue = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #111827;

  @media print {
    font-size: 14px;
  }
`;

const DetailSubtext = styled.span`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
`;

const SectionContainer = styled.div`
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.5px;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }

  @media print {
    display: none;
  }
`;

const OrdersTable = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;

  @media print {
    border-radius: 0;
    font-size: 10px;
  }
`;

const OrdersTableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 12px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 900px) {
    display: none;
  }

  @media print {
    grid-template-columns: repeat(6, 1fr);
    padding: 8px 12px;
  }
`;

const OrdersTableHeaderCell = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media print {
    font-size: 9px;
  }
`;

const OrderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  @media print {
    grid-template-columns: repeat(6, 1fr);
    padding: 6px 12px;
  }
`;

const OrderCell = styled.div`
  font-size: 13px;
  color: #111827;

  @media (max-width: 900px) {
    &::before {
      content: attr(data-label);
      display: block;
      font-size: 10px;
      color: #9ca3af;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
  }

  @media print {
    font-size: 10px;
  }
`;

const OrderNumber = styled.span`
  font-family: monospace;
  font-size: 12px;
  color: #6b7280;

  @media print {
    font-size: 9px;
  }
`;

const DifferenceCell = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => (props.positive ? "#16a34a" : "#dc2626")};

  @media print {
    font-size: 10px;
  }
`;

const InvoiceSection = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;

  @media print {
    display: none;
  }
`;

const InvoiceTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InvoiceText = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
`;

const InvoiceButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #111827;
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #1f2937;
  }
`;

const PrintFooter = styled.div`
  display: none;

  @media print {
    display: block;
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    font-size: 11px;
    color: #6b7280;
    text-align: center;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 48px 0;
`;

const getStatusIcon = (status) => {
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

const getStatusLabel = (status) => {
  const labels = {
    credited: "Credit Issued",
    settled: "Invoice Settled",
    payment_required: "Invoice Pending",
    pending: "Processing",
  };
  return labels[status] || "Processing";
};

const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split("-");
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

// Calculate credit price based on reconciliation month
// Before Nov 2025: 0.19 EUR + 25% VAT = 0.2375 EUR per credit
// From Nov 2025: 0.21 EUR + 25% VAT = 0.2625 EUR per credit
const getCreditPrice = (monthStr) => {
  const [year, month] = monthStr.split("-").map(Number);
  if (year < 2025 || (year === 2025 && month < 11)) {
    return 0.2375;
  }
  return 0.2625;
};

const getBaseCreditPrice = (monthStr) => {
  const [year, month] = monthStr.split("-").map(Number);
  if (year < 2025 || (year === 2025 && month < 11)) {
    return 0.19;
  }
  return 0.21;
};

const calculateCredits = (differenceEur, monthStr) => {
  if (differenceEur <= 0) return 0;
  const pricePerCredit = getCreditPrice(monthStr);
  return Math.floor(differenceEur / pricePerCredit);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function ReconciliationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reconciliation, setReconciliation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/api/reconciliations/${id}`);
        setReconciliation(res.data);
      } catch (err) {
        console.error("Failed to fetch reconciliation:", err);
        navigate("/reconciliations");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !reconciliation) {
    return (
      <Container>
        <Section>
          <LoadingState>Loading reconciliation details...</LoadingState>
        </Section>
      </Container>
    );
  }

  const differenceEur = parseFloat(reconciliation.total_difference_eur);
  const isPositive = differenceEur >= 0;
  const orders = reconciliation.orders || [];
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 5);

  // Calculate credits received (only for overpayments)
  const creditsReceived = calculateCredits(differenceEur, reconciliation.month);
  const creditPrice = getCreditPrice(reconciliation.month);
  const baseCreditPrice = getBaseCreditPrice(reconciliation.month);

  return (
    <Container ref={printRef}>
      <Section>
        <ActionBar>
          <BackButton onClick={() => navigate("/billing?tab=reconciliations")}>
            <ArrowLeft size={16} />
            Back
          </BackButton>
          <ActionButtons>
            {reconciliation.invoice_url && (
              <ActionLink
                href={reconciliation.invoice_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={16} />
                Download Invoice
              </ActionLink>
            )}
            <ActionButton onClick={handlePrint}>
              <Printer size={16} />
              Print Report
            </ActionButton>
          </ActionButtons>
        </ActionBar>

        <PrintHeader>
          <PrintLogo>Blocklytics</PrintLogo>
          <PrintSubtitle>BTC/EUR Reconciliation Report</PrintSubtitle>
        </PrintHeader>

        <Header>
          <HeaderTop>
            <HeaderLeft>
              <Title>{formatMonth(reconciliation.month)} Reconciliation</Title>
              <Subtitle>
                <Calendar size={14} />
                {reconciliation.total_orders} orders · Created{" "}
                {new Date(reconciliation.created_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </Subtitle>
            </HeaderLeft>
            <StatusBadge status={reconciliation.status}>
              {getStatusIcon(reconciliation.status)}
              {getStatusLabel(reconciliation.status)}
            </StatusBadge>
          </HeaderTop>
        </Header>

        <InfoBox>
          <InfoIcon>
            <Info size={18} />
          </InfoIcon>
          <InfoText>
            This reconciliation compares the BTC amount requested in each order
            with the actual BTC received on-chain. Differences occur due to BTC
            price fluctuations between checkout and payment receipt.
          </InfoText>
        </InfoBox>

        <SummaryGrid>
          <SummaryCard>
            <div>
              <SummaryLabel>
                {isPositive ? "Total Overpayment" : "Total Underpayment"}
              </SummaryLabel>
              <SummaryValue>
                <SummaryIndicator positive={isPositive}>
                  {isPositive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                </SummaryIndicator>
                {isPositive ? "+" : ""}€
                {Math.abs(differenceEur).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </SummaryValue>
            </div>
            <SummaryNote>
              {isPositive
                ? "Credit note issued"
                : reconciliation.status === "settled"
                ? "Invoice settled"
                : "Invoice to be issued"}
            </SummaryNote>
          </SummaryCard>

          {isPositive && creditsReceived > 0 ? (
            <SummaryCard>
              <div>
                <SummaryLabel>Credits Added</SummaryLabel>
                <SummaryValue>
                  <Coins size={20} color="#6b7280" />
                  {creditsReceived.toLocaleString()}
                </SummaryValue>
              </div>
              <SummaryNote>
                €{baseCreditPrice.toFixed(2)} + VAT per credit
              </SummaryNote>
            </SummaryCard>
          ) : (
            <SummaryCard>
              <div>
                <SummaryLabel>Amount Due</SummaryLabel>
                <SummaryValue>
                  <FileText size={20} color="#6b7280" />€
                  {Math.abs(differenceEur).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </SummaryValue>
              </div>
              <SummaryNote>
                {reconciliation.status === "settled"
                  ? "Invoice paid"
                  : reconciliation.invoice_url
                  ? "Invoice issued"
                  : "Invoice pending"}
              </SummaryNote>
            </SummaryCard>
          )}
        </SummaryGrid>

        <DetailsGrid>
          <DetailCard>
            <DetailLabel>Total EUR Ordered</DetailLabel>
            <DetailValue>
              €
              {parseFloat(reconciliation.total_order_eur).toLocaleString(
                "en-US",
                { minimumFractionDigits: 2 }
              )}
            </DetailValue>
          </DetailCard>
          <DetailCard>
            <DetailLabel>Total BTC Ordered</DetailLabel>
            <DetailValue>
              {parseFloat(reconciliation.total_order_btc).toFixed(8)}
              <DetailSubtext> BTC</DetailSubtext>
            </DetailValue>
          </DetailCard>
          <DetailCard>
            <DetailLabel>Total BTC Received</DetailLabel>
            <DetailValue>
              {parseFloat(reconciliation.total_wallet_btc).toFixed(8)}
              <DetailSubtext> BTC</DetailSubtext>
            </DetailValue>
          </DetailCard>
          <DetailCard>
            <DetailLabel>Avg. BTC Rate</DetailLabel>
            <DetailValue>
              €{parseFloat(reconciliation.avg_btc_rate).toLocaleString("en-US")}
            </DetailValue>
          </DetailCard>
        </DetailsGrid>

        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Order Details ({orders.length} orders)</SectionTitle>
            {orders.length > 5 && (
              <ToggleButton onClick={() => setShowAllOrders(!showAllOrders)}>
                {showAllOrders ? (
                  <>
                    Show Less <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Show All ({orders.length}) <ChevronDown size={14} />
                  </>
                )}
              </ToggleButton>
            )}
          </SectionHeader>

          <OrdersTable>
            <OrdersTableHeader>
              <OrdersTableHeaderCell>Order</OrdersTableHeaderCell>
              <OrdersTableHeaderCell>Date</OrdersTableHeaderCell>
              <OrdersTableHeaderCell>Order BTC</OrdersTableHeaderCell>
              <OrdersTableHeaderCell>Received BTC</OrdersTableHeaderCell>
              <OrdersTableHeaderCell>Rate</OrdersTableHeaderCell>
              <OrdersTableHeaderCell>Difference</OrdersTableHeaderCell>
            </OrdersTableHeader>

            {displayedOrders.map((order) => {
              const orderDiffEur = parseFloat(order.difference_eur);
              const orderIsPositive = orderDiffEur >= 0;

              return (
                <OrderRow key={order.id}>
                  <OrderCell data-label="Order">
                    <OrderNumber>{order.order_number}</OrderNumber>
                  </OrderCell>
                  <OrderCell data-label="Date">
                    {formatDate(order.order_date)}
                  </OrderCell>
                  <OrderCell data-label="Order BTC">
                    {parseFloat(order.order_btc).toFixed(8)}
                  </OrderCell>
                  <OrderCell data-label="Received BTC">
                    {parseFloat(order.wallet_btc).toFixed(8)}
                  </OrderCell>
                  <OrderCell data-label="Rate">
                    €{parseFloat(order.btc_rate).toLocaleString("en-US")}
                  </OrderCell>
                  <DifferenceCell
                    data-label="Difference"
                    positive={orderIsPositive}
                  >
                    {orderIsPositive ? "+" : ""}€
                    {orderDiffEur.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </DifferenceCell>
                </OrderRow>
              );
            })}
          </OrdersTable>
        </SectionContainer>

        {!isPositive && reconciliation.invoice_url && (
          <InvoiceSection>
            <InvoiceTitle>
              <FileText size={18} />
              Invoice Available
            </InvoiceTitle>
            <InvoiceText>
              An invoice has been issued for the underpayment amount. Please
              download and settle within 7 days of issuance.
            </InvoiceText>
            <InvoiceButton
              href={reconciliation.invoice_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={16} />
              Download Invoice
            </InvoiceButton>
          </InvoiceSection>
        )}

        <PrintFooter>
          <p>
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>Blocklytics — BTC/EUR Reconciliation System</p>
        </PrintFooter>
      </Section>
    </Container>
  );
}

export default ReconciliationDetails;
