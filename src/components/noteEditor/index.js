import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  List,
  ListOrdered,
} from "lucide-react";

// Toolbar Bileşeni
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttonClass = (active) =>
    active ? "bg-gray-200 p-1 rounded" : "p-1";

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
      >
        <UnderlineIcon size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
      >
        <ListOrdered size={18} />
      </button>
    </div>
  );
};

// Ana Editor Bileşeni
export default function NoteEditor({
  value,
  onChange,
  onBlur,
  onKeyDown,
  autoFocus = false,
  multiline = false,
  rows = 1,
}) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    autofocus: autoFocus,
  });

  if (!editor) return null;

  return (
    <div
      className="editor-container border rounded p-4"
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (onKeyDown) onKeyDown(e);
        if (e.key === "Enter" && !multiline) onBlur?.();
      }}
      style={{ minHeight: multiline ? `${rows * 24}px` : "auto" }}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}