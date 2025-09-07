import MathRender from "./walker.jsx";

/**
 * Math rendering component
 * Renders LaTeX math expressions using MathJax
 * @param {string} latex - The LaTeX string to render
 * @param {string} fixedColor - The color to use for the rendered output
 * @param {number} maxFormulaWidth - The maximum width of the rendered formula
 * @param {boolean} showAsBlock - Whether to show the formula as a block
 * @param {number} fontSize - The font size to use for the rendered output
 * @returns {JSX.Element} The rendered MathJax component
 */
export const MarkdownRenderer = MathRender;

export default MarkdownRenderer;
