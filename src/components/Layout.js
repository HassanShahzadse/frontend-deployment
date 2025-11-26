// src/components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const Main = styled.main`
  margin-top: 64px; // Razmak za fixed header
  min-height: calc(100vh - 64px); // Osigurava da main zauzima prostor
`;

const Layout = () => (
  <>
    <Header />
    <Main>
      <Outlet />
    </Main>
    <Footer />
  </>
);

export default Layout;
