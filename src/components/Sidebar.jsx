import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        🌸 Hoa Tươi Admin
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">🏠 Dashboard</Link>
        <Link to="/products" className="hover:bg-gray-700 p-2 rounded">📦 Sản phẩm</Link>
        <Link to="/categories" className="hover:bg-gray-700 p-2 rounded">🏷️ Danh mục</Link>
        <Link to="/occasions" className="hover:bg-gray-700 p-2 rounded">🎁 Dịp</Link>
        <Link to="/flowers" className="hover:bg-gray-700 p-2 rounded">🌹 Loại hoa</Link>
        <Link to="/promotions" className="hover:bg-gray-700 p-2 rounded">💸 Khuyến mãi</Link>
        <Link to="/customers" className="hover:bg-gray-700 p-2 rounded">🧑‍💼 Khách hàng</Link>
        <Link to="/orders" className="hover:bg-gray-700 p-2 rounded">🛒 Đơn hàng</Link>
        <Link to="/reviews" className="hover:bg-gray-700 p-2 rounded">📝 Bình luận</Link>
        <Link to="/statistics" className="hover:bg-gray-700 p-2 rounded">📊 Thống kê</Link>
        <Link to="/blog" className="hover:bg-gray-700 p-2 rounded">📝 Blog</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
