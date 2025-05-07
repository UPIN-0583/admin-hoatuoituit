import React, { useEffect, useState } from "react";
import api from "../services/api";
import dayjs from "dayjs";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const Statistics = () => {
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());
  const [startDate, setStartDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));

  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [orderCountByMonth, setOrderCountByMonth] = useState([]);
  const [revenueRange, setRevenueRange] = useState([]);
  const [orderCountRange, setOrderCountRange] = useState([]);

  // Load theo tháng
  useEffect(() => {
    loadRevenueByMonth();
    loadOrderCountByMonth();
  }, [month, year]);

  // Load theo khoảng
  useEffect(() => {
    loadRevenueRange();
    loadOrderCountRange();
  }, [startDate, endDate]);

  const loadRevenueByMonth = async () => {
    const res = await api.get(`/api/orders/revenue/daily?month=${month}&year=${year}`);
    setRevenueByMonth(objectToChartData(res.data));
  };

  const loadOrderCountByMonth = async () => {
    const res = await api.get(`/api/orders/count/daily?month=${month}&year=${year}`);
    setOrderCountByMonth(objectToChartData(res.data, "count"));
  };

  const loadRevenueRange = async () => {
    const res = await api.get(`/api/orders/revenue/range?start=${startDate}&end=${endDate}`);
    setRevenueRange(objectToChartData(res.data));
  };

  const loadOrderCountRange = async () => {
    const res = await api.get(`/api/orders/count/range?start=${startDate}&end=${endDate}`);
    setOrderCountRange(objectToChartData(res.data, "count"));
  };

  const objectToChartData = (obj, valueKey = "revenue") =>
    Object.entries(obj).map(([date, value]) => ({
      date,
      [valueKey]: Number(value)
    }));

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Thống kê</h1>

      {/* Thống kê theo tháng */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Thống kê theo tháng</h2>
        <div className="flex space-x-4">
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="border p-1 rounded">
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{`Tháng ${i + 1}`}</option>
            ))}
          </select>
          <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border p-1 rounded w-24" />
        </div>

        <ChartSection title="Biểu đồ doanh thu theo tháng" data={revenueByMonth} dataKey="revenue" chartType="line" />
        <ChartSection title="Biểu đồ số đơn hàng theo tháng" data={orderCountByMonth} dataKey="count" chartType="bar" />
      </section>

      {/* Thống kê theo khoảng ngày */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Thống kê theo khoảng ngày</h2>
        <div className="flex space-x-4">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-1 rounded" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-1 rounded" />
        </div>

        <ChartSection title="Biểu đồ doanh thu theo khoảng ngày" data={revenueRange} dataKey="revenue" chartType="line" />
        <ChartSection title="Biểu đồ số đơn hàng theo khoảng ngày" data={orderCountRange} dataKey="count" chartType="bar" />
      </section>
    </div>
  );
};

const ChartSection = ({ title, data, dataKey, chartType }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#82ca9d" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

export default Statistics;
