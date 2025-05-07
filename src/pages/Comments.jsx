
import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState({ productId: "", customerId: "" });

  const loadComments = useCallback(async () => {
    const res = await api.get("/api/reviews", { params: filter });
    setComments(res.data);
  }, [filter]);

  const loadProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  const loadCustomers = async () => {
    const res = await api.get("/api/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleVerify = async (comment) => {
    try {
      await api.put(`/api/reviews/${comment.id}/verify`);
      loadComments();
    } catch (err) {
      alert("Lỗi khi xác minh bình luận");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý bình luận</h1>

      <div className="flex gap-4">
        <select
          name="productId"
          value={filter.productId}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">-- Tất cả sản phẩm --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          name="customerId"
          value={filter.customerId}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">-- Tất cả khách hàng --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Nội dung</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Xác minh</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c, i) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 text-center">{i + 1}</td>
                <td className="p-3">{c.productName}</td>
                <td className="p-3">{c.customerName}</td>
                <td className="p-3">{c.comment}</td>
                <td className="p-3">{new Date(c.createdAt).toLocaleString("vi-VN")}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleVerify(c)}
                    className={`px-3 py-1 rounded text-white ${c.isVerified ? "bg-red-500" : "bg-green-600"}`}
                  >
                    {c.isVerified ? "Bỏ xác minh" : "Xác minh"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
