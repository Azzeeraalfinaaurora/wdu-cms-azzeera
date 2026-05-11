import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { useRef, useEffect, useState } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const colorTextRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false);
  const [isDarkEditor, setIsDarkEditor] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle.configure({ mergeNestedSpanStyles: true }),
      Color.configure({ types: ['textStyle'] }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      isUpdatingRef.current = true;
      const html = editor.getHTML();
      onChange(html);
      // Reset the flag after a short delay to allow React state to propagate
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 10);
    },
    onSelectionUpdate: ({ editor }) => {
      const currentColor = editor.getAttributes('textStyle').color;
      if (colorTextRef.current) {
        colorTextRef.current.value = currentColor || '';
      }
    },
    onCreate: ({ editor }) => {
      const currentColor = editor.getAttributes('textStyle').color;
      if (colorTextRef.current) {
        colorTextRef.current.value = currentColor || '';
      }
    }
  });

  // Keep editor content in sync with external changes, but avoid loops during typing
  useEffect(() => {
    if (editor && content !== undefined && !isUpdatingRef.current) {
      const currentHTML = editor.getHTML();
      // Only set content if it's actually different to avoid cursor jumps and state loss
      if (content !== currentHTML) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  const saveColor = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    if (colorTextRef.current) colorTextRef.current.value = color;
  };

  // Sync with global dark mode on mount
  useEffect(() => {
    const isGlobalDark = document.documentElement.classList.contains('dark');
    setIsDarkEditor(isGlobalDark);
  }, []);

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
    <div className={`w-full border border-outline-variant/30 rounded-xl overflow-hidden transition-all ${isDarkEditor ? 'bg-zinc-900 shadow-inner' : 'bg-white'} focus-within:ring-2 focus-within:ring-primary/20`}>
      {/* Toolbar */}
      <div className={`flex flex-wrap gap-1 p-2 border-b border-outline-variant/10 ${isDarkEditor ? 'bg-zinc-800' : 'bg-slate-50'}`}>
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
        
        <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-container-high/30 rounded-lg">
          <div className="flex items-center gap-1">
            {[
              { color: '#000000', title: 'Black' },
              { color: '#ffffff', title: 'White' },
              { color: '#059669', title: 'Emerald' },
              { color: '#2563eb', title: 'Blue' },
              { color: '#dc2626', title: 'Red' },
              { color: '#475569', title: 'Slate' },
            ].map((p) => (
              <button
                key={p.color}
                onClick={() => saveColor(p.color)}
                className={`w-4 h-4 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-125 active:scale-90 ${
                  editor.getAttributes('textStyle').color === p.color ? 'ring-2 ring-primary ring-offset-1' : ''
                }`}
                style={{ backgroundColor: p.color }}
                title={p.title}
              />
            ))}
          </div>
          
          <div className="w-px h-4 bg-outline-variant/20 mx-1" />
           
          <div className="relative group/color flex items-center gap-1" title="Custom Color">
            <input
              type="color"
              onChange={(event: any) => saveColor(event.target.value)}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-5 h-5 p-0 border-0 cursor-pointer bg-transparent"
            />
            <input
              ref={colorTextRef}
              type="text"
              placeholder="#000000"
              maxLength={7}
              defaultValue={editor.getAttributes('textStyle').color || ''}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) saveColor(val);
                }
              }}
              className="w-16 h-5 text-xs px-1 border border-outline-variant/30 rounded bg-transparent text-outline placeholder:text-outline/50 focus:outline-none focus:border-primary"
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
          onClick={() => editor.chain().focus().undo().run()} 
          icon="undo" 
          title="Undo"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().redo().run()} 
          icon="redo" 
          title="Redo"
        />
 
        <div className="flex-1" />
 
        <button
          onClick={() => setIsDarkEditor(!isDarkEditor)}
          className={`p-2 rounded-md transition-all ${isDarkEditor ? 'text-amber-400 bg-zinc-700 shadow-inner' : 'text-slate-400 hover:bg-slate-200'}`}
          title={isDarkEditor ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined text-sm block leading-none">
            {isDarkEditor ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
 
      {/* Editor Content Area */}
      <div className={`p-6 min-h-[200px] transition-colors duration-300 ${isDarkEditor ? 'bg-zinc-900' : 'bg-slate-50'}`}>
        <div className={`max-w-4xl mx-auto focus:outline-none tiptap-content ${isDarkEditor ? 'prose-invert' : ''}`}>
          <EditorContent editor={editor} />
        </div>
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
        /* Strong highlight for white text in light mode */
        ${!isDarkEditor ? `
          .tiptap-content .ProseMirror span[style*="color: #ffffff"],
          .tiptap-content .ProseMirror span[style*="color:#ffffff"],
          .tiptap-content .ProseMirror span[style*="color: rgb(255, 255, 255)"] {
            background-color: #334155; /* slate-700 */
            color: #ffffff !important;
            border-radius: 4px;
            padding: 2px 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
        ` : ''}
        
        .tiptap-content .ProseMirror {
          min-height: 150px;
          color: ${isDarkEditor ? '#ffffff' : '#334155'};
          font-size: 1.1rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
