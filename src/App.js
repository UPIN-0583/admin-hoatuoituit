import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Occasions from "./pages/Occasions";
import Flowers from "./pages/Flowers";
import Promotions from "./pages/Promotions";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Comments from "./pages/Comments";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Statistics from "./pages/Statistics";
import BlogManager from "./pages/BlogManager";
import CreateOrder from "./pages/CreateOrder";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang login không cần layout */}
        <Route path="/" element={<Login />} />

        {/* Trang hiển thị khi không có quyền */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Các trang cần ADMIN + layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/categories" element={<Layout><Categories /></Layout>} />
        <Route path="/occasions" element={<Layout><Occasions /></Layout>} />
        <Route path="/flowers" element={<Layout><Flowers /></Layout>} />
        <Route path="/promotions" element={<Layout><Promotions /></Layout>} />
        <Route path="/customers" element={<Layout><Customers /></Layout>} />
        <Route path="/orders" element={<Layout><Orders /></Layout>} />
        <Route path="/orderdetails/:id" element={<Layout><OrderDetail /></Layout>} />
        <Route path="/reviews" element={<Layout><Comments /></Layout>} />
        <Route path="/statistics" element={<Layout><Statistics /></Layout>} />
        <Route path="/blog" element={<Layout><BlogManager /></Layout>} />
        <Route path="/createorder" element={<Layout><CreateOrder /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
