import React, { useState, useEffect } from "react"; 
import api from "../services/api";

const ProductForm = ({ onSuccess, editingProduct = null, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/api/categories/active").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setDescription(editingProduct.description || "");
      setPrice(editingProduct.price || "");
      setImageUrl(editingProduct.imageUrl || "");
      setCategoryId(editingProduct.categoryId || "");
      setIsActive(editingProduct.isActive ?? true);
      setIsFeatured(editingProduct.isFeatured ?? false);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setCategoryId("");
      setIsActive(true);
      setIsFeatured(false);
      setImageFile(null);
    }
  }, [editingProduct]);

  const handleImageUpload = async () => {
    if (!imageFile) return imageUrl;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await api.post("/api/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedUrl = await handleImageUpload();

      const payload = {
        name,
        description,
        price,
        categoryId,
        isActive,
        isFeatured,
        imageUrl: uploadedUrl
      };

      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, payload);
      } else {
        await api.post("/api/products", payload);
      }

      onSuccess();
      if (onCancel) onCancel();
    } catch (err) {
      console.error("Error saving product", err);
      alert("Lỗi khi lưu sản phẩm");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">
        {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
      </h2>

      <input
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên sản phẩm"
        required
      />

      <textarea
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
      />

      <input
        type="number"
        className="border p-2 w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Giá"
        required
      />

      <select
        className="border p-2 w-full"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">-- Chọn danh mục --</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

    {(imageFile || imageUrl) && (
        <img
          src={imageFile ? URL.createObjectURL(imageFile) : `http://localhost:8080${imageUrl}`}
          alt="preview"
          className="w-24 h-24 object-cover rounded"
        />
      )}

      <div className="flex gap-4">
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />{" "}
          Hoạt động
        </label>
        <label>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />{" "}
          Nổi bật
        </label>
      </div>

      <div className="space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingProduct ? "Lưu" : "Thêm"}
        </button>
        {editingProduct && (
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

export default ProductForm;
