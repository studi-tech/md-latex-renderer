import { Dimensions, View } from "react-native";
import defaults from "./defaultRenderers.jsx";
import { MarkdownRendererBase } from "@md-latex-renderer/react";

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
