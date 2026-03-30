import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { BrowseSection } from "./components/BrowseSection";
import { TopColleges } from "./components/TopColleges";
import { CollegeDetail } from "./components/CollegeDetail";
import { CounsellingForm } from "./components/CounsellingForm";

import { CollegeDashboard } from "./components/CollegeDashboard";
import { collegesData } from "./components/collegeData";


export default function App() {
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);
    const [showCounsellingForm, setShowCounsellingForm] = useState(false);
    const [user, setUser] = useState(null); // Global user state: { username, role, college_id, ... }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleCollegeClick = (collegeId) => {
        setSelectedCollegeId(collegeId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToHome = () => {
        setSelectedCollegeId(null);
        setShowCounsellingForm(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGetCounselling = () => {
        setShowCounsellingForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackFromCounselling = () => {
        setShowCounsellingForm(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setSelectedCollegeId(null);
        setShowCounsellingForm(false);
    };

    // Routing Logic
    if (user?.role === 'college_admin') {
        return <CollegeDashboard user={user} onLogout={handleLogout} />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Header
                onLogoClick={handleBackToHome}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
            />
            {showCounsellingForm ? (
                <CounsellingForm onBack={handleBackFromCounselling} />
            ) : selectedCollegeId ? (
                <CollegeDetail collegeId={selectedCollegeId} onBack={handleBackToHome} user={user} onLogin={handleLogin} />
            ) : (
                <>
                    <HeroSection onGetCounselling={handleGetCounselling} />
                    <BrowseSection />
                    <TopColleges onCollegeClick={handleCollegeClick} />
                </>
            )}
        </div>
    );
}

