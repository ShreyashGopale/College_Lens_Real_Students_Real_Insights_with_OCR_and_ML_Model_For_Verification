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
    const [viewingDashboard, setViewingDashboard] = useState(true);
    const [collegeDetailInitialTab, setCollegeDetailInitialTab] = useState("info");
    const [showCounsellingForm, setShowCounsellingForm] = useState(false);
    const [user, setUser] = useState(null); // Global user state: { username, role, college_id, ... }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }

        // --- HISTORY API SYNC ---
        const syncStateFromURL = () => {
            const params = new URLSearchParams(window.location.search);
            const collegeId = params.get('collegeId');
            const view = params.get('view');

            if (collegeId) {
                setSelectedCollegeId(parseInt(collegeId));
                setShowCounsellingForm(false);
                setViewingDashboard(false);
            } else if (view === 'counselling') {
                setShowCounsellingForm(true);
                setSelectedCollegeId(null);
                setViewingDashboard(false);
            } else if (view === 'dashboard') {
                setViewingDashboard(true);
                setSelectedCollegeId(null);
                setShowCounsellingForm(false);
            } else {
                setSelectedCollegeId(null);
                setShowCounsellingForm(false);
                setViewingDashboard(false);
            }
        };

        // Sync on back/forward buttons
        window.addEventListener('popstate', syncStateFromURL);
        // Sync on initial load
        syncStateFromURL();

        return () => window.removeEventListener('popstate', syncStateFromURL);
    }, []);

    const navigate = (state, query = '') => {
        const url = window.location.pathname + query;
        window.history.pushState(state, '', url);
    };

    const handleCollegeClick = (collegeId) => {
        setSelectedCollegeId(collegeId);
        setCollegeDetailInitialTab("info");
        navigate({ collegeId }, `?collegeId=${collegeId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleWriteReviewClick = (collegeId) => {
        setSelectedCollegeId(collegeId);
        setCollegeDetailInitialTab("reviews");
        navigate({ collegeId, tab: 'reviews' }, `?collegeId=${collegeId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToHome = () => {
        setSelectedCollegeId(null);
        setShowCounsellingForm(false);
        setViewingDashboard(false);
        navigate({ view: 'home' }, '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGetCounselling = () => {
        setShowCounsellingForm(true);
        navigate({ view: 'counselling' }, '?view=counselling');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackFromCounselling = () => {
        setShowCounsellingForm(false);
        navigate({ view: 'home' }, '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDashboardClick = () => {
        setViewingDashboard(true);
        navigate({ view: 'dashboard' }, '?view=dashboard');
    };

    const handleLogin = (userData) => {
        setUser(userData);
        if (userData.role === 'college_admin') {
            setViewingDashboard(true);
            navigate({ view: 'dashboard' }, '?view=dashboard');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setSelectedCollegeId(null);
        setShowCounsellingForm(false);
    };

    // Routing Logic
    if (user?.role === 'college_admin' && viewingDashboard) {
        return <CollegeDashboard user={user} onLogout={handleLogout} onGoHome={() => setViewingDashboard(false)} />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Header
                onLogoClick={handleBackToHome}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onWriteReviewClick={handleWriteReviewClick}
                onDashboardClick={handleDashboardClick}
            />
            {showCounsellingForm ? (
                <CounsellingForm onBack={handleBackFromCounselling} />
            ) : selectedCollegeId ? (
                <CollegeDetail collegeId={selectedCollegeId} onBack={handleBackToHome} user={user} onLogin={handleLogin} initialTab={collegeDetailInitialTab} />
            ) : (
                <>
                    <HeroSection onGetCounselling={handleGetCounselling} onCollegeClick={handleCollegeClick} />
                    <BrowseSection />
                    <TopColleges onCollegeClick={handleCollegeClick} />
                </>
            )}
        </div>
    );
}

