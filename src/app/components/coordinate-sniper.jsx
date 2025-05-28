"use client";

import React, { useRef, useState } from "react";
import Navbar from "../components/nav";
import Footer from "../components/footer";

const getLatLngFromClick = (x, y, width, height) => {
  const lon = (x / width) * 360 - 180;
  const lat = 90 - (y / height) * 180;
  return { lat: parseFloat(lat.toFixed(2)), lon: parseFloat(lon.toFixed(2)) };
};

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = deg => deg * (Math.PI / 180);
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

export default function CoordinateSniperGame() {
  const mapRef = useRef(null);
  const [clickCoord, setClickCoord] = useState(null);
  const [targetCoord, setTargetCoord] = useState(generateRandomCoord());
  const [result, setResult] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);

  function generateRandomCoord() {
    return {
      lat: parseFloat((Math.random() * 180 - 90).toFixed(2)),
      lon: parseFloat((Math.random() * 360 - 180).toFixed(2)),
    };
  }

  const handleClick = (e) => {
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { lat, lon } = getLatLngFromClick(x, y, rect.width, rect.height);
    setClickCoord({ lat, lon });

    const km = calculateDistanceKm(lat, lon, targetCoord.lat, targetCoord.lon);
    setDistanceKm(km);

    const dist = Math.sqrt(
      Math.pow(lat - targetCoord.lat, 2) + Math.pow(lon - targetCoord.lon, 2)
    );

    if (dist < 5) setResult("🎯 Acertou Miserável!");
    else if (dist < 20) setResult("🔥 Quase!");
    else setResult("❌ Errou feio!");
  };

  const handleRetry = () => {
    setClickCoord(null);
    setDistanceKm(null);
    setResult(null);
    setTargetCoord(generateRandomCoord());
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 mb-6">
          Coordinate Sniper 🌍
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 mt-6 w-full max-w-7xl">
          {/* MAP */}
          <div className="relative border-4 border-white/20 rounded-xl overflow-hidden shadow-lg flex-1">
            <img
              src="/world-map.jpg"
              alt="World Map"
              ref={mapRef}
              onClick={handleClick}
              className="w-full cursor-crosshair select-none"
              draggable={false}
            />

            {clickCoord && (
              <div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white pointer-events-none"
                style={{
                  left: `calc(${((clickCoord.lon + 180) / 360) * 100}% - 8px)`,
                  top: `calc(${((90 - clickCoord.lat) / 180) * 100}% - 8px)`,
                }}
              ></div>
            )}
          </div>

          {/* INFO PANEL */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 w-full max-w-md text-left space-y-4">
            <div>
              <h3 className="text-yellow-400 font-bold">🎯 Coordenadas para acertar</h3>
              <p>
                {targetCoord.lat}°, {targetCoord.lon}°
              </p>
            </div>

            {clickCoord && (
              <>
                <div>
                  <h3 className="text-pink-400 font-bold">📍 Sua tentativa</h3>
                  <p>
                    {clickCoord.lat}°, {clickCoord.lon}°
                  </p>
                </div>

                <div>
                  <h3 className="text-green-400 font-bold">📏 Distância</h3>
                  <p>{distanceKm} km</p>
                </div>

                <div className="text-2xl font-bold">{result}</div>

                <button
                  onClick={handleRetry}
                  className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-lg hover:scale-105 transition"
                >
                  🔁 tente novamente com outras coordenadas
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
