"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const generateWavePath = (
    amplitude: number,
    frequency: number, // Unused for straight lines
    phase: number = 0 // Unused for straight lines
  ): string => {
    const points: string[] = [];
    const width = 800;
    const height = 400;
    const centerY = height / 2;
    const y = centerY + amplitude * 0.3; // Fixed y for straight line (~10px height)
    for (let x = 0; x <= width; x += 0.1) {
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")}`;
  };

  const waves = [
    {
      amplitude: 33.33, // 33.33 * 0.3 = ~10px height
      frequency: 3,
      delay: 0.2,
      opacity: 0.75,
      color: "stroke-blue-450",
      phaseOffset: 0, // First wave, uses top animation
      animation: "animate-wave-top",
    },
    {
      amplitude: 33.33,
      frequency: 3.5,
      delay: 0.5,
      opacity: 0.6,
      color: "stroke-blue-500",
      animation: "animate-wave-top",
    },
    {
      amplitude: 33.33,
      frequency: 2.8,
      delay: 1,
      opacity: 0.7,
      color: "stroke-cyan-400",
      animation: "animate-wave-top",
    },
    {
      amplitude: 33.33,
      frequency: 4,
      delay: 1.5,
      opacity: 0.5,
      color: "stroke-blue-300",
      animation: "animate-wave-top",
    },
    {
      amplitude: 33.33,
      frequency: 2.5,
      delay: 2,
      opacity: 0.6,
      color: "stroke-cyan-500",
      animation: "animate-wave-top",
    },
    {
      amplitude: 33.33,
      frequency: 3.2,
      delay: 2.5,
      opacity: 0.4,
      color: "stroke-blue-600",
      animation: "animate-wave-bottom",
    },
    {
      amplitude: 33.33,
      frequency: 3.3,
      delay: 2.8,
      opacity: 0.55,
      color: "stroke-cyan-450",
      animation: "animate-wave-bottom",
    },
    {
      amplitude: 33.33,
      frequency: 3.1,
      delay: 3,
      opacity: 0.65,
      color: "stroke-blue-350",
      animation: "animate-wave-bottom",
    },
    {
      amplitude: 33.33,
      frequency: 2.9,
      delay: 3.2,
      opacity: 0.45,
      color: "stroke-cyan-600",
      animation: "animate-wave-bottom",
    },
    {
      amplitude: 33.33,
      frequency: 3.4,
      delay: 3.5,
      opacity: 0.5,
      color: "stroke-blue-550",
      animation: "animate-wave-bottom",
    },
    {
      amplitude: 33.33,
      frequency: 2.7,
      delay: 3.8,
      opacity: 0.6,
      color: "stroke-cyan-550",
      animation: "animate-wave-bottom",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-4xl h-96">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          className="absolute inset-0"
          preserveAspectRatio="xMidYMid slice"
        >
          {waves.map((wave, index) => (
            <g key={index}>
              {[
                wave.phaseOffset || 0,
                Math.PI / 6,
                Math.PI / 3,
                Math.PI / 2,
              ].map((phaseOffset, phaseIndex) => (
                <path
                  key={`${index}-${phaseIndex}`}
                  d={generateWavePath(
                    wave.amplitude - phaseIndex * 5, // Slight vertical offset
                    wave.frequency,
                    phaseOffset
                  )}
                  fill="none"
                  className={`${wave.color} ${wave.animation}`}
                  strokeWidth="0.5"
                  opacity={wave.opacity * (1 - phaseIndex * 0.1)}
                  style={{
                    animationDelay: `${wave.delay + phaseIndex * 0.2}s`,
                    animationDuration: "5s",
                    animationIterationCount: "infinite",
                    animationTimingFunction: "ease-in-out",
                    animationFillMode: "forwards",
                  }}
                />
              ))}
            </g>
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={`flow-${i}`}
              d={generateWavePath(
                33.33 - i * 5, // Slight vertical offset
                3 + i * 0.4,
                (i * Math.PI) / 4
              )}
              fill="none"
              className={`stroke-blue-400 ${
                i < 4 ? "animate-flow-wave-top" : "animate-flow-wave-bottom"
              }`}
              strokeWidth="0.3"
              opacity={0.3 - i * 0.03}
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: "5s",
                animationIterationCount: "infinite",
                animationTimingFunction: "ease-in-out",
                animationFillMode: "forwards",
              }}
            />
          ))}
        </svg>
      </div>
      <style jsx>{`
        @keyframes wave-top {
          0% {
            transform: translateX(-800px) translateY(0px) skewX(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateX(-400px) translateY(20px) skewX(6deg);
            opacity: 0.6;
          }
          50% {
            transform: translateX(0px) translateY(0px) skewX(0deg);
            opacity: 1;
          }
          75% {
            transform: translateX(400px) translateY(-20px) skewX(-6deg);
            opacity: 0.6;
          }
          100% {
            transform: translateX(800px) translateY(0px) skewX(0deg);
            opacity: 0.2;
          }
        }
        @keyframes wave-bottom {
          0% {
            transform: translateX(-800px) translateY(0px) skewX(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateX(-400px) translateY(10px) skewX(3deg);
            opacity: 0.5;
          }
          50% {
            transform: translateX(0px) translateY(0px) skewX(0deg);
            opacity: 0.8;
          }
          75% {
            transform: translateX(400px) translateY(-10px) skewX(-3deg);
            opacity: 0.5;
          }
          100% {
            transform: translateX(800px) translateY(0px) skewX(0deg);
            opacity: 0.2;
          }
        }
        @keyframes flow-wave-top {
          0% {
            transform: translateX(-800px) scaleY(0.8) translateY(0px)
              skewX(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateX(-400px) scaleY(0.8) translateY(16px)
              skewX(5deg);
            opacity: 0.5;
          }
          50% {
            transform: translateX(0px) scaleY(0.8) translateY(0px) skewX(0deg);
            opacity: 0.8;
          }
          75% {
            transform: translateX(400px) scaleY(0.8) translateY(-16px)
              skewX(-5deg);
            opacity: 0.5;
          }
          100% {
            transform: translateX(800px) scaleY(0.8) translateY(0px) skewX(0deg);
            opacity: 0.2;
          }
        }
        @keyframes flow-wave-bottom {
          0% {
            transform: translateX(-800px) scaleY(0.8) translateY(0px)
              skewX(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateX(-400px) scaleY(0.8) translateY(8px)
              skewX(2deg);
            opacity: 0.4;
          }
          50% {
            transform: translateX(0px) scaleY(0.8) translateY(0px) skewX(0deg);
            opacity: 0.7;
          }
          75% {
            transform: translateX(400px) scaleY(0.8) translateY(-8px)
              skewX(-2deg);
            opacity: 0.4;
          }
          100% {
            transform: translateX(800px) scaleY(0.8) translateY(0px) skewX(0deg);
            opacity: 0.2;
          }
        }
        .animate-wave-top {
          animation: wave-top 5s ease-in-out infinite;
        }
        .animate-wave-bottom {
          animation: wave-bottom 5s ease-in-out infinite;
        }
        .animate-flow-wave-top {
          animation: flow-wave-top 5s ease-in-out infinite;
        }
        .animate-flow-wave-bottom {
          animation: flow-wave-bottom 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
