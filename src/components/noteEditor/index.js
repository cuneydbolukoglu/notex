import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Superscript,
  Subscript,
  Code,
  ChevronDown,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const toggle = (command) => editor.chain().focus()[command]().run();
  const isActive = (command, options = {}) => editor.isActive(command, options);

  const buttonClass = (active) =>
    `flex items-center px-2 py-1 text-sm rounded hover:bg-gray-100 ${
      active ? "bg-gray-200 font-semibold" : ""
    }`;

  return (
    <div className="editor-menu-bar">
      <button
        className={buttonClass(isActive("bold"))}
        onMouseDown={(e) => {
          e.preventDefault();
          toggle("toggleBold");
        }}
      >
        <Bold size={16} className="mr-2" /> Bold{" "}
        <span className="ml-1 text-gray-400">⌘B</span>
      </button>

      <button
        className={buttonClass(isActive("italic"))}
        onMouseDown={(e) => {
          e.preventDefault();
          toggle("toggleItalic");
        }}
      >
        <Italic size={16} className="mr-2" /> Italic{" "}
        <span className="ml-1 text-gray-400">⌘I</span>
      </button>

      <button
        className={buttonClass(isActive("underline"))}
        onMouseDown={(e) => {
          e.preventDefault();
          toggle("toggleUnderline");
        }}
      >
        <UnderlineIcon size={16} className="mr-2" /> Underline{" "}
        <span className="ml-1 text-gray-400">⌘U</span>
      </button>

      <button
        className={buttonClass(isActive("strike"))}
        onMouseDown={(e) => {
          e.preventDefault();
          toggle("toggleStrike");
        }}
      >
        <Strikethrough size={16} className="mr-2" /> Strikethrough
      </button>

      <button
        className={buttonClass(isActive("superscript"))}
        onMouseDown={(e) => {
          e.preventDefault();
          toggle("toggleSuperscript");
        }}
      >
        <Superscript size={16} className="mr-2" /> Superscript
      </button>

      <button
        className={buttonClass(isActive("subscript"))}
        onMouseDown={(e) => {
          e.preventDefault();
          toggle("toggleSubscript");
        }}
      >
        <Subscript size={16} className="mr-2" /> Subscript
      </button>

      <button
        className={buttonClass(isActive("code"))}
        onMouseDown={(e) => {
          e.preventDefault();
          toggle("toggleCode");
        }}
      >
        <Code size={16} className="mr-2" /> Code
      </button>
    </div>
  );
};

export default function NoteEditor({
  value,
  onChange,
  onBlur,
  onKeyDown,
  autoFocus = false,
  multiline = false,
  rows = 4,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ strike: false, code: false }), // Disable defaults
      Underline,
      Superscript,
      Subscript,
      Strike,
      Code,
    ],
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
      className="editor-container border rounded p-4 bg-white"
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (onKeyDown) onKeyDown(e);
        if (e.key === "Enter" && !multiline) onBlur?.();
      }}
      style={{ minHeight: multiline ? `${rows * 24}px` : 200 }}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none mt-2"
        onBlur={onBlur}
      />
    </div>
  );
}