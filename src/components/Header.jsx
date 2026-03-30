import { Search, Bell, User, Eye, EyeOff, Upload, LogOut, ChevronDown } from "lucide-react";
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

export function Header({ onLogoClick, user, onLogin, onLogout }) {

    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
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
            const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
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
        onLogout();
        // setLoggedInUser(null);
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
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-500 whitespace-nowrap">
                        Write a Review
                    </Button>
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
                                <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer">
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
                                onClick={() => setAccountType("college")}
                            >
                                College
                            </Button>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-2.5">
                            {accountType === "student" ? (
                                <>
                                    {/* Student Form Fields */}
                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Name (As per result)</label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="Enter name as per result"
                                            className="w-full h-9 text-sm"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {/* College 1 */}
                                        <div>
                                            <label className="text-xs text-gray-700 mb-0.5 block">
                                                College 1 <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="college1"
                                                className="w-full h-9 text-sm border border-input bg-background rounded-md px-3 py-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                required
                                                value={formData.college1}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select College</option>
                                                {collegesList.map((col) => (
                                                    <option key={col.id} value={col.name}>
                                                        {col.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* College 2 */}
                                        <div>
                                            <label className="text-xs text-gray-700 mb-0.5 block">
                                                College 2 <span className="text-gray-400">(optional)</span>
                                            </label>
                                            <select
                                                id="college2"
                                                className="w-full h-9 text-sm border border-input bg-background rounded-md px-3 py-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                value={formData.college2}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select College</option>
                                                {collegesList.map((col) => (
                                                    <option key={col.id} value={col.name}>
                                                        {col.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>                                        {/* Upload Marksheet for College 1 and 2 */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* College 1 Marksheet */}
                                        <div>
                                            <label className="text-xs text-gray-700 mb-0.5 block">Upload Marksheet (College 1)</label>
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    id="college1-marksheet"
                                                />
                                                <label
                                                    htmlFor="college1-marksheet"
                                                    className="flex items-center justify-center gap-2 w-full h-9 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span className="text-xs">Choose PDF</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* College 2 Marksheet */}
                                        <div>
                                            <label className="text-xs text-gray-700 mb-0.5 block">Upload Marksheet (College 2)</label>
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    id="college2-marksheet"
                                                />
                                                <label
                                                    htmlFor="college2-marksheet"
                                                    className="flex items-center justify-center gap-2 w-full h-9 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span className="text-xs">Choose PDF</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upload Fees Receipt for College 1 and 2 */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* College 1 Fees Receipt */}
                                        <div>
                                            <label className="text-xs text-gray-700 mb-0.5 block">Upload Fees Receipt (College 1)</label>
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    id="college1-fees"
                                                />
                                                <label
                                                    htmlFor="college1-fees"
                                                    className="flex items-center justify-center gap-2 w-full h-9 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span className="text-xs">Choose PDF</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* College 2 Fees Receipt */}
                                        <div>
                                            <label className="text-xs text-gray-700 mb-0.5 block">Upload Fees Receipt (College 2)</label>
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    id="college2-fees"
                                                />
                                                <label
                                                    htmlFor="college2-fees"
                                                    className="flex items-center justify-center gap-2 w-full h-9 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span className="text-xs">Choose PDF</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Passing Year for College 1 and 2 */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* College 1 Passing Year */}
                                        <div>
                                            <label className="text-xs text-gray-700 mb-0.5 block">Passing Year (College 1)</label>
                                            <Input
                                                type="text"
                                                placeholder="e.g., 2024"
                                                className="w-full h-9 text-sm"
                                            />
                                        </div>

                                        {/* College 2 Passing Year */}
                                        <div>
                                            <label className="text-xs text-gray-700 mb-0.5 block">Passing Year (College 2)</label>
                                            <Input
                                                type="text"
                                                placeholder="e.g., 2024"
                                                className="w-full h-9 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Email-ID</label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full h-9 text-sm"
                                            value={formData.email}
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
                                </>
                            ) : (
                                <>
                                    {/* College Form Fields */}
                                    {/* College Form Fields */}
                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Full Name</label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full h-9 text-sm"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>

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
                                        <label className="text-xs text-gray-700 mb-0.5 block">Location</label>
                                        <Input
                                            id="location"
                                            type="text"
                                            placeholder="City, State"
                                            className="w-full h-9 text-sm"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Website</label>
                                        <Input
                                            id="website"
                                            type="url"
                                            placeholder="https://example.com"
                                            className="w-full h-9 text-sm"
                                            value={formData.website}
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
                                        <label className="text-xs text-gray-700 mb-0.5 block">Description</label>
                                        <textarea
                                            id="description"
                                            placeholder="Brief description of the college..."
                                            className="w-full min-h-[80px] text-sm border border-input bg-background rounded-md px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Email</label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full h-9 text-sm"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700 mb-0.5 block">Mobile Number</label>
                                        <Input
                                            id="mobile"
                                            type="tel"
                                            placeholder="0123456789"
                                            className="w-full h-9 text-sm"
                                            value={formData.mobile}
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
                                        <label className="text-xs text-gray-700 mb-0.5 block">Confirm Password</label>
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
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>

                        {/* Sign In Link */}
                        <p className="text-center text-xs text-gray-500">
                            Already have an account?{" "}
                            <button className="text-blue-600 hover:underline">
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
        </header>

    );
}
