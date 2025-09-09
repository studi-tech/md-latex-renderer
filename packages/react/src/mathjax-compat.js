// inside your library source
import * as mjmathjaxNS from "mathjax-full/js/mathjax.js";
import * as mjTeXNS from "mathjax-full/js/input/tex.js";
import * as mjSVGNS from "mathjax-full/js/output/svg.js";
import * as mjliteAdaptorNS from "mathjax-full/js/adaptors/liteAdaptor.js";
import * as mjRegisterHTMLHandlerNS from "mathjax-full/js/handlers/html.js";
import * as mjAllPackagesNS from "mathjax-full/js/input/tex/AllPackages.js";

const mjmathjax = "default" in mjmathjaxNS ? mjmathjaxNS.default : mjmathjaxNS;
const mjTeX = "default" in mjTeXNS ? mjTeXNS.default : mjTeXNS;
const mjSVG = "default" in mjSVGNS ? mjSVGNS.default : mjSVGNS;
const mjliteAdaptor =
  "default" in mjliteAdaptorNS ? mjliteAdaptorNS.default : mjliteAdaptorNS;
const mjRegisterHTMLHandler =
  "default" in mjRegisterHTMLHandlerNS
    ? mjRegisterHTMLHandlerNS.default
    : mjRegisterHTMLHandlerNS;
const mjAllPackages =
  "default" in mjAllPackagesNS ? mjAllPackagesNS.default : mjAllPackagesNS;

const { mathjax } = mjmathjax;
const { TeX } = mjTeX;
const { SVG } = mjSVG;
const { liteAdaptor } = mjliteAdaptor;
const { RegisterHTMLHandler } = mjRegisterHTMLHandler;
const { AllPackages } = mjAllPackages;

export { TeX, SVG, AllPackages, mathjax, liteAdaptor, RegisterHTMLHandler };
