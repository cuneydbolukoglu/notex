import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Superscript,
  Subscript,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Table,
  ChevronDown,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TableExtension from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

const ToolbarButton = ({ icon: Icon, onClick, isActive, title, children, className = "" }) => (
  <button
    className={`toolbar-button ${isActive ? 'active' : ''} ${className}`}
    onClick={onClick}
    title={title}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

const ToolbarSeparator = () => <div className="toolbar-separator" />;

const ToolbarGroup = ({ children, className = "" }) => (
  <div className={`toolbar-group ${className}`}>
    {children}
  </div>
);

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const toggle = (command) => editor.chain().focus()[command]().run();
  const isActive = (command, options = {}) => editor.isActive(command, options);

  const addLink = () => {
    const url = window.prompt('URL girin:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Resim URL girin:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="enhanced-toolbar">
      {/* Text Formatting */}
      <ToolbarGroup>
        <ToolbarButton
          icon={Bold}
          onClick={() => toggle("toggleBold")}
          isActive={isActive("bold")}
          title="Kalın (⌘B)"
        />
        <ToolbarButton
          icon={Italic}
          onClick={() => toggle("toggleItalic")}
          isActive={isActive("italic")}
          title="İtalik (⌘I)"
        />
        <ToolbarButton
          icon={UnderlineIcon}
          onClick={() => toggle("toggleUnderline")}
          isActive={isActive("underline")}
          title="Altı Çizili (⌘U)"
        />
        <ToolbarButton
          icon={Strikethrough}
          onClick={() => toggle("toggleStrike")}
          isActive={isActive("strike")}
          title="Üstü Çizili"
        />
        <ToolbarButton
          icon={Superscript}
          onClick={() => toggle("toggleSuperscript")}
          isActive={isActive("superscript")}
          title="Üst Simge"
        />
        <ToolbarButton
          icon={Subscript}
          onClick={() => toggle("toggleSubscript")}
          isActive={isActive("subscript")}
          title="Alt Simge"
        />
        <ToolbarButton
          icon={Code}
          onClick={() => toggle("toggleCode")}
          isActive={isActive("code")}
          title="Kod"
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Headings */}
      <ToolbarGroup>
        <ToolbarButton
          icon={Heading1}
          onClick={() => toggle("toggleHeading", { level: 1 })}
          isActive={isActive("heading", { level: 1 })}
          title="Başlık 1"
        />
        <ToolbarButton
          icon={Heading2}
          onClick={() => toggle("toggleHeading", { level: 2 })}
          isActive={isActive("heading", { level: 2 })}
          title="Başlık 2"
        />
        <ToolbarButton
          icon={Heading3}
          onClick={() => toggle("toggleHeading", { level: 3 })}
          isActive={isActive("heading", { level: 3 })}
          title="Başlık 3"
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Lists & Blockquote */}
      <ToolbarGroup>
        <ToolbarButton
          icon={List}
          onClick={() => toggle("toggleBulletList")}
          isActive={isActive("bulletList")}
          title="Madde Listesi"
        />
        <ToolbarButton
          icon={ListOrdered}
          onClick={() => toggle("toggleOrderedList")}
          isActive={isActive("orderedList")}
          title="Numaralı Liste"
        />
        <ToolbarButton
          icon={Quote}
          onClick={() => toggle("toggleBlockquote")}
          isActive={isActive("blockquote")}
          title="Alıntı"
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Text Alignment */}
      <ToolbarGroup>
        <ToolbarButton
          icon={AlignLeft}
          onClick={() => toggle("setTextAlign", { align: "left" })}
          isActive={isActive({ textAlign: "left" })}
          title="Sola Hizala"
        />
        <ToolbarButton
          icon={AlignCenter}
          onClick={() => toggle("setTextAlign", { align: "center" })}
          isActive={isActive({ textAlign: "center" })}
          title="Ortaya Hizala"
        />
        <ToolbarButton
          icon={AlignRight}
          onClick={() => toggle("setTextAlign", { align: "right" })}
          isActive={isActive({ textAlign: "right" })}
          title="Sağa Hizala"
        />
        <ToolbarButton
          icon={AlignJustify}
          onClick={() => toggle("setTextAlign", { align: "justify" })}
          isActive={isActive({ textAlign: "justify" })}
          title="İki Yana Yasla"
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Links, Images & Tables */}
      <ToolbarGroup>
        <ToolbarButton
          icon={Link}
          onClick={addLink}
          title="Link Ekle"
        />
        <ToolbarButton
          icon={Image}
          onClick={addImage}
          title="Resim Ekle"
        />
        <ToolbarButton
          icon={Table}
          onClick={insertTable}
          title="Tablo Ekle"
        />
      </ToolbarGroup>
    </div>
  );
};

export default function TextEditor({
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
      StarterKit.configure({ 
        strike: false, 
        code: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      Underline,
      Strike,
      Code,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      Blockquote,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      TableExtension.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-semibold border border-gray-300 px-3 py-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-3 py-2',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    autofocus: autoFocus,
  });

  if (!editor) return null;

  // Calculate height based on rows (similar to textarea)
  const rowHeight = 24; // Standard line height
  const padding = 32; // Top and bottom padding
  const toolbarHeight = 60; // Toolbar height
  const minHeight = rows * rowHeight + padding + toolbarHeight;

  return (
    <div
      className="enhanced-editor-container"
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (onKeyDown) onKeyDown(e);
        if (e.key === "Enter" && !multiline) onBlur?.();
      }}
      style={{ 
        minHeight: multiline ? `${rows * rowHeight + padding + toolbarHeight}px` : minHeight,
        height: multiline ? `${rows * rowHeight + padding + toolbarHeight}px` : minHeight
      }}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="enhanced-editor-content prose max-w-none"
        onBlur={onBlur}
      />
    </div>
  );
}