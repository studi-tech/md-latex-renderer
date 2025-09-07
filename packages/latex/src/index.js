import { renderers } from "./renderers.js";

export function renderLatex(ast) {
  function renderNode(node) {
    switch (node.type) {
      case "Document":
        return (node.children || []).map(renderNode).join("\n");
      case "Paragraph":
        return (node.children || []).map(renderNode).join("") + "\n\n";
      case "Heading":
        return renderers.Heading(node);
      case "Text":
        return renderers.Text(node);
      case "InlineMath":
        return renderers.InlineMath(node);
      case "BlockMath":
        return renderers.BlockMath(node);
      default:
        return "";
    }
  }
  return renderNode(ast);
}

export default { renderLatex };
