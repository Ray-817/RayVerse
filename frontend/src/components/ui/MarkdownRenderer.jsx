import { marked } from "marked";

export default function MarkdownRenderer({ markdown }) {
  const html = marked.parse(markdown, {
    breaks: true, // 支持换行
    gfm: true, // GitHub 风格
  });

  return (
    <div
      className="markdown-body max-w-full prose prose-2xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
