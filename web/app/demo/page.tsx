'use client'
import Image from "next/image";
import {
  FaMicrophone,
  FaVideo,
  FaRecordVinyl,
  FaPhoneSlash,
  FaEllipsisH,
  FaArrowLeft,
} from "react-icons/fa";
import { MdOutlineScreenShare } from "react-icons/md";
import { HiChat } from "react-icons/hi";
import { useState } from "react";

export default function DemoPage() {
    const [showShareScreen, setShowShareScreen] = useState(true)
    
  return (
    <>
      <div className="h-screen w-full box-border">
        <div className="h-[90%] bg-gray-900 w-full text-white flex p-4">
          {/* Main Container */}
          <div className="relative rounded-lg items-center shadow-lg flex md:flex-row flex-col w-full h-full overflow-hidden">
            {/* Screen share section */}
            {showShareScreen && (
            <div className="md:flex-1 flex w-full flex-col items-center max-780:basis-[200%] h-full justify-center">
              <div className="relative w-full h-full">
                <Image
                  src="/window.png"
                  alt="Main User"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg max-w-full h-auto"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  Adam Joseph
                </div>
              </div>
            </div>
            )}

            {/* Right Participant Section */}
            <div className={`w-full h-full lg:pl-4 pr-0 flex flex-row users-cont ${showShareScreen ? 'md:flex-col md:w-[25%]' : 'grid grid-cols-3 grid-rows-2 items-center'} space-y-2 lg:mt-0`}>
              {/* Participant 1 */}
              <div className={`flex max-780:w-1/3 md:min-w-[25%] items-center space-x-2 p-2 mt-2 rounded-lg h-full`}>
                <div className="relative w-full h-full shadow-effect">
                  <Image
                    src="/first.png"
                    alt="Christian Wong"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm max-w-full h-auto"
                  />
                </div>
              </div>

              {/* Participant 2 */}
              <div className={`flex max-780:w-1/3 md:min-w-[25%] items-center space-x-2 p-2 rounded-lg h-full`}>
                <div className="relative w-full h-full shadow-effect">
                  <Image
                    src="/second.png"
                    alt="Alice Wong"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm max-w-full h-auto"
                  />
                </div>
              </div>

              {/* Participant 3 */}
              <div className={`flex max-780:w-1/3 md:min-w-[25%] items-center space-x-2 p-2 rounded-lg h-full`}>
                <div className="relative w-full h-full shadow-effect">
                  <Image
                    src="/third.png"
                    alt="Theresa Webb"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-800 p-3 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Left Section */}
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <button className="flex items-center space-x-2 text-blue-400 bg-gray-700 hover:bg-gray-600 rounded-full px-4 py-2">
              <FaArrowLeft />
              <span className="text-sm hidden sm:inline">eem-jamt</span>
            </button>
          </div>

          {/* Center Section with Call Control Icons */}
          <div className="flex flex-wrap items-center justify-center space-x-2 lg:space-x-4 space-y-2 sm:space-y-0">
            <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white">
              <FaMicrophone />
            </button>
            <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white">
              <FaVideo />
            </button>
            <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white">
              <MdOutlineScreenShare />
            </button>
            <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white">
              <HiChat />
            </button>
            <button className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white">
              <FaRecordVinyl />
            </button>
            <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white">
              <FaEllipsisH />
            </button>
          </div>

          {/* Right Section with End Call Button */}
          <div className="flex items-center mt-2 lg:mt-0">
            <button className="flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full px-4 lg:px-6 py-2 text-sm">
              End Call
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
