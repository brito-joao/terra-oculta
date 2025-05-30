"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegHeart, FaCommentDots } from "react-icons/fa";

// Inject pattern defs once globally
const SVGPatternDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <pattern id="grid0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      </pattern>
      <pattern id="grid1" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="lime" strokeOpacity="0.25" strokeWidth="1" />
      </pattern>
      <pattern id="grid2" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 28 28 M28 0 L 0 28" fill="none" stroke="cyan" strokeOpacity="0.2" strokeWidth="1" />
      </pattern>
      <pattern id="grid3" width="1" height="14" patternUnits="userSpaceOnUse">
        <rect width="100%" height="1" fill="white" fillOpacity="0.15" />
      </pattern>
      <pattern id="grid4" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="lime" strokeOpacity="0.2" strokeWidth="2" />
      </pattern>
      <pattern id="grid5" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 20 0 M 0 0 L 0 20" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
      </pattern>
      <pattern id="grid6" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M 0 25 L 25 0" fill="none" stroke="deepskyblue" strokeOpacity="0.15" strokeWidth="1" />
      </pattern>
      <pattern id="grid7" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 0 16" fill="none" stroke="lime" strokeOpacity="0.2" strokeWidth="1" />
      </pattern>
    </defs>
  </svg>
);

// Utility
const hashSeed = (str) => [...str.toString()].reduce((a, c) => a + c.charCodeAt(0), 0);

// Coordinate animation
const getInitialCharArray = (text) =>
  text.split("").map((char) =>
    /\d/.test(char)
      ? { char, isDigit: true, display: char }
      : { char, isDigit: false, display: char }
  );

const AnimatedCoordinates = ({ text }) => {
  const [charArray, setCharArray] = useState(() => getInitialCharArray(text));

  useEffect(() => {
    const interval = setInterval(() => {
      setCharArray((prev) => {
        const digitIndices = prev
          .map((c, i) => (c.isDigit ? i : -1))
          .filter((i) => i !== -1);
        const randomIndex =
          digitIndices[Math.floor(Math.random() * digitIndices.length)];

        const updated = [...prev];
        const original = updated[randomIndex].char;
        updated[randomIndex] = {
          ...updated[randomIndex],
          display: Math.floor(Math.random() * 10).toString(),
        };

        setTimeout(() => {
          setCharArray((current) => {
            const reverted = [...current];
            reverted[randomIndex] = {
              ...reverted[randomIndex],
              display: original,
            };
            return reverted;
          });
        }, 250);

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-xs font-mono text-lime-400 mt-1 whitespace-nowrap">
      {charArray.map((c, i) => (
        <span key={i}>{c.display}</span>
      ))}
    </p>
  );
};

// Main Card
const PlaceCard = ({ place }) => {
  const seed = hashSeed(place.id);
  const patternId = seed % 8;
  const lat = Number(place.latitude).toFixed(4);
  const lng = Number(place.longitude).toFixed(4);
  const coordText = `${lat}° N, ${lng}° W`;

  const animationId = `patternMove${seed}`;
  const dx = (seed % 2 === 0 ? 1 : -1) * (40 + (seed % 40));
  const dy = (seed % 3 === 0 ? 1 : -1) * (40 + (seed % 30));
  const duration = 3 + (seed % 3); // 3–5 seconds

  return (
    <>
      <SVGPatternDefs />

      <style jsx>{`
        @keyframes ${animationId} {
          0% {
            patternTransform: translate(0, 0);
          }
          100% {
            patternTransform: translate(${dx}px, ${dy}px);
          }
        }
        .pattern-${animationId} rect {
          animation: ${animationId} ${duration}s linear infinite;
        }
      `}</style>

      <Link href={`/place/${place.id}`}>
        <div
          className="relative rounded-3xl overflow-hidden border border-[#A259FF]/20 transition-transform duration-300 hover:scale-[1.015]"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          {/* Actual moving pattern */}
          <svg
            className={`absolute inset-0 w-full h-full pattern-${animationId}`}
            style={{ zIndex: 1 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100%" height="100%" fill={`url(#grid${patternId})`} />
          </svg>

          <div className="relative z-10 p-6 h-64 flex flex-col justify-between">
            <div>
              <h2 className="text-white text-xl font-bold tracking-tight">{place.name}</h2>
              <AnimatedCoordinates text={coordText} />
            </div>
            <p className="text-sm text-gray-300 mt-4 line-clamp-2">{place.description}</p>
            <div className="flex justify-between items-center text-xs text-gray-400 mt-6">
              <div className="flex items-center gap-2">
                <FaRegHeart className="text-[#A259FF]" />
                <span>{place.likes.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCommentDots className="text-[#0ABDC6]" />
                <span>{place.comments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PlaceCard;
