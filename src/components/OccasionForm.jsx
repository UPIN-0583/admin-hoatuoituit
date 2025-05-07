import React, { useEffect, useState } from "react";
import api from "../services/api"; 

const OccasionForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setImageUrl(initialData.imageUrl || "");
      setIsActive(initialData.isActive ?? true);
      setFile(null);
    } else {
      setName("");
      setDescription("");
      setImageUrl("");
      setIsActive(true);
      setFile(null);
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = imageUrl;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await api.post("/api/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        });

        finalImageUrl = res.data.url;
      } catch (err) {
        alert("Lỗi tải ảnh lên");
        return;
      }
    }

    const payload = {
      name,
      description,
      isActive,
      imageUrl: finalImageUrl,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">
        {initialData ? "Chỉnh sửa dịp" : "Thêm dịp mới"}
      </h2>

      <input
        type="text"
        placeholder="Tên dịp"
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

      <div className="flex items-center gap-2">
        <label>Ảnh biểu tượng:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {(file || imageUrl) && (
        <img
          src={file ? URL.createObjectURL(file) : `http://localhost:8080${imageUrl}`}
          alt="preview"
          className="w-24 h-24 object-cover rounded"
        />
      )}

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
          {initialData ? "Cập nhật" : "Thêm"}
        </button>
        {initialData && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default OccasionForm;
