import React, { useEffect, useState } from "react";
import API from "../api/api";
import styled from "styled-components";
import {
  User,
  Mail,
  Building,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Eye,
  Smartphone,
  Globe,
  Lock,
  Save,
  Clock,
} from "lucide-react";

const Container = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 16px 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  grid-column: span ${(props) => props.span || 12};

  @media (max-width: 1024px) {
    grid-column: span 12;
  }
`;

const CardHeader = styled.div`
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
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
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
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
  padding: 12px 12px 12px ${(props) => (props.hasIcon ? "44px" : "12px")};
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

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SettingIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${(props) => (props.active ? "#fce7f3" : "#f3f4f6")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.active ? "#ec4899" : "#6b7280")};
  transition: all 0.2s ease;
`;

const SettingContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SettingTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const SettingDescription = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  }

  &:checked + span:before {
    transform: translateX(22px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #d1d5db;
  border-radius: 26px;
  transition: all 0.3s ease;

  &:before {
    content: "";
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${(props) =>
    props.variant === "secondary"
      ? "white"
      : "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"};
  color: ${(props) => (props.variant === "secondary" ? "#374151" : "white")};
  font-weight: 600;
  font-size: 14px;
  border: ${(props) =>
    props.variant === "secondary" ? "1px solid #d1d5db" : "none"};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${(props) =>
    props.variant === "secondary"
      ? "0 1px 2px rgba(0, 0, 0, 0.05)"
      : "0 4px 6px rgba(236, 72, 153, 0.25)"};

  &:hover {
    background: ${(props) =>
      props.variant === "secondary"
        ? "#f9fafb"
        : "linear-gradient(135deg, #db2777 0%, #be185d 100%)"};
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.variant === "secondary"
        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
        : "0 6px 12px rgba(236, 72, 153, 0.3)"};
  }

  &:disabled {
    opacity: 0.5;
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

const SuccessMessage = styled.div`
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #166534;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

// Dodaj novi styled component za Security Settings Grid
const SecurityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const SecurityColumn = styled.div`
  padding: 16px 24px;
  border-right: 1px solid #f3f4f6;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 1024px) {
    padding: 0;
    border-right: none;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }
  }
`;

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    company_name: "",
    primary_address: "",
    billing_email: "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    securityAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    sessionTimeout: true,
    apiAccess: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        setFormData({
          email: response.data.email || "",
          company_name: response.data.company_name || "",
          primary_address: response.data.primary_address || "",
          billing_email: response.data.billing_email || "",
        });
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      // Ovdje bi trebao biti API call za update profila
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulacija

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Card>
          <LoadingState>Loading profile...</LoadingState>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>Account Settings</PageTitle>

      <Grid>
        {/* Account Information */}
        <Card span={8}>
          <CardHeader>
            <CardTitle>
              <User size={20} />
              Account Information
            </CardTitle>
          </CardHeader>

          {success && (
            <SuccessMessage>
              <Shield size={18} />
              Profile updated successfully!
            </SuccessMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">
                <Mail size={16} />
                Email Address
              </Label>
              <InputWrapper>
                <IconWrapper>
                  <Mail size={20} />
                </IconWrapper>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  hasIcon
                  disabled
                />
              </InputWrapper>
              <InfoText>Your email address cannot be changed</InfoText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="company_name">
                <Building size={16} />
                Company Name
              </Label>
              <InputWrapper>
                <IconWrapper>
                  <Building size={20} />
                </IconWrapper>
                <Input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  hasIcon
                />
              </InputWrapper>
              <InfoText>This name will appear on invoices</InfoText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="primary_address">
                <MapPin size={16} />
                Primary Business Address
              </Label>
              <InputWrapper>
                <IconWrapper>
                  <MapPin size={20} />
                </IconWrapper>
                <Input
                  type="text"
                  id="primary_address"
                  name="primary_address"
                  value={formData.primary_address}
                  onChange={handleInputChange}
                  placeholder="Enter business address"
                  hasIcon
                />
              </InputWrapper>
              <InfoText>Used for tax calculation purposes</InfoText>
            </FormGroup>

            <ButtonGroup>
              <Button type="submit" disabled={saving}>
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setFormData({
                    email: user.email || "",
                    company_name: user.company_name || "",
                    primary_address: user.primary_address || "",
                    billing_email: user.billing_email || "",
                  })
                }
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Form>
        </Card>

        {/* Notification Settings */}
        <Card span={4}>
          <CardHeader>
            <CardTitle>
              <Bell size={20} />
              Notifications
            </CardTitle>
          </CardHeader>

          <SettingRow>
            <SettingInfo>
              <SettingIconWrapper active={settings.emailNotifications}>
                <Mail size={20} />
              </SettingIconWrapper>
              <SettingContent>
                <SettingTitle>Email Notifications</SettingTitle>
                <SettingDescription>
                  Receive updates via email
                </SettingDescription>
              </SettingContent>
            </SettingInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingRow>

          <SettingRow>
            <SettingInfo>
              <SettingIconWrapper active={settings.securityAlerts}>
                <Shield size={20} />
              </SettingIconWrapper>
              <SettingContent>
                <SettingTitle>Security Alerts</SettingTitle>
                <SettingDescription>
                  Get notified of suspicious activity
                </SettingDescription>
              </SettingContent>
            </SettingInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.securityAlerts}
                onChange={() => handleToggle("securityAlerts")}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingRow>

          <SettingRow>
            <SettingInfo>
              <SettingIconWrapper active={settings.marketingEmails}>
                <Globe size={20} />
              </SettingIconWrapper>
              <SettingContent>
                <SettingTitle>Marketing Emails</SettingTitle>
                <SettingDescription>
                  Receive product updates and news
                </SettingDescription>
              </SettingContent>
            </SettingInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={() => handleToggle("marketingEmails")}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingRow>
        </Card>

        {/* Security Settings */}
        <Card span={12}>
          <CardHeader>
            <CardTitle>
              <Lock size={20} />
              Security & Privacy
            </CardTitle>
          </CardHeader>

          <SecurityGrid>
            <SecurityColumn>
              <SettingRow>
                <SettingInfo>
                  <SettingIconWrapper active={settings.twoFactorAuth}>
                    <Smartphone size={20} />
                  </SettingIconWrapper>
                  <SettingContent>
                    <SettingTitle>Two-Factor Authentication</SettingTitle>
                    <SettingDescription>
                      Add an extra layer of security
                    </SettingDescription>
                  </SettingContent>
                </SettingInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleToggle("twoFactorAuth")}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </SettingRow>
            </SecurityColumn>

            <SecurityColumn>
              <SettingRow>
                <SettingInfo>
                  <SettingIconWrapper active={settings.sessionTimeout}>
                    <Clock size={20} />
                  </SettingIconWrapper>
                  <SettingContent>
                    <SettingTitle>Auto Session Timeout</SettingTitle>
                    <SettingDescription>
                      Log out after 30 minutes of inactivity
                    </SettingDescription>
                  </SettingContent>
                </SettingInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={settings.sessionTimeout}
                    onChange={() => handleToggle("sessionTimeout")}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </SettingRow>
            </SecurityColumn>
          </SecurityGrid>
        </Card>
      </Grid>
    </Container>
  );
}

export default Profile;
