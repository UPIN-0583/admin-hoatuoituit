import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    api.get(`/api/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "PRINT", "width=900,height=650");

    win.document.write(`
      <html>
        <head>
          <title>Hóa đơn đơn hàng #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .text-right { text-align: right; margin-top: 10px; font-weight: bold; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);

    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  if (!order) return <div className="p-6">Đang tải đơn hàng...</div>;

  const items = order.items || [];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          In hoá đơn
        </button>
      </div>

      <div ref={printRef} className="bg-white p-6 rounded shadow text-sm">
        <p><strong>Khách hàng:</strong> {order.customerName}</p>
        <p><strong>Địa chỉ giao:</strong> {order.deliveryAddress}</p>
        <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString("vi-VN")}</p>
        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethodName || "Chưa chọn"}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>

        <h2 className="font-semibold mt-4 mb-2">Danh sách sản phẩm:</h2>
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border text-left">Sản phẩm</th>
              <th className="p-2 border text-right">Số lượng</th>
              <th className="p-2 border text-right">Giá gốc</th>
              <th className="p-2 border text-right">Giảm giá</th>
              <th className="p-2 border text-right">Giá sau giảm</th>
              <th className="p-2 border text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const total = item.priceAfterDiscount * item.quantity;
              return (
                <tr key={item.productId}>
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border">{item.productName}</td>
                  <td className="p-2 border text-right">{item.quantity}</td>
                  <td className="p-2 border text-right text-gray-500 line-through">
                    {item.price.toLocaleString()} đ
                  </td>
                  <td className="p-2 border text-right text-red-500">
                    {item.discountApplied.toLocaleString()} đ
                  </td>
                  <td className="p-2 border text-right text-green-600 font-semibold">
                    {item.priceAfterDiscount.toLocaleString()} đ
                  </td>
                  <td className="p-2 border text-right font-medium">
                    {total.toLocaleString()} đ
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-right mt-4 font-semibold">
          Tổng cộng: {order.totalAmount.toLocaleString()} đ
        </div>
      </div>
    </div>
  );
}
