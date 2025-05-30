import React, { useEffect, useState } from "react";
import api from "../services/api";
import { BASE_URL } from "../services/api";
import OccasionForm from "../components/OccasionForm";

const Occasions = () => {
  const [occasions, setOccasions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");  

  const loadOccasions = async () => {
    const res = await api.get("/api/occasions");
    setOccasions(res.data);
  };

  useEffect(() => {
    loadOccasions();
  }, []);

  const filteredOccasions = occasions.filter(occasion =>
    occasion.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = async (payload) => {
    try {
      if (editingId) {
        await api.put(`/api/occasions/${editingId}`, payload);
      } else {
        await api.post("/api/occasions", payload);
      }

      setEditingId(null);
      loadOccasions();
    } catch (err) {
      console.error("Submit failed", err);
      alert("Lỗi khi lưu dịp tặng hoa");
    }
  };

  const handleEdit = (occasion) => {
    setEditingId(occasion.id);
  };

  const handleToggle = async (occasion) => {
    try {
      await api.put(`/api/occasions/${occasion.id}`, {
        ...occasion,
        isActive: !occasion.isActive,
      });
      loadOccasions();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý dịp tặng hoa (Occasions)</h1>

      <OccasionForm
        onSubmit={handleFormSubmit}
        initialData={editingId ? occasions.find((o) => o.id === editingId) : null}
        onCancel={() => setEditingId(null)}
      />

      <div className="my-4">
        <input
          type="text"
          placeholder="Tìm kiếm dịp tặng hoa theo tên..."
          className="p-4 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3">Ảnh</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOccasions.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.name}</td>
                <td className="p-3">{o.description}</td>
                <td className="p-3">
                  {o.imageUrl && (
                    <img
                      src={`${BASE_URL}${o.imageUrl}`}
                      alt={o.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-3 text-sm text-center">
                  {o.isActive ? (
                    <span className="text-green-600 font-medium">✔️</span>
                  ) : (
                    <span className="text-red-500 font-medium">❌</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(o)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggle(o)}
                    className={`px-3 py-1 rounded text-white ${
                      o.isActive ? "bg-red-500" : "bg-green-600"
                    }`}
                  >
                    {o.isActive ? "Tắt" : "Bật"}
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

export default Occasions;
