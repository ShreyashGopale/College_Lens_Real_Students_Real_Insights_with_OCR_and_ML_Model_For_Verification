import { Star, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { collegeService } from "../services/api";
import { useEffect, useState } from "react";


export function TopColleges({ onCollegeClick }) {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const data = await collegeService.getAll();
                // Transform API data to match component expected structure
                const transformed = data.map(c => ({
                    id: c.id,
                    name: c.name, // Use simple name since we don't have shortname
                    fullName: c.name,
                    location: c.location, // We could append accreditation if we had it
                    image: c.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80", // Fallback
                    rating: `${c.average_rating}/5`,
                    // Take the first course as representative or generic "Various Courses"
                    course: c.courses && c.courses.length > 0 ? c.courses[0].name : "Various Courses",
                    // Format fee
                    fees: c.courses && c.courses.length > 0 ? `₹${c.courses[0].fee}` : "Fees N/A",
                    reviewCount: c.review_count,
                    starRating: c.average_rating,
                    ranking: "Ranked Top 100", // Placeholder
                    placement: c.highest_package ? `${c.highest_package} LPA` : (c.average_package ? `${c.average_package} LPA (Avg)` : "N/A"),
                    cutoffStat: c.cutoffs && c.cutoffs.length > 0 ? (c.cutoffs.find(cu => cu.caste === 'General')?.score || c.cutoffs[0].score) : "N/A"
                }));
                setColleges(transformed);
            } catch (error) {
                console.error("Failed to fetch colleges", error);
                // Optionally keep using mock data on error or show empty state
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, []);

    if (loading) {
        return <div className="py-12 text-center">Loading top colleges...</div>;
    }

    return (
        <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl text-gray-900 mb-8">Top Universities/Colleges</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colleges.map((college) => (
                        <div
                            key={college.id}
                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => onCollegeClick(college.id)}
                        >
                            {/* College Image */}
                            <div className="relative h-48">
                                <ImageWithFallback
                                    src={college.image}
                                    alt={college.name}
                                    className="w-full h-full object-cover"
                                />
                                <Badge className="absolute top-3 right-3 bg-blue-600 text-white">
                                    <span className="mr-1">cd</span> {college.starRating}
                                </Badge>
                                {/* College Logo - Placeholder */}
                                <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center">
                                    <span className="text-xs">{college.name.substring(0, 2)}</span>
                                </div>
                            </div>

                            {/* College Info */}
                            <div className="p-4">
                                <h3 className="text-gray-900 mb-1">{college.fullName}</h3>
                                <p className="text-gray-600 text-sm mb-3">{college.location}</p>

                                {/* Course and Rating */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-900">{college.course}</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-gray-900">{college.starRating}/5</span>
                                    </div>
                                </div>

                                {/* Fees and Reviews */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-blue-600 text-sm">{college.fees}</span>
                                    <span className="text-gray-600 text-sm">{college.reviewCount} reviews</span>
                                </div>

                                {/* Placement & Cutoffs Highlights */}
                                <div className="flex items-center justify-between mb-3 bg-blue-50 p-2 rounded">
                                    <div>
                                        <span className="block text-xs text-blue-500">Highest Package</span>
                                        <span className="text-sm font-semibold text-blue-800">{college.placement}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs text-blue-500">Top Cutoff</span>
                                        <span className="text-sm font-semibold text-blue-800">{college.cutoffStat}</span>
                                    </div>
                                </div>

                                {/* Ranking */}
                                <p className="text-gray-600 text-sm mb-4">{college.ranking}</p>

                                {/* Action Links */}
                                <div className="space-y-2 border-t pt-3">
                                    <button className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-blue-600">
                                        <span>View All Courses and fees</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-blue-600">
                                        <span>Download Brochure</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-blue-600">
                                        <span>Compare</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

