import React, { useEffect, useState } from "react";
import api from "../services/api";

const PromotionForm = ({
  onSuccess,
  onCancel,
  initialData = null,
  onCreated, // dùng để mở modal gán sản phẩm sau khi tạo
}) => {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || "");
      setDescription(initialData.description || "");
      setDiscountValue(initialData.discountValue || "");
      setStartDate(initialData.startDate?.slice(0, 16) || "");
      setEndDate(initialData.endDate?.slice(0, 16) || "");
      setIsActive(initialData.isActive ?? true);
    } else {
      setCode("");
      setDescription("");
      setDiscountValue("");
      setStartDate("");
      setEndDate("");
      setIsActive(true);
    }
  }, [initialData]);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code,
      description,
      discountValue: Number(discountValue),
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      isActive,
    };

    try {
      if (initialData) {
        await api.put(`/api/promotions/${initialData.id}`, payload);
      } else {
        const res = await api.post("/api/promotions", payload);
        onCreated?.(res.data.id); // mở modal gán sản phẩm
      }

      setCode("");
      setDescription("");
      setDiscountValue("");
      setStartDate("");
      setEndDate("");
      setIsActive(true);
      onCancel?.();
      onSuccess?.();
    } catch (err) {
      console.error("Submit failed", err);
      alert("Lỗi khi lưu khuyến mãi");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-3"
    >
      <h2 className="text-lg font-semibold">
        {initialData ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}
      </h2>

      <input
        type="text"
        placeholder="Mã khuyến mãi"
        className="border p-2 w-full"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Phần trăm giảm giá (%)"
        className="border p-2 w-full"
        value={discountValue}
        onChange={(e) => setDiscountValue(e.target.value)}
        required
      />

      <textarea
        placeholder="Mô tả"
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm mb-1">Từ ngày:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Đến ngày:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
      </div>

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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
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

export default PromotionForm;
