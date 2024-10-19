import { FC } from "react";

interface ScreenShareProps {
  screenShareId: string;
}

const ScreenShareComponent: FC<ScreenShareProps> = ({ screenShareId }) => {
  return (
    <video
      id={screenShareId}
      height="1080"
      width="1920"
      className="users-screen-share-content-canvas"
    ></video>
  );
};

export default ScreenShareComponent;
