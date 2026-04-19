import { Search, Bell, User, Eye, EyeOff, Upload, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LoginDialog } from "./auth/LoginDialog";
import { collegeService } from "../services/api";
import { useEffect } from "react";

export function Header({ onLogoClick, user, onLogin, onLogout, onWriteReviewClick, onDashboardClick }) {

    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    // const [loggedInUser, setLoggedInUser] = useState(null); // Removed local state

    const [accountType, setAccountType] = useState("student");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        firstName: "", // For "Name (As per result)"
        college1: "",
        college2: "",
        passingYear1: "",
        passingYear2: "",
        mobile: "",
        confirmPassword: "",

        // College Admin registration fields
        collegeName: "",
        location: "",
        description: "",
        website: "",
        establishedYear: ""
    });


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [collegesList, setCollegesList] = useState([]);

    useEffect(() => {
        // Fetch colleges for the dropdown when modal opens or on mount
        const fetchColleges = async () => {
            try {
                const data = await collegeService.getAll();
                setCollegesList(data);
            } catch (err) {
                console.error("Failed to fetch colleges list", err);
            }
        };
        fetchColleges();
    }, []);


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSignUp = async () => {
        setError("");

        if (!formData.username || !formData.password || !formData.email) {
            setError("Please fill in all required fields (Username, Email, Password).");
            return;
        }

        if (formData.password !== formData.confirmPassword && accountType === 'college') {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/users/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: accountType === 'college' ? 'college_admin' : 'student',
                    // New College Creation fields
                    college_name: accountType === 'college' ? formData.collegeName : undefined,
                    location: accountType === 'college' ? formData.location : undefined,
                    description: accountType === 'college' ? formData.description : undefined,
                    website: accountType === 'college' && formData.website
                        ? (formData.website.startsWith('http') ? formData.website : `https://${formData.website}`)
                        : undefined,
                    established_year: accountType === 'college' ? formData.establishedYear : undefined
                }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                throw new Error("Server error. Backend or Database connection issue.");
            }

            if (response.ok) {
                // setLoggedInUser(data.username); // Logic handled by parent via Login
                setIsCreateAccountOpen(false);

                // Reset form
                setFormData({
                    username: "",
                    password: "",
                    email: "",
                    firstName: "",
                    college1: "",
                    college2: "",
                    passingYear1: "",
                    passingYear2: "",
                    mobile: "",
                    confirmPassword: ""
                });
                // Optionally open login dialog or auto-login
                alert("Account created successfully! Please login.");
                setIsLoginDialogOpen(true);
            } else {
                setError(JSON.stringify(data));
            }
        } catch (err) {
            console.error("Sign up failed:", err);
            setError(err.message === "Failed to fetch" ? "Network error. Is backend running?" : (err.message || "Network error. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutClick = () => {
        setIsLogoutDialogOpen(true);
    };

    const confirmLogout = () => {
        setIsLogoutDialogOpen(false);
        onLogout();
    };

    // Wrapper for LoginDialog success
    const handleLoginDialogSuccess = (userData) => {
        onLogin(userData); // Update parent state
        setIsLoginDialogOpen(false);
    };

    return (
        <header className="bg-white border-b">
            {/* Main Header */}
            <div className="px-6 py-3 flex items-center justify-between gap-6">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <h1
                        className="text-blue-900 text-2xl tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={onLogoClick}
                    >
                        College <span className="text-blue-600">Lens</span>
                    </h1>
                </div>

                {/* Search Bar and Actions */}
                <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 w-full"
                        />
                    </div>
                    {user?.role !== 'college_admin' && (
                        <Button 
                            className="bg-yellow-400 text-black hover:bg-yellow-500 whitespace-nowrap"
                            onClick={() => {
                                if (user?.role === 'student' && user?.college_id) {
                                    if (onWriteReviewClick) onWriteReviewClick(user.college_id);
                                } else if (!user) {
                                    setIsLoginDialogOpen(true);
                                    alert("Please log in as a student to write a review for your college.");
                                } else if (user?.role === 'student' && !user?.college_id) {
                                    alert("You are not associated with a specific college yet.");
                                }
                            }}
                        >
                            Write a Review
                        </Button>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon">
                        <Bell className="w-5 h-5" />
                    </Button>

                    {user ? (
                        // Show username with dropdown when logged in
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="whitespace-nowrap gap-2">
                                    <User className="w-4 h-4" />
                                    {user.username}

                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {user.role === 'college_admin' && (
                                    <DropdownMenuItem onClick={() => onDashboardClick && onDashboardClick()} className="cursor-pointer">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        handleLogoutClick();
                                    }} 
                                    className="cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        // Show Create Account button and Login icon when not logged in
                        <>
                            <Button
                                variant="outline"
                                className="whitespace-nowrap"
                                onClick={() => setIsCreateAccountOpen(true)}
                            >
                                Create an Account
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <User className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem 
                                        className="cursor-pointer py-3 border-b"
                                        onClick={() => setIsLoginDialogOpen(true)}
                                    >
                                        College Login
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className="cursor-pointer py-3"
                                        onClick={() => setIsLoginDialogOpen(true)}
                                    >
                                        Student Login
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            {/* Create Account Modal */}
            <Dialog open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Create Account</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Join us today — it only takes a minute!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 mt-2">
                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                        {/* Account Type Selection */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                className={`flex-1 text-sm h-9 ${accountType === "student"
                                    ? "bg-yellow-400 text-black hover:bg-yellow-500"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                onClick={() => setAccountType("student")}
                            >
                                Student
                            </Button>
                            <Button
                                type="button"
                                className={`flex-1 text-sm h-9 ${accountType === "college"
                                    ? "bg-yellow-400 text-black hover:bg-yellow-500"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                onClick={() => setAccountType("college")}>
                                College Admin
                            </Button>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-2.5">
                            {accountType === "student" ? (
                                <div className="text-center p-6 bg-gray-50 rounded-lg border my-4">
                                    <h3 className="font-semibold text-lg text-blue-900 mb-2">Student Registration</h3>
                                    <p className="text-sm text-gray-600">
                                        Please search for your college name in the search bar above and login there using the "Register as Student" button on your specific college's page.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* College Form Fields */}
                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">College Name</label>
                                        <Input
                                            id="collegeName"
                                            type="text"
                                            placeholder="Enter College Name"
                                            className="w-full h-9 text-sm"
                                            value={formData.collegeName}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Established Year</label>
                                        <Input
                                            id="establishedYear"
                                            type="number"
                                            placeholder="e.g., 1995"
                                            className="w-full h-9 text-sm"
                                            value={formData.establishedYear}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Username</label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Choose a username"
                                            className="w-full h-9 text-sm"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">College Email ID</label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@college.edu"
                                            className="w-full h-9 text-sm"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Password</label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full pr-10 h-9 text-sm"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block mt-2">Re-enter Password</label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full pr-10 h-9 text-sm"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Sign Up Button */}
                        <Button
                            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 h-9 text-sm"
                            onClick={handleSignUp}
                            disabled={loading || accountType === "student"}
                            className={accountType === "student" ? "hidden" : ""}
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>

                        {/* Sign In Link */}
                        <p className="text-center text-xs text-gray-500">
                            Already have an account?{" "}
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => { setIsCreateAccountOpen(false); setIsLoginDialogOpen(true); }}
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Login Dialog */}
            <LoginDialog
                isOpen={isLoginDialogOpen}
                onClose={() => setIsLoginDialogOpen(false)}
                onLoginSuccess={handleLoginDialogSuccess}
            />

            {/* Logout Confirmation Dialog */}
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <DialogContent className="sm:max-w-xs">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Do you want to Log out?</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
                            No
                        </Button>
                        <Button variant="destructive" onClick={confirmLogout}>
                            Yes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </header>

    );
}
