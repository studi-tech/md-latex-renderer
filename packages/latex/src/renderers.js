export const renderers = {
  Heading: (node) => {
    const levelToCmd = {
      1: "\\section",
      2: "\\subsection",
      3: "\\subsubsection",
      4: "\\paragraph",
      5: "\\subparagraph",
      6: "\\textbf",
    };
    const text = (node.children || [])
      .map((c) => (c.type === "Text" ? c.value : ""))
      .join("");
    const cmd = levelToCmd[node.depth] || "\\textbf";
    return `${cmd}{${text}}\n`;
  },
  Text: (node) => escapeLatex(node.value || ""),
  InlineMath: (node) => `$${node.value}$`,
  BlockMath: (node) => `\\[${node.value}\\]\n`,
};

function escapeLatex(s) {
  return String(s)
    .replace(/([#%&_{}$])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}");
}
