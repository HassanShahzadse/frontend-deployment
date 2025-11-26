import React, { useState } from "react";
import API from "../api/api";
import logo from "../static/logo.webp";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fce7f3 0%, #ffffff 50%, #faf5ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 448px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`;

const Logo = styled.img`
  height: 64px;
  width: auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 2px solid #e5e7eb;
  padding: 48px 40px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #ec4899;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 44px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 14px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
    box-shadow: 0 20px 25px -5px rgba(236, 72, 153, 0.4);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;

  a {
    font-weight: 600;
    color: #ec4899;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #db2777;
    }
  }
`;

const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;

  a {
    color: #ec4899;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #db2777;
    }
  }
`;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await API.post("/api/users/forgot-password", { email });
      setSuccess("Password reset email sent successfully. Check your inbox!");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Failed to send password reset email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <LogoContainer>
          <Logo src={logo} alt="logo" />
        </LogoContainer>

        <Card>
          <BackLink to="/login">
            <ArrowLeft size={16} />
            Back to login
          </BackLink>

          <Header>
            <Title>Reset your password</Title>
            <Subtitle>
              Enter your email and we'll send you a reset link
            </Subtitle>
          </Header>

          <Form onSubmit={handleSubmit}>
            {error && (
              <ErrorMessage>
                <AlertCircle size={20} />
                <span>{error}</span>
              </ErrorMessage>
            )}

            {success && (
              <SuccessMessage>
                <CheckCircle size={20} />
                <span>{success}</span>
              </SuccessMessage>
            )}

            <FormGroup>
              <Label htmlFor="email">Email address</Label>
              <InputWrapper>
                <IconWrapper>
                  <Mail size={20} />
                </IconWrapper>
                <Input
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset link"}
            </SubmitButton>
          </Form>

          <LoginLink>
            <p>
              Remember your password? <Link to="/login">Sign in</Link>
            </p>
          </LoginLink>
        </Card>

        <Footer>
          <p>
            © 2025{" "}
            <a
              href="https://asseco.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Asseco Poland S.A
            </a>{" "}
            All right reserved
          </p>
        </Footer>
      </Wrapper>
    </Container>
  );
}

export default ForgotPassword;
