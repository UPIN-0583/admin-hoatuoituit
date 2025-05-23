import { useState, useEffect } from "react";
import api from "../services/api";
import TiptapEditor from "./TiptapEditor";

export default function BlogForm({ onSuccess, initialData = null, onCancel }) {
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [resetKey, setResetKey] = useState(0); // Dùng để reset editor nếu cần

  // ✅ Khi initialData thay đổi (sửa hoặc tạo mới)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setThumbnailUrl(initialData.thumbnailUrl);
      setContent(initialData.content);
      setAuthor(initialData.author);
      setIsActive(initialData.isActive);
      setFile(null);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setThumbnailUrl("");
    setFile(null);
    setIsActive(true);
    setAuthor("Admin");
    setResetKey(prev => prev + 1); // Để Tiptap reset lại nội dung nếu cần
  };

  const handleImageUpload = async () => {
    if (!file) return thumbnailUrl;
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedThumbnailUrl = thumbnailUrl;

    try {
      if (file) {
        uploadedThumbnailUrl = await handleImageUpload();
      }

      const payload = {
        title,
        content,
        thumbnailUrl: uploadedThumbnailUrl,
        author,
        isActive,
      };

      if (initialData) {
        await api.put(`/api/blog/${initialData.id}`, payload);
      } else {
        await api.post("/api/blog", payload);
        resetForm(); // ✅ Reset khi tạo mới
      }

      alert("Lưu bài viết thành công!");
      onSuccess?.();
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Có lỗi xảy ra khi lưu bài viết.");
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">{initialData ? "Chỉnh sửa" : "Thêm mới"} Bài viết</h2>

      <div>
        <label className="block font-medium">Tiêu đề</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Nội dung</label>
        <TiptapEditor content={content} setContent={setContent} key={resetKey} />
      </div>

      <div>
        <label className="block font-medium">Tác giả</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Upload ảnh đại diện</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
        {(file || thumbnailUrl) && (
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : `http://localhost:8080${thumbnailUrl}`
            }
            alt="Thumbnail"
            className="h-24 mt-2 border rounded"
          />
        )}
      </div>

      <div>
        <label className="block font-medium">Tags (ngăn cách bằng dấu phẩy)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Ví dụ: Cám ơn, Sinh nhật, Tình yêu"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label>Hiển thị bài viết</label>
      </div>

      <div className="space-x-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {initialData ? "Cập nhật" : "Tạo mới"}
        </button>

        {(initialData || title || content || file) && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Huỷ
          </button>
        )}
      </div>
    </form>
  );
}
