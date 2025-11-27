import React, { useState, useEffect } from "react";
import API from "../api/api";
import logo from "../static/logo.webp";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Mail, Lock, AlertCircle } from "lucide-react";

const SplashOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fce7f3 0%, #ffffff 50%, #faf5ff 100%);
  transition: opacity 0.2s ease;
  opacity: ${(props) => (props.fadeOut ? 0 : 1)};
`;

const SplashLogo = styled.img`
  height: 384px;
  width: auto;

  @media (max-width: 640px) {
    height: 256px;
  }
`;

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

  @media (max-width: 640px) {
    height: 48px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 2px solid #e5e7eb;
  padding: 48px 40px;

  @media (max-width: 640px) {
    padding: 24px 20px;
    border-radius: 16px;
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

  @media (max-width: 640px) {
    font-size: 24px;
  }
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

const FormOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  accent-color: #ec4899;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const ForgotLink = styled(Link)`
  font-size: 14px;
  font-weight: 600;
  color: #ec4899;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #db2777;
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

const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SignupLink = styled.div`
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

function Login() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [otpCode, setOtpCode] = useState("");
  const [userId, setUserId] = useState(null);
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2500);
    const t2 = setTimeout(() => setShowSplash(false), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await API.post("/api/users/login", { email, password });
      
      // Check if 2FA is required
      if (res.data.requires2FA) {
        setUserId(res.data.userId);
        setLoginStep(2);
        setIsLoading(false);
      } else {
        // Normal login without 2FA
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setIsLoading(true);

    try {
      const res = await API.post("/api/users/verify-2fa", { userId, otpCode });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setOtpError(err.response?.data?.error || "OTP verification failed");
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    try {
      await API.post("/api/users/resend-2fa-otp", { userId });
      setOtpError("New OTP sent to your email");
    } catch (err) {
      console.error(err);
      setOtpError(err.response?.data?.error || "Failed to resend OTP");
    }
  };

  return (
    <>
      {showSplash && (
        <SplashOverlay fadeOut={fadeOut}>
          <SplashLogo src="/img/logo.gif" alt="Logo" />
        </SplashOverlay>
      )}

      <Container>
        <Wrapper>
          <LogoContainer>
            <Logo src={logo} alt="logo" />
          </LogoContainer>

          <Card>
            <Header>
              <Title>{loginStep === 1 ? "Welcome back" : "Enter Verification Code"}</Title>
              <Subtitle>
                {loginStep === 1
                  ? "Sign in to continue to your account"
                  : "We've sent a 6-digit code to your email"}
              </Subtitle>
            </Header>

            {loginStep === 1 && (
              <Form onSubmit={handleSubmit}>
                {error && (
                  <ErrorMessage>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </ErrorMessage>
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

                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputWrapper>
                    <IconWrapper>
                      <Lock size={20} />
                    </IconWrapper>
                    <Input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputWrapper>
                </FormGroup>

                <FormOptions>
                  <RememberMe>
                    <Checkbox id="remember" type="checkbox" />
                    <CheckboxLabel htmlFor="remember">Remember me</CheckboxLabel>
                  </RememberMe>
                  <ForgotLink to="/forgot-password">Forgot password?</ForgotLink>
                </FormOptions>

                <SubmitButton type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    "Sign in"
                  )}
                </SubmitButton>
              </Form>
            )}

            {loginStep === 2 && (
              <Form onSubmit={handleOtpSubmit}>
                {otpError && (
                  <ErrorMessage>
                    <AlertCircle size={20} />
                    <span>{otpError}</span>
                  </ErrorMessage>
                )}

                <FormGroup>
                  <Label htmlFor="otp">Verification Code</Label>
                  <InputWrapper>
                    <IconWrapper>
                      <Lock size={20} />
                    </IconWrapper>
                    <Input
                      type="text"
                      id="otp"
                      placeholder="Enter 6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      required
                    />
                  </InputWrapper>
                </FormGroup>

                <SubmitButton type="submit" disabled={isLoading || otpCode.length !== 6}>
                  {isLoading ? (
                    <>
                      <Spinner />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify"
                  )}
                </SubmitButton>

                <FormOptions style={{ justifyContent: "space-between", marginTop: "12px" }}>
                  <ForgotLink
                    as="button"
                    type="button"
                    onClick={() => setLoginStep(1)}
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    ← Back to login
                  </ForgotLink>
                  <ForgotLink
                    as="button"
                    type="button"
                    onClick={handleResendOtp}
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    Resend code
                  </ForgotLink>
                </FormOptions>
              </Form>
            )}
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
    </>
  );
}

export default Login;
