import React, { useState, useEffect } from "react";
import { Youtube, Loader, PlayCircle, Info, Clock } from "lucide-react";
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
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 gap-4">
                <div className="relative">
                    <Loader className="w-12 h-12 animate-spin text-secondary" />
                    <Youtube className="w-5 h-5 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-xs">Loading masterclasses...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-12">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-10 md:mb-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-secondary p-2 rounded-xl shadow-lg shadow-secondary/20">
                                <Youtube className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight">
                                Book <span className="text-secondary">Tutorials</span>
                            </h1>
                        </div>
                        <p className="text-gray-500 font-medium text-sm md:text-lg max-w-2xl">
                            Curated reviews, summaries, and reading hacks from the best bibliophiles.
                        </p>
                    </div>
                    <div className="hidden lg:block bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Library Growth</p>
                                <p className="text-lg font-black text-secondary">{tutorials.length} Videos</p>
                            </div>
                            <PlayCircle className="w-10 h-10 text-secondary/20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* TUTORIALS GRID */}
            <div className="max-w-7xl mx-auto">
                {tutorials.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
                        <Youtube className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                        <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2">No Content Yet</h3>
                        <p className="text-gray-400 font-medium">We're currently filming and curating new guides for you.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {tutorials.map((tutorial) => {
                            const videoId = extractVideoId(tutorial.youtubeUrl);
                            return (
                                <div
                                    key={tutorial._id}
                                    className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500"
                                >
                                    {/* VIDEO EMBED CONTAINER */}
                                    <div className="relative aspect-video overflow-hidden">
                                        {videoId ? (
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
                                                title={tutorial.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2">
                                                <Info className="w-8 h-8 text-gray-300" />
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Video Unavailable</p>
                                            </div>
                                        )}
                                        {/* Play Overlay (Visible before interaction) */}
                                        <div className="absolute inset-0 bg-secondary/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
                                    </div>

                                    {/* VIDEO INFO */}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-secondary/10 text-secondary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                                Tutorial
                                            </span>
                                            <div className="flex items-center gap-1 text-gray-300 text-[10px] font-bold">
                                                <Clock className="w-3 h-3" /> 10-15 Min
                                            </div>
                                        </div>

                                        <h3 className="text-lg md:text-xl font-black text-gray-800 mb-3 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                                            {tutorial.title}
                                        </h3>

                                        {tutorial.description && (
                                            <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-3">
                                                {tutorial.description}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                                            <button className="text-secondary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                                Watch Now <PlayCircle className="w-4 h-4" />
                                            </button>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tutorials;