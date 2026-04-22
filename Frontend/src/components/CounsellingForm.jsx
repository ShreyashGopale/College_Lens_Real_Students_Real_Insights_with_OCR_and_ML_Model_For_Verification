import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import axios from "axios";

export function CounsellingForm({ onBack }) {
    const [formData, setFormData] = useState({
        jee_mains_rank: "",
        seat_type: "OPEN",
        gender: "Gender-Neutral",
        quota: "AI",
        result_count: "20"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [predictions, setPredictions] = useState(null);
    const [fallbackInfo, setFallbackInfo] = useState(null);
    const resultsRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setPredictions(null);
        setFallbackInfo(null);

        try {
            const payload = {
                jee_mains_rank: parseInt(formData.jee_mains_rank, 10),
                seat_type: formData.seat_type,
                gender: formData.gender,
                quota: formData.quota,
                result_count: parseInt(formData.result_count, 10)
            };

            const response = await axios.post("/api/users/predict-colleges/", payload);
            
            if (response.data.data && response.data.data.length > 0) {
                if (response.data.is_fallback) {
                    setFallbackInfo({
                        message: response.data.message,
                        max_cutoff: response.data.max_cutoff,
                        min_cutoff: response.data.min_cutoff
                    });
                    toast.info("Showing closest matches for your category.", { duration: 5000 });
                } else {
                    toast.success(`Found ${response.data.data.length} potential colleges!`);
                }
                setPredictions(response.data.data);
            } else {
                toast.error(response.data.message || "No colleges match your exact criteria. Try adjusting your rank.");
                setPredictions([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch predictions. Please ensure your backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (predictions && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [predictions]);

    return (
        <section className="min-h-screen py-10 bg-gray-50 flex flex-col items-center justify-start relative">
            <div className="container mx-auto px-6 max-w-3xl w-full bg-white p-10 rounded-xl shadow-lg border-t-8 border-yellow-400 mt-10 transition-all duration-500">
                <button 
                    onClick={onBack}
                    className="text-gray-500 hover:text-black mb-6 font-semibold flex items-center transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Home
                </button>
                
                <h2 className="text-3xl font-bold mb-2 text-gray-800">ML College Predictor</h2>
                <p className="text-gray-500 mb-8 border-b pb-6">
                    Enter your JEE Rank and Category details. Our advanced Random Forest AI will predict your best chances for admissions in 2026.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="jee_mains_rank" className="font-semibold text-gray-700">JEE Mains Rank (CRL/Category) *</Label>
                            <Input
                                id="jee_mains_rank"
                                name="jee_mains_rank"
                                type="number"
                                required
                                min="1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                placeholder="E.g. 15000"
                                value={formData.jee_mains_rank}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="seat_type" className="font-semibold text-gray-700">Seat Type (Category) *</Label>
                            <select 
                                id="seat_type" 
                                name="seat_type" 
                                value={formData.seat_type} 
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white shadow-sm"
                            >
                                <option value="OPEN">OPEN</option>
                                <option value="OBC-NCL">OBC-NCL</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                                <option value="OPEN (PwD)">OPEN (PwD)</option>
                                <option value="OBC-NCL (PwD)">OBC-NCL (PwD)</option>
                                <option value="SC (PwD)">SC (PwD)</option>
                                <option value="ST (PwD)">ST (PwD)</option>
                                <option value="EWS (PwD)">EWS (PwD)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="font-semibold text-gray-700">Gender *</Label>
                            <select 
                                id="gender" 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white shadow-sm"
                            >
                                <option value="Gender-Neutral">Gender-Neutral</option>
                                <option value="Female-only (including Supernumerary)">Female-only (including Supernumerary)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quota" className="font-semibold text-gray-700">Quota *</Label>
                            <select 
                                id="quota" 
                                name="quota" 
                                value={formData.quota} 
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white shadow-sm"
                            >
                                <option value="AI">AI (All India)</option>
                                <option value="OS">OS (Other State)</option>
                                <option value="HS">HS (Home State)</option>
                                <option value="GO">GO (Goa)</option>
                                <option value="JK">JK (Jammu & Kashmir)</option>
                                <option value="LA">LA (Ladakh)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="result_count" className="font-semibold text-gray-700">Results to Show *</Label>
                            <select 
                                id="result_count" 
                                name="result_count" 
                                value={formData.result_count} 
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white shadow-sm"
                            >
                                <option value="10">Top 10 Colleges</option>
                                <option value="20">Top 20 Colleges</option>
                                <option value="50">Top 50 Colleges</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button 
                            type="submit" 
                            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-lg transition-all transform hover:-translate-y-1 py-6 text-xl font-bold rounded-xl"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Analyzing Data...
                                </span>
                            ) : "Predict My Colleges"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Results Popup List / Container */}
            {predictions !== null && (
                <div ref={resultsRef} className="container mx-auto px-4 max-w-4xl w-full mt-10 mb-20 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center">
                                    <span className="bg-green-500 w-3 h-3 rounded-full mr-3 animate-pulse"></span>
                                    AI Predictions
                                </h3>
                                <p className="text-gray-300 text-sm mt-1">Showing {predictions.length} most ambitious matching programs based on past data.</p>
                            </div>
                            <div className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg shadow-inner">
                                Rank: {formData.jee_mains_rank}
                            </div>
                        </div>

                        {/* Fallback info banner */}
                        {fallbackInfo && (
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mx-4 mt-4 rounded-r-lg">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800">Showing Closest Matches</p>
                                        <p className="text-sm text-amber-700 mt-1">
                                            Your rank ({formData.jee_mains_rank}) exceeds the predicted cutoff range for <strong>{formData.seat_type} / {formData.quota}</strong>.
                                            The valid predicted cutoff range for this category is <strong>{fallbackInfo.min_cutoff.toLocaleString()} – {fallbackInfo.max_cutoff.toLocaleString()}</strong>.
                                            Below are the closest matching programs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {predictions.length > 0 ? (
                            <div className="max-h-[600px] overflow-y-auto w-full custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm border-b">
                                        <tr>
                                            <th className="p-4 font-bold text-gray-700 tracking-wider">#</th>
                                            <th className="p-4 font-bold text-gray-700 tracking-wider">Institute Name</th>
                                            <th className="p-4 font-bold text-gray-700 tracking-wider">Academic Program</th>
                                            <th className="p-4 font-bold text-gray-700 tracking-wider text-right">Predicted Cutoff Rank</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {predictions.map((p, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50 transition-colors duration-200 group">
                                                <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                                                <td className="p-4 font-semibold text-gray-800">{p.institute}</td>
                                                <td className="p-4 text-gray-600 group-hover:text-gray-900">{p.academic_program_name}</td>
                                                <td className="p-4 text-right">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                                                        {p.predicted_cutoff}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                             <div className="p-12 text-center flex flex-col items-center">
                                 <div className="bg-red-50 p-4 rounded-full mb-4">
                                     <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                 </div>
                                 <h4 className="text-xl font-bold text-gray-800 mb-2">No Ambitious Matches Found</h4>
                                 <p className="text-gray-500 max-w-md">Our AI analyzed the data and couldn't find programs that historically fall within this rank criteria. Please try adjusting your rank realistically or relaxing constraints.</p>
                             </div>
                        )}
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1; 
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8; 
                }
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
            `}} />
        </section>
    );
}
