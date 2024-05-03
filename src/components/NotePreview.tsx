interface NotePreviewProps {
  html: string;
}

export default function NotePreview({ html }: NotePreviewProps) {
  return (
    <div className="min-h-[200px] rounded-md border border-gray-200 bg-white p-4">
      <article
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
