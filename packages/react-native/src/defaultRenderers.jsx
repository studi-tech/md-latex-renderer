import React from "react";
import { Text as RNText, View as RNView } from "react-native";

export const defaultRenderers = {
  Paragraph: ({ children }) =>
    React.createElement(RNView, { style: { marginBottom: 8 } }, children),
  Heading: ({ depth, children }) =>
    React.createElement(
      RNText,
      { style: { fontWeight: "bold", fontSize: 24 - (depth - 1) * 2 } },
      children
    ),
  Text: ({ children }) => React.createElement(RNText, null, children),
  InlineMath: ({ value }) =>
    React.createElement(
      RNText,
      { style: { fontFamily: "monospace" } },
      `$${value}$`
    ),
  BlockMath: ({ value }) =>
    React.createElement(
      RNText,
      { style: { fontFamily: "monospace" } },
      `$$${value}$$`
    ),
};
