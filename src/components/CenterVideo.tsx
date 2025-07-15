"use client";

import React from "react";

const CenterVideo: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-lg"
      >
        <source src="/Animation.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default CenterVideo;
