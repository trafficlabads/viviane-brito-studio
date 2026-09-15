/** Mostra conteúdo com formatação e imagens; textos simples mantêm os parágrafos. */
export function RichContent({ value, className = "" }: { value?: string | null; className?: string }) {
  const content = value ?? "";
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return <div className={`prose-viviane rich-content ${className}`} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <div className={`prose-viviane rich-content whitespace-pre-wrap ${className}`}>{content}</div>;
}
