import { useEffect, useState } from "react";
import api from "../services/api";
import BlogForm from "../components/BlogForm";
import BlogPreview from "../components/BlogPreview";

export default function AdminBlogManager() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/blog");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch blog posts", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      await api.delete(`/api/blog/${id}`);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting blog", err);
      alert("Xoá thất bại!");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Bài viết Blog</h1>

      <BlogForm
        onSuccess={() => {
          fetchPosts();
          setEditingPost(null); 
        }}
        initialData={editingPost}
        onCancel={() => setEditingPost(null)}
      />
      <div className="my-4">
        <input
          type="text"
          placeholder="Tìm kiếm bài viết theo tiêu đề hoặc tác giả..."  
          className="p-4 border rounded w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-white shadow rounded mt-6">
        <table className="table-auto w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Tác giả</th>
              <th className="p-3">Hoạt động</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{post.id}</td>
                <td
                  className="p-3 cursor-pointer text-blue-600"
                  onClick={() => setPreviewPost(post)}
                >
                  {post.title}
                </td>

                <td className="p-3">{post.author}</td>
                <td className="p-3">{post.isActive ? "✔️" : "❌"}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditingPost(post)}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(post.id)}
                  >
                    Xoá
                  </button>
                </td>
          
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
              onClick={() => setPreviewPost(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{previewPost.title}</h2>
            <p className="text-sm text-gray-500 mb-4">Tác giả: {previewPost.author}</p>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: previewPost.content }}
            />
          </div>
        </div>
      )}
      {previewPost && (
        <BlogPreview post={previewPost} onClose={() => setPreviewPost(null)} />
      )}

    </div>
  );
}
