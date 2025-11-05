import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useEffect } from "react";
import { useUploadImage } from "@/hooks/useImage";
import { toast } from "react-hot-toast";

interface EditorProps {
  onChange: (content: string) => void;
  onEditorReady: (editor: BlockNoteEditor) => void;
}

const Editor = ({ onChange, onEditorReady }: EditorProps) => {
  const { mutateAsync: uploadImage } = useUploadImage();

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

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      onChange={() => {
        const newContent = JSON.stringify(editor.document);
        onChange(newContent);
      }}
    />
  );
};

export default Editor;
