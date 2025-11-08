// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import PaymentSteps from "./pages/PaymentSteps";
import TicketsList from "./pages/TicketsList";
import TicketDetails from "./pages/TicketDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentTimeout from "./pages/PaymentTimeout";
import NotificationCenter from "./pages/NotificationCenter";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Javne rute bez Headera i Footera */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

       <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        {/* Stranice dostupne bez prijave (gateway callbacki) */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/timeout" element={<PaymentTimeout />} />

        {/* Zaštićene rute s Layoutom */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="payment" element={<PaymentSteps />} />
          <Route path="orders" element={<Orders />} />
          <Route path="tickets" element={<TicketsList />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="tickets/:id" element={<TicketDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
