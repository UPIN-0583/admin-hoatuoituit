
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    const res = await api.get("/api/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders
    .filter(order =>
      order.id.toString().includes(searchTerm) ||
      (order.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.paymentMethodName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    )


  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status?status=${status}`);
      loadOrders();
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo ID, khách hàng, phương thức thanh toán..."
          className="p-2 border rounded w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          to="/createorder"
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setError(null)}
        >
          Tạo đơn hàng mới
        </Link> 
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Ngày đặt</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Thanh toán</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            
            {filteredOrders.map(o => (
              <tr key={o.id} className="border-t text-sm">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{new Date(o.orderDate).toLocaleString("vi-VN")}</td>
                <td className="p-3">{o.customerName || "Ẩn danh"}</td>
                <td className="p-3">{o.paymentMethodName || "Chưa chọn"}</td>
                <td className="p-3">{o.totalAmount.toLocaleString()} đ</td>
                <td className="p-3 text-center capitalize">{o.status.toLowerCase()}</td>
                <td className="p-3 space-x-2">
                    <Link
                    to={`/orderdetails/${o.id}`}
                    className="bg-gray-500 text-white px-3 py-1 rounded inline-block"
                    >
                    Chi tiết
                    </Link>
                  {o.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(o.id, "PROCESSING")}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Xác nhận
                    </button>
                  )}
                  {o.status === "PROCESSING" && (
                    <button
                      onClick={() => updateStatus(o.id, "SHIPPED")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Giao hàng
                    </button>
                  )}
                  {o.status === "SHIPPED" && (
                    <button
                      onClick={() => updateStatus(o.id, "DELIVERED")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Đã giao
                    </button>
                  )}
                  {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                    <button
                      onClick={() => updateStatus(o.id, "CANCELLED")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Huỷ
                    </button>
                  )}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
