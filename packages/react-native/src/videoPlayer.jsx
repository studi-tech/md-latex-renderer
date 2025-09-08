import { useVideoPlayer, VideoView } from "expo-video";
import * as ScreenOrientation from "expo-screen-orientation";

import { defaultActions } from "./defaultRenderers.jsx";

const { normalizePx } = defaultActions;

const CustomVideo = ({
  videoUrl,
  style = null,
  loop = false,
  showNowPlayingNotification = true,
  nativeControls = true,
  allowsFullscreen = true,
  allowsPictureInPicture = true,
}) => {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = loop;
    player.showNowPlayingNotification = showNowPlayingNotification;
    player.play();
  });

  return (
    <VideoView
      player={player}
      style={
        style || {
          width: "100%",
          height: "100%",
          borderRadius: normalizePx(15),
          backgroundColor: "black",
        }
      }
      nativeControls={nativeControls}
      allowsFullscreen={allowsFullscreen}
      allowsPictureInPicture={allowsPictureInPicture}
      onFullscreenEnter={async () => {
        await ScreenOrientation.unlockAsync();
      }}
      onFullscreenExit={async () => {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }}
    >
      <ActivityIndicator
        size="small"
        color={colors.secondaryColor1}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      />
    </VideoView>
  );
};
export default CustomVideo;
