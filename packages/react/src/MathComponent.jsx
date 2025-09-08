import { memo } from "react";
import MathJax from "./MathJax.jsx";

function cleanLatexText(text) {
  let newText = "";
  const pairs = [
    ["\\degree", "°"],
    ["á", "a"],
    ["é", "e"],
    ["í", "i"],
    ["ó", "o"],
    ["ú", "u"],
  ];
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    for (let j = 0; j < pairs.length; j++) {
      if (char === pairs[j][0]) {
        char = pairs[j][1];
        break;
      }
    }
    newText += char;
  }
  return `\\mathrm{${newText}}`;
}

const MathComponent = memo(
  ({
    text,
    isBlock,
    fixedColor,
    maxFormulaWidth,
    showAsBlock,
    leftSymbol,
    rightSymbol,
    fontSize,
    indentation = 0,
    nodeId,
    isSelectable,
    firstSelectedView,
    setFirstSelectedView,
    lastSelectedView,
    setLastSelectedView,
    defaults,
  }) => {
    const { defaultConstants, defaultRenderers } = defaults;
    const { HIGHLIGHT_COLOR, INDENT_SIZE } = defaultConstants;
    const { LoadingIndicator, Text, Block, Button, SVG } = defaultRenderers;
    // const { theme } = useContext(ThemeContext);
    // const { width } = Dimensions.get("window");
    const fixedText = cleanLatexText(text);
    const isSelected =
      firstSelectedView !== null &&
      lastSelectedView !== null &&
      firstSelectedView <= nodeId &&
      lastSelectedView >= nodeId;
    if (isSelected) {
      fixedColor = "white";
    }

    if (fixedText.length === 0) {
      // Loading circle
      return <LoadingIndicator color={fixedColor} />;
    }

    const MathComponent = (
      <>
        {leftSymbol && (
          <Text
            style={{
              ...styles.text,
              color: isSelected ? "white" : fixedColor,
              paddingVertical: 0,
              fontSize,
            }}
          >
            {leftSymbol}
          </Text>
        )}
        <MathJax
          fontSize={fontSize}
          color={fixedColor}
          inline={showAsBlock === undefined ? !isBlock : !showAsBlock}
          maxWidth={maxFormulaWidth - indentation * INDENT_SIZE}
          SvgFromString={SVG}
          defaults={defaults}
        >
          {fixedText}
        </MathJax>
        {rightSymbol && (
          <Text
            style={{
              textAlign: "left",
              color: isSelected ? "white" : fixedColor,
              paddingVertical: 0,
              fontSize,
            }}
          >
            {rightSymbol}
          </Text>
        )}
      </>
    );

    if (isSelectable) {
      return (
        // Add svg image to fit inline math
        <Button
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: isSelected ? HIGHLIGHT_COLOR : "transparent",
          }}
          onPress={() => {
            if (firstSelectedView === null || lastSelectedView === null) {
              return;
            }
            if (nodeId < firstSelectedView) {
              setFirstSelectedView(nodeId);
            }
            if (nodeId > lastSelectedView) {
              setLastSelectedView(nodeId);
            }
          }}
          onLongPress={() => {
            setFirstSelectedView(nodeId);
            setLastSelectedView(nodeId);
          }}
        >
          {MathComponent}
        </Button>
      );
    } else {
      return (
        <Block
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {MathComponent}
        </Block>
      );
    }
  }
);

export default MathComponent;
