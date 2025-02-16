/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const parentRef = useRef<HTMLDivElement>(null!);

  const beams = [
    { initialX: 10, duration: 12, repeatDelay: 1, delay: 0 },
    { initialX: 200, duration: 10, repeatDelay: 1, delay: 1 },
    {
      initialX: 300,
      duration: 10,
      repeatDelay: 1,
      delay: 1,
      className: "bg-red-500",
    },
    { initialX: 500, duration: 10, repeatDelay: 1, delay: 1 },
    {
      initialX: 700,
      duration: 10,
      repeatDelay: 1,
      delay: 1,
      className: "bg-red-500",
    },
    { initialX: 600, duration: 10, repeatDelay: 1, delay: 1 },
    {
      initialX: 100,
      duration: 14,
      repeatDelay: 1,
      className: "h-20 bg-red-500 w-2",
    },
    { initialX: 400, duration: 13, repeatDelay: 1, delay: 1 },
    { initialX: 800, duration: 16, repeatDelay: 1, className: "h-32 w-3" },
    {
      initialX: 1000,
      duration: 11,
      repeatDelay: 1,
      className: "h-24 w-2 bg-red-500",
    },
    {
      initialX: 1200,
      duration: 15,
      repeatDelay: 2,
      delay: 1,
      className: "h-16 w-2",
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "min-h-screen md:h-[40rem] bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800 absolute flex items-center w-full justify-center overflow-hidden z-[-1]",
        className
      )}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}
      {children}
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      initialY?: number;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
      className?: string;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={beamRef}
      animate={{ translateY: "-1800px" }}
      initial={{
        translateY: "100px",
        translateX: beamOptions.initialX || "0px",
      }}
      transition={{
        duration: beamOptions.duration || 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay: beamOptions.delay || 0,
        repeatDelay: beamOptions.repeatDelay || 0,
      }}
      className={cn(
        "absolute left-0 bottom-0 m-auto w-2 bg-green-500 rounded-full z-[-1]",
        beamOptions.className
      )}
    />
  );
});

CollisionMechanism.displayName = "CollisionMechanism";
