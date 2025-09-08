import { Dimensions, View } from "react-native";
import defaults from "./defaultRenderers.jsx";
import { MarkdownRendererBase } from "@md-latex-renderer/react";

/**
 * Math rendering component
 * Renders LaTeX math expressions using MathJax
 * @param {string} latex - The LaTeX string to render
 * @param {string} style - The CSS class name to apply to the component
 * @param {string} fixedColor - The color to use for the rendered output
 * @param {number} fontSize - The font size to use for the rendered output
 * @param {number} maxFormulaWidth - The maximum width of the rendered formula
 * @param {boolean} showAsBlock - Whether to show the formula as a block
 * @param {Array<string>} images - Array of image URLs to be used in the markdown
 * @param {Array<string>} videos - Array of video URLs to be used in the markdown
 * @param {boolean} useAnimation - Whether to use animation for rendering
 * @param {object|null} useSelection - Object to manage text selection, or null if selection is disabled
 * @returns {JSX.Element} The rendered MathJax component
 */
export function MarkdownRenderer({ style, maxFormulaWidth, ...props }) {
  const { width } = Dimensions.get("window");
  return (
    <View style={{ flex: 1, width: "100%", ...style }}>
      <MarkdownRendererBase
        defaults={defaults}
        maxFormulaWidth={maxFormulaWidth || width}
        {...props}
      />
    </View>
  );
}

export default MarkdownRenderer;
