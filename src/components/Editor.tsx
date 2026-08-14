import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useEffect, useRef } from "react";
import { useUploadImage } from "@/hooks/useImage";
import { toast } from "react-hot-toast";

interface EditorProps {
  onChange: (content: string) => void;
  onEditorReady: (editor: BlockNoteEditor) => void;
  initialContent?: string;
}

const Editor = ({ onChange, onEditorReady, initialContent }: EditorProps) => {
  const { mutateAsync: uploadImage } = useUploadImage();
  const lastEmittedRef = useRef<string | null>(null);

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      const response = await uploadImage({ file });
      return response.data.data.path;
    } catch (error) {
      toast.error("Failed to upload file");
      throw error;
    }
  };

  const editor = useCreateBlockNote({
    uploadFile: handleFileUpload,
    placeholders: {
      default: "Start writing here...",
    },
  });

  useEffect(() => {
    onEditorReady(editor);
  }, [editor, onEditorReady]);

  // Load initial content (template / duplicate). Skip anything that the
  // editor itself emitted, otherwise every keystroke would reload the
  // document and split each character onto its own line.
  useEffect(() => {
    if (!initialContent) return;
    if (initialContent === lastEmittedRef.current) return;
    try {
      const blocks = JSON.parse(initialContent);
      if (Array.isArray(blocks) && blocks.length > 0) {
        editor.replaceBlocks(editor.document, blocks);
      }
    } catch {
      // Ignore malformed content
    }
  }, [initialContent, editor]);

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      onChange={() => {
        const newContent = JSON.stringify(editor.document);
        lastEmittedRef.current = newContent;
        onChange(newContent);
      }}
    />
  );
};

export default Editor;
