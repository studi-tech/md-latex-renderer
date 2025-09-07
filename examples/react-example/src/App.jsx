import React from "react";
import { MarkdownRenderer } from "@md-latex-renderer/react";

const md = `# Hellos

This is inline $a^2 + b^2$ and a block: 

$$E=mc^2$$`;

export default function App() {
  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        backgroundColor: "gray",
        opacity: "70%",
      }}
    >
      <MarkdownRenderer latex={md} maxFormulaWidth={390} fontSize={20} />
    </div>
  );
}
