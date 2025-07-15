"use client";

import React, { useEffect, useRef } from "react";
import { DiscIcon } from "lucide-react";

// Custom CSS for SVG gradient and enhanced styling
const style = `
  .icon-gradient {
    fill: url(#text-gradient);
  }
  .icon-container:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  }
  .paused-icon {
    transform: scale(1.2);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  }
`;

const socialIcons = [
  { icon: DiscIcon, label: "Messange", color: "hover:fill-gray-300" },
  { icon: DiscIcon, label: "Messange", color: "hover:fill-gray-300" },
  { icon: DiscIcon, label: "Messange", color: "hover:fill-gray-300" },
  { icon: DiscIcon, label: "Messange", color: "hover:fill-gray-300" },
  { icon: DiscIcon, label: "Messange", color: "hover:fill-gray-300" },
  { icon: DiscIcon, label: "Messange", color: "hover:fill-gray-300" },
];

export default function CircleComponent() {
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isPaused = useRef(false);
  const pauseStart = useRef(0);
  const lastPauseEnd = useRef(0);
  const startTime = useRef(Date.now());
  const animationRef = useRef<number | null>(null);
  const currentPauseIconIndex = useRef<number | null>(null);

  useEffect(() => {
    const duration = 20000;
    const radius = 215;
    const pauseCooldown = 1900;

    const animate = () => {
      const now = Date.now();

      if (isPaused.current) {
        const pauseDuration = now - pauseStart.current;
        console.log(
          "Paused at",
          pauseDuration,
          "ms for icon",
          currentPauseIconIndex.current
        );
        if (pauseDuration >= 1900) {
          console.log(
            "Resuming animation for icon",
            currentPauseIconIndex.current
          );
          isPaused.current = false;
          currentPauseIconIndex.current = null;
          lastPauseEnd.current = now;
          startTime.current += pauseDuration;
        } else {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }
      }

      const elapsed = now - startTime.current;
      const progress = (elapsed % duration) / duration;
      const baseAngle = progress * 360;

      iconsRef.current.forEach((icon, index) => {
        if (!icon) return;

        const angle = (index * 60 - 90 + baseAngle) % 360;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        // Apply scale for paused icon
        const isPausedIcon = currentPauseIconIndex.current === index;
        icon.style.transform = `translate(${x}px, ${y}px) scale(${
          isPausedIcon ? 1.2 : 1
        })`;
        icon.classList.toggle("paused-icon", isPausedIcon);

        const angleMod = (angle + 360) % 360;
        console.log("Icon", index, "angleMod", angleMod.toFixed(2));

        if (
          Math.abs(angleMod - 0) < 3.0 &&
          !isPaused.current &&
          currentPauseIconIndex.current === null &&
          now - lastPauseEnd.current > pauseCooldown
        ) {
          console.log(
            "Pausing for icon",
            index,
            "at angle",
            angleMod.toFixed(2)
          );
          isPaused.current = true;
          pauseStart.current = now;
          currentPauseIconIndex.current = index;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const setIconRef = (el: HTMLDivElement | null, index: number) => {
    iconsRef.current[index] = el;
  };

  return (
    <div className="flex items-center justify-start min-h-screen bg-black text-white w-full">
      <style>{style}</style>
      <div className="flex flex-col items-start">
        <div
          className="relative overflow-hidden"
          style={{ width: "400px", height: "600px" }}
        >
          {/* SVG for gradient definition */}
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="text-gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" style={{ stopColor: "#ffffff" }} />
                <stop offset="100%" style={{ stopColor: "#6b7280" }} />
              </linearGradient>
            </defs>
          </svg>

          {/* Half circle border with subtle shadow */}
          <div
            className="absolute left-0 rounded-full border-[#191919] bg-transparent shadow-[0_0_20px_rgba(99, 111, 218, 0.2)]"
            style={{
              width: "600px",
              height: "600px",
              borderWidth: "200px",
              transform: "translateX(-50%)",
            }}
          ></div>

          {/* Icons Animation Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative"
              style={{
                width: "600px",
                height: "600px",
                transform: "translateX(-50%)",
              }}
            >
              {socialIcons.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    ref={(el) => setIconRef(el, index)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center icon-container transition-transform"
                  >
                    <div className=" rounded-md flex items-center justify-center ">
                      <IconComponent
                      // fill="currentColor"
                      // className={`icon-gradient ${item.color} cursor-pointer transition-all `}
                      />
                    </div>

                    <div className="text-sm mt-1 font-semibold tracking-wide">
                      {item.label}
                    </div>
                    {/* Optional: Gradient on label */}
                    {/* <div className="text-sm mt-1 font-semibold tracking-wide bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">{item.label}</div> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
