import React, { useEffect, useState } from "react";
import api from "../services/api";
import CategoryForm from "../components/CategoryForm";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = async () => {
    const res = await api.get("/api/categories");
    setCategories(res.data);
  };

  const handleToggleActive = async (id) => {
    const category = categories.find((c) => c.id === id);
    await api.put(`/api/categories/${id}`, {
        name: category.name,
        description: category.description,
        isActive: !category.isActive
      });

    loadCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
      <CategoryForm
        onSuccess={loadCategories}
        initialData={editingCategory}
        onCancel={() => setEditingCategory(null)}
      />

      <div className="bg-white rounded shadow mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3">Hoạt động</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-3">{cat.id}</td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.description || <i className="text-gray-400">Không có</i>}</td>
                <td className="p-3">{cat.isActive ? "✔️" : "❌"}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleActive(cat.id)}
                    className={`px-3 py-1 rounded ${cat.isActive ? "bg-red-600" : "bg-green-600"} text-white`}
                  >
                    {cat.isActive ? "Tắt" : "Bật"}
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

export default Categories;
