import { Dimensions, View } from "react-native";
import defaults from "./defaultRenderers.jsx";
import MarkdownRenderer from "@md-latex-renderer/react";

function MarkdownRendererNative(props = {}) {
  const { width } = Dimensions.get("window");
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <MarkdownRenderer
        defaults={defaults}
        maxFormulaWidth={props.maxFormulaWidth || width}
        {...props}
      />
    </View>
  );
}

export { MarkdownRendererNative as MarkdownRenderer };

export default MarkdownRendererNative;
