"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

const style = `
  .paused-icon {
    transform: scale(1.2);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  }
`;

const userDetails = [
  {
    name: "Ravi Kumar",
    email: "ravi@example.com",
    image: "https://i.pravatar.cc/100?img=1",
    message: "Yay, Thank you for the quick service!",
  },
  {
    name: "Anita Sharma",
    email: "anita@example.com",
    image: "https://i.pravatar.cc/100?img=2",
    message: "Really great experience with your team!",
  },
  {
    name: "Sunil Thapa",
    email: "sunil@example.com",
    image: "https://i.pravatar.cc/100?img=3",
    message: "Excellent delivery speed!",
  },
  {
    name: "Mina Joshi",
    email: "mina@example.com",
    image: "https://i.pravatar.cc/100?img=4",
    message: "Highly recommend to others.",
  },
  {
    name: "Bishal Rai",
    email: "bishal@example.com",
    image: "https://i.pravatar.cc/100?img=5",
    message: "Superb customer support.",
  },
  {
    name: "Kritika Lama",
    email: "kritika@example.com",
    image: "https://i.pravatar.cc/100?img=6",
    message: "Amazing quality and service.",
  },
];

export default function RightideComponent() {
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isPaused = useRef(false);
  const pauseStart = useRef(0);
  const lastPauseEnd = useRef(0);
  const startTime = useRef(Date.now());
  const animationRef = useRef<number | null>(null);
  const pausedCardIndex = useRef<number | null>(null);

  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  useEffect(() => {
    const duration = 20000;
    const radius = 215;
    const pauseCooldown = 1000;
    const pauseDuration = 2000; // Pause for 2 seconds

    const animate = () => {
      const now = Date.now();

      if (isPaused.current) {
        const pauseTime = now - pauseStart.current;
        if (pauseTime >= pauseDuration) {
          isPaused.current = false;
          pausedCardIndex.current = null;
          lastPauseEnd.current = now;
          startTime.current += pauseTime;
        } else {
          // Show full content for all cards during pause
          setActiveIndexes(userDetails.map((_, i) => i));
          animationRef.current = requestAnimationFrame(animate);
          return;
        }
      }

      const elapsed = now - startTime.current;
      const progress = (elapsed % duration) / duration;
      const baseAngle = progress * 360;

      const newActiveIndexes: number[] = [];

      iconsRef.current.forEach((card, index) => {
        if (!card) return;

        const angle = (index * 60 - 90 + baseAngle) % 360;
        const radian = (angle * Math.PI) / 180;
        const x = -Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        card.style.transform = `translate(${x}px, ${y}px)`;

        const angleMod = (angle + 360) % 360;

        const isAtRight = Math.abs(angleMod - 0) < 2;
        const isAtLeftRange = angleMod >= 180 && angleMod <= 180;
        const isActive = isAtRight || isAtLeftRange;

        card.classList.toggle("paused-icon", isActive);

        if (
          isActive &&
          !isPaused.current &&
          now - lastPauseEnd.current > pauseCooldown
        ) {
          newActiveIndexes.push(index);
          isPaused.current = true;
          pauseStart.current = now;
          pausedCardIndex.current = index;
        } else if (isActive) {
          newActiveIndexes.push(index);
        }
      });

      setActiveIndexes(newActiveIndexes);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const setIconRef = (el: HTMLDivElement | null, index: number) => {
    iconsRef.current[index] = el;
  };

  return (
    <>
      <style>{style}</style>
      <div className="flex items-center justify-center h-screen text-white">
        <div className="flex flex-col items-center">
          <div
            className="relative overflow-hidden"
            style={{ width: "600px", height: "630px" }}
          >
            <div
              className="relative mx-auto"
              style={{ width: "600px", height: "600px" }}
            >
              {userDetails.map((user, index) => {
                const isActive =
                  isPaused.current ||
                  activeIndexes.includes(index) ||
                  pausedCardIndex.current === index;

                return (
                  <div
                    key={index}
                    ref={(el) => setIconRef(el, index)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform pl-[600px]"
                  >
                    {isActive ? (
                      <Card className="w-[366px] h-[174px] p-3 bg-[#1e1e1e] text-white rounded-xl shadow-xl border border-gray-700 relative">
                        <CardContent className="flex flex-col gap-2 p-0">
                          <div className="bg-purple-300 text-black p-2 rounded-lg w-fit text-sm mb-1">
                            {user.message}
                          </div>
                          <div className="flex items-center gap-3">
                            <Image
                              width={50}
                              height={50}
                              src={user.image}
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="text-sm font-bold">
                                {user.name}
                              </div>
                              <div className="flex">
                                {[1, 2, 3, 4].map((i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className="text-yellow-400 fill-yellow-400"
                                  />
                                ))}
                                <Star size={14} className="text-gray-400" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 bg-[#2c2c2c] text-green-400 text-sm px-4 py-1 rounded-full w-fit flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12l5 5L20 7"
                              />
                            </svg>
                            Website Traffic Increased by 20%
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="w-[366px] h-[174px] p-3 bg-[#1e1e1e] rounded-xl shadow border border-gray-700">
                        <CardContent className="space-y-2">
                          <Skeleton className="h-4 w-32 rounded" />
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-3 w-24" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-48 rounded-full mt-3" />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
