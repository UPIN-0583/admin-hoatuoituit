import React, { useEffect, useState } from "react";
import { BASE_URL } from "../services/api";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");  
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resCustomers, resProducts, resPayments] = await Promise.all([
          api.get("/api/customers"),
          api.get("/api/products/view-all"),
          api.get("/api/payments"),
        ]);
        setCustomers(resCustomers.data);
        setProducts(resProducts.data);
        setPayments(resPayments.data.filter(p => p.isActive));
      } catch (err) {
        setError("Lỗi khi tải dữ liệu khách hàng, sản phẩm hoặc thanh toán");
      }
    };
    loadData();
  }, []);

  const handleSelectProduct = (productId, quantity) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.productId === productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === productId ? { ...p, quantity } : p
        );
      } else {
        return [...prev, { productId, quantity }];
      }
    });
  };

  const totalAmount = selectedProducts.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.finalPrice * item.quantity : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || selectedProducts.length === 0 || !selectedPaymentId || !deliveryAddress) {
        alert("Vui lòng nhập đầy đủ thông tin đơn hàng");
        return;
    }

    const selectedPayment = payments.find(p => p.id.toString() === selectedPaymentId);

    const itemsPayload = selectedProducts
        .filter(item => item.quantity > 0)
        .map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: product ? product.price : 0,  // giá gốc
            discountApplied: product ? product.discountValue : 0
        };
        });

    console.log("Dữ liệu gửi lên backend:", {
        customerId: selectedCustomerId,
        paymentId: selectedPaymentId,
        paymentMethodName: selectedPayment?.paymentName,
        deliveryAddress,
        status: "PENDING",
        items: itemsPayload
    });

    try {
        await api.post("/api/orders", {
        customerId: selectedCustomerId,
        paymentId: selectedPaymentId,
        paymentMethodName: selectedPayment?.paymentName,
        deliveryAddress,
        status: "PENDING",
        items: itemsPayload
        });
        alert("Tạo đơn hàng thành công!");
        navigate("/orders");
    } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tạo đơn hàng");
    }
    };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-center">Tạo đơn hàng mới (Admin)</h2>

      {error && <div className="text-red-500 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn khách hàng */}
        <div>
          <label className="block font-medium mb-1">Khách hàng</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">-- Chọn khách hàng --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Địa chỉ giao hàng */}
        <div>
          <label className="block font-medium mb-1">Địa chỉ giao hàng</label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Nhập địa chỉ giao hàng"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Danh sách sản phẩm */}
        <div>
          <label className="block font-medium mb-1">Sản phẩm</label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border rounded p-3 shadow hover:shadow-lg transition">
                <img src={`${BASE_URL}${p.imageUrl}`} alt={p.name} className="h-40 w-auto max-w-full object-contain rounded mb-2" />
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-600">{p.categoryName}</p>
                <p className="text-sm">
                  Giá:{" "}
                  {p.discountValue && p.discountValue > 0 ? (
                    <>
                      <span className="line-through">{p.price.toLocaleString()} đ</span>{" "}
                      <span className="text-red-600 font-bold">{p.finalPrice.toLocaleString()} đ</span>
                    </>
                  ) : (
                    <span>{p.price.toLocaleString()} đ</span>
                  )}
                </p>
                <input
                  type="number"
                  min="0"
                  placeholder="Số lượng"
                  className="w-full p-2 border rounded mt-1"
                  onChange={(e) =>
                    handleSelectProduct(p.id, parseInt(e.target.value) || 0)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <label className="block font-medium mb-1">Phương thức thanh toán</label>
          <select
            value={selectedPaymentId}
            onChange={(e) => setSelectedPaymentId(e.target.value)}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">-- Chọn phương thức --</option>
            {payments.map((p) => (
              <option key={p.id} value={p.id}>
                {p.paymentName} - {p.description}
              </option>
            ))}
          </select>
        </div>

        {/* Tổng tiền */}
        <div className="text-lg font-bold text-right">
          Tổng tiền: {totalAmount.toLocaleString()} đ
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded font-medium"
        >
          Tạo đơn hàng
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
