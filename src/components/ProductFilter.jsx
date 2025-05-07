import React, { useState, useEffect } from "react";
import api from "../services/api";

const ProductFilter = ({ onFilter }) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [occasionId, setOccasionId] = useState("");
  const [flowerId, setFlowerId] = useState("");
  const [isActive, setIsActive] = useState("");
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/api/categories/active"),
      api.get("/api/occasions/active"),
      api.get("/api/flowers/active")
    ]).then(([c, o, f]) => {
      setCategories(c.data);
      setOccasions(o.data);
      setFlowers(f.data);
    });
  }, []);

  const handleSubmit = () => {
    onFilter({ name, categoryId, occasionId, flowerId, isActive });
  };

  return (
    <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
      <div>
        <label className="block">Tên</label>
        <input className="border p-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="block">Danh mục</label>
        <select className="border p-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">-- Tất cả --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block">Dịp tặng</label>
        <select className="border p-2" value={occasionId} onChange={(e) => setOccasionId(e.target.value)}>
          <option value="">-- Tất cả --</option>
          {occasions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block">Loài hoa</label>
        <select className="border p-2" value={flowerId} onChange={(e) => setFlowerId(e.target.value)}>
          <option value="">-- Tất cả --</option>
          {flowers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block">Trạng thái</label>
        <select className="border p-2" value={isActive} onChange={(e) => setIsActive(e.target.value)}>
          <option value="">-- Tất cả --</option>
          <option value="true">Hoạt động</option>
          <option value="false">Ẩn</option>
        </select>
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-2 rounded">
        Lọc
      </button>
    </div>
  );
};

export default ProductFilter;
