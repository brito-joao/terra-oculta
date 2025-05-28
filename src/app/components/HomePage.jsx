"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Typewriter from "typewriter-effect";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import Slideshow from "../components/slideshow";
import PlaceCard from "../components/PlaceCard";
import TopPlaces from "../components/TopPlaces";
import BroacastLogos from "../components/BroadcastLogos";
import ExplorationCategories from "../components/Categories";
import { ThreeBackground } from "../components/Background";

import { Button } from "../../components/ui/button";

const slideshowItems = [
    { img: "/brunei.jpg", title: "Brunei ceremony" },
    { img: "/waldo.jpg", title: "Waldo on building" },
    { img: "/strange.jpg", title: "Land drawing in Peru" },
    { img: "/finger.jpg", title: "Largest fingerprint" },
    { img: "/man.jpg", title: "A garden in the shape of a man" },
    { img: "/alien-ship.webp", title: "An alien-ship drawing in Utah" },
    { img: "/china-drawing.jpg", title: "A strange pattern in China" },
];

const HomePage = () => {
    const router = useRouter();
    const [places, setPlaces] = useState([]);
    const [user, setUser] = useState(null);

    // Fetch user right away
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
                if (!res.ok) throw new Error("User not authenticated");
                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    // Delay fetching places to reduce load time pressure
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetch("/api/places")
                .then((res) => res.json())
                .then((data) => setPlaces(Array.isArray(data) ? data : Object.values(data)))
                .catch((err) => console.error("Error fetching places:", err));
        }, 1000); // Delay by 1 second
        return () => clearTimeout(timeout);
    }, []);

    const ensureAuthenticated = () => {
        if (!user || !user.id) {
            router.push("/login");
            return false;
        }
        return true;
    };

    const handleLike = async (placeId) => {
        if (!ensureAuthenticated()) return;
        try {
            const res = await fetch("/api/places", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placeId, userId: user.id, type: "like" }),
            });
            if (res.ok) {
                setPlaces((prev) =>
                    prev.map((p) => (p.id === placeId ? { ...p, likes: (p.likes || 0) + 1 } : p))
                );
            }
        } catch (error) {
            console.error("Error liking place:", error);
        }
    };

    const handleComment = async (placeId, content) => {
        if (!ensureAuthenticated()) return;
        try {
            const res = await fetch("/api/places", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placeId, userId: user.id, type: "comment", content }),
            });
            const data = await res.json();
            if (res.ok) {
                setPlaces((prev) =>
                    prev.map((p) =>
                        p.id === placeId ? { ...p, comments: [...(p.comments || []), data] } : p
                    )
                );
            }
        } catch (error) {
            console.error("Error commenting:", error);
        }
    };

    return (
        <motion.div
            className="bg-[#000000100] text-white min-h-screen font-sans overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        >
            <Navbar />

            <div className="bg-[#141414] fixed top-0 left-0 w-full h-full -z-2">
                <ThreeBackground />
            </div>

            <header className="relative flex flex-col lg:flex-row items-center justify-between gap-8 px-6 py-12">
                <motion.div
                    className="text-center lg:text-left max-w-lg"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-transparent bg-clip-text">
                        Discover Unique Places
                    </h1>
                    <Typewriter
                        options={{
                            strings: ["Procure", "Encontre", "Fique maravilhado"],
                            autoStart: true,
                            loop: true,
                            delay: 75,
                        }}
                    />
                    <p className="text-md sm:text-lg mt-3 text-gray-300">
                        Explore os mistérios escondidos pelo mundo.
                    </p>
                    <Button onClick={() => router.push("/explore")} className="futuristic-btn mt-6">
                        Começar a explorar
                    </Button>
                </motion.div>


                <Slideshow places={places} />

            </header>


            {/* Top Places (delayed render is possible too) */}
            {places.length > 0 && <TopPlaces places={places} />}

            <section className="p-12">
                <motion.h2
                    className="text-4xl font-bold text-center text-purple-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    Últimas Descobertas
                </motion.h2>

                <div className="p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {places.slice().reverse().map((place) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                            userId={user?.id}
                            onLike={handleLike}
                            onComment={handleComment}
                        />
                    ))}

                </div>
            </section>



            <Footer />
        </motion.div>
    );
};

export default HomePage;
