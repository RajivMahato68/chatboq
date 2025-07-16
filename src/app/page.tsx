import CircleComponent from "@/components/Half";
import AnimatedWave from "@/components/Waves";
import React from "react";
import RightideComponent from "@/components/RightSide";

const Page = () => {
  return (
    <div className="w-full min-h-screen bg-black flex justify-center items-center overflow-hidden">
      <div className="relative w-full max-w-full h-screen bg-black">
        {/* 🔵 Floating Wave #1 */}
        <div className="absolute top-0 left-[15.5%] w-[23%] max-w-full z-50 pointer-events-none">
          <AnimatedWave />
        </div>

        {/* 🔵 Floating Wave #2 */}
        <div className="absolute top-0 left-[52%] w-[32.3%] max-w-full z-50 pointer-events-none">
          <AnimatedWave />
        </div>

        {/* 🔲 Main Flex Layout */}
        <div className="flex w-full h-full">
          {/* 1️⃣ Circle */}
          <div className="w-[15%] flex h-screen z-100">
            <CircleComponent />
          </div>

          {/* 2️⃣ Spacer for Wave */}
          <div className="w-[15%]" />

          {/* 3️⃣ Video */}
          <div className="w-[30%] flex items-center justify-center">
            <video
              src="/Animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-[700px] object-contain"
            />
          </div>

          {/* 4️⃣ Spacer for Wave */}
          <div className="w-[16%]" />

          {/* 5️⃣ RightSide Component */}
          <div className="w-[8%] pl-52 z-100 bg-transparent">
            <RightideComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
