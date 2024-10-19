"use client";

import { FC } from "react";
import VideoContainer from "../VideoContainers/VideoContainer";
import ScreenShareComponent from "../ShareScreen/ScreenShareComponent";
import ControlButtons from "../ControlButtons/ControlButtons";
import { useZoomHandler } from "../ZoomEventHandler/ZoomEventHandler";


interface ZoomProps {
  session_key: string;
  tpc: string;
  password: string;
  role: number;
  userName: string;
}

interface ZoomMediaStream extends MediaStream {
  muteAudio(): void;
  startShareScreen(screen: HTMLElement, options: unknown): Promise<void>;
}

const Zoom: FC<ZoomProps> = ({ session_key, tpc, password, role, userName }) => {
  const stream:ZoomMediaStream = useZoomHandler(session_key, tpc, password, role, userName) as ZoomMediaStream ;

  const handleMute = () => {
    stream!.muteAudio();
  };
  

  const handleShareScreen = async () => {
    const screen = document.getElementById("users-screen-share-content-canvas");
    await stream?.startShareScreen(screen!, {
      displaySurface: "monitor",
      monitorTypeSurfaces: "exclude",
      surfaceSwitching: "exclude",
    });
  };

  return (
    <>
      <VideoContainer selfViewId="self-view" participantViewId="participant-videos-canvas" />
      <ScreenShareComponent screenShareId="users-screen-share-content-canvas" />
      <ControlButtons handleMute={handleMute} handleShareScreen={handleShareScreen} />
    </>
  );
};

export default Zoom;
