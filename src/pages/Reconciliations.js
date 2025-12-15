import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import styled from "styled-components";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  FileText,
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

const ReconciliationCount = styled.span`
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

const ReconciliationsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReconciliationRow = styled.article`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  align-items: center;
  padding: 20px 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
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

const ReconciliationColumn = styled.div`
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

const PeriodID = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PeriodIcon = styled.div`
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

const PeriodText = styled.span`
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
      case "credited":
        return "background: #dcfce7; color: #166534;";
      case "settled":
        return "background: #f3f4f6; color: #374151;";
      case "payment_required":
        return "background: #fef3c7; color: #92400e;";
      default:
        return "background: #e0e7ff; color: #3730a3;";
    }
  }}
`;

const DifferenceValue = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.positive ? "#16a34a" : "#dc2626")};
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

function Reconciliations() {
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReconciliations = async () => {
      try {
        const res = await API.get("/api/reconciliations");
        setReconciliations(res.data);
      } catch (err) {
        console.error("Failed to fetch reconciliations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReconciliations();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/reconciliations/${id}`);
  };

  if (loading) {
    return (
      <Container>
        <Section>
          <LoadingState>Loading reconciliations...</LoadingState>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Header>
          <Title>Monthly Reconciliations</Title>
          {reconciliations.length > 0 && (
            <ReconciliationCount>
              {reconciliations.length} reconciliation
              {reconciliations.length !== 1 ? "s" : ""}
            </ReconciliationCount>
          )}
        </Header>

        {reconciliations.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Calendar size={32} />
            </EmptyIcon>
            <EmptyText>No reconciliations available yet.</EmptyText>
          </EmptyState>
        ) : (
          <ReconciliationsTable>
            {reconciliations.map((rec) => {
              const differenceEur = parseFloat(rec.total_difference_eur);
              const isPositive = differenceEur >= 0;

              return (
                <ReconciliationRow
                  key={rec.id}
                  onClick={() => handleRowClick(rec.id)}
                >
                  <ReconciliationColumn>
                    <ColumnLabel>Period</ColumnLabel>
                    <PeriodID>
                      <PeriodIcon>
                        <FileText size={16} />
                      </PeriodIcon>
                      <PeriodText>{formatMonth(rec.month)}</PeriodText>
                    </PeriodID>
                  </ReconciliationColumn>

                  <ReconciliationColumn>
                    <ColumnLabel>Orders</ColumnLabel>
                    <ColumnValue>{rec.total_orders} orders</ColumnValue>
                  </ReconciliationColumn>

                  <ReconciliationColumn>
                    <ColumnLabel>Total EUR</ColumnLabel>
                    <ColumnValue>
                      €
                      {parseFloat(rec.total_order_eur).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </ColumnValue>
                  </ReconciliationColumn>

                  <ReconciliationColumn>
                    <ColumnLabel>Status</ColumnLabel>
                    <StatusBadge status={rec.status}>
                      {getStatusIcon(rec.status)}
                      {getStatusLabel(rec.status)}
                    </StatusBadge>
                  </ReconciliationColumn>

                  <ReconciliationColumn>
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
                  </ReconciliationColumn>

                  <ReconciliationColumn>
                    <ColumnLabel>Action</ColumnLabel>
                    <ActionLink>
                      <ChevronRight size={18} />
                      View Details
                    </ActionLink>
                  </ReconciliationColumn>
                </ReconciliationRow>
              );
            })}
          </ReconciliationsTable>
        )}
      </Section>
    </Container>
  );
}

export default Reconciliations;
