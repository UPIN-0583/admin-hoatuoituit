import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Truy cập bị từ chối</h1>
        <p className="text-gray-700 mb-6">
          Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập lại với tài khoản có quyền hợp lệ.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
