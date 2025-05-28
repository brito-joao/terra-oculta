"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

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
      stylers: [{ color: "#0ABDC6" }],
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
      className="bg-[#0D0D0D] text-white w-screen h-screen overflow-hidden flex flex-col font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Futuristic Top Bar */}
      <div className="w-full h-[60px] bg-[#101010]/80 backdrop-blur-lg border-b border-[#A259FF] flex items-center justify-between px-4 z-50">
        {/* Map Type Toggle */}
        <div className="flex space-x-2">
          {["roadmap", "satellite", "hybrid"].map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-4 py-1 text-xs uppercase font-bold rounded-full transition-all border border-[#222] ${
                mapType === type
                  ? "bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-black shadow"
                  : "bg-[#1a1a1a] text-white hover:bg-[#333]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        
      </div>

      {/* Map */}
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
                 // custom pin design if needed
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              onClick={() => setActivePlace(place)}
            />
          ))}

          {activePlace && (
            <InfoWindow
              position={{ lat: activePlace.latitude, lng: activePlace.longitude }}
              onCloseClick={() => setActivePlace(null)}
            >
              <div className="bg-[#141414] text-white w-64 rounded-2xl border border-[#0ABDC6] shadow-lg p-4 space-y-2">
                <img
                  src={activePlace.imageUrl}
                  alt={activePlace.name}
                  className="rounded-lg w-full h-32 object-cover border border-[#333]"
                />
                <h3 className="text-lg font-bold text-[#A259FF]">{activePlace.name}</h3>
                <p className="text-sm text-gray-300">{activePlace.description.slice(0, 100)}...</p>
                <button
                  onClick={() => router.push(`/place/${activePlace.id}`)}
                  className="mt-2 w-full text-center py-1 bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] rounded-lg text-sm font-semibold hover:opacity-90"
                >
                  Explore
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </motion.div>
  );
}
