import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { LogOut, Menu, X, User, Settings, Bell } from "lucide-react";
import logo from "../static/logo.webp";
import API from "../api/api";

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 16px;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;

  @media (max-width: 768px) {
    height: 32px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 1024px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 24px;
    gap: 16px;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#ec4899" : "#374151")};
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #ec4899;
    background: #fef2f8;
  }

  ${(props) =>
    props.active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -16px;
      left: 0;
      right: 0;
      height: 2px;
      background: #ec4899;
      
      @media (max-width: 1024px) {
        display: none;
      }
    }
  `}

  @media (max-width: 1024px) {
    width: 100%;
    padding: 12px 16px;
  }
`;

const ExternalLink = styled.a`
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #ec4899;
    background: #fef2f8;
  }

  @media (max-width: 1024px) {
    width: 100%;
    padding: 12px 16px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NotificationButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fef2f8;
    border-color: #ec4899;
    color: #ec4899;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: #ec4899;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
`;

const ProfileSection = styled.div`
  position: relative;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fef2f8;
    border-color: #ec4899;
  }
`;

const ProfileAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const ProfileEmail = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const DropdownUserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const DropdownUserEmail = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #fef2f8;
    color: #ec4899;
  }

  svg {
    flex-shrink: 0;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  color: #374151;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fef2f8;
    color: #ec4899;
  }

  svg {
    flex-shrink: 0;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const MobileProfileSection = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: ${(props) => (props.isOpen ? "block" : "none")};
    padding: 16px;
    border-top: 1px solid #e5e7eb;
  }
`;

const MobileProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const MobileProfileButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MobileButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #fef2f8;
    border-color: #ec4899;
    color: #ec4899;
  }
`;

const MobileLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/api/notifications", {
          params: { limit: 100, offset: 0 },
        });
        const data = response.data?.notifications || response.data || [];
        const unread = data.filter((n) => !n.seen && !n.archived).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <HeaderWrapper>
      <Nav>
        <NavContainer>
          <LogoLink to="/" onClick={closeMobileMenu}>
            <Logo src={logo} alt="Logo" />
          </LogoLink>

          <NavLinks isOpen={isMobileMenuOpen}>
            <NavLink to="/" active={isActive("/")} onClick={closeMobileMenu}>
              Dashboard
            </NavLink>
            <NavLink
              to="/orders"
              active={isActive("/orders")}
              onClick={closeMobileMenu}
            >
              Billing
            </NavLink>
            <NavLink
              to="/tickets"
              active={isActive("/tickets")}
              onClick={closeMobileMenu}
            >
              Support
            </NavLink>
            <ExternalLink
              href="https://docs.blocklytics.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </ExternalLink>

            <MobileProfileSection isOpen={isMobileMenuOpen}>
              <MobileProfileInfo>
                <ProfileAvatar>
                  {getInitials(user?.company_name || user?.email)}
                </ProfileAvatar>
                <ProfileInfo>
                  <ProfileName>{user?.company_name || "User"}</ProfileName>
                  <ProfileEmail>{user?.email}</ProfileEmail>
                </ProfileInfo>
              </MobileProfileInfo>
              <MobileProfileButtons>
                <MobileButton to="/profile" onClick={closeMobileMenu}>
                  <User size={18} />
                  Profile Settings
                </MobileButton>
                <MobileLogoutButton onClick={handleLogout}>
                  <LogOut size={18} />
                  Log out
                </MobileLogoutButton>
              </MobileProfileButtons>
            </MobileProfileSection>
          </NavLinks>

          <RightSection>
            <NotificationButton onClick={() => navigate("/notifications")}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <NotificationBadge>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </NotificationBadge>
              )}
            </NotificationButton>

            <ProfileSection ref={dropdownRef}>
              <ProfileButton onClick={toggleProfileDropdown}>
                <ProfileAvatar>
                  {getInitials(user?.company_name || user?.email)}
                </ProfileAvatar>
                <ProfileInfo>
                  <ProfileName>{user?.company_name || "User"}</ProfileName>
                  <ProfileEmail>{user?.email}</ProfileEmail>
                </ProfileInfo>
              </ProfileButton>

              <DropdownMenu isOpen={isProfileDropdownOpen}>
                <DropdownHeader>
                  <DropdownUserName>
                    {user?.company_name || "User"}
                  </DropdownUserName>
                  <DropdownUserEmail>{user?.email}</DropdownUserEmail>
                </DropdownHeader>

                <DropdownItem
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <User size={18} />
                  Profile Settings
                </DropdownItem>

                <DropdownDivider />

                <DropdownButton onClick={handleLogout}>
                  <LogOut size={18} />
                  Log out
                </DropdownButton>
              </DropdownMenu>
            </ProfileSection>

            <MobileMenuButton onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MobileMenuButton>
          </RightSection>
        </NavContainer>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
