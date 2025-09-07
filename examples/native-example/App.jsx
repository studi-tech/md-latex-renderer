import React from "react";
import { Text, View } from "react-native";
import { parseMarkdown } from "@md-latex-renderer/core";
import { MarkdownRenderer } from "@md-latex-renderer/react-native";

const md = `# Hello\n\nThis is inline $a^2 + b^2$ and a block: \n\n$$E=mc^2$$`;
const ast = parseMarkdown(md);

export default function App() {
  return (
    <View style={{ padding: 16 }}>
      <MarkdownRenderer ast={ast} />
    </View>
  );
}
