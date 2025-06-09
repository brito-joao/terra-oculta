"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";

// Grid pattern defs
const SVGPatternDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      {[...Array(8)].map((_, i) => (
        <pattern
          key={i}
          id={`grid${i}`}
          width={(i + 1) * 4}
          height={(i + 1) * 4}
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 0 L 0 100 M 0 0 L 100 0"
            fill="none"
            stroke={["white", "lime", "cyan", "white", "lime", "white", "deepskyblue", "lime"][i]}
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        </pattern>
      ))}
    </defs>
  </svg>
);

// Coordinate flicker
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
        }, 200);

        return updated;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-xs font-mono text-lime-400 mt-1 tracking-wide text-center">
      {charArray.map((c, i) => (
        <span key={i}>{c.display}</span>
      ))}
    </p>
  );
};

// Seed utility
const hashSeed = (str) =>
  [...str.toString()].reduce((a, c) => a + c.charCodeAt(0), 0);

// Main component
const PlaceCard = ({ place }) => {
  const seed = hashSeed(place.id);
  const patternId = seed % 8;
  const lat = Number(place.latitude).toFixed(4);
  const lng = Number(place.longitude).toFixed(4);
  const coordText = `${lat}° N, ${lng}° W`;

  return (
    <>
      <SVGPatternDefs />
      <Link href={`/place/${place.id}`}>
        <div
          className="relative group border border-green-700 rounded-md overflow-hidden bg-[#050805] shadow-[0_0_8px_#00ff7f44] hover:shadow-[0_0_12px_#00ff7f66] transition-transform hover:scale-[1.02]"
          style={{ width: "100%", aspectRatio: "1 / 1" }}
        >
          {/* Background pattern + image */}
          <div className="absolute inset-0 z-0">
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-full object-cover opacity-20 mix-blend-lighten"
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100%" height="100%" fill={`url(#grid${patternId})`} />
            </svg>
          </div>


          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-2">
            <h3 className="text-[#33ff33] text-sm sm:text-base font-bold tracking-wider uppercase">
              {place.name}
            </h3>
            <AnimatedCoordinates text={coordText} />
          </div>

          {/* Likes - top left corner */}
          <div className="absolute top-2 left-2 flex items-center gap-1 text-lime-400 text-xs">
            <FaRegHeart className="text-[#33ff33]" />
            <span>{place.likes.length}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PlaceCard;
