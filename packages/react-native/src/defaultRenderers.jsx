import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  PixelRatio,
  Text,
  View,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MotiView } from "moti";
import { SvgFromXML } from "react-native-svg";

export const defaultRenderers = {
  Text,
  SVG: ({ svgString, ...props }) => <SvgFromXML xml={svgString} {...props} />,
  LoadingIndicator: ({ color }) => (
    <ActivityIndicator size="small" color={color} />
  ),
  Block: View,
  Button: TouchableOpacity,
  Image: ({ src, width }) => {
    const [openMedia, setOpenMedia] = useState(false);
    return (
      <TouchableOpacity
        onPress={() => setOpenMedia(true)}
        style={{ height: 120, width }}
      >
        <Image
          resizeMode="contain"
          style={{
            marginHorizontal: "5%",
            height: "100%",
            borderRadius: defaultActions.normalizePx(30),
          }}
          source={{
            uri: src,
          }}
        />
        <ImageView
          images={[{ uri: src }]}
          imageIndex={0}
          visible={openMedia}
          onRequestClose={() => setOpenMedia(false)}
          presentationStyle="overFullScreen"
          backgroundColor="rgba(0, 0, 0, 0.9)"
        />
      </TouchableOpacity>
    );
  },
  Link: ({ href, children, ...props }) => (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(href);
      }}
      {...props}
    >
      {children}
    </TouchableOpacity>
  ),
  Video: ({ src, ...props }) => <CustomVideo videoUrl={src} {...props} />,
  AnimatedBlock: ({ children, ...props }) => (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 100 + 300 }}
    >
      {children}
    </MotiView>
  ),
};

export const defaultActions = {
  normalizeFontSize: (size) => {
    const newSize = size * scaleFont;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  },
  normalizePx: (size) => {
    if (typeof size === "string") {
      return size;
    }
    const newSize = size * scaleWidth;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  },
  navigate: (url) => {
    Linking.openURL(url);
  },
};

export const defaultConstants = {
  FONT_SIZE: defaultActions.normalizeFontSize(12),
  HIGHLIGHT_COLOR: "rgb(46, 62, 159)",
  INDENT_SIZE: defaultActions.normalizePx(15),
  SVG_RATIO: 1,
};

const defaults = {
  defaultRenderers,
  defaultActions,
  defaultConstants,
};

export default defaults;
