import { useEffect, useState } from "react";
import axios from "axios";

export const useZoomHandler = (
  session_key: string,
  tpc: string,
  password: string,
  role: number,
  userName: string
) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const initZoomSession = async () => {
      const VideoSDK = (await import("@zoom/videosdk")).default;
      const { data } = await axios.post("/api/zoom", {
        session_key,
        tpc,
        password,
        role,
      });

      const client = VideoSDK.createClient();
      client.init("en-US", "Global", {
        patchJsMedia: true,
        enforceMultipleVideos: false,
      });

      const selfView: HTMLVideoElement | null = document.getElementById("self-view") as HTMLVideoElement | null;
      const participantView: HTMLCanvasElement | null = document.getElementById("participant-videos-canvas") as HTMLCanvasElement | null;;

      client
        .join(tpc, data.sessionToken, userName, password)
        .then(() => {
          const stream = client.getMediaStream();
          setStream(stream as unknown as MediaStream);

          stream
            .startVideo({ videoElement: selfView! })
            .then(() => {
              stream.renderVideo(selfView!, client.getCurrentUserInfo().userId, 540, 540, 0, 0, 3);
              client.getAllUser().forEach((user) => {
                stream.renderVideo(participantView!, user.userId, 1920, 1080, 0, 0, 3);
              });
            });

          stream.startAudio();

          client.on("peer-video-state-change", (user) => {
            stream.renderVideo(participantView!, user.userId, 1920, 1080, 0, 0, 3);
          });

          client.on("active-share-change", (payload) => {
            if (payload.state === "Active") {
              stream.startShareView(document.querySelector("#users-screen-share-content-canvas")!, payload.userId);
            } else {
              stream.stopShareView();
            }
          });
        })
        .catch((error) => console.error("Error joining Zoom session:", error));
    };

    initZoomSession();
  }, [session_key, tpc, password, role, userName]);

  return stream;
};
