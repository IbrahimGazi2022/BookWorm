import React, { useState, useEffect } from "react";
import { Youtube, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getAllTutorials } from "../../services/tutorialService";

const Tutorials = () => {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        try {
            setLoading(true);
            const data = await getAllTutorials();
            setTutorials(data.tutorials);
        } catch (error) {
            toast.error("Failed to fetch tutorials");
        } finally {
            setLoading(false);
        }
    };

    const extractVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* HEADER */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Youtube className="w-10 h-10 text-secondary" />
                    <h1 className="text-4xl font-bold text-secondary">Book Tutorials</h1>
                </div>
                <p className="text-gray-600">
                    Watch curated book reviews, recommendations, and reading tips
                </p>
            </div>

            {/* TUTORIALS GRID */}
            {tutorials.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No tutorials available
                    </h3>
                    <p className="text-gray-600">
                        Check back later for book recommendations and reading tips!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutorials.map((tutorial) => {
                        const videoId = extractVideoId(tutorial.youtubeUrl);
                        return (
                            <div
                                key={tutorial._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {/* VIDEO EMBED */}
                                {videoId ? (
                                    <div className="relative pb-[56.25%]">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={tutorial.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-200 h-48 flex items-center justify-center">
                                        <p className="text-gray-500">Invalid video URL</p>
                                    </div>
                                )}

                                {/* VIDEO INFO */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        {tutorial.title}
                                    </h3>
                                    {tutorial.description && (
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {tutorial.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Tutorials;