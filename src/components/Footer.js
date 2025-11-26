// src/components/Footer.js
import React from "react";
import styled from "styled-components";
import { Heart } from "lucide-react";

const FooterWrapper = styled.footer`
  background: white;
  border-top: 1px solid #e5e7eb;
  margin-top: 64px;
`;

const FooterContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 16px 32px;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 48px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FooterTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const FooterDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
`;

const FooterLink = styled.a`
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s ease;
  width: fit-content;

  &:hover {
    color: #ec4899;
    transform: translateX(4px);
  }
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 768px) {
    text-align: left;
    justify-content: flex-start;
  }
`;

const CompanyLink = styled.a`
  color: #ec4899;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #db2777;
  }
`;

const MadeWithLove = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #6b7280;

  svg {
    color: #ec4899;
  }
`;

const Footer = () => (
  <FooterWrapper>
    <FooterContainer>
      <FooterTop>
        <FooterSection>
          <FooterTitle>About</FooterTitle>
          <FooterDescription>
            Blocklytics provides powerful cryptocurrency data analytics and API
            services. Built with precision and reliability for developers and
            businesses.
          </FooterDescription>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Resources</FooterTitle>
          <FooterLink
            href="https://docs.blocklytics.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </FooterLink>
          <FooterLink href="/tickets">Support Center</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Legal</FooterTitle>
          <FooterLink
            href="https://asseco.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </FooterLink>
          <FooterLink
            href="https://www.blocklytics.net/terms_condition.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </FooterLink>
          <FooterLink
            href="https://asseco.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Asseco
          </FooterLink>
        </FooterSection>
      </FooterTop>

      <FooterBottom>
        <Copyright>
          © 2025{" "}
          <CompanyLink
            href="https://asseco.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Asseco Poland S.A
          </CompanyLink>
          . All rights reserved.
        </Copyright>

        <MadeWithLove>
          Made with <Heart size={16} fill="currentColor" /> by Blocklytics Team
        </MadeWithLove>
      </FooterBottom>
    </FooterContainer>
  </FooterWrapper>
);

export default Footer;
