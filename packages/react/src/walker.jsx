import * as React from "react";
import { useEffect, memo } from "react";

import lodash from "lodash";

import { parseMarkdown, MARKDOWN_COMPONENT } from "@md-latex-renderer/core";
import MathComponent from "./MathComponent.jsx";
import reactDefaults from "./defaults.jsx";

// Get the text for the enumeration in the format depending on level (number, letter, roman, etc)
function enumerationToText(enumeration, level = 0) {
  const numberToRoman = [
    "i",
    "ii",
    "iii",
    "iv",
    "v",
    "vi",
    "vii",
    "viii",
    "ix",
    "x",
    "xi",
    "xii",
    "xiii",
    "xiv",
    "xv",
    "xvi",
    "xvii",
    "xviii",
    "xix",
    "xx",
  ];
  switch (level % 3) {
    case 0:
      return `${enumeration})`;
    case 1:
      return `${String.fromCharCode(((enumeration - 1) % 26) + 97)})`;
    case 2:
      return `${numberToRoman[(enumeration - 1) % numberToRoman.length]})`;
  }
}

const ItemRenderer = memo(
  /**
   *
   * @param {object} attributes
   * @param {import("@md-latex-renderer/core").LatexBlock} attributes.item
   * @param {import('./defaults.jsx')} defaults - The default values to use
   */
  ({
    item,
    fixedColor,
    showAsBlock,
    maxFormulaWidth,
    fontSize,
    indentation = 0,
    isSelectable,
    firstSelectedView,
    setFirstSelectedView,
    lastSelectedView,
    setLastSelectedView,
    isOnlyChild = false,
    defaults,
  }) => {
    const { defaultRenderers, defaultActions, defaultConstants } = defaults;
    const { Text, Block, Link, Image, Video, AnimatedBlock } = defaultRenderers;
    const { normalizeFontSize, normalizePx } = defaultActions;
    const { HIGHLIGHT_COLOR, INDENT_SIZE } = defaultConstants;

    switch (item.type) {
      case MARKDOWN_COMPONENT.PARAGRAPH:
      case MARKDOWN_COMPONENT.HEADING:
      case MARKDOWN_COMPONENT.ORDERED_LIST:
      case MARKDOWN_COMPONENT.UNORDERED_LIST:
        let updatedFontSize = fontSize;
        if (MARKDOWN_COMPONENT.HEADING) {
          updatedFontSize = fontSize + normalizeFontSize(item.fontLevel);
        }
        return (
          <Block
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              rowGap: normalizePx(5),
              columnGap: normalizePx(5),
              marginVertical: normalizePx(5),
              justifyContent: "start",
              alignItems: "start",
              alignContent: "start",
            }}
          >
            {item.listLevel !== undefined && (
              <Block
                style={{
                  minWidth: INDENT_SIZE * 1.5,
                  paddingLeft: INDENT_SIZE / 2,
                }}
              >
                {item.type === MARKDOWN_COMPONENT.ORDERED_LIST && (
                  <Text
                    style={{
                      color: fixedColor,
                      fontWeight: "bold",
                      marginTop: normalizePx(2),
                      fontSize: updatedFontSize,
                    }}
                  >
                    {enumerationToText(item.enumeration, item.listLevel)}
                  </Text>
                )}
                {item.type === MARKDOWN_COMPONENT.UNORDERED_LIST && (
                  <Block
                    style={{
                      height: updatedFontSize / 2,
                      width: updatedFontSize / 2,
                      marginTop: updatedFontSize / 2,
                      borderRadius:
                        item.listLevel % 4 >= 2 ? 0 : updatedFontSize / 4,
                      borderWidth: 1,
                      borderColor: fixedColor,
                      backgroundColor:
                        (item.listLevel % 4) % 2 === 1
                          ? "transparent"
                          : fixedColor,
                    }}
                  />
                )}
              </Block>
            )}
            <Block style={{ flexShrink: 1 }}>
              <Block
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  rowGap: 0,
                  columnGap: 4,
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignContent: "space-between",
                }}
              >
                {item.content.map((subitem, index) => (
                  <ItemRenderer
                    key={index}
                    item={subitem}
                    fixedColor={fixedColor}
                    maxFormulaWidth={maxFormulaWidth}
                    showAsBlock={showAsBlock}
                    fontSize={updatedFontSize}
                    indentation={indentation}
                    isSelectable={isSelectable}
                    firstSelectedView={firstSelectedView}
                    setFirstSelectedView={setFirstSelectedView}
                    lastSelectedView={lastSelectedView}
                    setLastSelectedView={setLastSelectedView}
                    isOnlyChild={item.content.length === 1}
                    defaults={defaults}
                  />
                ))}
                {/* Add final padding for correcting justify */}
                {item.content.length > 0 &&
                  !(
                    item.content.length === 1 && item.content[0].content === ""
                  ) &&
                  [...Array(9)].map((_, index) => (
                    <Text
                      key={`text-${index}`}
                      style={{ width: "10%", height: 0 }}
                    />
                  ))}
              </Block>
              <Block
                style={{
                  paddingLeft:
                    item.type === MARKDOWN_COMPONENT.HEADING ? INDENT_SIZE : 0,
                }}
              >
                {item.children?.map((subitem, index) => (
                  <ItemRenderer
                    key={index}
                    item={subitem}
                    fixedColor={fixedColor}
                    maxFormulaWidth={maxFormulaWidth}
                    showAsBlock={showAsBlock}
                    fontSize={fontSize}
                    indentation={indentation + 1}
                    isSelectable={isSelectable}
                    firstSelectedView={firstSelectedView}
                    setFirstSelectedView={setFirstSelectedView}
                    lastSelectedView={lastSelectedView}
                    setLastSelectedView={setLastSelectedView}
                    defaults={defaults}
                  />
                ))}
              </Block>
            </Block>
          </Block>
        );
      case MARKDOWN_COMPONENT.TEXT:
        const startNodeId = item.nodeId;
        const endNodeId = item.nodeId + item.content.split(" ").length - 1;
        const isSelected =
          firstSelectedView !== null &&
          lastSelectedView !== null &&
          firstSelectedView <= startNodeId &&
          lastSelectedView >= endNodeId;
        if (isOnlyChild) {
          return (
            <Text
              style={{
                textAlign: "justify",
                color: isSelected ? "white" : fixedColor,
                paddingVertical: 0,
                fontWeight: item.bold ? "bold" : "normal",
                fontStyle: item.italic ? "italic" : "normal",
                textDecorationLine: item.underline ? "underline" : "none",
                fontSize,
                backgroundColor: isSelected ? HIGHLIGHT_COLOR : "transparent",
              }}
              onPress={
                !isSelectable
                  ? undefined
                  : () => {
                      if (
                        firstSelectedView === null ||
                        lastSelectedView === null
                      ) {
                        return;
                      }
                      if (startNodeId < firstSelectedView) {
                        setFirstSelectedView(startNodeId);
                      }
                      if (endNodeId > lastSelectedView) {
                        setLastSelectedView(endNodeId);
                      }
                    }
              }
              onLongPress={
                !isSelectable
                  ? undefined
                  : () => {
                      setFirstSelectedView(startNodeId);
                      setLastSelectedView(endNodeId);
                    }
              }
            >
              {item.content}
            </Text>
          );
        }
        return item.content.split(" ").map((word, index) => {
          const isSelected =
            firstSelectedView !== null &&
            lastSelectedView !== null &&
            firstSelectedView <= item.nodeId + index &&
            lastSelectedView >= item.nodeId + index;
          return (
            <Text
              key={index}
              style={{
                textAlign: "left",
                color: isSelected ? "white" : fixedColor,
                paddingVertical: 0,
                height: fontSize * 1.2,
                fontWeight: item.bold ? "bold" : "normal",
                fontStyle: item.italic ? "italic" : "normal",
                textDecorationLine: item.underline ? "underline" : "none",
                fontSize,
                backgroundColor: isSelected ? HIGHLIGHT_COLOR : "transparent",
              }}
              onPress={
                !isSelectable
                  ? undefined
                  : () => {
                      if (
                        firstSelectedView === null ||
                        lastSelectedView === null
                      ) {
                        return;
                      }
                      const componentIndex = item.nodeId + index;
                      if (componentIndex < firstSelectedView) {
                        setFirstSelectedView(componentIndex);
                      }
                      if (componentIndex > lastSelectedView) {
                        setLastSelectedView(componentIndex);
                      }
                    }
              }
              onLongPress={
                !isSelectable
                  ? undefined
                  : () => {
                      const componentIndex = item.nodeId + index;
                      setFirstSelectedView(componentIndex);
                      setLastSelectedView(componentIndex);
                    }
              }
            >
              {word}
            </Text>
          );
        });
      case MARKDOWN_COMPONENT.MATH:
        return (
          <MathComponent
            text={item.content}
            isBlock={!item.inline}
            fixedColor={fixedColor}
            maxFormulaWidth={maxFormulaWidth}
            showAsBlock={showAsBlock}
            leftSymbol={item.leftSymbol}
            rightSymbol={item.rightSymbol}
            fontSize={fontSize}
            indentation={indentation}
            nodeId={item.nodeId}
            isSelectable={isSelectable}
            firstSelectedView={firstSelectedView}
            setFirstSelectedView={setFirstSelectedView}
            lastSelectedView={lastSelectedView}
            setLastSelectedView={setLastSelectedView}
            defaults={defaults}
          />
        );
      case MARKDOWN_COMPONENT.URL:
        return (
          <Link
            // Prevents text to wrap, while keeping the minimum width
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: 0,
              columnGap: 4,
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "cyan",
            }}
            href={item.url}
          >
            {item.content.map((subitem, index) => (
              <ItemRenderer
                key={index}
                item={subitem}
                fixedColor="cyan"
                maxFormulaWidth={maxFormulaWidth}
                showAsBlock={showAsBlock}
                fontSize={fontSize}
                indentation={indentation}
                isSelectable={isSelectable}
                firstSelectedView={firstSelectedView}
                setFirstSelectedView={setFirstSelectedView}
                lastSelectedView={lastSelectedView}
                setLastSelectedView={setLastSelectedView}
                defaults={defaults}
              />
            ))}
          </Link>
        );
      case MARKDOWN_COMPONENT.IMAGE:
        return (
          <AnimatedBlock>
            <Image src={item.content} alt="" width={maxFormulaWidth * 0.9} />
          </AnimatedBlock>
        );
      case MARKDOWN_COMPONENT.VIDEO:
        return (
          <AnimatedBlock
            style={{
              height: 200,
              width: maxFormulaWidth * 0.9,
              marginHorizontal: "5%",
              marginTop: normalizePx(20),
            }}
          >
            <Video src={item.content} />
          </AnimatedBlock>
        );
    }
  },
  (prevProps, nextProps) => {
    const isEqual =
      prevProps.fixedColor === nextProps.fixedColor &&
      prevProps.maxFormulaWidth === nextProps.maxFormulaWidth &&
      prevProps.showAsBlock === nextProps.showAsBlock &&
      prevProps.fontSize === nextProps.fontSize &&
      prevProps.indentation === nextProps.indentation &&
      prevProps.firstSelectedView === nextProps.firstSelectedView &&
      prevProps.lastSelectedView === nextProps.lastSelectedView &&
      prevProps.setFirstSelectedView === nextProps.setFirstSelectedView &&
      prevProps.setLastSelectedView === nextProps.setLastSelectedView &&
      lodash.isEqual(prevProps.item, nextProps.item);

    return isEqual;
  }
);

/**
 * Math rendering component
 * Renders LaTeX math expressions using MathJax
 * @param {string} latex - The LaTeX string to render
 * @param {string} fixedColor - The color to use for the rendered output
 * @param {number} fontSize - The font size to use for the rendered output
 * @param {number} maxFormulaWidth - The maximum width of the rendered formula
 * @param {boolean} showAsBlock - Whether to show the formula as a block
 * @param {Array<string>} images - Array of image URLs to be used in the markdown
 * @param {Array<string>} videos - Array of video URLs to be used in the markdown
 * @param {boolean} useAnimation - Whether to use animation for rendering
 * @param {object|null} useSelection - Object to manage text selection, or null if selection is disabled
 * @param {import('./defaults.jsx')} defaults - The default values to use
 * @returns {JSX.Element} The rendered MathJax component
 */
const MathRender = React.memo(
  ({
    latex,
    fixedColor,
    fontSize,
    maxFormulaWidth,
    showAsBlock = undefined,
    images = [],
    videos = [],
    useAnimation = false,
    useSelection = null,
    defaults = reactDefaults,
  }) => {
    const { defaultRenderers, defaultConstants } = defaults;
    const { Block, AnimatedBlock } = defaultRenderers;

    if (!fontSize) fontSize = defaultConstants.FONT_SIZE;

    const { nestedBlocks, orderedComponents } = parseMarkdown(
      latex,
      images,
      videos
    );
    const [firstSelectedView, setFirstSelectedView] = React.useState(null);
    const [lastSelectedView, setLastSelectedView] = React.useState(null);
    const selectedText = React.useRef("");

    useEffect(() => {
      if (
        !useSelection ||
        firstSelectedView === null ||
        lastSelectedView === null
      ) {
        return;
      }
      selectedText.current = orderedComponents
        .slice(firstSelectedView, lastSelectedView + 1)
        .reduce((acc, item) => {
          return acc + item;
        }, "")
        .trim();
      useSelection.setSelection(selectedText.current);
    }, [!!useSelection, firstSelectedView, lastSelectedView]);

    useEffect(() => {
      if (
        useSelection &&
        useSelection.selectedId !== useSelection.componentId
      ) {
        setFirstSelectedView(null);
        setLastSelectedView(null);
      }
    }, [useSelection, useSelection?.selectedId, useSelection?.componentId]);

    if (useAnimation) {
      return (
        <AnimatedBlock
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          {nestedBlocks.map((item, index) => (
            <ItemRenderer
              key={index}
              item={item}
              fixedColor={fixedColor}
              fontSize={fontSize}
              maxFormulaWidth={maxFormulaWidth}
              showAsBlock={showAsBlock}
              isSelectable={!!useSelection}
              firstSelectedView={useSelection ? firstSelectedView : null}
              setFirstSelectedView={
                useSelection ? setFirstSelectedView : () => {}
              }
              lastSelectedView={useSelection ? lastSelectedView : null}
              setLastSelectedView={
                useSelection ? setLastSelectedView : () => {}
              }
              defaults={defaults}
            />
          ))}
        </AnimatedBlock>
      );
    }

    return (
      <Block
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        {nestedBlocks.map((item, index) => (
          <ItemRenderer
            key={index}
            item={item}
            fixedColor={fixedColor}
            fontSize={fontSize}
            maxFormulaWidth={maxFormulaWidth}
            showAsBlock={showAsBlock}
            isSelectable={!!useSelection}
            firstSelectedView={useSelection ? firstSelectedView : null}
            setFirstSelectedView={
              useSelection ? setFirstSelectedView : () => {}
            }
            lastSelectedView={useSelection ? lastSelectedView : null}
            setLastSelectedView={useSelection ? setLastSelectedView : () => {}}
            defaults={defaults}
          />
        ))}
      </Block>
    );
  },
  (prevProps, nextProps) => {
    const isEqual =
      prevProps.latex === nextProps.latex &&
      prevProps.fixedColor === nextProps.fixedColor &&
      prevProps.fontSize === nextProps.fontSize &&
      prevProps.maxFormulaWidth === nextProps.maxFormulaWidth &&
      prevProps.showAsBlock === nextProps.showAsBlock &&
      prevProps.useSelection === nextProps.useSelection &&
      lodash.isEqual(prevProps.useSelection, nextProps.useSelection) &&
      lodash.isEqual(prevProps.images, nextProps.images) &&
      lodash.isEqual(prevProps.videos, nextProps.videos);

    return isEqual;
  }
);

export default MathRender;
