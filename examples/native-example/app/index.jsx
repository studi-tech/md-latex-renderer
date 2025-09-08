import { Text, View } from "react-native";
import MarkdownRenderer from "@md-latex-renderer/react-native";

const md = `# Hellos

This is inline $a^2 + b^2$ and a block: 

$$E=mc^2$$`;

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MarkdownRenderer latex={md} />
    </View>
  );
}
