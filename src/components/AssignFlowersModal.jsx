import React, { useEffect, useState } from "react";
import api from "../services/api";

const AssignFlowersModal = ({ productId, onClose }) => {
  const [flowers, setFlowers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    api.get("/api/flowers").then((res) => setFlowers(res.data));
  }, []);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    try {
      await api.post(`/api/products/${productId}/assign-flowers`, selectedIds);
      alert("Gán loài hoa thành công!");
      onClose();
    } catch (err) {
      console.error("Assign failed", err);
      alert("Lỗi khi gán loài hoa");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Gán loài hoa cho sản phẩm</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {flowers.map((f) => (
            <label key={f.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(f.id)}
                onChange={() => handleToggle(f.id)}
              />
              <span>{f.name}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 space-x-2">
          <button onClick={handleAssign} className="bg-blue-600 text-white px-4 py-2 rounded">
            Lưu
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignFlowersModal;