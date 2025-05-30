import React, { useEffect, useState } from "react";
import api from "../services/api";
import PromotionForm from "../components/PromotionForm";
import AssignProductsModal from "../components/AssignProductsModal"; // Modal để gán sản phẩm

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPromotions = async () => {
    const res = await api.get("/api/promotions");
    setPromotions(res.data);
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const filteredPromotions = promotions.filter(promo =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitSuccess = () => {
    setEditingId(null);
    loadPromotions();
  };

  const handleEdit = (promo) => {
    setEditingId(promo.id);
  };

  const handleToggle = async (promo) => {
    try {
      await api.put(`/api/promotions/${promo.id}`, {
        ...promo,
        isActive: !promo.isActive,
      });
      loadPromotions();
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  const handleAfterCreated = (id) => {
    setSelectedPromotionId(id);
    setShowAssignModal(true);
    loadPromotions();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>

      <PromotionForm
        initialData={editingId ? promotions.find((p) => p.id === editingId) : null}
        onCancel={() => setEditingId(null)}
        onSuccess={handleSubmitSuccess}
        onCreated={handleAfterCreated}
      />

      {/* Ô tìm kiếm */}
      <div className="my-4"> 
        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi theo mã..."
          className="p-4 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">ID</th>
              <th className="p-3">Mã</th>
              <th className="p-3">Giảm (%)</th>
              <th className="p-3">Từ</th>
              <th className="p-3">Đến</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.code}</td>
                <td className="p-3">{p.discountValue}%</td>
                <td className="p-3">{p.startDate?.slice(0, 10)}</td>
                <td className="p-3">{p.endDate?.slice(0, 10)}</td>
                <td className="p-3 text-sm text-center">
                  {p.isActive ? (
                    <span className="text-green-600 font-medium">✔️</span>
                  ) : (
                    <span className="text-red-500 font-medium">❌</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggle(p)}
                    className={`px-2 py-1 rounded ${p.isActive ? 'bg-green-600' : 'bg-red-500'} text-white`}
                  >
                    {p.isActive ? "Tắt" : "Bật"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPromotionId(p.id);
                      setShowAssignModal(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Gán sản phẩm
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal gán sản phẩm */}
      {showAssignModal && selectedPromotionId && (
        <AssignProductsModal
          promotionId={selectedPromotionId}
          onClose={() => {
            setSelectedPromotionId(null);
            setShowAssignModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Promotions;
