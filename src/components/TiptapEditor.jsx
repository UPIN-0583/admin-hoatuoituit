import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TiptapMenuBar from "./TiptapMenuBar";

export default function TiptapEditor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Heading.configure({ levels: [1, 2] }),
      BulletList,
      OrderedList,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // ✅ Cập nhật lại nội dung khi prop content thay đổi
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border rounded p-2">
      <TiptapMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
