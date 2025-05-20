import React, { useState, useEffect } from "react";
import api from "../services/api";
import { BASE_URL } from "../services/api";
import ProductForm from "../components/ProductForm";
import ProductFilter from "../components/ProductFilter";
import AssignOccasionsModal from "../components/AssignOccasionsModal";
import AssignFlowersModal from "../components/AssignFlowersModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOccasionModal, setShowOccasionModal] = useState(false);
  const [showFlowerModal, setShowFlowerModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const loadProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  const fetchFilteredProducts = async (params) => {
    const res = await api.get("/api/products/filter", { params });
    setProducts(res.data.content || []);
  };

  const handleToggleActive = async (product) => {
    await api.put(`/api/products/${product.id}`, {
      ...product,
      isActive: !product.isActive,
    });
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>

      <ProductForm
        editingProduct={editingProduct}
        onSuccess={loadProducts}
        onCancel={() => setEditingProduct(null)}
      />

      <ProductFilter onFilter={fetchFilteredProducts} />

      <div className="bg-white shadow rounded mt-6 overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Dịp</th>
              <th className="p-3">Loài hoa</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ảnh</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.price?.toLocaleString()}₫</td>
                <td className="p-3 ">
                  {p.occasionNames?.map((name, idx) => (
                    <div key={idx}>{name}</div>
                  ))}
                </td>
                <td className="p-3 ">
                  {p.flowerNames?.map((name, idx) => (
                    <div key={idx}>{name}</div>
                  ))}
                </td>
                <td className="p-3 text-center">
                  {p.isActive ? (
                    <span className="text-green-600 font-medium">✔️</span>
                  ) : (
                    <span className="text-red-500 font-medium">❌</span>
                  )}
                </td>
                <td className="p-3">
                  {p.imageUrl && <img src={`${BASE_URL}${p.imageUrl}`} alt={p.name} className="w-12 h-12 object-cover" />}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setEditingProduct(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`px-3 py-1 rounded text-white ${
                      p.isActive ? "bg-red-500" : "bg-green-600"
                    }`}
                  >
                    {p.isActive ? "Tắt" : "Bật"}
                  </button>
                
                  <button
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setShowOccasionModal(true);
                    }}
                    className="bg-indigo-600 text-white px-2 py-1 rounded"
                  >
                    Gán dịp
                  </button>
                  <button
                    onClick={() => {
                      console.log("Gán dịp clicked, productId:", p.id);
                      setSelectedProductId(p.id);
                      setShowFlowerModal(true);
                    }}
                    className="bg-pink-600 text-white px-2 py-1 rounded"
                  >
                    Gán hoa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showOccasionModal && selectedProductId && (
        <AssignOccasionsModal
          productId={selectedProductId}
          onClose={() => {
            setShowOccasionModal(false);
            loadProducts();
          }}
        />
      )}

      {showFlowerModal && selectedProductId && (
        <AssignFlowersModal
          productId={selectedProductId}
          onClose={() => {
            setShowFlowerModal(false);
            loadProducts();
          }}
        />
      )}
    </div>
  );
};

export default Products;
