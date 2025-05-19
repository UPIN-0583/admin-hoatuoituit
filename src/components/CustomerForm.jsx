import React, { useEffect, useState } from "react";

const CustomerForm = ({ onSubmit, initialData = null, onCancel, isEditing }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
      setPassword(""); // Không điền mật khẩu khi chỉnh sửa
      setIsActive(initialData.isActive ?? true);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPassword("");
      setIsActive(true);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = isEditing
      ? { name, email, phone, address, isActive } // chỉnh sửa
      : { email, password }; // đăng ký chỉ cần email + password
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">
        {isEditing ? "Cập nhật khách hàng" : "Thêm khách hàng"}
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {!isEditing && (
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      )}

      {isEditing && (
        <>
          <input
            type="text"
            placeholder="Tên khách hàng"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            className="border p-2 w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            placeholder="Địa chỉ"
            className="border p-2 w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
        </>
      )}

      <div className="space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {isEditing ? "Lưu" : "Đăng ký"}
        </button>
        {isEditing && (
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

export default CustomerForm;
