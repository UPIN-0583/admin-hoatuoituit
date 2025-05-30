import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const loadComments = useCallback(async () => {
    try {
      const res = await api.get("/api/reviews");
      setComments(res.data);
    } catch (err) {
      setError("Lỗi khi tải danh sách bình luận");
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // 🔥 Lọc bình luận dựa trên searchTerm (lọc frontend)
  const filteredComments = comments.filter((c) =>
    (c.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.comment || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* 🔥 Ô tìm kiếm */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo sản phẩm, khách hàng, nội dung..."
          className="p-2 border rounded w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

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
            {filteredComments.length > 0 ? (
              filteredComments.map((c, i) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  Không tìm thấy bình luận nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
