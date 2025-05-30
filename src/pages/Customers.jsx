import React, { useEffect, useState } from "react";
import api from "../services/api";
import CustomerForm from "../components/CustomerForm";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const loadCustomers = async () => {
    try {
      const res = await api.get("/api/customers");
      setCustomers(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải danh sách khách hàng");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = [...customers]
    .sort((a, b) => a.id - b.id)
    .filter(customer =>
      (customer.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone || "").includes(searchTerm) ||
      (customer.address || "").toLowerCase().includes(searchTerm.toLowerCase())
    );


  const handleSubmit = async (payload) => {
    try {
      if (editingId) {
        // Cập nhật khách hàng
        await api.put(`/api/customers/${editingId}`, {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          isActive: payload.isActive,
        });
      } else {
        // Thêm khách hàng mới bằng /api/customers/signup
        await api.post("/api/customers/signup", payload);
      }
      setEditingId(null);
      loadCustomers();
      alert("Lưu khách hàng thành công!");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi lưu khách hàng");
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
  };

  const handleToggle = async (customer) => {
    try {
      await api.put(`/api/customers/${customer.id}`, {
        ...customer,
        isActive: !customer.isActive,
      });
      loadCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <CustomerForm
        onSubmit={handleSubmit}
        initialData={editingId ? customers.find((c) => c.id === editingId) : null}
        onCancel={() => setEditingId(null)}
        isEditing={!!editingId}
      />

      {/* Ô tìm kiếm */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng theo tên, email, số điện thoại hoặc địa chỉ..."
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
              <th className="p-3">Email</th>
              <th className="p-3">Số điện thoại</th>
              <th className="p-3">Địa chỉ</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.address}</td>
                  <td className="p-3 text-center">
                    {c.isActive ? (
                      <span className="text-green-600 font-medium">✔️</span>
                    ) : (
                      <span className="text-red-500 font-medium">❌</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleToggle(c)}
                      className={`px-3 py-1 rounded text-white ${
                        c.isActive ? "bg-red-500" : "bg-green-600"
                      }`}
                    >
                      {c.isActive ? "Tắt" : "Bật"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  Không tìm thấy khách hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;