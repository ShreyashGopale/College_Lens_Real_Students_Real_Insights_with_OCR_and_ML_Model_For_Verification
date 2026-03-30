import { Star, MapPin, ArrowLeft, Home, Wifi, Book, Trophy, ThumbsUp, ThumbsDown, MessageCircle, User, Image as ImageIcon, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { collegeService, galleryService, reviewService } from "../services/api";
import { StudentRegisterModal } from "./StudentRegisterModal";
import { LoginDialog } from "./auth/LoginDialog";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

export function CollegeDetail({ collegeId, onBack, user, onLogin }) {
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [expandedComments, setExpandedComments] = useState({});
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [galleryData, setGalleryData] = useState([]);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCollegeDetail = async () => {
      try {
        const data = await collegeService.getDetail(collegeId);

        // Transform API data to match component structure
        const transformed = {
          id: data.id,
          name: data.name.substring(0, 4), // Approximation for short name
          fullName: data.name,
          location: data.location,
          rating: data.average_rating || 0,
          yearEstablished: data.established_year,
          address: data.location, // Approximate
          collegeFees: data.courses && data.courses.length > 0 ? `₹${data.courses[0].fee}` : "Contact for fees",

          // Adapting arrays
          coursesOffered: data.courses ? data.courses.map(c => c.name) : [],
          facilities: data.facilities ? data.facilities.map(f => ({ ...f, available: true })) : [],
          images: data.image ? [data.image] : ["https://images.unsplash.com/photo-1562774053-701939374585?w=1200"],

          // Reviews from API
          reviews: data.reviews ? data.reviews.map(r => ({
            id: r.id,
            studentName: r.user.username,
            isAnonymous: false, // API doesn't have this yet, assume false
            rating: r.rating,
            date: new Date(r.created_at).toLocaleDateString(),
            reviewText: r.text,
            likes: 0,
            dislikes: 0,
            comments: r.comments ? r.comments.length : 0
          })) : [],

          // Placeholders for missing data
          vision: data.description || "Vision statement not available.",
          mission: "Mission statement not available.",
          hostelAvailable: false,
          busAvailable: false,
          cutoffs: [],
          placements: []
        };
        setCollege(transformed);
      } catch (error) {
        console.error("Failed to fetch college detail", error);
      } finally {
        setLoading(false);
      }
    };

    if (collegeId) {
      fetchCollegeDetail();
    }
  }, [collegeId]);

  // Fetch gallery data
  useEffect(() => {
    const fetchGallery = async () => {
      if (!collegeId) return;
      try {
        const data = await galleryService.getByCollege(collegeId);
        setGalleryData(data);
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      }
    };
    fetchGallery();
  }, [collegeId]);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewCourse, setReviewCourse] = useState("");
  const [isAnonymousReview, setIsAnonymousReview] = useState(false);

  // Check if user is logged in and registered for THIS specific college
  const isLoggedIn = !!user;
  const currentUserName = user?.username || "Student";
  const isRegisteredForThisCollege = isLoggedIn && String(user?.college_id) === String(college?.id);

  // Mock comments data for reviews
  const mockComments = {
    1: [
      { id: 1, userName: "Mohit Singh", isAnonymous: false, date: "Oct 16, 2024", text: "I completely agree! The faculty here is exceptional and really cares about student success.", sentiment: 'positive' },
      { id: 2, userName: "Anonymous", isAnonymous: true, date: "Oct 17, 2024", text: "While I agree the faculty is good, I feel the course material could be updated more frequently.", sentiment: 'negative' },
      { id: 3, userName: "Sneha Patel", isAnonymous: false, date: "Oct 18, 2024", text: "Great review! The peer learning aspect is what sets this college apart.", sentiment: 'positive' }
    ],
    2: [
      { id: 1, userName: "Rahul Kumar", isAnonymous: false, date: "Sep 29, 2024", text: "Thanks for the honest review. The fees are indeed high but worth it for the experience.", sentiment: 'neutral' },
      { id: 2, userName: "Anonymous", isAnonymous: true, date: "Sep 30, 2024", text: "I disagree about the workload being overwhelming. It's challenging but manageable with proper time management.", sentiment: 'negative' },
      { id: 3, userName: "Priyanka Joshi", isAnonymous: false, date: "Oct 1, 2024", text: "The facilities mentioned are indeed top-notch. The library is my favorite spot on campus!", sentiment: 'positive' }
    ],
    3: [
      { id: 1, userName: "Anonymous", isAnonymous: true, date: "Aug 11, 2024", text: "Could you share more about the research opportunities available?", sentiment: 'neutral' },
      { id: 2, userName: "Arvind Sharma", isAnonymous: false, date: "Aug 12, 2024", text: "Excellent insights! The research ecosystem here is truly world-class.", sentiment: 'positive' }
    ],
    4: [
      { id: 1, userName: "Kavya Reddy", isAnonymous: false, date: "Jul 23, 2024", text: "I wish there were more international exchange opportunities too. That's one area for improvement.", sentiment: 'negative' },
      { id: 2, userName: "Anonymous", isAnonymous: true, date: "Jul 24, 2024", text: "The clubs and activities really make campus life vibrant. Great point!", sentiment: 'positive' },
      { id: 3, userName: "Nikhil Verma", isAnonymous: false, date: "Jul 25, 2024", text: "The competition is indeed healthy. It pushes you to be your best.", sentiment: 'positive' }
    ],
    5: [
      { id: 1, userName: "Deepak Gupta", isAnonymous: false, date: "Jun 6, 2024", text: "The Executive MBA program sounds intense! How did you manage work-life balance?", sentiment: 'neutral' },
      { id: 2, userName: "Anonymous", isAnonymous: true, date: "Jun 7, 2024", text: "I heard the placement support is exceptional. Thanks for confirming!", sentiment: 'positive' }
    ]
  };

  const toggleComments = (reviewId) => {
    setExpandedComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Gallery images
  const galleryImages = [
    { id: 1, category: "Classroom", url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2xhc3Nyb29tJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzYyOTg3NTUwfDA&ixlib=rb-4.1.0&q=80&w=1080", title: "Modern Classroom" },
    { id: 2, category: "Campus", url: "https://images.unsplash.com/photo-1631599143424-5bc234fbebf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYzMDA3NzczfDA&ixlib=rb-4.1.0&q=80&w=1080", title: "Campus View" },
    { id: 3, category: "Hostel", url: "https://images.unsplash.com/photo-1725779333925-1df900a8e1bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwaG9zdGVsJTIwcm9vbXxlbnwxfHx8fDE3NjMwMTY2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080", title: "Hostel Room" },
    { id: 4, category: "Canteen", url: "https://images.unsplash.com/photo-1685879226944-30c32b186aa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FmZXRlcmlhJTIwY2FudGVlbnxlbnwxfHx8fDE3NjMwMTY2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080", title: "College Cafeteria" },
    { id: 5, category: "Seminar Hall", url: "https://images.unsplash.com/photo-1758413350815-7b06dbbfb9a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW1pbmFyJTIwaGFsbCUyMGF1ZGl0b3JpdW18ZW58MXx8fHwxNzYzMDE2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080", title: "Seminar Hall" },
    { id: 6, category: "Ground", url: "https://images.unsplash.com/photo-1639586827570-e1a3268aecaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3BvcnRzJTIwZ3JvdW5kfGVufDF8fHx8MTc2MzAxNjYzMXww&ixlib=rb-4.1.0&q=80&w=1080", title: "Sports Ground" },
    { id: 7, category: "Library", url: "https://images.unsplash.com/photo-1501503069356-3c6b82a17d89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbGlicmFyeXxlbnwxfHx8fDE3NjMwMDA1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080", title: "College Library" },
    { id: 8, category: "Laboratory", url: "https://images.unsplash.com/photo-1562411403-f583472c8e87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwbGFib3JhdG9yeXxlbnwxfHx8fDE3NjMwMDcyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080", title: "Science Laboratory" }
  ];

  const GALLERY_CATEGORIES = [
    { value: 'all', label: 'All' },
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

  const filteredGallery = galleryFilter === 'all'
    ? galleryData
    : galleryData.filter(item => item.category === galleryFilter);

  // Filter static fallback images by category too
  const filteredStaticImages = galleryFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category.toLowerCase().replace(/\s+/g, '_') === galleryFilter);

  if (loading || !college) {
    return <div className="min-h-screen flex items-center justify-center">Loading college details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image and College Info Card */}
      <div className="relative h-[450px]">
        {/* Background Image Carousel */}
        <Carousel className="w-full h-full">
          <CarouselContent>
            {college.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[450px]">
                  <ImageWithFallback
                    src={image}
                    alt={`${college.fullName} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button variant="secondary" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* College Info Card Overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-6 pb-6">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Left Section - Logo and Details */}
                  <div className="flex gap-4 flex-1">
                    {/* College Logo */}
                    <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-blue-200">
                      <span className="text-2xl text-blue-900">{college.name.substring(0, 2)}</span>
                    </div>

                    {/* College Details */}
                    <div className="flex-1">
                      <h1 className="text-2xl text-gray-900 mb-2">
                        {college.fullName}
                      </h1>

                      <div className="flex items-center gap-4 flex-wrap mb-3">
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          {college.location}
                        </div>
                        <Badge variant="outline" className="text-xs">Estd {college.yearEstablished}</Badge>
                        {college.type && <Badge variant="outline" className="text-xs">{college.type}</Badge>}
                        {college.accreditation?.map((acc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{acc}</Badge>
                        ))}
                        {college.naacGrade && (
                          <Badge variant="outline" className="text-xs">NAAC Grade {college.naacGrade}</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Rating & Action */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Rating */}
                    <div className="flex flex-col items-center gap-2 bg-blue-50 p-4 rounded-lg w-full">
                      <div className="text-4xl text-blue-600">
                        {college.rating}/5
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(college.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">Based on reviews</span>
                    </div>

                    {/* Action Button */}
                    {isRegisteredForThisCollege ? (
                      <Button
                        onClick={() => {
                          setActiveTab("reviews");
                          setIsWriteReviewOpen(true);
                        }}
                        className="bg-yellow-400 text-black hover:bg-yellow-500 gap-2 w-full"
                      >
                        <Plus className="w-4 h-4" />
                        Write Review
                      </Button>
                    ) : !isLoggedIn ? (
                      <div className="w-full flex flex-col gap-2">
                        <Button 
                          onClick={() => setShowRegisterModal(true)}
                          className="bg-blue-600 text-white hover:bg-blue-700 w-full"
                        >
                          Create Student Account
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                          Already a student here? <button onClick={() => setIsLoginDialogOpen(true)} className="text-blue-600 hover:underline">Login</button>
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation Tabs and Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Navigation Tabs */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-6">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none border-b-0">
              <TabsTrigger
                value="info"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Info
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Courses & Fees
              </TabsTrigger>
              <TabsTrigger
                value="facility"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Facility
              </TabsTrigger>
              <TabsTrigger
                value="placements"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Placements & Cutoff
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Gallery
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl text-gray-900">{college.fullName}</h2>
              <span className="text-blue-600">›</span>
              <span className="text-gray-600">Details</span>
            </div>

            <TabsContent value="info" className="mt-0">
              <Card className="mb-6">
                <CardContent className="p-8">
                  {/* Vision */}
                  <div className="mb-8">
                    <h3 className="text-2xl text-blue-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Vision
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg italic border-l-4 border-blue-200 pl-6 py-2 bg-blue-50/50">
                      {college.vision}
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="mb-8">
                    <h3 className="text-2xl text-blue-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Mission
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg italic border-l-4 border-blue-200 pl-6 py-2 bg-blue-50/50">
                      {college.mission}
                    </p>
                  </div>

                  {/* Year of Establishment */}
                  <div className="mb-8">
                    <h3 className="text-2xl text-blue-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Year of Establishment
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-600">
                      <p className="text-4xl text-blue-900">{college.yearEstablished}</p>
                      <p className="text-gray-600 mt-2">
                        Over {new Date().getFullYear() - college.yearEstablished} years of excellence in education
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-2xl text-blue-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Address
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 text-lg">{college.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="mt-0">
              <Card className="mb-6">
                <CardContent className="p-8">
                  {/* Courses Offered */}
                  <div className="mb-8">
                    <h3 className="text-2xl text-blue-900 mb-6 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Courses Offered
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {college.coursesOffered.map((course, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100 hover:bg-blue-100/50 transition-colors">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm">{index + 1}</span>
                          </div>
                          <span className="text-gray-700 text-lg leading-relaxed">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* College Fees */}
                  <div>
                    <h3 className="text-2xl text-blue-900 mb-6 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      College Fees
                    </h3>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-lg text-white">
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl">{college.collegeFees}</span>
                      </div>
                      <p className="text-blue-100 mt-3">
                        <span className="opacity-80">Please note:</span> Fees may vary by course and year.
                        Contact the admission office for detailed fee structure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facility" className="mt-0">
              <Card className="mb-6">
                <CardContent className="p-8">
                  <h3 className="text-2xl text-blue-900 mb-6 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    Available Facilities
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hostel Facility */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-600">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Home className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl text-blue-900">Hostel Facility</h4>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="text-blue-900">Available:</span>
                          <span className={`ml-2 ${college.hostelAvailable ? "text-green-600" : "text-red-600"}`}>
                            {college.hostelAvailable ? "Yes" : "No"}
                          </span>
                        </p>
                        {college.hostelAvailable && college.hostelFees && (
                          <p className="text-gray-700">
                            <span className="text-blue-900">Fees:</span>
                            <span className="ml-2 text-gray-900">{college.hostelFees}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bus Facility */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-600">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <h4 className="text-xl text-green-900">Bus Facility</h4>
                      </div>
                      <p className="text-gray-700">
                        <span className="text-green-900">Available:</span>
                        <span className={`ml-2 ${college.busAvailable ? "text-green-600" : "text-red-600"}`}>
                          {college.busAvailable ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>

                    {/* Additional Facilities */}
                    {college.facilities && college.facilities.map((facility, index) => (
                      <div key={index} className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-600">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                            {facility.name.toLowerCase().includes('library') ? (
                              <Book className="w-6 h-6 text-white" />
                            ) : facility.name.toLowerCase().includes('wifi') || facility.name.toLowerCase().includes('internet') ? (
                              <Wifi className="w-6 h-6 text-white" />
                            ) : facility.name.toLowerCase().includes('sports') ? (
                              <Trophy className="w-6 h-6 text-white" />
                            ) : (
                              <Star className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <h4 className="text-xl text-purple-900">{facility.name}</h4>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            <span className="text-purple-900">Available:</span>
                            <span className={`ml-2 ${facility.available ? "text-green-600" : "text-red-600"}`}>
                              {facility.available ? "Yes" : "No"}
                            </span>
                          </p>
                          {facility.description && (
                            <p className="text-gray-600 text-sm mt-2">{facility.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="placements" className="mt-0">
              <div className="space-y-6">
                {/* Cutoff Section */}
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl text-blue-900 mb-6 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Admission Cutoff (Last 3 Years)
                    </h3>

                    {college.cutoffs && college.cutoffs.length > 0 ? (
                      <div className="space-y-6">
                        {/* Group cutoffs by course */}
                        {Array.from(new Set(college.cutoffs.map(c => c.course))).map(courseName => {
                          const courseCutoffs = college.cutoffs?.filter(c => c.course === courseName) || [];
                          return (
                            <div key={courseName} className="border-l-4 border-blue-600 pl-6 py-2">
                              <h4 className="text-xl text-blue-900 mb-4">{courseName}</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-blue-600 text-white">
                                      <th className="p-3 text-left">Year</th>
                                      <th className="p-3 text-center">General</th>
                                      <th className="p-3 text-center">OBC</th>
                                      <th className="p-3 text-center">SC</th>
                                      <th className="p-3 text-center">ST</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[...courseCutoffs].sort((a, b) => b.year - a.year).map((cutoff, index) => (
                                      <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                                        <td className="p-3 text-blue-900">{cutoff.year}</td>
                                        <td className="p-3 text-center text-gray-700">{cutoff.general}</td>
                                        <td className="p-3 text-center text-gray-700">{cutoff.obc}</td>
                                        <td className="p-3 text-center text-gray-700">{cutoff.sc}</td>
                                        <td className="p-3 text-center text-gray-700">{cutoff.st}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Cutoff data not available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Placement Section */}
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl text-blue-900 mb-6 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Placement Statistics (Last 3 Years)
                    </h3>

                    {college.placements && college.placements.length > 0 ? (
                      <div className="space-y-8">
                        {/* Placement Rate Chart */}
                        <div>
                          <h4 className="text-lg text-gray-700 mb-4">Placement Rate Trend</h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={[...college.placements].sort((a, b) => a.year - b.year)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="placementRate"
                                stroke="#2563eb"
                                strokeWidth={3}
                                name="Placement Rate (%)"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Package Comparison Chart */}
                        <div>
                          <h4 className="text-lg text-gray-700 mb-4">Package Comparison (in LPA)</h4>
                          <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={[...college.placements].sort((a, b) => a.year - b.year)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="averagePackage" fill="#3b82f6" name="Average Package" />
                              <Bar dataKey="highestPackage" fill="#10b981" name="Highest Package" />
                              <Bar dataKey="medianPackage" fill="#f59e0b" name="Median Package" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Placement Summary Table */}
                        <div>
                          <h4 className="text-lg text-gray-700 mb-4">Detailed Placement Data</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-blue-600 text-white">
                                  <th className="p-3 text-left">Year</th>
                                  <th className="p-3 text-center">Placement Rate</th>
                                  <th className="p-3 text-center">Average Package</th>
                                  <th className="p-3 text-center">Highest Package</th>
                                  <th className="p-3 text-center">Median Package</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[...college.placements].sort((a, b) => b.year - a.year).map((placement, index) => (
                                  <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                                    <td className="p-3 text-blue-900">{placement.year}</td>
                                    <td className="p-3 text-center text-gray-700">{placement.placementRate}%</td>
                                    <td className="p-3 text-center text-gray-700">₹{placement.averagePackage} LPA</td>
                                    <td className="p-3 text-center text-green-600">₹{placement.highestPackage} LPA</td>
                                    <td className="p-3 text-center text-gray-700">₹{placement.medianPackage} LPA</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Placement data not available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl text-blue-900 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      Student Reviews
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl">{college.rating}/5</span>
                        <span className="text-sm">({college.reviews?.length || 0} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Write Review Button - Only for registered students */}
                  {isRegisteredForThisCollege ? (
                    <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-blue-900 mb-1">Share Your Experience</h4>
                          <p className="text-sm text-gray-600">
                            As a registered student of {college.name}, you can write a review
                          </p>
                        </div>
                        <Button
                          onClick={() => setIsWriteReviewOpen(true)}
                          className="bg-yellow-400 text-black hover:bg-yellow-500 gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Write Review
                        </Button>
                      </div>
                    </div>
                  ) : !isLoggedIn ? (
                    <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-gray-900 mb-1">Verify Your Student Status</h4>
                          <p className="text-sm text-gray-600">
                            Create a student account for {college.name} to write reviews and unlock features.
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button
                            onClick={() => setShowRegisterModal(true)}
                            className="bg-blue-600 text-white hover:bg-blue-700 gap-2"
                          >
                            Create Student Account
                          </Button>
                          <p className="text-xs text-gray-500">
                            Already registered? <button onClick={() => setIsLoginDialogOpen(true)} className="text-blue-600 hover:underline">Login here</button>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {college.reviews && college.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {college.reviews.map((review) => (
                        <Card key={review.id} className="overflow-hidden border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            {/* Header Section */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div className="flex items-start gap-4 flex-1">
                                {/* Avatar */}
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-6 h-6 text-white" />
                                </div>

                                {/* Student Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-gray-900">
                                      {(review.isAnonymous || review.is_anonymous) ? "Anonymous Student" : (review.studentName || review.user?.username)}
                                    </h4>
                                    {!(review.isAnonymous || review.is_anonymous) && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        Verified Student
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    {review.course && (
                                      <span className="text-gray-700">{review.course}</span>
                                    )}
                                    <span>•</span>
                                    <span>{review.date}</span>
                                  </div>

                                  {/* Star Rating */}
                                  <div className="flex gap-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "fill-gray-300 text-gray-300"
                                          }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Like/Dislike Section */}
                              <div className="flex flex-col gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors group">
                                  <ThumbsUp className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                                  <span className="text-sm text-gray-700 group-hover:text-green-600">{review.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors group">
                                  <ThumbsDown className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                                  <span className="text-sm text-gray-700 group-hover:text-red-600">{review.dislikes}</span>
                                </button>
                              </div>
                            </div>

                            {/* Review Text */}
                            <div className="mb-4 pl-16">
                              <p className="text-gray-700 leading-relaxed">
                                {review.reviewText}
                              </p>
                            </div>

                            {/* Footer - Comments */}
                            <div className="pl-16">
                              <div className="pt-4 border-t">
                                <button
                                  onClick={() => toggleComments(review.id)}
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  {expandedComments[review.id] ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <MessageCircle className="w-4 h-4" />
                                  )}
                                  <span className="text-sm">
                                    {expandedComments[review.id]
                                      ? 'Hide comments'
                                      : review.comments > 0
                                        ? `View ${review.comments} ${review.comments === 1 ? 'comment' : 'comments'}`
                                        : 'Add a comment'
                                    }
                                  </span>
                                </button>
                              </div>

                              {/* Comments List */}
                              {expandedComments[review.id] && mockComments[review.id] && (
                                <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                                  {mockComments[review.id].map((comment) => (
                                    <div
                                      key={comment.id}
                                      className={`p-4 rounded-lg ${comment.sentiment === 'positive'
                                        ? 'bg-green-50 border border-green-100'
                                        : comment.sentiment === 'negative'
                                          ? 'bg-red-50 border border-red-100'
                                          : 'bg-gray-50 border border-gray-100'
                                        }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-gray-900 text-sm">
                                              {comment.userName}
                                            </span>
                                            <span className="text-xs text-gray-500">• {comment.date}</span>
                                          </div>
                                          <p className="text-gray-700 text-sm">{comment.text}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No reviews yet</p>
                      <p className="text-gray-400 text-sm mt-2">Be the first to review this college</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-0">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <ImageIcon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-2xl text-blue-900">College Gallery</h3>
                  </div>

                  {/* Category Filter Buttons */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {GALLERY_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setGalleryFilter(cat.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${galleryFilter === cat.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Gallery Grid */}
                  {filteredGallery.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGallery.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                          {item.media_type === 'video' ? (
                            <video
                              src={item.file_url || item.file}
                              className="w-full h-64 object-cover"
                              controls
                              preload="metadata"
                            />
                          ) : (
                            <img
                              src={item.file_url || item.file}
                              alt={item.title || item.category}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="text-white">{item.title || 'Untitled'}</p>
                              <p className="text-blue-200 text-sm">
                                {GALLERY_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                              </p>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-blue-600 text-white text-xs">
                              {GALLERY_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : galleryData.length === 0 ? (
                    filteredStaticImages.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaticImages.map((image) => (
                          <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                            <ImageWithFallback
                              src={image.url}
                              alt={image.title}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white">{image.title}</p>
                                <p className="text-blue-200 text-sm">{image.category}</p>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-blue-600 text-white text-xs">
                                {image.category}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No media found in this category.</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No media found in this category.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {/* Write Review Dialog */}
      <Dialog open={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Write a Review for {college.name}</DialogTitle>
            <DialogDescription>
              Share your honest experience to help prospective students make informed decisions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Rating */}
            <div>
              <label className="text-sm text-gray-700 mb-2 block">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= reviewRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                        }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-gray-600 self-center">
                  {reviewRating > 0 ? `${reviewRating}/5` : "Select rating"}
                </span>
              </div>
            </div>

            {/* Course */}
            <div>
              <label className="text-sm text-gray-700 mb-2 block">
                Course <span className="text-gray-400">(optional)</span>
              </label>
              <Input
                type="text"
                placeholder="e.g., B.Tech Computer Science"
                value={reviewCourse}
                onChange={(e) => setReviewCourse(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="text-sm text-gray-700 mb-2 block">
                Your Review <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Share your experience about academics, campus life, facilities, placements, etc..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full min-h-[150px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters ({reviewText.length}/50)
              </p>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymousReview}
                onChange={(e) => setIsAnonymousReview(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600"
              />
              <div>
                <label htmlFor="anonymous" className="text-sm text-gray-900 cursor-pointer">
                  Post anonymously
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Your identity will be hidden, but the review will still be marked as verified
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsWriteReviewOpen(false);
                  setReviewRating(0);
                  setReviewText("");
                  setReviewCourse("");
                  setIsAnonymousReview(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (reviewRating > 0 && reviewText.length >= 50) {
                    try {
                      await reviewService.create({
                        college: college.id,
                        rating: reviewRating,
                        text: reviewText,
                        is_anonymous: isAnonymousReview
                      });
                      
                      // Refresh reviews by refetching college details
                      const updatedData = await collegeService.getDetail(college.id);
                      setCollege(prev => ({
                        ...prev,
                        reviews: updatedData.reviews ? updatedData.reviews.map(r => ({
                          id: r.id,
                          studentName: r.user.username,
                          isAnonymous: r.is_anonymous || false,
                          rating: r.rating,
                          date: new Date(r.created_at).toLocaleDateString(),
                          reviewText: r.text,
                          likes: 0,
                          dislikes: 0,
                          comments: r.comments ? r.comments.length : 0
                        })) : []
                      }));

                      alert("Thank you! Your review has been submitted successfully.");
                      setIsWriteReviewOpen(false);
                      setReviewRating(0);
                      setReviewText("");
                      setReviewCourse("");
                      setIsAnonymousReview(false);
                    } catch (error) {
                      console.error("Error submitting review:", error);
                      alert(error.response?.data?.detail || "Failed to submit review. Try again later.");
                    }
                  } else {
                    alert("Please provide a rating and write at least 50 characters.");
                  }
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={reviewRating === 0 || reviewText.length < 50}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Student Register Modal */}
      <StudentRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        collegeId={college.id}
        collegeName={college.name}
        onSuccess={(data) => {
          // data should contain user and token
          if (onLogin && data) {
            onLogin(data);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            // Alert success
            alert(`Thanks for registering as a student at ${college.name}! You can now write a review.`);
          }
        }}
      />

      {/* Login Dialog Integration */}
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onLoginSuccess={(data) => {
          if (onLogin && data) {
             onLogin(data);
             setIsLoginDialogOpen(false);
          }
        }}
      />
    </div>
  );
}