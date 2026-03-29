import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import axios from "axios";

export function CounsellingForm({ onBack }) {
    const [formData, setFormData] = useState({
        ssc_percentage: "",
        hsc_percentage: "",
        diploma_cgpa: "",
        jee_mains_rank: "",
        jee_mains_percentile: "",
        state: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Ensure proper data types (handle empty strings appropriately for decimals/ints)
            const payload = {
                ...formData,
                ssc_percentage: formData.ssc_percentage || null,
                hsc_percentage: formData.hsc_percentage || null,
                diploma_cgpa: formData.diploma_cgpa || null,
                jee_mains_rank: formData.jee_mains_rank || null,
                jee_mains_percentile: formData.jee_mains_percentile || null,
            };

            await axios.post("http://localhost:8000/api/users/counselling/", payload);
            toast.success("Counselling request submitted successfully!");
            onBack();
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit request. Please ensure all details are correct.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen py-20 bg-gray-50 flex items-center justify-center">
            <div className="container mx-auto px-6 max-w-2xl bg-white p-10 rounded-xl shadow-lg border-t-8 border-yellow-400">
                <button 
                    onClick={onBack}
                    className="text-gray-500 hover:text-black mb-6 font-semibold"
                >
                    &larr; Back to Home
                </button>
                
                <h2 className="text-3xl font-bold mb-2">Get Counselling</h2>
                <p className="text-gray-500 mb-8">
                    Fill out the academic details below to proceed with your college admissions counselling.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="ssc_percentage">10th / SSC Percentage *</Label>
                            <Input
                                id="ssc_percentage"
                                name="ssc_percentage"
                                type="number"
                                step="0.01"
                                max="100"
                                required
                                placeholder="E.g. 95.50"
                                value={formData.ssc_percentage}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="hsc_percentage">12th / HSC Percentage</Label>
                            <Input
                                id="hsc_percentage"
                                name="hsc_percentage"
                                type="number"
                                step="0.01"
                                max="100"
                                placeholder="E.g. 88.20"
                                value={formData.hsc_percentage}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="diploma_cgpa">Diploma CGPA (if applicable)</Label>
                            <Input
                                id="diploma_cgpa"
                                name="diploma_cgpa"
                                type="number"
                                step="0.01"
                                max="10"
                                placeholder="E.g. 8.5"
                                value={formData.diploma_cgpa}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                                id="state"
                                name="state"
                                type="text"
                                required
                                placeholder="E.g. Maharashtra"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="jee_mains_rank">JEE Mains Rank</Label>
                            <Input
                                id="jee_mains_rank"
                                name="jee_mains_rank"
                                type="number"
                                placeholder="E.g. 15000"
                                value={formData.jee_mains_rank}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jee_mains_percentile">JEE Mains Percentile</Label>
                            <Input
                                id="jee_mains_percentile"
                                name="jee_mains_percentile"
                                type="number"
                                step="0.01"
                                max="100"
                                placeholder="E.g. 98.45"
                                value={formData.jee_mains_percentile}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 py-6 text-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Counselling Request"}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
