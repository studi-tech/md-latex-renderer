import React from "react";

export const defaultRenderers = {
  Text: ({ children, onPress, onLongPress, ...props }) =>
    React.createElement(
      "span",
      { onClick: onPress, onDoubleClick: onLongPress, ...props },
      children
    ),
  SVG: ({ svgString, ...props }) =>
    React.createElement("img", {
      src: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
      ...props,
    }),
  LoadingIndicator: () => React.createElement("span", props, "Loading..."),
  Block: ({ children, ...props }) =>
    React.createElement(
      "div",
      {
        ...props,
        style: {
          gap: 10,
          ...props.style,
        },
      },
      children
    ),
  Button: ({ onPress, children, ...props }) =>
    React.createElement("button", { onClick: onPress, ...props }, children),
  Image: ({ src, alt, ...props }) =>
    React.createElement("img", { src, alt, ...props }),
  Link: ({ href, children, ...props }) =>
    React.createElement("a", { href, ...props }, children),
  Video: ({ src, ...props }) =>
    React.createElement("video", { src, controls: true, ...props }),
  AnimatedBlock: ({ children, ...props }) =>
    React.createElement(
      "div",
      { ...props, style: { ...props.style, transition: "all 0.3s ease" } },
      children
    ),
};

export const defaultActions = {
  normalizeFontSize: (size) => size,
  normalizePx: (size) => size,
  navigate: (url) => {
    window.location.href = url;
  },
};

export const defaultConstants = {
  FONT_SIZE: defaultActions.normalizeFontSize(12),
  HIGHLIGHT_COLOR: "rgb(46, 62, 159)",
  INDENT_SIZE: defaultActions.normalizePx(15),
  SVG_RATIO: 0.11,
};

const defaults = {
  defaultRenderers,
  defaultActions,
  defaultConstants,
};
export default defaults;
