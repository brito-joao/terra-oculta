"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import InteractiveMap from "./interactiveMap";
import AddPlaceForm from "./AddPlaceForm";
import Navbar from "./nav";
import PlaceCard from "./PlaceCard";
import Footer from "./footer";
/*
const places = [
    { id: 1, name: "Brunei Ceremony", lat: 4.9031, lng: 114.9398, img: "/brunei.jpg", desc: "A grand royal ceremony in Brunei, captured from above." },
    { id: 2, name: "Waldo on a Building", lat: 45.4215, lng: -75.6993, img: "/waldo.jpg", desc: "A giant hidden Waldo painted on a rooftop!" },
    { id: 3, name: "Strange Land Drawing", lat: -14.758, lng: -75.120, img: "/strange.jpg", desc: "A mysterious ancient land drawing in Peru." },
    { id: 4, name: "Largest Fingerprint", lat: 52.5200, lng: 13.4050, img: "/finger.jpg", desc: "A unique garden shaped like a fingerprint." },
    { id: 5, name: "Man-Shaped Garden", lat: 51.5074, lng: -0.1278, img: "/man.jpg", desc: "A massive garden in the perfect shape of a man." }
];
*/


export default function StartExploring() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activePlace, setActivePlace] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [places, setPlaces] = useState([]);  // ✅ Always an array

    const router = useRouter();

    useEffect(() => {
        fetchPlaces();
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % (places.length || 1)); // ✅ Prevent crash on empty array
        }, 4000);
        return () => clearInterval(interval);
    }, [places.length]); // ✅ Added dependency to prevent stale length issues

    const fetchPlaces = async () => {
        try {
            const response = await fetch("/api/places");
            const data = await response.json();
            if (Array.isArray(data)) {  // ✅ Ensure it's an array
                setPlaces(data);
            } else {
                console.error("Received non-array data from API:", data);
                setPlaces([]); // Fallback to empty array
            }
        } catch (error) {
            console.error("Error fetching places:", error);
            setPlaces([]); // Prevent crash by using an empty array
        }
    };
    const handleLike = async (placeId) => {
        await fetch("/api/places", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placeId, userId: 1, type: "like" }) // Dummy userId
        });
    };
    const handleComment = async (placeId, content) => {
        await fetch("/api/places", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placeId, userId: 1, type: "comment", content }) // Dummy userId
        });
    };
    return (
        <motion.div className="bg-[#1A1A1A] text-white min-h-screen font-sans overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        >
            {/* Navbar */}
            <Navbar />
            {/* Google Map Section */}
            <InteractiveMap places={places} />
            {/* Places List Section */}
            <section className="p-12">
                <motion.h2
                    className="text-4xl font-bold text-center text-[#A259FF]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    Últimas Descobertas
                </motion.h2>
                <div className="p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {places.slice().reverse().map((place) => (
                        <PlaceCard key={place.id} place={place} onLike={handleLike} onComment={handleComment} />
                    ))}
                </div>
            </section>


            
            {/* Futuristic Info Section */}
            <motion.section className="p-12 text-center bg-[#0ABDC6] text-black rounded-lg mx-6 shadow-2xl"
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            >
                <h2 className="text-5xl font-bold">Next-Gen 3D Mapping da última geração</h2>
                <p className="text-lg mt-3">Em breve, irás navegar em um mundo tri-dimensional assim como a vida real.</p>

            </motion.section>

            {/* Footer */}
            <Footer/>
        </motion.div>
    );
}
