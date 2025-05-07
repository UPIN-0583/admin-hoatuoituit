import React, { useEffect, useState } from "react";

const FlowerForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setIsActive(initialData.isActive ?? true);
    } else {
      setName("");
      setDescription("");
      setIsActive(true);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, description, isActive };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">
        {initialData ? "Cập nhật loài hoa" : "Thêm loài hoa"}
      </h2>
      <input
        type="text"
        placeholder="Tên hoa"
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Mô tả"
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex items-center space-x-2">
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
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default FlowerForm;
