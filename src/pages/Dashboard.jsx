import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";


const Dashboard = () => {
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    customerCount: 0,
    activeProductCount: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);


  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    fetchDailyRevenue();
    fetchOrderStatus();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const [
        ordersRes,
        revenueRes,
        customersRes,
        productsRes
      ] = await Promise.all([
        api.get("/api/orders/count/today"),
        api.get(`/api/orders/revenue/date?date=${today}`),
        api.get("/api/customers"),
        api.get("/api/products/active")
      ]);

      setStats({
        ordersToday: ordersRes.data,
        revenueToday: revenueRes.data,
        customerCount: customersRes.data.length,
        activeProductCount: productsRes.data.length,
      });
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await api.get("/api/orders/recent?limit=5");
      setRecentOrders(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng gần đây:", err);
    }
  };

  const fetchDailyRevenue = async () => {
    try {
      const today = new Date();
      const res = await api.get(`/api/orders/revenue/daily?month=${today.getMonth() + 1}&year=${today.getFullYear()}`);
      const chartData = Object.entries(res.data).map(([date, revenue]) => ({
        date,
        revenue
      }));
      setDailyRevenue(chartData);
    } catch (err) {
      console.error("Lỗi khi lấy biểu đồ doanh thu:", err);
    }
  };
  
  const fetchOrderStatus = async () => {
    try {
      const res = await api.get("/api/orders/status-count");
      const chartData = Object.entries(res.data).map(([status, count]) => ({
        name: status,
        value: count
      }));
      setOrderStatusData(chartData);
    } catch (err) {
      console.error("Lỗi khi lấy biểu đồ trạng thái:", err);
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bảng điều khiển</h1>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Đơn hàng hôm nay" value={stats.ordersToday} />
        <StatCard label="Doanh thu hôm nay" value={`${stats.revenueToday.toLocaleString()}₫`} />
        <StatCard label="Khách hàng" value={stats.customerCount} />
        <StatCard label="Sản phẩm đang bán" value={stats.activeProductCount} />
      </div>

      {/* Placeholder biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Biểu đồ doanh thu</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(v) => `${v / 1000000} tr`} />
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()}₫`} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Tình trạng đơn hàng</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#0088FE", "#FFBB28", "#FF8042", "#00C49F"][index % 4]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* Đơn hàng gần nhất + sản phẩm bán chạy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Đơn hàng gần đây</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600 border-b">
              <tr>
                <th className="py-2">Mã</th>
                <th className="py-2">Khách</th>
                <th className="py-2">Tổng</th>
                <th className="py-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="py-2">#{order.id}</td>
                  <td className="py-2">{order.customerName}</td>
                  <td className="py-2">{order.totalAmount.toLocaleString()}₫</td>
                  <td className="py-2 text-blue-600">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-2xl font-semibold mt-1">{value}</div>
  </div>
);

export default Dashboard;
