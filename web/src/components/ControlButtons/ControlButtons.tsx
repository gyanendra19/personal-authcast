import { FC } from "react";

interface ControlButtonsProps {
  handleMute: () => void;
  handleShareScreen: () => void;
}

const ControlButtons: FC<ControlButtonsProps> = ({ handleMute, handleShareScreen }) => {
  return (
    <div className="flex justify-center gap-8 items-center">
      <button
        className="p-4 flex justify-center items-center text-gray-800 mt-10 bg-white"
        onClick={handleMute}
      >
        Mute
      </button>
      <button
        className="p-4 flex justify-center items-center text-gray-800 mt-10 bg-white"
        onClick={handleShareScreen}
      >
        Share Screen
      </button>
    </div>
  );
};

export default ControlButtons;
