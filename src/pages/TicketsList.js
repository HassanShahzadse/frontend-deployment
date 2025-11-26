import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import API from "../api/api";
import styled from "styled-components";
import { Ticket, X, CheckCircle, Clock, XCircle } from "lucide-react";

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

const Title = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
`;

const CreateButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(236, 72, 153, 0.25);

  &:hover {
    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(236, 72, 153, 0.3);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 32px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 16px;
  color: #111827;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 16px;
  color: #111827;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
  font-weight: 600;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.3);

  &:hover {
    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
    box-shadow: 0 20px 25px -5px rgba(236, 72, 153, 0.4);
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 16px;
  padding: 48px 0;
`;

const LoadingState = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 16px;
  padding: 48px 0;
`;

const TicketsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TicketCard = styled(Link)`
  display: grid;
  grid-template-columns: 120px 1fr 140px 140px 140px;
  gap: 16px;
  align-items: center;
  padding: 20px 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    background: #f9fafb;
    border-color: #ec4899;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const TicketColumn = styled.div`
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
  font-size: 16px;
  color: #111827;
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TicketID = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TicketIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fce7f3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ec4899;
  flex-shrink: 0;
`;

const TicketNumber = styled.span`
  font-size: 16px;
  color: #111827;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
  text-transform: capitalize;

  ${(props) => {
    switch (props.status) {
      case "closed":
        return `
          background: #f3f4f6;
          color: #374151;
        `;
      case "resolved":
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case "open":
      default:
        return `
          background: #fef3c7;
          color: #92400e;
        `;
    }
  }}
`;

const getStatusIcon = (status) => {
  switch (status) {
    case "closed":
      return <XCircle size={14} />;
    case "resolved":
      return <CheckCircle size={14} />;
    case "open":
    default:
      return <Clock size={14} />;
  }
};

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

        console.log("Tickets loaded:", res.data);
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
    <Container>
      <Section>
        <Header>
          <Title>Support Tickets</Title>
          <CreateButton onClick={() => setIsModalOpen(true)}>
            Open New Ticket
          </CreateButton>
        </Header>

        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Create New Ticket</ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="title">Subject</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Enter subject"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Describe your issue..."
                    required
                  />
                </FormGroup>

                <SubmitButton type="submit">Submit Ticket</SubmitButton>
              </Form>
            </Modal>
          </ModalOverlay>
        )}

        {loading ? (
          <LoadingState>Loading tickets...</LoadingState>
        ) : tickets.length === 0 ? (
          <EmptyState>You have no tickets yet.</EmptyState>
        ) : (
          <TicketsTable>
            {tickets.map((ticket) => (
              <TicketCard to={`/tickets/${ticket.id}`} key={ticket.id}>
                <TicketColumn>
                  <ColumnLabel>Ticket ID</ColumnLabel>
                  <TicketID>
                    <TicketIcon>
                      <Ticket size={16} />
                    </TicketIcon>
                    <TicketNumber>#{ticket.id.slice(0, 6)}</TicketNumber>
                  </TicketID>
                </TicketColumn>

                <TicketColumn>
                  <ColumnLabel>Title</ColumnLabel>
                  <ColumnValue bold>{ticket.title}</ColumnValue>
                </TicketColumn>

                <TicketColumn>
                  <ColumnLabel>Status</ColumnLabel>
                  <StatusBadge status={ticket.status}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </StatusBadge>
                </TicketColumn>

                <TicketColumn>
                  <ColumnLabel>Created</ColumnLabel>
                  <ColumnValue>
                    {dayjs(ticket.created_at).format("MMM D, YYYY")}
                  </ColumnValue>
                </TicketColumn>

                <TicketColumn>
                  <ColumnLabel>Updated</ColumnLabel>
                  <ColumnValue>
                    {dayjs(ticket.updated_at).format("MMM D, YYYY")}
                  </ColumnValue>
                </TicketColumn>
              </TicketCard>
            ))}
          </TicketsTable>
        )}
      </Section>
    </Container>
  );
}

export default TicketsList;
