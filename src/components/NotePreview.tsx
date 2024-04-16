interface NotePreviewProps {
  html: string;
}

export default function NotePreview({ html }: NotePreviewProps) {
  return (
    <article
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
