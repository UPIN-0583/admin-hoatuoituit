import React, { useEffect, useState } from "react";
import api from "../services/api";

const AssignProductsModal = ({ promotionId, onClose }) => {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/api/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post(`/api/promotions/${promotionId}/assign-products`, selectedIds);
      alert("Gán sản phẩm thành công!");
      onClose();
    } catch (err) {
      console.error("Assign failed", err);
      alert("Lỗi khi gán sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Gán sản phẩm vào khuyến mãi</h2>

        <div className="space-y-2">
          {products.map((p) => (
            <label key={p.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => toggleSelection(p.id)}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignProductsModal;
