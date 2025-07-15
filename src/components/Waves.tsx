"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimatedWave: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRefs = [
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
  ];
  const shadowRefs = [
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
  ];

  // Define constants outside useEffect
  const width = 800;
  const height = 400;
  const centerY = height / 2;

  // Wave configurations
  const waveConfigs = [
    {
      duration: 4,
      frequency: 100,
      amplitude: 60,
      phase: 0,
      strokeWidth: 3,
      opacity: 0.9,
    },
    {
      duration: 3.5,
      frequency: 80,
      amplitude: 45,
      phase: Math.PI / 3,
      strokeWidth: 2.5,
      opacity: 0.8,
    },
    {
      duration: 5,
      frequency: 120,
      amplitude: 75,
      phase: Math.PI / 6,
      strokeWidth: 2,
      opacity: 0.7,
    },
    {
      duration: 4.5,
      frequency: 90,
      amplitude: 55,
      phase: Math.PI / 4,
      strokeWidth: 2.8,
      opacity: 0.85,
    },
    {
      duration: 3.8,
      frequency: 110,
      amplitude: 65,
      phase: Math.PI / 2,
      strokeWidth: 2.2,
      opacity: 0.75,
    },
    {
      duration: 4.2,
      frequency: 100,
      amplitude: 50,
      phase: Math.PI / 5,
      strokeWidth: 2.5,
      opacity: 0.8,
    },
  ];

  useEffect(() => {
    if (
      !containerRef.current ||
      waveRefs.some((ref) => !ref.current) ||
      shadowRefs.some((ref) => !ref.current)
    ) {
      return;
    }

    // Create timeline for smooth looping animation
    const tl = gsap.timeline({ repeat: -1, yoyo: false });

    // Animate each wave
    waveConfigs.forEach((config, index) => {
      tl.to(
        waveRefs[index].current,
        {
          duration: config.duration,
          ease: "none",
          attr: {
            d: () => {
              let path = `M 0 ${centerY}`;
              for (let x = 0; x <= width; x += 10) {
                const y =
                  centerY +
                  Math.sin(
                    x / config.frequency + Date.now() / 1000 + config.phase
                  ) *
                    config.amplitude;
                path += ` L ${x} ${y}`;
              }
              return path;
            },
          },
          repeat: -1,
          repeatRefresh: true,
        },
        0
      );

      // Animate shadow paths
      tl.to(
        shadowRefs[index].current,
        {
          duration: config.duration,
          ease: "none",
          attr: {
            d: () => {
              let path = `M 0 ${centerY}`;
              for (let x = 0; x <= width; x += 10) {
                const y =
                  centerY +
                  Math.sin(
                    x / config.frequency + Date.now() / 1000 + config.phase
                  ) *
                    config.amplitude;
                path += ` L ${x} ${y}`;
              }
              return path;
            },
          },
          repeat: -1,
          repeatRefresh: true,
        },
        0
      );

      // Add glow animation for main waves
      gsap.to(waveRefs[index].current, {
        duration: config.duration / 2,
        attr: { "stroke-opacity": config.opacity - 0.1 },
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut",
        delay: index * 0.5,
      });

      // Add subtle flicker animation for fire-like shadow
      gsap.to(shadowRefs[index].current, {
        duration: 0.5,
        attr: { "stroke-opacity": config.opacity * 0.5 },
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        delay: index * 0.3,
      });
    });

    // Continuous animation update
    const updateWaves = () => {
      const time = Date.now() / 1000;

      waveConfigs.forEach((config, index) => {
        // Update main wave
        let path = `M 0 ${centerY}`;
        for (let x = 0; x <= width; x += 8) {
          const y =
            centerY +
            Math.sin(x / config.frequency + time * 2 + config.phase) *
              config.amplitude;
          path += ` L ${x} ${y}`;
        }
        if (waveRefs[index].current) {
          waveRefs[index].current.setAttribute("d", path);
        }

        // Update shadow wave
        let shadowPath = `M 0 ${centerY}`;
        for (let x = 0; x <= width; x += 8) {
          const y =
            centerY +
            Math.sin(x / config.frequency + time * 2 + config.phase) *
              config.amplitude;
          shadowPath += ` L ${x} ${y}`;
        }
        if (shadowRefs[index].current) {
          shadowRefs[index].current.setAttribute("d", shadowPath);
        }
      });

      requestAnimationFrame(updateWaves);
    };

    updateWaves();

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex justify-start items-center overflow-hidden p-0 m-0"
    >
      <div className="relative w-full  h-96">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0"
        >
          <defs>
            {[
              {
                id: "wave1Gradient",
                colors: ["#8b5cf6", "#a855f7", "#8b5cf6"],
                opacities: [0.8, 1, 0.8],
              },
              {
                id: "wave2Gradient",
                colors: ["#c084fc", "#d8b4fe", "#c084fc"],
                opacities: [0.7, 0.9, 0.7],
              },
              {
                id: "wave3Gradient",
                colors: ["#7c3aed", "#9333ea", "#7c3aed"],
                opacities: [0.6, 0.8, 0.6],
              },
              {
                id: "wave4Gradient",
                colors: ["#9f7aea", "#b794f4", "#9f7aea"],
                opacities: [0.75, 0.95, 0.75],
              },
              {
                id: "wave5Gradient",
                colors: ["#a78bff", "#c4b5fd", "#a78bff"],
                opacities: [0.65, 0.85, 0.65],
              },
              {
                id: "wave6Gradient",
                colors: ["#8a5be2", "#a78bff", "#8a5be2"],
                opacities: [0.7, 0.9, 0.7],
              },
            ].map((gradient, index) => (
              <linearGradient
                key={index}
                id={gradient.id}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={gradient.colors[0]}
                  stopOpacity={gradient.opacities[0]}
                />
                <stop
                  offset="50%"
                  stopColor={gradient.colors[1]}
                  stopOpacity={gradient.opacities[1]}
                />
                <stop
                  offset="100%"
                  stopColor={gradient.colors[2]}
                  stopOpacity={gradient.opacities[2]}
                />
              </linearGradient>
            ))}
            {[
              {
                id: "shadow1Gradient",
                colors: ["#ff4500", "#ffa500", "#ff4500"],
                opacities: [0.4, 0.6, 0.4],
              },
              {
                id: "shadow2Gradient",
                colors: ["#ff6347", "#ffd700", "#ff6347"],
                opacities: [0.3, 0.5, 0.3],
              },
              {
                id: "shadow3Gradient",
                colors: ["#ff4500", "#ff8c00", "#ff4500"],
                opacities: [0.35, 0.55, 0.35],
              },
              {
                id: "shadow4Gradient",
                colors: ["#ff6347", "#ffa500", "#ff6347"],
                opacities: [0.3, 0.5, 0.3],
              },
              {
                id: "shadow5Gradient",
                colors: ["#ff4500", "#ffd700", "#ff4500"],
                opacities: [0.25, 0.45, 0.25],
              },
              {
                id: "shadow6Gradient",
                colors: ["#ff6347", "#ff8c00", "#ff6347"],
                opacities: [0.3, 0.5, 0.3],
              },
            ].map((gradient, index) => (
              <linearGradient
                key={index}
                id={gradient.id}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={gradient.colors[0]}
                  stopOpacity={gradient.opacities[0]}
                />
                <stop
                  offset="50%"
                  stopColor={gradient.colors[1]}
                  stopOpacity={gradient.opacities[1]}
                />
                <stop
                  offset="100%"
                  stopColor={gradient.colors[2]}
                  stopOpacity={gradient.opacities[2]}
                />
              </linearGradient>
            ))}
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {waveConfigs.map((config, index) => (
            <g key={index}>
              <path
                ref={shadowRefs[index]}
                d={`M 0 ${centerY} L ${width} ${centerY}`}
                fill="none"
                stroke={`url(#shadow${index + 1}Gradient)`}
                strokeWidth={config.strokeWidth + 2}
                strokeOpacity={config.opacity * 0.5}
                filter="url(#glow)"
                className="drop-shadow-md"
              />
              <path
                ref={waveRefs[index]}
                d={`M 0 ${centerY} L ${width} ${centerY}`}
                fill="none"
                stroke={`url(#wave${index + 1}Gradient)`}
                strokeWidth={config.strokeWidth}
                strokeOpacity={config.opacity}
                filter="url(#glow)"
                className={`drop-shadow-${
                  ["lg", "md", "sm", "lg", "md", "sm"][index]
                }`}
              />
            </g>
          ))}
        </svg>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-400/5 to-transparent blur-2xl"></div>
      </div>

      {/* <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animation: `pulse ${2 + Math.random() * 2}s infinite alternate`,
            }}
          />
        ))}
      </div> */}
    </div>
  );
};

export default AnimatedWave;
