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

  const beams = Array.from({ length: 200 }, (_, i) => ({
    initialX: Math.random() * 1200,
    duration: Math.floor(Math.random() * 3) + 8, // Duration between 8 and 10
    repeatDelay: Math.random() * 1.5 + 0.5, // Ensures continuous arrival, avoids clustering
    delay: i * 0.2, // Staggered delay for constant flow
    className: `h-${Math.floor(Math.random() * 20) + 10} w-${
      Math.floor(Math.random() * 3) + 1
    } ${Math.random() > 0.8 ? "bg-red-500" : ""}`,
  }));

  console.log(beams);

  return (
    <div
      ref={parentRef}
      className={cn(
        "h-full bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800 absolute flex items-center w-full justify-center overflow-hidden z-[-1]",
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
