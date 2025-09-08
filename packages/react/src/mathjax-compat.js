// inside your library source
import * as Tex from "mathjax-full/js/input/tex.js";
import * as SVG from "mathjax-full/js/output/svg.js";
import * as AllPackages from "mathjax-full/js/input/tex/AllPackages.js";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";

export { Tex, SVG, AllPackages, mathjax, liteAdaptor, RegisterHTMLHandler };
