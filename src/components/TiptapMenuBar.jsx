import { useRef } from "react";
import api from "../services/api";


export default function TiptapMenuBar({ editor }) {
  const fileInputRef = useRef();

  if (!editor) return null;

  const insertImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = res.data.url;

      editor.chain().focus().setImage({ src: `http://localhost:8080${imageUrl}` }).run();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Tải ảnh thất bại");
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) insertImage(file);
  };

  const button = (label, command, isActive = false) => (
    <button
      type="button"
      onClick={command}
      className={`px-2 py-1 rounded border ${isActive ? "bg-blue-600 text-white" : "bg-white"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center flex-wrap gap-2 border rounded px-2 py-2 mb-3 bg-gray-100">
      {button("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
      {button("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
      {button("U", () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"))}
      {button("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
      {button("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
      {button("• List", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
      {button("L", () => editor.chain().focus().setTextAlign("left").run(), editor.isActive({ textAlign: 'left' }))}
      {button("C", () => editor.chain().focus().setTextAlign("center").run(), editor.isActive({ textAlign: 'center' }))}
      {button("R", () => editor.chain().focus().setTextAlign("right").run(), editor.isActive({ textAlign: 'right' }))}


      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-2 py-1 rounded bg-green-600 text-white"
      >
        🖼 Ảnh
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        hidden
      />
    </div>
  );
}
