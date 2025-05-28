"use client";
import React, { useState } from "react";
import { LoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { motion } from "framer-motion";

// Set a smaller container for the map
const containerStyle = {
    width: "100%",
    height: "550px", // Adjusted for the mini map size
};

const MiniMap = ({ lat, lng, placeName, placeImage, zoomLevel = 18 }) => {
    const [activePlace, setActivePlace] = useState(null);

    const mapCenter = { lat, lng };

    return (
        <motion.div
            className="w-full bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={zoomLevel}
                    mapTypeId="satellite"
                >
                    <Marker
                        position={mapCenter}
                        label={{
                            text: placeName,
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                        onClick={() => setActivePlace({ placeName, placeImage })}
                    />

                    {activePlace && (
                        <InfoWindow
                            position={mapCenter}
                            onCloseClick={() => setActivePlace(null)}
                        >
                            <div className="p-4 bg-[#2A2A2A] rounded-lg shadow-lg text-white">
                                <img
                                    src={activePlace.placeImage}
                                    alt={activePlace.placeName}
                                    className="w-full h-32 object-cover rounded-md mb-3"
                                />
                                <h3 className="text-xl font-bold text-[#A259FF]">{activePlace.placeName}</h3>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </motion.div>
    );
};

export default MiniMap;
