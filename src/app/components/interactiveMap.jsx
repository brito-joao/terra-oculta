"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import { motion } from "framer-motion";

const containerStyle = {
  width: "100vw",
  height: "calc(100vh - 60px)",
};

const center = { lat: 20, lng: 0 };

const mapOptions = {
  disableDefaultUI: true,
  styles: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#004643" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#0f0f0f" }],
    },
  ],
};

export default function InteractiveMap({ places }) {
  const router = useRouter();
  const [mapType, setMapType] = useState("satellite");
  const [activePlace, setActivePlace] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const autocompleteRef = useRef(null);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null && mapRef !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        mapRef.panTo({ lat: location.lat(), lng: location.lng() });
        mapRef.setZoom(5);
      }
    }
  };

  return (
    <motion.div
      className="bg-black text-[#A1FF0A] w-screen h-screen overflow-hidden flex flex-col font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Tactical Control Bar */}
      <div className="w-full h-[60px] bg-[#050505]/90 backdrop-blur-sm border-b border-[#A1FF0A]/20 flex items-center justify-between px-4 z-50">
        <div className="flex space-x-2">
          {["roadmap", "satellite", "hybrid"].map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-4 py-1 text-xs uppercase font-bold rounded border transition-all tracking-widest ${
                mapType === type
                  ? "bg-[#A1FF0A] text-black border-[#A1FF0A]"
                  : "bg-[#111] text-[#A1FF0A] border-[#333] hover:bg-[#1a1a1a]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* MAP */}
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          onLoad={(map) => setMapRef(map)}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={3}
          options={{ ...mapOptions, mapTypeId: mapType }}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={{ lat: place.latitude, lng: place.longitude }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // tactical green
                scaledSize: new window.google.maps.Size(32, 32),
              }}
              onClick={() => setActivePlace(place)}
            />
          ))}

          {activePlace && (
            <InfoWindow
              position={{ lat: activePlace.latitude, lng: activePlace.longitude }}
              onCloseClick={() => setActivePlace(null)}
            >
              <div className="bg-[#0f0f0f] text-[#A1FF0A] w-64 rounded border border-[#A1FF0A] shadow-xl p-4 space-y-2 font-mono">
                <img
                  src={activePlace.imageUrl}
                  alt={activePlace.name}
                  className="rounded w-full h-32 object-cover border border-[#222]"
                />
                <h3 className="text-base font-bold uppercase tracking-wider">
                  {activePlace.name}
                </h3>
                <p className="text-xs text-[#C0FFC0]">
                  {activePlace.description.slice(0, 100)}...
                </p>
                <button
                  onClick={() => router.push(`/place/${activePlace.id}`)}
                  className="mt-2 w-full py-1.5 text-center border border-[#A1FF0A] text-[#0f0f0f] bg-[#A1FF0A] font-semibold rounded hover:opacity-90 transition uppercase text-sm"
                >
                  Access Node
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </motion.div>
  );
}
