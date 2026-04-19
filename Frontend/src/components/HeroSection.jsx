import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { collegeService } from "../services/api";

export function HeroSection({ onGetCounselling, onCollegeClick }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length >= 2) {
                setIsSearching(true);
                try {
                    const data = await collegeService.getAll({ search: searchTerm });
                    setResults(data);
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <section
            className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80')`,
            }}
        >
            <div className="container mx-auto px-6 py-20 text-center relative z-10">
                <h2 className="text-white text-4xl md:text-5xl mb-8 font-bold">
                    Search for <span className="text-yellow-400">Top Colleges</span> and <span className="text-yellow-400">Programs</span>
                </h2>

                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Main Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-20" />
                        <Input
                            type="text"
                            placeholder="Type a college name, location, or course (e.g. BCA, B.Tech)"
                            className="pl-12 pr-4 py-6 w-full bg-white text-lg shadow-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        {/* Search Dropdown Results */}
                        {searchTerm.trim().length >= 2 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl overflow-hidden z-50 text-left">
                                {isSearching ? (
                                    <div className="p-4 text-gray-500 text-center">Searching...</div>
                                ) : results.length > 0 ? (
                                    <ul className="max-h-80 overflow-y-auto">
                                        {results.map((college) => (
                                            <li 
                                                key={college.id} 
                                                className="border-b last:border-0 hover:bg-gray-50 flex items-center gap-4 cursor-pointer p-4 transition-colors"
                                                onClick={() => onCollegeClick(college.id)}
                                            >
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-900 font-bold">
                                                    {college.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{college.name}</h4>
                                                    <p className="text-sm text-gray-500">{college.location}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 text-gray-500 text-center">No colleges or courses found matching "{searchTerm}"</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Get Counselling Button */}
                    <div className="flex justify-center mt-6 relative z-0">
                        <Button 
                            className="bg-yellow-400 text-black hover:bg-yellow-500 px-8 py-6 text-lg font-semibold shadow-lg"
                            onClick={onGetCounselling}
                        >
                            Get Counselling
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
