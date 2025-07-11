import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, List, ListOrdered } from "lucide-react"; // Veya başka bir ikon kütüphanesi

// Toolbar Düğmeleri
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-gray-200 p-1 rounded" : "p-1"}
      >
        <Bold size={18} />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-gray-200 p-1 rounded" : "p-1"}
      >
        <Italic size={18} />
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-gray-200 p-1 rounded" : "p-1"}
      >
        <UnderlineIcon size={18} />
      </button>

      {/* Heading 1 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "bg-gray-200 p-1 rounded" : "p-1"}
      >
        <Heading1 size={18} />
      </button>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-gray-200 p-1 rounded" : "p-1"}
      >
        <List size={18} />
      </button>

      {/* Ordered List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-gray-200 p-1 rounded" : "p-1"}
      >
        <ListOrdered size={18} />
      </button>
    </div>
  );
};

// Ana Editor Bileşeni
export default function NoteEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline, // Underline eklentisini ekledik
    ],
    content: "<p>Bu bir örnek metin. <strong>Bold</strong>, <em>italic</em> veya <u>underline</u> yapabilirsiniz.</p>",
  });

  return (
    <div className="editor-container border rounded p-4">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
}