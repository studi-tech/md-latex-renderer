import defaults from "./defaultRenderers.jsx";
import MarkdownRenderer from "@md-latex-renderer/react";

function MarkdownRendererNative(props) {
  return <MarkdownRenderer defaults={defaults} {...props} />;
}

export { MarkdownRendererNative as MarkdownRenderer };

export default MarkdownRendererNative;
