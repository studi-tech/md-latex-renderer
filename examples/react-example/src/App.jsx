import React from "react";
import { parseMarkdown } from "@md-latex-renderer/core";
import { MarkdownRenderer } from "@md-latex-renderer/react";

const md = `# Hello\n\nThis is inline $a^2 + b^2$ and a block: \n\n$$E=mc^2$$`;
const ast = parseMarkdown(md);

export default function App() {
  return (
    <div>
      <MarkdownRenderer ast={ast} />
    </div>
  );
}

