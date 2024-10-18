import { FC } from "react";

interface VideoContainerProps {
  selfViewId: string;
  participantViewId: string;
}

const VideoContainer: FC<VideoContainerProps> = ({ selfViewId, participantViewId }) => {
  return (
    <div id="room" className="h-[40vh] w-[80vw] mt-[10%] ml-[10%] flex">
      <video
        className="w-[50%] p-4 h-[100%] object-cover bg-gray-600"
        id={selfViewId}
      ></video>
      <canvas
        id={participantViewId}
        height="1080"
        width="1920"
        className="w-[50%] h-[100%] p-4 bg-white object-cover"
      ></canvas>
    </div>
  );
};

export default VideoContainer;
