import CircleComponent from "@/components/Half";
import AnimatedWave from "@/components/Waves";
import React from "react";
import Home from "@/components/Wave";
import RightideComponent from "@/components/RightSide";

const Page = () => {
  return (
    <>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        {/* 🔵 Floating Wave #1 - on top of layout */}
        <div className="absolute top-0 left-[22%] w-[24%] z-50 pointer-events-none">
          <AnimatedWave />
        </div>

        {/* 🔵 Floating Wave #2 - on top of layout */}
        <div className="absolute top-0 left-[51%] w-[26.3%] z-50 pointer-events-none">
          <AnimatedWave />
        </div>

        {/* 🔵 Main Layout in Horizontal Order */}
        <div className="flex w-full h-full">
          {/* 1️⃣ Circle */}
          <div className="w-[25%] flex items-center justify-center">
            <CircleComponent />
          </div>

          {/* 2️⃣ Space for first wave (will be floating above) */}
          <div className="w-[20%]" />

          {/* 3️⃣ Video */}
          <div className="w-[25%] flex items-center justify-center ml-20">
            <video
              src="/Animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-[700px] object-contain"
            />
          </div>

          {/* 4️⃣ Space for second wave (will be floating above) */}
          <div className="w-[25%]" />

          {/* 5️⃣ Circle */}
          <div className="w-[31%] flex items-center justify-center ">
            <RightideComponent />
          </div>
        </div>
      </div>
      <Home />
    </>
  );
};

export default Page;
