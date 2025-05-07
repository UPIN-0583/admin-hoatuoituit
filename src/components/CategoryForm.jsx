import React, { useState, useEffect } from "react";
import api from "../services/api";

const CategoryForm = ({ onSuccess, initialData = null, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);


  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setIsActive(initialData.isActive ?? true);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData) {
      await api.put(`/api/categories/${initialData.id}`, { name, description, isActive  });
    } else {
      await api.post("/api/categories", { name, description, isActive  });
    }
    setName("");
    setDescription("");
    onSuccess();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold">
        {initialData ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      </h2>
      <input
        type="text"
        placeholder="Tên danh mục"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
      />
      
      <div className="flex items-center gap-2">
        <label>Trạng thái:</label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <span>{isActive ? "Hiển thị" : "Ẩn"}</span>
      </div>

      <div className="space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {initialData ? "Lưu" : "Thêm"}
        </button>
        {initialData && (
          <button onClick={onCancel} type="button" className="bg-gray-400 text-white px-4 py-2 rounded">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
