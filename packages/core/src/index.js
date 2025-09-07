export const MARKDOWN_COMPONENT = {
  PARAGRAPH: "paragraph",
  HEADING: "heading",
  UNORDERED_LIST: "unordered-list",
  ORDERED_LIST: "ordered-list",
  TEXT: "text",
  MATH: "math",
  URL: "link",
  IMAGE: "image",
  VIDEO: "video",
};

const LATEX_COMPONENT = {
  TEXT: "text",
  MATH: "math",
  IMAGE: "image",
  VIDEO: "video",
};

const LEFT_SYMBOLS_WITHOUT_SPACE = "(¿¡'\"";
const RIGHT_SYMBOLS_WITHOUT_SPACE = ").,?!:;'\"";

function parseMarkdownLevel(blocks) {
  const document = [];
  const orderedComponents = [];
  let level = 0;
  let maxLevel = 0;
  let oldIndent = 0;
  let oldLevel = 0;
  let enumerationsForLevel = {};
  let levelForIndentation = {};
  let nodes = {
    "heading-0": { children: document, previousLevel: "heading-0" },
  };
  let currentHeadingLevel = 0;
  let currentNodeId = "heading-0";
  for (const block of blocks) {
    let headingLevel = currentHeadingLevel;
    if (block.type === LATEX_COMPONENT.MATH) {
      nodes[currentNodeId].children.push({
        nodeId: orderedComponents.length,
        type: MARKDOWN_COMPONENT.MATH,
        inline: false,
        content: block.content,
      });
      orderedComponents.push(`\n\\[ ${block.content} \\]\n`);
    } else if (block.type === LATEX_COMPONENT.IMAGE) {
      nodes[currentNodeId].children.push({
        type: MARKDOWN_COMPONENT.IMAGE,
        content: block.content,
      });
    } else if (block.type === LATEX_COMPONENT.VIDEO) {
      nodes[currentNodeId].children.push({
        type: MARKDOWN_COMPONENT.VIDEO,
        content: block.content,
      });
    } else {
      const inlines = block.content;
      if (inlines.length === 0) {
        continue;
      }
      const start = inlines[0];
      const blockDocument = {
        type: MARKDOWN_COMPONENT.PARAGRAPH,
        fontLevel: 0,
        content: [],
        children: [],
      };

      let prefix = "\n";
      if (!start[0]) {
        const indent = Math.floor(start[1].match(/^\s*/)[0].length / 2);
        if (levelForIndentation[indent] !== undefined) {
          level = levelForIndentation[indent];
        } else if (indent > oldIndent) {
          level = Math.min(level + 1, maxLevel);
        } else {
          level = Math.max(level - (oldIndent - indent), 0);
        }
        oldIndent = indent;
        prefix = "\n\n" + " ".repeat(level);

        let text = start[1].trim();
        if (text.length > 0) {
          if (text.match(/^#+ /)) {
            headingLevel = text.match(/^#+ /)[0].length - 1;
            prefix = "\n\n" + "#".repeat(headingLevel + 1) + " ";
            blockDocument.type = MARKDOWN_COMPONENT.HEADING;
            blockDocument.fontLevel = Math.max(0, 6 - headingLevel);
            text = text.slice(headingLevel).trim();
            level = 0;
            let node = nodes[`heading-${headingLevel}`];
            let i = headingLevel;
            while (!node) {
              node = nodes[`heading-${--i}`];
            }
            currentNodeId = node.previousLevel;
            nodes[`heading-${headingLevel}`] = blockDocument;
            nodes[`heading-${headingLevel}`].previousLevel = currentNodeId;
            currentHeadingLevel = headingLevel;

            // Clear all lists
            for (const key in nodes) {
              if (key.startsWith("list-")) {
                delete nodes[key];
              }
            }
          } else if (text.match(/^- /)) {
            prefix = "\n" + " ".repeat(level) + "- ";
            blockDocument.type = MARKDOWN_COMPONENT.UNORDERED_LIST;
            maxLevel = Math.max(maxLevel, level + 1);
            text = text.slice(1).trim();
          } else if (text.match(/^\d+\. /)) {
            blockDocument.type = MARKDOWN_COMPONENT.ORDERED_LIST;
            maxLevel = Math.max(maxLevel, level + 1);
            text = text.slice(text.match(/^\d+/)[0].length + 1).trim();
            if (enumerationsForLevel[level] === undefined) {
              enumerationsForLevel[level] = 1;
            } else {
              enumerationsForLevel[level]++;
            }
            blockDocument.enumeration = enumerationsForLevel[level];
            prefix =
              "\n" + " ".repeat(level) + `${enumerationsForLevel[level]}. `;
          }

          if (
            blockDocument.type !== MARKDOWN_COMPONENT.HEADING &&
            level <= oldLevel
          ) {
            const nodeId = `list-${level}`;
            if (nodes[nodeId]) {
              currentNodeId = nodes[nodeId].previousLevel;
            } else {
              currentNodeId = `heading-${currentHeadingLevel}`;
            }
          }
          if (
            [
              MARKDOWN_COMPONENT.UNORDERED_LIST,
              MARKDOWN_COMPONENT.ORDERED_LIST,
            ].includes(blockDocument.type)
          ) {
            blockDocument.listLevel = level;
            nodes[`list-${level}`] = blockDocument;
            nodes[`list-${level}`].previousLevel = currentNodeId;
          }
        }

        // Clear Indents and Numeration
        for (const key in levelForIndentation) {
          if (key >= indent) {
            delete levelForIndentation[key];
          }
        }
        for (const key in enumerationsForLevel) {
          if (
            blockDocument.type !== MARKDOWN_COMPONENT.ORDERED_LIST &&
            blockDocument.content.length > 0
          ) {
            delete enumerationsForLevel[level];
          }
          if (key > level) {
            delete enumerationsForLevel[key];
          }
        }
        levelForIndentation[indent] = level;
        inlines[0][1] = text;
      }

      let isFirstInBlock = true;
      let lastInline = null;
      let nextInline = null;
      let inlineIndex = 0;
      for (const inline of inlines) {
        nextInline =
          inlineIndex < inlines.length - 1 ? inlines[inlineIndex + 1] : null;
        if (inline[0]) {
          let leftSymbol = "";
          let rightSymbol = "";
          while (
            lastInline &&
            !lastInline[0] &&
            lastInline[1] &&
            LEFT_SYMBOLS_WITHOUT_SPACE.includes(lastInline[1].slice(-1))
          ) {
            leftSymbol = lastInline[1].slice(-1) + leftSymbol;
            lastInline[1] = lastInline[1].slice(0, -1).trim();
          }
          while (
            nextInline &&
            !nextInline[0] &&
            nextInline[1] &&
            RIGHT_SYMBOLS_WITHOUT_SPACE.includes(nextInline[1][0])
          ) {
            rightSymbol += nextInline[1][0];
            nextInline[1] = nextInline[1].slice(1).trim();
          }
          blockDocument.content.push({
            nodeId: orderedComponents.length,
            type: MARKDOWN_COMPONENT.MATH,
            inline: true,
            content: inline[1],
            leftSymbol,
            rightSymbol,
          });
          orderedComponents.push(
            `${isFirstInBlock ? prefix : " "}${leftSymbol}\\( ${
              inline[1]
            } \\)${rightSymbol}`
          );
        } else {
          let text = inline[1];
          // Check if the last character is a symbol that should not have a space after
          while (
            text.length > 0 &&
            nextInline &&
            nextInline[0] &&
            LEFT_SYMBOLS_WITHOUT_SPACE.includes(text.slice(-1))
          ) {
            text = text.slice(0, -1).trim();
          }
          if (text.length === 0) {
            lastInline = inline;
            inlineIndex++;
            continue;
          }

          // Detect links
          const reLink = /\[(.*?)\]\(([^\s]+?)\)/g;
          let lastIndex = 0;
          let matchLink = reLink.exec(text);
          const blockElements = [];
          while (matchLink !== null) {
            if (matchLink.index > lastIndex) {
              blockElements.push({
                content: text.slice(lastIndex, matchLink.index),
              });
            }
            blockElements.push({
              type: MARKDOWN_COMPONENT.URL,
              content: matchLink[1],
              url: matchLink[2],
            });
            lastIndex = matchLink.index + matchLink[0].length;
            matchLink = reLink.exec(text);
          }
          if (lastIndex < text.length) {
            blockElements.push({
              content: text.slice(lastIndex),
            });
          }

          for (const textBlock of blockElements) {
            const text = textBlock.content;
            textBlock.content = [];
            // Detect bold and italic
            const reBold = /(\*\*|__)(.*?)\1/g;
            lastIndex = 0;
            let matchBold = reBold.exec(text);
            const bolds = [];
            let textWithoutBoldSymbols = "";
            while (matchBold !== null) {
              if (matchBold.index > lastIndex) {
                textWithoutBoldSymbols += text.slice(
                  lastIndex,
                  matchBold.index
                );
              }
              bolds.push({
                start: textWithoutBoldSymbols.length,
                end: textWithoutBoldSymbols.length + matchBold[2].length,
              });
              lastIndex = matchBold.index + matchBold[0].length;
              textWithoutBoldSymbols += matchBold[2];
              matchBold = reBold.exec(text);
            }
            if (lastIndex < text.length) {
              textWithoutBoldSymbols += text.slice(lastIndex);
            }

            let textWithoutAnySymbols = "";
            const reItalic = /(\*|_)(.*?)\1/g;
            lastIndex = 0;
            let matchItalic = reItalic.exec(textWithoutBoldSymbols);
            const italics = [];
            const italicSymbolsPositions = [];
            while (matchItalic !== null) {
              if (matchItalic.index > lastIndex) {
                textWithoutAnySymbols += textWithoutBoldSymbols.slice(
                  lastIndex,
                  matchItalic.index
                );
              }
              italics.push({
                start: textWithoutAnySymbols.length,
                end: textWithoutAnySymbols.length + matchItalic[2].length,
              });
              lastIndex = matchItalic.index + matchItalic[0].length;
              italicSymbolsPositions.push(matchItalic.index);
              italicSymbolsPositions.push(lastIndex - 1);
              textWithoutAnySymbols += matchItalic[2];
              matchItalic = reItalic.exec(textWithoutBoldSymbols);
            }
            if (lastIndex < textWithoutBoldSymbols.length) {
              textWithoutAnySymbols += textWithoutBoldSymbols.slice(lastIndex);
            }

            let boldIndex = 0;
            let symbolsIndex = 0;
            let isStart = true;
            while (boldIndex < bolds.length) {
              const toCompare = isStart
                ? bolds[boldIndex].start
                : bolds[boldIndex].end;
              if (
                symbolsIndex < italicSymbolsPositions.length &&
                italicSymbolsPositions[symbolsIndex] < toCompare
              ) {
                symbolsIndex++;
              } else {
                bolds[boldIndex][isStart ? "start" : "end"] -= symbolsIndex;
                if (isStart) {
                  isStart = false;
                } else {
                  isStart = true;
                  boldIndex++;
                }
              }
            }
            let bold = false;
            let italic = false;
            boldIndex = 0;
            let italicIndex = 0;
            for (let i = 0; i < textWithoutAnySymbols.length; i++) {
              if (
                italicIndex < italics.length &&
                i === italics[italicIndex].start
              ) {
                italic = true;
              }
              if (
                italicIndex < italics.length &&
                i === italics[italicIndex].end
              ) {
                italic = false;
                italicIndex++;
              }
              if (boldIndex < bolds.length && i === bolds[boldIndex].start) {
                bold = true;
              }
              if (boldIndex < bolds.length && i === bolds[boldIndex].end) {
                bold = false;
                boldIndex++;
              }
              if (
                textBlock.content.length === 0 ||
                textBlock.content[textBlock.content.length - 1].bold !== bold ||
                textBlock.content[textBlock.content.length - 1].italic !==
                  italic
              ) {
                textBlock.content.push({
                  type: MARKDOWN_COMPONENT.TEXT,
                  content: textWithoutAnySymbols[i],
                  bold,
                  italic,
                });
              } else {
                textBlock.content[textBlock.content.length - 1].content +=
                  textWithoutAnySymbols[i];
              }
            }
            if (textBlock.type === MARKDOWN_COMPONENT.URL) {
              blockDocument.content.push(textBlock);

              for (const singleTextBlock of textBlock.content) {
                singleTextBlock.nodeId = orderedComponents.length;
                for (const word of singleTextBlock.content.trim().split(" ")) {
                  orderedComponents.push(
                    `${isFirstInBlock ? prefix : " "}${word}`
                  );
                  isFirstInBlock = false;
                }
              }
            } else {
              for (const singleTextBlock of textBlock.content) {
                singleTextBlock.nodeId = orderedComponents.length;
                blockDocument.content.push(singleTextBlock);
                for (const word of singleTextBlock.content.trim().split(" ")) {
                  orderedComponents.push(
                    `${isFirstInBlock ? prefix : " "}${word}`
                  );
                  isFirstInBlock = false;
                }
              }
            }
          }
        }
        isFirstInBlock = false;
        lastInline = inline;
        inlineIndex++;
      }
      nodes[currentNodeId].children.push(blockDocument);
      if (blockDocument.type === MARKDOWN_COMPONENT.HEADING) {
        currentNodeId = `heading-${currentHeadingLevel}`;
      } else if (
        [
          MARKDOWN_COMPONENT.UNORDERED_LIST,
          MARKDOWN_COMPONENT.ORDERED_LIST,
        ].includes(blockDocument.type)
      ) {
        currentNodeId = `list-${level}`;
      }
      oldLevel = level;
    }
  }
  return {
    nestedBlocks: document,
    orderedComponents,
  };
}

function parseInlineLatex(latex) {
  const inlines = [];
  let isFunction = false;
  let isParentesis = false;
  let inline = "";

  for (let i = 0; i < latex.length; i++) {
    if (latex[i] === "\\") {
      if (i >= latex.length - 1) {
        continue;
      }
      i++;

      if (latex[i] === "(") {
        if (isFunction) {
          continue;
        }
        isFunction = true;
        isParentesis = true;
        inlines.push([false, inline.trim()]);
        inline = "";
      } else if (latex[i] === ")") {
        if (!isParentesis) {
          continue;
        }
        isFunction = false;
        isParentesis = false;
        inlines.push([true, inline.trim()]);
        inline = "";
      } else if (latex[i] === "$" && !isFunction) {
        inline += "$";
      } else {
        inline += "\\" + latex[i];
      }
    } else if (latex[i] === "$") {
      if (isParentesis) {
        continue;
      }
      inlines.push([isFunction, inline.trim()]);
      inline = "";
      isFunction = !isFunction;
    } else {
      inline += latex[i];
    }
  }
  if (!isFunction) {
    inlines.push([isFunction, inline.trim()]);
  }

  return inlines;
}

/**
 * @typedef {{
 *  nodeId: number,
 *  type: string,
 *  fontLevel: number,
 *  enumeration: number,
 *  listLevel: number,
 *  inline: boolean,
 *  bold: boolean,
 *  italic: boolean,
 *  url: string,
 *  children: LatexBlock[],
 *  content: string | LatexBlock[]
 * }} LatexBlock
 */

/**
 * Parse latex into blocks of text and math
 * @param {string} latex
 * @returns {{ nestedBlocks: LatexBlock[], orderedComponents: LatexBlock[] }}
 */
export function parseMarkdown(latex, images = [], videos = []) {
  const escForCharClass = (s) => s.replace(/[-\\\]^]/g, "\\$&");

  const escapedLeftSymbols = escForCharClass(LEFT_SYMBOLS_WITHOUT_SPACE);
  const regexLeftSymbols = new RegExp(`([${escapedLeftSymbols}])\\s+\\$`, "g");
  const regexMathLeftSymbols = new RegExp(`(^|[^$])\\$([¡¿])`, "g");

  const escapedRightSymbols = escForCharClass(RIGHT_SYMBOLS_WITHOUT_SPACE);
  const regexRightSymbols = new RegExp(
    `\\$\\s+([${escapedRightSymbols}])`,
    "g"
  );
  const regexMathRightSymbols = new RegExp(`([.,?!])\\$([^$]|$)`, "g");

  latex = latex
    .trim()
    .replace(/ +/g, " ")
    .replace(regexRightSymbols, (_, p) => "$" + p)
    .replace(regexLeftSymbols, (_, p) => p + "$")
    .replace(regexMathRightSymbols, (_, p, r) => "$" + p + r)
    .replace(regexMathLeftSymbols, (_, r, p) => r + p + "$");
  const blocks = [];
  let isFunction = false;
  let isSquareBracket = false;
  let block = "";
  let count = 0;
  for (let i = 0; i < latex.length; i++) {
    if (count === 1 && latex[i] !== "$") {
      block += "$";
      count = 0;
    }

    const imageMatch = latex.slice(i).match(/^~image(\d+)~/);
    if (imageMatch) {
      const imageIndex = parseInt(imageMatch[1], 10);
      blocks.push({
        type: LATEX_COMPONENT.TEXT,
        content: parseInlineLatex(block),
      });
      block = "";
      if (imageIndex < images.length) {
        blocks.push({
          type: LATEX_COMPONENT.IMAGE,
          content: images[imageIndex],
        });
      }
      i += imageMatch[0].length - 1;
      continue;
    }
    const videoMatch = latex.slice(i).match(/^~video(\d+)~/);
    if (videoMatch) {
      const videoIndex = parseInt(videoMatch[1], 10);
      blocks.push({
        type: LATEX_COMPONENT.TEXT,
        content: parseInlineLatex(block),
      });
      block = "";
      if (videoIndex < videos.length) {
        blocks.push({
          type: LATEX_COMPONENT.VIDEO,
          content: videos[videoIndex],
        });
      }
      i += videoMatch[0].length - 1;
      continue;
    }

    if (latex[i] === "\\") {
      if (i >= latex.length - 1) {
        continue;
      }
      i++;
      if (latex[i] === "[") {
        if (isFunction) {
          continue;
        }
        isFunction = true;
        isSquareBracket = true;
        blocks.push({
          type: LATEX_COMPONENT.TEXT,
          content: parseInlineLatex(block),
        });
        block = "";
      } else if (latex[i] === "]") {
        if (!isSquareBracket) {
          continue;
        }
        isFunction = false;
        isSquareBracket = false;
        blocks.push({
          type: LATEX_COMPONENT.MATH,
          content: block,
        });
        block = "";
      } else {
        block += "\\" + latex[i];
      }
    } else if (latex[i] === "$") {
      if (isSquareBracket) {
        count = 0;
        continue;
      }
      if (count === 0) {
        count++;
      } else {
        count = 0;
        if (isFunction) {
          blocks.push({ type: LATEX_COMPONENT.MATH, content: block.trim() });
        } else {
          blocks.push({
            type: LATEX_COMPONENT.TEXT,
            content: parseInlineLatex(block),
          });
        }
        block = "";
        isFunction = !isFunction;
      }
    } else {
      if (latex[i] === "\n" && !isFunction) {
        blocks.push({
          type: LATEX_COMPONENT.TEXT,
          content: parseInlineLatex(block),
        });
        block = "";
      } else {
        block += latex[i];
      }
    }
  }
  if (count === 1) {
    block += "$";
  }
  if (!isFunction) {
    blocks.push({
      type: LATEX_COMPONENT.TEXT,
      content: parseInlineLatex(block),
    });
  }

  return parseMarkdownLevel(blocks);
}

export default parseMarkdown;
