import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function HeroSection({ onGetCounselling }) {
    return (
        <section
            className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80')`,
            }}
        >
            <div className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-white text-4xl md:text-5xl mb-8">
                    Search for <span className="text-yellow-400">Top Colleges</span> by name and city.
                </h2>

                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Main Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Type to start search"
                            className="pl-12 pr-4 py-6 w-full bg-white text-lg"
                        />
                    </div>

                    {/* Get Counselling Button */}
                    <div className="flex justify-center">
                        <Button 
                            className="bg-yellow-400 text-black hover:bg-yellow-500 px-8 py-6 text-lg"
                            onClick={onGetCounselling}
                        >
                            Get Counselling
                        </Button>
                    </div>
                </div>
            </div>

            {/* College Name Label */}
            <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded shadow-md text-sm">
                Indian Institute Of Technology Roorkee ↗
            </div>
        </section>
    );
}
