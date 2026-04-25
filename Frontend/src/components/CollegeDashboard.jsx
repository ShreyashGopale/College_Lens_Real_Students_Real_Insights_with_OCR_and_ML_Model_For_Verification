import { useEffect, useState } from "react";
import { collegeService, reviewService, galleryService, cutoffService, courseService, authService } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Star, Users, MessageSquare, LogOut, MapPin, Building, Briefcase, IndianRupee, Upload, Camera, Trash2, Image, Video, Plus, Home, Settings, KeyRound, AlertTriangle, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function CollegeDashboard({ user, onLogout, onGoHome }) {
    const [college, setCollege] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    // Account Settings State
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Gallery State
    const [galleryMedia, setGalleryMedia] = useState([]);
    const [galleryCategory, setGalleryCategory] = useState('classroom');
    const [galleryUploading, setGalleryUploading] = useState(false);
    const GALLERY_CATEGORIES = [
        { value: 'classroom', label: 'Classroom' },
        { value: 'campus', label: 'Campus' },
        { value: 'library', label: 'Library' },
        { value: 'hostel', label: 'Hostel' },
        { value: 'canteen', label: 'Canteen' },
        { value: 'seminar_hall', label: 'Seminar Hall' },
        { value: 'ground', label: 'Ground' },
        { value: 'laboratory', label: 'Laboratory' },
        { value: 'other', label: 'Other' },
    ];

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [isEditingFacilities, setIsEditingFacilities] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [uploading, setUploading] = useState(false);

    // Cutoffs State
    const [cutoffs, setCutoffs] = useState([]);
    const [isEditingCutoff, setIsEditingCutoff] = useState(null); // null if creating or ID if editing
    const [showCutoffForm, setShowCutoffForm] = useState(false);
    const [cutoffFormData, setCutoffFormData] = useState({
        course: '',
        year: new Date().getFullYear(),
        caste: 'General',
        score: ''
    });

    // Courses State
    const [courses, setCourses] = useState([]);
    const [isEditingCourse, setIsEditingCourse] = useState(null);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [courseFormData, setCourseFormData] = useState({
        degree_type: 'B.E/B.TECH',
        name: '',
        duration: '',
        fee: '',
        established_year: '',
        average_package: '',
        number_of_students: ''
    });
    const DEGREE_TYPES = ['B.E/B.TECH', 'MBA', 'BCA', 'B.Sc', 'M.Tech', 'Diploma', 'Other'];

    // New College Creation State
    const [newCollegeData, setNewCollegeData] = useState({
        name: "",
        location: "",
        description: "",
        established_year: "",
        website: ""
    });



    // Initialize edit form data when college loads
    useEffect(() => {
        if (college) {
            setEditFormData({
                placement_description: college.placement_description || "",
                average_package: college.average_package || "",
                highest_package: college.highest_package || "",
                name: college.name || "",
                location: college.location || "",
                established_year: college.established_year || "",
                description: college.description || "",
                website: college.website || "",
                hostel_available: college.hostel_available || false,
                hostel_fees: college.hostel_fees || "",
                bus_available: college.bus_available || false,
                mission: college.mission || "",
                vision: college.vision || ""
            });
        }
    }, [college]);

    const handleUpdateCollege = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updatedCollege = await collegeService.update(college.id, editFormData);
            setCollege({ ...college, ...updatedCollege });
            setIsEditing(false);
            alert("College details updated successfully!");
        } catch (error) {
            console.error("Failed to update college", error);
            alert("Failed to update details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCollegeDetails = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const detailsData = {
                name: editFormData.name,
                location: editFormData.location,
                established_year: editFormData.established_year,
                website: editFormData.website,
                description: editFormData.description,
                hostel_available: editFormData.hostel_available,
                hostel_fees: editFormData.hostel_fees,
                bus_available: editFormData.bus_available,
                mission: editFormData.mission,
                vision: editFormData.vision
            };
            const updatedCollege = await collegeService.update(college.id, detailsData);
            setCollege({ ...college, ...updatedCollege });
            setIsEditingDetails(false);
            alert("College profile updated successfully!");
        } catch (error) {
            console.error("Failed to update college details", error);
            alert("Failed to update details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCollegeFacilities = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const facilitiesData = {
                hostel_available: editFormData.hostel_available,
                hostel_fees: editFormData.hostel_fees,
                bus_available: editFormData.bus_available
            };
            const updatedCollege = await collegeService.update(college.id, facilitiesData);
            setCollege({ ...college, ...updatedCollege });
            setIsEditingFacilities(false);
            alert("Facilities updated successfully!");
        } catch (error) {
            console.error("Failed to update facilities", error);
            alert("Failed to update facilities. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCutoff = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = { ...cutoffFormData, college: college.id };
            if (isEditingCutoff) {
                const updatedCutoff = await cutoffService.update(isEditingCutoff, data);
                setCutoffs(prev => prev.map(c => c.id === isEditingCutoff ? updatedCutoff : c));
                alert("Cutoff updated successfully!");
            } else {
                const newCutoff = await cutoffService.create(data);
                setCutoffs(prev => [...prev, newCutoff]);
                alert("Cutoff added successfully!");
            }
            setShowCutoffForm(false);
            setCutoffFormData({ course: '', year: new Date().getFullYear(), caste: 'General', score: '' });
            setIsEditingCutoff(null);
        } catch (error) {
            console.error("Failed to save cutoff", error);
            alert("Failed to save cutoff. Check if a cutoff for this caste/course/year already exists.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCutoff = async (id) => {
        if (!confirm("Are you sure you want to delete this cutoff?")) return;
        try {
            await cutoffService.delete(id);
            setCutoffs(prev => prev.filter(c => c.id !== id));
            alert("Cutoff deleted seamlessly!");
        } catch (error) {
            console.error("Failed to delete cutoff", error);
            alert("Failed to delete cutoff");
        }
    };

    const handleEditCutoffInit = (cutoff) => {
        setIsEditingCutoff(cutoff.id);
        setCutoffFormData({
            course: cutoff.course,
            year: cutoff.year,
            caste: cutoff.caste,
            score: cutoff.score
        });
        setShowCutoffForm(true);
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = { ...courseFormData, college: college.id, number_of_students: parseInt(courseFormData.number_of_students) || null };
            if (isEditingCourse) {
                const updatedCourse = await courseService.update(isEditingCourse, data);
                setCourses(prev => prev.map(c => c.id === isEditingCourse ? updatedCourse : c));
                alert("Branch updated successfully!");
            } else {
                const newCourse = await courseService.create(data);
                setCourses(prev => [...prev, newCourse]);
                alert("Branch added successfully!");
            }
            setShowCourseForm(false);
            setCourseFormData({ degree_type: 'B.E/B.TECH', name: '', duration: '', fee: '', established_year: '', average_package: '', number_of_students: '' });
            setIsEditingCourse(null);
        } catch (error) {
            console.error("Failed to save branch", error);
            alert("Failed to save branch parameters correctly.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!confirm("Are you sure you want to delete this branch?")) return;
        try {
            await courseService.delete(id);
            setCourses(prev => prev.filter(c => c.id !== id));
            alert("Branch deleted seamlessly!");
        } catch (error) {
            console.error("Failed to delete branch", error);
            alert("Failed to delete branch.");
        }
    };

    const handleEditCourseInit = (course) => {
        setIsEditingCourse(course.id);
        setCourseFormData({
            degree_type: course.degree_type || 'B.E/B.TECH',
            name: course.name || '',
            duration: course.duration || '',
            fee: course.fee || '',
            established_year: course.established_year || '',
            average_package: course.average_package || '',
            number_of_students: course.number_of_students || ''
        });
        setShowCourseForm(true);
    };

    const handleCreateCollege = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const createdCollege = await collegeService.create(newCollegeData);

            // Update local user state to reflect new college_id
            const updatedUser = { ...user, college_id: createdCollege.id };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Trigger reload or just set state
            window.location.reload(); // Simplest way to refresh everything including user context
        } catch (error) {
            console.error("Failed to create college", error);
            alert("Failed to create college. Please try again.");
            setLoading(false);
        }
    };



    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            const updatedCollege = await collegeService.update(college.id, formData);
            setCollege({ ...college, image: updatedCollege.image });
            alert("College photo updated successfully!");
        } catch (error) {
            console.error("Failed to upload photo", error);
            alert("Failed to upload photo. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.college_id) {
                // If user doesn't have a college_id, we stop loading but don't fetch
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Fetch college details
                const collegeData = await collegeService.getDetail(user.college_id);
                setCollege(collegeData);

                // Fetch reviews (if not included in detail)
                if (collegeData.reviews) {
                    setReviews(collegeData.reviews);
                } else {
                    const reviewsData = await reviewService.getByCollege(user.college_id);
                    setReviews(reviewsData);
                }

                // Fetch gallery media
                const galleryData = await galleryService.getByCollege(user.college_id);
                setGalleryMedia(galleryData);

                // Initialize cutoffs locally
                if (collegeData.cutoffs) {
                    setCutoffs(collegeData.cutoffs);
                }
                if (collegeData.courses) {
                    setCourses(collegeData.courses);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                alert("Failed to load dashboard data. Please try refreshing.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
    }

    if (!user?.college_id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create College Profile</CardTitle>
                        <CardDescription>
                            Welcome! Let's set up your college profile to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateCollege} className="space-y-4">
                            <div>
                                <Label>College Name</Label>
                                <Input
                                    required
                                    value={newCollegeData.name}
                                    onChange={(e) => setNewCollegeData({ ...newCollegeData, name: e.target.value })}
                                    placeholder="e.g. Indian Institute of Technology, Bombay"
                                />
                            </div>
                            <div>
                                <Label>Location</Label>
                                <Input
                                    required
                                    value={newCollegeData.location}
                                    onChange={(e) => setNewCollegeData({ ...newCollegeData, location: e.target.value })}
                                    placeholder="e.g. Mumbai, Maharashtra"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Established Year</Label>
                                    <Input
                                        type="number"
                                        required
                                        value={newCollegeData.established_year}
                                        onChange={(e) => setNewCollegeData({ ...newCollegeData, established_year: e.target.value })}
                                        placeholder="e.g. 1958"
                                    />
                                </div>
                                <div>
                                    <Label>Website</Label>
                                    <Input
                                        type="url"
                                        required
                                        value={newCollegeData.website}
                                        onChange={(e) => setNewCollegeData({ ...newCollegeData, website: e.target.value })}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    required
                                    value={newCollegeData.description}
                                    onChange={(e) => setNewCollegeData({ ...newCollegeData, description: e.target.value })}
                                    placeholder="Tell us about the college..."
                                    className="min-h-[100px]"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating Profile..." : "Create Profile"}
                            </Button>
                        </form>
                        <div className="mt-4 text-center">
                            <Button variant="link" onClick={() => setIsLogoutDialogOpen(true)} className="text-gray-500">
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
    }

    if (!college) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-xl font-bold mb-2">College Not Found</h2>
                <p className="text-gray-600 mb-4">Could not load college details.</p>
                <Button onClick={() => setIsLogoutDialogOpen(true)}>Logout</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dashboard Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onGoHome} className="text-gray-500 hover:text-gray-900 border" title="Go to Home Page">
                            <Home className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                {college.name.substring(0, 2)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">{college.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                        {/* Account Dropdown */}
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                            >
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                Account
                                <ChevronDown className={`w-4 h-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                            </Button>
                            {isAccountMenuOpen && (
                                <>
                                    {/* Invisible overlay to close the dropdown */}
                                    <div className="fixed inset-0 z-30" onClick={() => setIsAccountMenuOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border z-40 py-1">
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                            onClick={() => { setIsAccountMenuOpen(false); }}
                                        >
                                            <Building className="w-4 h-4 text-blue-600" />
                                            Dashboard
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                            onClick={() => { setIsAccountMenuOpen(false); setIsAccountSettingsOpen(true); }}
                                        >
                                            <Settings className="w-4 h-4 text-gray-500" />
                                            Account Settings
                                        </button>
                                        <div className="border-t my-1" />
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                            onClick={() => { setIsAccountMenuOpen(false); setIsLogoutDialogOpen(true); }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* College Info & Stats */}
                <div className="bg-white rounded-lg p-6 shadow-sm mb-8 flex items-center gap-6">
                    <div className="relative group w-32 h-32 flex-shrink-0">
                        {college.image ? (
                            <img
                                src={college.image}
                                alt={college.name}
                                className="w-full h-full object-cover rounded-lg border"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border text-gray-400">
                                <Building className="w-12 h-12" />
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-xs">Change Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                                disabled={uploading}
                            />
                        </label>
                        {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg"><span className="text-xs font-bold">Uploading...</span></div>}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{college.name}</h2>
                        <p className="text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" /> {college.location}
                        </p>
                        <div className="flex gap-4 mt-4">
                            <div className="text-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Avg Package</p>
                                <p className="text-lg font-bold text-blue-900">₹{college.average_package || "N/A"} LPA</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Highest Package</p>
                                <p className="text-lg font-bold text-green-900">₹{college.highest_package || "N/A"} LPA</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-100">
                                <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide">Rating</p>
                                <p className="text-lg font-bold text-yellow-900">{college.average_rating || "0.0"}/5</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="reviews" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="reviews">Student Reviews</TabsTrigger>
                        <TabsTrigger value="placements">Placements</TabsTrigger>
                        <TabsTrigger value="facilities">Facilities</TabsTrigger>
                        <TabsTrigger value="cutoffs">Cutoffs</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        <TabsTrigger value="courses">Branches & Courses</TabsTrigger>
                        <TabsTrigger value="details">College Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="placements">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                    Placement Highlights
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? "Cancel Edit" : "Edit Details"}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <form onSubmit={handleUpdateCollege} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Average Package (LPA)</Label>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                                    <Input
                                                        type="number"
                                                        className="pl-9"
                                                        value={editFormData.average_package}
                                                        onChange={(e) => setEditFormData({ ...editFormData, average_package: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Highest Package (LPA)</Label>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                                    <Input
                                                        type="number"
                                                        className="pl-9"
                                                        value={editFormData.highest_package}
                                                        onChange={(e) => setEditFormData({ ...editFormData, highest_package: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Placement Description</Label>
                                            <textarea
                                                className="w-full min-h-[150px] p-3 text-sm border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Describe your college's placement record, top recruiters, and statistics..."
                                                value={editFormData.placement_description}
                                                onChange={(e) => setEditFormData({ ...editFormData, placement_description: e.target.value })}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">Save Changes</Button>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="prose max-w-none text-gray-700">
                                            {college.placement_description ? (
                                                <p className="whitespace-pre-line">{college.placement_description}</p>
                                            ) : (
                                                <div className="text-center py-8 bg-gray-50 rounded-lg dashed-border">
                                                    <p className="text-gray-500">No placement details added yet.</p>
                                                    <Button variant="link" onClick={() => setIsEditing(true)}>Add Details</Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>



                    <TabsContent value="reviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Reviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {reviews.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">No reviews yet.</div>
                                ) : (
                                    <div className="space-y-6">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-semibold text-gray-900">
                                                            {review.user?.username || "Student"}
                                                        </div>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm mb-3">{review.text}</p>

                                                {/* Comments Section */}
                                                {review.comments && review.comments.length > 0 && (
                                                    <div className="bg-gray-50 p-3 rounded-md mt-2">
                                                        <p className="text-xs font-semibold text-gray-600 mb-2">Comments:</p>
                                                        <div className="space-y-2">
                                                            {review.comments.map((comment) => (
                                                                <div key={comment.id} className="text-xs text-gray-600 border-l-2 border-blue-200 pl-2">
                                                                    <span className="font-medium">{comment.user?.username}: </span>
                                                                    {comment.text}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="courses">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Branches & Degrees</CardTitle>
                                <Button size="sm" onClick={() => { setShowCourseForm(!showCourseForm); setIsEditingCourse(null); setCourseFormData({ degree_type: 'B.E/B.TECH', name: '', duration: '', fee: '', established_year: '', average_package: '', number_of_students: '' }); }}>
                                    {showCourseForm ? "Cancel" : "Add Branch"}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {showCourseForm && (
                                    <div className="bg-gray-50 p-6 rounded-lg border mb-8">
                                        <h4 className="font-semibold text-gray-900 mb-4">{isEditingCourse ? "Edit Branch" : "Add New Branch"}</h4>
                                        <form onSubmit={handleSaveCourse} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Degree Type</Label>
                                                    <select required className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" value={courseFormData.degree_type} onChange={(e) => setCourseFormData({ ...courseFormData, degree_type: e.target.value })}>
                                                        {DEGREE_TYPES.map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label>Course / Branch Name</Label>
                                                    <Input required value={courseFormData.name} onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })} placeholder="e.g. Computer Science Engineering" />
                                                </div>
                                                <div>
                                                    <Label>Established Year</Label>
                                                    <Input type="number" value={courseFormData.established_year} onChange={(e) => setCourseFormData({ ...courseFormData, established_year: e.target.value })} placeholder="e.g. 2005" />
                                                </div>
                                                <div>
                                                    <Label>Average Package</Label>
                                                    <Input value={courseFormData.average_package} onChange={(e) => setCourseFormData({ ...courseFormData, average_package: e.target.value })} placeholder="e.g. 8 LPA" />
                                                </div>
                                                <div>
                                                    <Label>Number of Students</Label>
                                                    <Input type="number" value={courseFormData.number_of_students} onChange={(e) => setCourseFormData({ ...courseFormData, number_of_students: e.target.value })} placeholder="e.g. 120" />
                                                </div>
                                                <div>
                                                    <Label>Course Duration</Label>
                                                    <Input required value={courseFormData.duration} onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })} placeholder="e.g. 4 Years" />
                                                </div>
                                                <div>
                                                    <Label>Course Fees</Label>
                                                    <Input value={courseFormData.fee} onChange={(e) => setCourseFormData({ ...courseFormData, fee: e.target.value })} placeholder="e.g. ₹1,50,000 / year" />
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? "Saving..." : "Save Branch Details"}</Button>
                                        </form>
                                    </div>
                                )}
                                
                                <div className="space-y-6">
                                    {DEGREE_TYPES.map(type => {
                                        const typeCourses = courses.filter(c => c.degree_type === type);
                                        if (typeCourses.length === 0) return null;
                                        
                                        return (
                                            <div key={type} className="border-l-4 border-blue-600 pl-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="text-xl font-bold text-gray-900 mb-4">{type} Programs</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {typeCourses.map(course => (
                                                        <div key={course.id} className="p-4 bg-gray-50 rounded-lg border group relative">
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                                <Button size="sm" variant="outline" className="h-8 shadow" onClick={() => handleEditCourseInit(course)}>Edit</Button>
                                                                <Button size="sm" variant="destructive" className="h-8 shadow" onClick={() => handleDeleteCourse(course.id)}>Delete</Button>
                                                            </div>
                                                            <h5 className="font-bold text-lg text-blue-900 mb-2">{course.name}</h5>
                                                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                                <p><strong>Duration:</strong> {course.duration}</p>
                                                                <p><strong>Fees:</strong> {course.fee || 'N/A'}</p>
                                                                <p><strong>Avg Package:</strong> {course.average_package || 'N/A'}</p>
                                                                <p><strong>Strength:</strong> {course.number_of_students || 'N/A'}</p>
                                                                <p><strong>Est. Year:</strong> {course.established_year || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {courses.length === 0 && !showCourseForm && (
                                        <div className="text-center py-8 text-gray-500">No branches added yet.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>College Profile</CardTitle>
                                <Button variant="outline" size="sm" onClick={() => setIsEditingDetails(!isEditingDetails)}>
                                    {isEditingDetails ? "Cancel Edit" : "Edit Details"}
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditingDetails ? (
                                    <form onSubmit={handleUpdateCollegeDetails} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>College Name</Label>
                                                <Input
                                                    required
                                                    value={editFormData.name}
                                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                                    placeholder="College Name"
                                                />
                                            </div>
                                            <div>
                                                <Label>Location</Label>
                                                <Input
                                                    required
                                                    value={editFormData.location}
                                                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                                    placeholder="Location"
                                                />
                                            </div>
                                            <div>
                                                <Label>Website</Label>
                                                <Input
                                                    type="url"
                                                    required
                                                    value={editFormData.website}
                                                    onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                                                    placeholder="https://example.com"
                                                />
                                            </div>
                                            <div>
                                                <Label>Established Year</Label>
                                                <Input
                                                    type="number"
                                                    required
                                                    value={editFormData.established_year}
                                                    onChange={(e) => setEditFormData({ ...editFormData, established_year: e.target.value })}
                                                    placeholder="e.g. 1958"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <textarea
                                                className="w-full min-h-[150px] p-3 text-sm border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                                required
                                                value={editFormData.description}
                                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                                placeholder="Tell us about the college..."
                                            />
                                        </div>

                                        {/* Vision */}
                                        <div>
                                            <Label>Vision Statement</Label>
                                            <textarea
                                                className="w-full min-h-[100px] p-3 text-sm border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={editFormData.vision}
                                                onChange={(e) => setEditFormData({ ...editFormData, vision: e.target.value })}
                                                placeholder="Enter the college's vision statement..."
                                            />
                                        </div>

                                        {/* Mission */}
                                        <div>
                                            <Label>Mission Statement</Label>
                                            <textarea
                                                className="w-full min-h-[100px] p-3 text-sm border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={editFormData.mission}
                                                onChange={(e) => setEditFormData({ ...editFormData, mission: e.target.value })}
                                                placeholder="Enter the college's mission statement..."
                                            />
                                        </div>
                                        
                                        {/* Facilities Section in Edit Form */}
                                        <Button type="submit" className="w-full">Save Changes</Button>
                                    </form>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">College Name</label>
                                                <p className="text-gray-900">{college.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Location</label>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <p className="text-gray-900">{college.location}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Website</label>
                                                <a href={college.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline block truncate">
                                                    {college.website}
                                                </a>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Established</label>
                                                <p className="text-gray-900">{college.established_year}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Description</label>
                                            <p className="text-gray-700 mt-1">{college.description}</p>
                                        </div>
                                        {(college.vision || college.mission) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                    <label className="text-sm font-medium text-blue-700">Vision</label>
                                                    <p className="text-gray-700 mt-1 italic">{college.vision || <span className="text-gray-400">Not added yet</span>}</p>
                                                </div>
                                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                    <label className="text-sm font-medium text-green-700">Mission</label>
                                                    <p className="text-gray-700 mt-1 italic">{college.mission || <span className="text-gray-400">Not added yet</span>}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="facilities">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Campus Facilities</CardTitle>
                                <Button variant="outline" size="sm" onClick={() => setIsEditingFacilities(!isEditingFacilities)}>
                                    {isEditingFacilities ? "Cancel Edit" : "Edit Facilities"}
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditingFacilities ? (
                                    <form onSubmit={handleUpdateCollegeFacilities} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        id="hostel_available"
                                                        checked={editFormData.hostel_available}
                                                        onChange={(e) => setEditFormData({ ...editFormData, hostel_available: e.target.checked })}
                                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <Label htmlFor="hostel_available" className="text-base cursor-pointer">Hostel Facility Available</Label>
                                                </div>
                                                {editFormData.hostel_available && (
                                                    <div className="ml-6 mt-3">
                                                        <Label className="text-sm text-gray-500">Hostel Fees</Label>
                                                        <Input
                                                            className="mt-1"
                                                            value={editFormData.hostel_fees}
                                                            onChange={(e) => setEditFormData({ ...editFormData, hostel_fees: e.target.value })}
                                                            placeholder="e.g. ₹50,000/year"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        id="bus_available"
                                                        checked={editFormData.bus_available}
                                                        onChange={(e) => setEditFormData({ ...editFormData, bus_available: e.target.checked })}
                                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <Label htmlFor="bus_available" className="text-base cursor-pointer">Bus Facility Available</Label>
                                                </div>
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full">Save Changes</Button>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-lg border flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${college.hostel_available ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <Building className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Hostel Facility</h3>
                                                <p className={`mt-1 font-medium ${college.hostel_available ? "text-green-600" : "text-gray-500"}`}>
                                                    {college.hostel_available ? "✓ Available" : "✗ Not Available"}
                                                </p>
                                                {college.hostel_available && college.hostel_fees && (
                                                    <p className="text-sm text-gray-600 mt-2"><strong>Fees:</strong> {college.hostel_fees}</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white p-6 rounded-lg border flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${college.bus_available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {/* Reusing MapPin for bus temporarily, could be a Bus icon if imported */}
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Bus Facility</h3>
                                                <p className={`mt-1 font-medium ${college.bus_available ? "text-green-600" : "text-gray-500"}`}>
                                                    {college.bus_available ? "✓ Available" : "✗ Not Available"}
                                                </p>
                                                {college.bus_available && (
                                                    <p className="text-sm text-gray-600 mt-2"><strong>Note:</strong> Bus fees depends on route</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="cutoffs">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Admission Cutoffs</CardTitle>
                                <Button size="sm" onClick={() => { setShowCutoffForm(!showCutoffForm); setIsEditingCutoff(null); setCutoffFormData({ course: '', year: new Date().getFullYear(), caste: 'General', score: '' }); }}>
                                    {showCutoffForm ? "Cancel" : "Add Cutoff"}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {showCutoffForm && (
                                    <div className="bg-gray-50 p-6 rounded-lg border mb-8">
                                        <h4 className="font-semibold text-gray-900 mb-4">{isEditingCutoff ? "Edit Cutoff" : "Add New Cutoff"}</h4>
                                        <form onSubmit={handleSaveCutoff} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Course Name</Label>
                                                    <Input required value={cutoffFormData.course} onChange={(e) => setCutoffFormData({ ...cutoffFormData, course: e.target.value })} placeholder="e.g. B.Tech Computer Engineering" />
                                                </div>
                                                <div>
                                                    <Label>Year</Label>
                                                    <select required className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent" value={cutoffFormData.year} onChange={(e) => setCutoffFormData({ ...cutoffFormData, year: parseInt(e.target.value) })}>
                                                        {[0, 1, 2].map(offset => {
                                                            const yearOption = new Date().getFullYear() - offset;
                                                            return <option key={yearOption} value={yearOption}>{yearOption}</option>;
                                                        })}
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label>Caste / Category</Label>
                                                    <select required className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent" value={cutoffFormData.caste} onChange={(e) => setCutoffFormData({ ...cutoffFormData, caste: e.target.value })}>
                                                        <option value="General">General</option>
                                                        <option value="OBC">OBC</option>
                                                        <option value="SC">SC</option>
                                                        <option value="ST">ST</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label>Cutoff Score / Percentile</Label>
                                                    <Input required value={cutoffFormData.score} onChange={(e) => setCutoffFormData({ ...cutoffFormData, score: e.target.value })} placeholder="e.g. 98.5" />
                                                </div>
                                            </div>
                                            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Cutoff"}</Button>
                                        </form>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 text-gray-700">
                                                <th className="p-3 text-left border">Course</th>
                                                <th className="p-3 text-center border">Year</th>
                                                <th className="p-3 text-center border">Caste</th>
                                                <th className="p-3 text-center border">Cutoff Score</th>
                                                <th className="p-3 text-center border">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cutoffs.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="p-6 text-center text-gray-500">No cutoff data available.</td>
                                                </tr>
                                            ) : (
                                                cutoffs.sort((a,b) => b.year - a.year).map(cutoff => (
                                                    <tr key={cutoff.id} className="border-b">
                                                        <td className="p-3 border text-gray-800">{cutoff.course}</td>
                                                        <td className="p-3 border text-center text-gray-600">{cutoff.year}</td>
                                                        <td className="p-3 border text-center font-semibold text-blue-600">{cutoff.caste}</td>
                                                        <td className="p-3 border text-center text-gray-800">{cutoff.score}</td>
                                                        <td className="p-3 border text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <Button variant="outline" size="sm" onClick={() => handleEditCutoffInit(cutoff)}>Edit</Button>
                                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCutoff(cutoff.id)}>Delete</Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="gallery">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Image className="w-5 h-5 text-blue-600" />
                                    Gallery Management
                                </CardTitle>
                                <CardDescription>Upload photos and videos for students to see on your college profile.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Upload Section */}
                                <div className="bg-gray-50 p-6 rounded-lg border mb-8">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Upload New Media
                                    </h4>
                                    <div className="flex flex-wrap items-end gap-4">
                                        <div>
                                            <Label className="mb-1 block">Category</Label>
                                            <select
                                                value={galleryCategory}
                                                onChange={(e) => setGalleryCategory(e.target.value)}
                                                className="h-10 px-3 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                {GALLERY_CATEGORIES.map(cat => (
                                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="mb-1 block">Photo or Video</Label>
                                            <label className="inline-flex items-center gap-2 h-10 px-4 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors text-sm">
                                                <Upload className="w-4 h-4" />
                                                {galleryUploading ? "Uploading..." : "Choose File"}
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    className="hidden"
                                                    disabled={galleryUploading}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;
                                                        try {
                                                            setGalleryUploading(true);
                                                            const formData = new FormData();
                                                            formData.append('file', file);
                                                            formData.append('college', college.id);
                                                            formData.append('category', galleryCategory);
                                                            formData.append('title', file.name.split('.')[0]);
                                                            const newMedia = await galleryService.upload(formData);
                                                            setGalleryMedia(prev => [newMedia, ...prev]);
                                                            alert("Media uploaded successfully!");
                                                        } catch (error) {
                                                            console.error("Upload failed", error);
                                                            alert("Failed to upload. Please try again.");
                                                        } finally {
                                                            setGalleryUploading(false);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery Grid */}
                                {galleryMedia.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No media uploaded yet.</p>
                                        <p className="text-sm mt-1">Upload photos and videos to showcase your college.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {galleryMedia.map((item) => (
                                            <div key={item.id} className="relative group rounded-lg overflow-hidden border shadow-sm">
                                                {item.media_type === 'video' ? (
                                                    <video
                                                        src={item.file_url || item.file}
                                                        className="w-full h-48 object-cover"
                                                        muted
                                                        preload="metadata"
                                                    />
                                                ) : (
                                                    <img
                                                        src={item.file_url || item.file}
                                                        alt={item.title || item.category}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                )}
                                                <div className="absolute top-2 left-2">
                                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                        {GALLERY_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                                                    </span>
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                    {item.media_type === 'video' ? (
                                                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                            <Video className="w-3 h-3" /> Video
                                                        </span>
                                                    ) : (
                                                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                            <Image className="w-3 h-3" /> Photo
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-3 flex items-center justify-between bg-white">
                                                    <span className="text-sm text-gray-700 truncate">{item.title || 'Untitled'}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                                        onClick={async () => {
                                                            if (confirm("Delete this media?")) {
                                                                try {
                                                                    await galleryService.delete(item.id);
                                                                    setGalleryMedia(prev => prev.filter(m => m.id !== item.id));
                                                                } catch (error) {
                                                                    console.error("Delete failed", error);
                                                                    alert("Failed to delete.");
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

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
                        <Button variant="destructive" onClick={() => { setIsLogoutDialogOpen(false); onLogout(); }}>
                            Yes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Account Settings Dialog */}
            <Dialog open={isAccountSettingsOpen} onOpenChange={setIsAccountSettingsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Settings className="w-5 h-5 text-blue-600" />
                            Account Settings
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                        {/* User Info */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{user.username}</p>
                                    <p className="text-sm text-gray-500">College Admin</p>
                                </div>
                            </div>
                        </div>

                        {/* Change Password Option */}
                        <button
                            className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors text-left group"
                            onClick={() => {
                                setIsAccountSettingsOpen(false);
                                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                setPasswordError('');
                                setPasswordSuccess('');
                                setIsChangePasswordOpen(true);
                            }}
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <KeyRound className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Change Password</p>
                                <p className="text-sm text-gray-500">Update your account password</p>
                            </div>
                        </button>

                        {/* Delete College Profile Option */}
                        <button
                            className="w-full flex items-center gap-4 p-4 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-left group"
                            onClick={() => {
                                setIsAccountSettingsOpen(false);
                                setIsDeleteConfirmOpen(true);
                            }}
                        >
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="font-medium text-red-700">Delete College Profile</p>
                                <p className="text-sm text-red-400">Permanently remove all college data</p>
                            </div>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-blue-600" />
                            Change Password
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        className="space-y-4 mt-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setPasswordError('');
                            setPasswordSuccess('');

                            if (passwordData.newPassword !== passwordData.confirmPassword) {
                                setPasswordError('New passwords do not match.');
                                return;
                            }
                            if (passwordData.newPassword.length < 6) {
                                setPasswordError('New password must be at least 6 characters.');
                                return;
                            }

                            try {
                                setPasswordLoading(true);
                                const result = await authService.changePassword(passwordData.oldPassword, passwordData.newPassword);
                                // Update the token in localStorage
                                if (result.token) {
                                    localStorage.setItem('token', result.token);
                                }
                                setPasswordSuccess('Password changed successfully!');
                                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                setTimeout(() => setIsChangePasswordOpen(false), 1500);
                            } catch (error) {
                                setPasswordError(error.response?.data?.error || 'Failed to change password. Please try again.');
                            } finally {
                                setPasswordLoading(false);
                            }
                        }}
                    >
                        <div>
                            <Label>Current Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    type={showOldPassword ? 'text' : 'password'}
                                    required
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowOldPassword(!showOldPassword)}>
                                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <Label>New Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    type={showNewPassword ? 'text' : 'password'}
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                required
                                className="mt-1"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                            />
                        </div>

                        {passwordError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
                                ✓ {passwordSuccess}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={passwordLoading}>
                                {passwordLoading ? 'Changing...' : 'Change Password'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete College Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg flex items-center gap-2 text-red-700">
                            <AlertTriangle className="w-5 h-5" />
                            Delete College Profile
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <p className="text-red-800 font-medium mb-2">This action cannot be undone!</p>
                            <p className="text-red-600 text-sm">
                                Deleting the college profile will permanently remove:
                            </p>
                            <ul className="text-red-600 text-sm mt-2 ml-4 list-disc space-y-1">
                                <li>All college details and description</li>
                                <li>All courses and branches</li>
                                <li>All cutoff data</li>
                                <li>All gallery photos and videos</li>
                                <li>All student reviews</li>
                                <li>All placement information</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 text-sm font-medium">
                            Are you sure you want to delete <strong>{college?.name}</strong>?
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} disabled={deleteLoading}>
                                No, Keep It
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={deleteLoading}
                                onClick={async () => {
                                    try {
                                        setDeleteLoading(true);
                                        await collegeService.delete(college.id);
                                        // Clear college_id from local user data
                                        const updatedUser = { ...user, college_id: null };
                                        localStorage.setItem('user', JSON.stringify(updatedUser));
                                        setIsDeleteConfirmOpen(false);
                                        alert('College profile has been permanently deleted.');
                                        window.location.reload();
                                    } catch (error) {
                                        console.error('Failed to delete college', error);
                                        alert('Failed to delete college profile. Please try again.');
                                    } finally {
                                        setDeleteLoading(false);
                                    }
                                }}
                            >
                                {deleteLoading ? 'Deleting...' : 'Yes, Delete Everything'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
