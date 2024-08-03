import { EditorContent, EditorRoot, type JSONContent } from "novel";
import { useState } from "react";

export const TailwindEditor = () => {
  const [content, setContent] = useState<JSONContent | undefined>();
  return (
    <EditorRoot>
      <EditorContent
        initialContent={content}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          setContent(json);
        }}
      />
    </EditorRoot>
  );
};

