import React, { useEffect, useState } from "react";
import api from "../services/api";
import FlowerForm from "../components/FlowerForm";

const Flowers = () => {
  const [flowers, setFlowers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadFlowers = async () => {
    const res = await api.get("/api/flowers");
    setFlowers(res.data);
  };

  useEffect(() => {
    loadFlowers();
  }, []);

  const filteredFlowers = flowers.filter(flower =>
      flower.name.toLowerCase().includes(searchTerm.toLowerCase())  
  );

  const handleSubmit = async (payload) => {
    try {
      if (editingId) {
        await api.put(`/api/flowers/${editingId}`, payload);
      } else {
        await api.post("/api/flowers", payload);
      }
      setEditingId(null);
      loadFlowers();
    } catch (err) {
      alert("Lỗi khi lưu hoa");
    }
  };

  const handleEdit = (flower) => {
    setEditingId(flower.id);
  };

  const handleToggle = async (flower) => {
    try {
      await api.put(`/api/flowers/${flower.id}`, {
        ...flower,
        isActive: !flower.isActive,
      });
      loadFlowers();
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý các loài hoa</h1>

      <FlowerForm
        onSubmit={handleSubmit}
        initialData={editingId ? flowers.find(f => f.id === editingId) : null}
        onCancel={() => setEditingId(null)}
      />

      <div className="my-4">
        <input
          type="text"
          placeholder="Tìm kiếm hoa theo tên..."
          className="p-4 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlowers.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-3">{f.id}</td>
                <td className="p-3">{f.name}</td>
                <td className="p-3">{f.description}</td>
                <td className="p-3 text-center">
                  {f.isActive ? (
                    <span className="text-green-600 font-medium">✔️</span>
                  ) : (
                    <span className="text-red-500 font-medium">❌</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(f)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggle(f)}
                    className={`px-3 py-1 rounded text-white ${
                      f.isActive ? "bg-red-500" : "bg-green-600"
                    }`}
                  >
                    {f.isActive ? "Tắt" : "Bật"}
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

export default Flowers;
