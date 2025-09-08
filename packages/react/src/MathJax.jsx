import { memo } from "react";

import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { SVG } from "mathjax-full/js/output/svg.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js";
import { defaultConstants } from "./defaults.jsx";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const getScale = (_svgString) => {
  const svgString = _svgString.match(/<svg([^>]+)>/gi).join("");

  let [width, height] = (svgString || "")
    .replace(/.* width="([\d.]*)[ep]x".*height="([\d.]*)[ep]x".*/gi, "$1,$2")
    .split(/,/gi);
  [width, height] = [parseFloat(width), parseFloat(height)];

  let viewport = svgString.match(
    /viewBox="(-?[\d.]+ -?[\d.]+ -?[\d.]+ -?[\d.]+)"/i
  );
  if (viewport) {
    viewport = viewport[1].split(/[\s,]+/gi).map((v) => parseFloat(v));
  } else {
    // If viewBox is not defined, we can use the width and height
    viewport = [0, 0, width, height];
  }
  return [width, height, viewport];
};

const applyScale = (svgString, scale, params) => {
  const [width, height, viewport] = getScale(svgString);

  const imgRatio = width / height;
  let fixedWidth = width * scale;
  if (params.maxWidth) {
    fixedWidth = Math.min(params.maxWidth, fixedWidth);
  }
  const fixedHeight = Math.round(fixedWidth / imgRatio);

  let retSvgString = svgString.replace(
    /(<svg[^>]+height=")([\d.]+)([ep]x"[^>]+>)/gi,
    `$1${fixedHeight}$3`
  );
  retSvgString = retSvgString.replace(
    /(<svg[^>]+width=")([\d.]+)([ep]x"[^>]+>)/gi,
    `$1${fixedWidth}$3`
  );
  return retSvgString;
};

const applyColor = (svgString, fillColor, isTable = false) => {
  if (isTable) {
    // Find all rect and line elements, add it a stroke-width and fill with transparent
    svgString = svgString.replace(
      /<rect/gi,
      `<rect stroke-width="40" fill="transparent"`
    );
    svgString = svgString.replace(
      /<line/gi,
      `<line stroke-width="40" fill="transparent"`
    );
  }
  // return svgString;

  return svgString.replace(/currentColor/gim, `${fillColor}`);
};

const texToSvg = (textext = "", fontSize = 8, params) => {
  if (!textext) {
    return "";
  }

  // Get multiplier for single numbers/chars to avoid scaling issues
  let multiplier = defaultConstants.SVG_RATIO;
  if (new RegExp(`^\\\\mathrm{[a-z0-9]}$`, "g").test(textext)) {
    multiplier *= 1.2;
  } else if (new RegExp(`^\\\\mathrm{[a-z0-9]+}$`, "g").test(textext)) {
    multiplier *= 1.1;
  } else if (new RegExp(`^\\\\mathrm{[A-Z]}$`, "g").test(textext)) {
    multiplier *= 1.1;
  }

  if (multiplier > 1) {
    // Add a phantom to avoid scaling issues with single numbers
    textext = "\\vphantom{x}" + textext;
  }

  const tex = new TeX({
    packages: params.packages.split(/\s*,\s*/),
  });
  const svg = new SVG({ fontCache: params.fontCache ? "local" : "none" });
  const html = mathjax.document("", { InputJax: tex, OutputJax: svg });
  const node = html.convert(textext, {
    display: !params.inline,
    em: params.em,
    ex: params.ex,
  });

  let svgString = adaptor.outerHTML(node) || "";
  svgString = svgString.replace(
    /<mjx-container.*?>(.*)<\/mjx-container>/gi,
    "$1"
  );

  svgString = applyScale(svgString, fontSize * multiplier, params);

  return `${svgString}`;
};

const MathJax = memo(
  ({ fontSize, color, inline, maxWidth, children, SvgFromString } = {}) => {
    const params = {
      ex: 8,
      em: 16,
      inline: !!inline,
      packages: AllPackages.sort().join(", "),
      fontCache: true,
      maxWidth,
    };

    const textext = children || "";
    const newFontSize = fontSize ? fontSize / 2 : undefined;
    color = color || "black";
    let svgString = texToSvg(textext, newFontSize, params);
    const isTable = textext.includes("\\begin{array}");
    svgString = applyColor(svgString, color, isTable);
    return <SvgFromString svgString={svgString} color={color} />;
  }
);

export default MathJax;
export { texToSvg };
