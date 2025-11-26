import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import API from "../api/api";
import styled from "styled-components";
import {
  ArrowLeft,
  Send,
  User,
  HeadphonesIcon,
  Clock,
  Loader,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Container = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 16px 16px;
`;

const Section = styled.section`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  color: #ec4899;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #ec4899;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;

  &:hover {
    background: #fef2f8;
    transform: translateX(-4px);
  }
`;

const Header = styled.header`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 16px;

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

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

const DateText = styled.p`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
`;

const MessageCard = styled.article`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: ${(props) => (props.isAdmin ? "#f9fafb" : "#fef2f8")};
  border: 1px solid ${(props) => (props.isAdmin ? "#e5e7eb" : "#fce7f3")};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) =>
    props.isAdmin
      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
      : "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

const SenderName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const MessageDate = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const MessageText = styled.p`
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-line;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
  margin-bottom: 24px;
`;

const Dots = styled.span`
  display: flex;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ec4899;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TextareaWrapper = styled.div`
  position: relative;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 14px;
  color: #111827;
  resize: vertical;
  min-height: 120px;
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

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(236, 72, 153, 0.25);
  width: fit-content;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(236, 72, 153, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 48px 0;
`;

const ClosedNotice = styled.div`
  padding: 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
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

  if (loading) {
    return (
      <Container>
        <Section>
          <LoadingState>Loading ticket...</LoadingState>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back to Tickets
        </BackButton>

        <Header>
          <StatusBadge status={ticket.status}>
            {getStatusIcon(ticket.status)}
            {ticket.status
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </StatusBadge>

          <Title>Ticket: {ticket.title}</Title>
          <DateText>
            <Clock size={16} />
            Created on {dayjs(ticket.created_at).format("MMMM D, YYYY")}
          </DateText>
        </Header>

        <MessagesContainer>
          {messages.map((msg, index) => {
            const isAdmin = msg.sender === "admin";
            return (
              <MessageCard key={index} isAdmin={isAdmin}>
                <Avatar isAdmin={isAdmin}>
                  {isAdmin ? <HeadphonesIcon size={20} /> : <User size={20} />}
                </Avatar>
                <MessageContent>
                  <MessageHeader>
                    <SenderName>{isAdmin ? "Support Team" : "You"}</SenderName>
                    <MessageDate>
                      {dayjs(msg.created_at).format("MMM D, YYYY [at] h:mm A")}
                    </MessageDate>
                  </MessageHeader>
                  <MessageText>{msg.message}</MessageText>
                </MessageContent>
              </MessageCard>
            );
          })}
        </MessagesContainer>

        {waitingReply && (
          <TypingIndicator>
            <HeadphonesIcon size={18} />
            Support is typing
            <Dots>
              <span></span>
              <span></span>
              <span></span>
            </Dots>
          </TypingIndicator>
        )}

        {ticket.status === "closed" ? (
          <ClosedNotice>
            This ticket is closed. You cannot add new messages.
          </ClosedNotice>
        ) : (
          <Form onSubmit={handleSubmit}>
            <TextareaWrapper>
              <Textarea
                id="comment"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message here..."
                required
              />
            </TextareaWrapper>
            <SubmitButton type="submit" disabled={waitingReply}>
              {waitingReply ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Waiting for reply...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </SubmitButton>
          </Form>
        )}
      </Section>
    </Container>
  );
}

export default TicketDetails;
