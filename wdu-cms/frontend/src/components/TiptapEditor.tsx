import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const MenuButton = ({ onClick, isActive, icon, title }: any) => (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`p-2 rounded-md transition-all ${
        isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-outline hover:bg-surface-container-high'
      }`}
      title={title}
    >
      <span className="material-symbols-outlined text-sm block leading-none">{icon}</span>
    </button>
  );

  return (
    <div className="w-full border border-outline-variant/30 rounded-xl overflow-hidden bg-white dark:bg-emerald-950/20 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-surface-container-low border-b border-outline-variant/10">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')} 
          icon="format_bold" 
          title="Bold"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')} 
          icon="format_italic" 
          title="Italic"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          isActive={editor.isActive('underline')} 
          icon="format_underlined" 
          title="Underline"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          isActive={editor.isActive('strikethrough')} 
          icon="strikethrough_s" 
          title="Strikethrough"
        />
        
        <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-container-high/30 rounded-lg">
          <div className="flex items-center gap-1">
            {[
              { color: '#000000', title: 'Black' },
              { color: '#059669', title: 'Emerald' },
              { color: '#2563eb', title: 'Blue' },
              { color: '#dc2626', title: 'Red' },
              { color: '#475569', title: 'Slate' },
            ].map((p) => (
              <button
                key={p.color}
                onClick={() => editor.chain().focus().setColor(p.color).run()}
                className={`w-4 h-4 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-125 active:scale-90 ${
                  editor.getAttributes('textStyle').color === p.color ? 'ring-2 ring-primary ring-offset-1' : ''
                }`}
                style={{ backgroundColor: p.color }}
                title={p.title}
              />
            ))}
          </div>
          
          <div className="w-px h-4 bg-outline-variant/20 mx-1" />
          
          <div className="relative group/color" title="Custom Color">
            <input
              type="color"
              onInput={(event: any) => editor.chain().focus().setColor(event.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-5 h-5 p-0 border-0 cursor-pointer bg-transparent"
            />
          </div>

          <button
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="p-1 hover:bg-surface-container-high rounded transition-colors text-outline hover:text-red-500"
            title="Clear Color"
          >
            <span className="material-symbols-outlined text-[16px]">format_color_reset</span>
          </button>
        </div>

        <div className="w-px h-6 bg-outline-variant/20 mx-1 my-auto" />
        
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })} 
          icon="format_h1" 
          title="Heading 1"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })} 
          icon="format_h2" 
          title="Heading 2"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().setParagraph().run()} 
          isActive={editor.isActive('paragraph')} 
          icon="format_paragraph" 
          title="Paragraph"
        />
        
        <div className="w-px h-6 bg-outline-variant/20 mx-1 my-auto" />

        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('left').run()} 
          isActive={editor.isActive({ textAlign: 'left' })} 
          icon="format_align_left" 
          title="Align Left"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('center').run()} 
          isActive={editor.isActive({ textAlign: 'center' })} 
          icon="format_align_center" 
          title="Align Center"
        />
        
        <div className="w-px h-6 bg-outline-variant/20 mx-1 my-auto" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')} 
          icon="format_list_bulleted" 
          title="Bullet List"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')} 
          icon="format_list_numbered" 
          title="Ordered List"
        />
        
        <div className="w-px h-6 bg-outline-variant/20 mx-1 my-auto" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')} 
          icon="format_quote" 
          title="Blockquote"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().undo().run()} 
          icon="undo" 
          title="Undo"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().redo().run()} 
          icon="redo" 
          title="Redo"
        />
      </div>

      {/* Editor Content */}
      <div className="p-4 min-h-[150px] max-w-4xl focus:outline-none tiptap-content">
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap-content .ProseMirror:focus {
          outline: none;
        }
        .tiptap-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
