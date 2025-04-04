import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import User from "./components/contents/users/User.tsx";
import Product from "./components/contents/products/Product.tsx";
import Service from "./components/contents/services/Service.tsx";
import Dashboard from "./components/contents/dashboards/Dashboard.tsx";
import Order from "./components/contents/users/Order.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/order" element={<Order />} />
          <Route path="/product" element={<Product />} />
          <Route path="/service" element={<Service />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
