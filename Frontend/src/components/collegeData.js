
export const collegesData = [
  {
    id: 1,
    name: "IIMA",
    fullName: "Indian Institute of Management Ahmedabad",
    location: "Ahmedabad, Gujarat",
    rating: 4.5,
    type: "Autonomous",
    accreditation: ["UGC", "AICTE"],
    naacGrade: "A++",
    images: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80"
    ],
    vision: "To be a global leader in management education and research, nurturing innovative and ethical leaders who shape the future of business and society.",
    mission: "To foster excellence in management education through rigorous academic programs, cutting-edge research, and industry collaboration, while developing socially responsible leaders.",
    coursesOffered: [
      "Post Graduate Programme in Management (PGP)",
      "Post Graduate Programme in Management for Executives (PGPX)",
      "Fellow Programme in Management (FPM)",
      "Executive Post Graduate Programme (ePGP)",
      "Armed Forces Programme (AFP)",
      "Faculty Development Programme (FDP)"
    ],
    hostelAvailable: true,
    hostelFees: "₹2.5 Lacs per year",
    collegeFees: "₹27.50 Lacs (Total Program Fees)",
    yearEstablished: 1961,
    address: "Vastrapur, Ahmedabad, Gujarat 380015, India",
    busAvailable: true,
    facilities: [
      { name: "Library & Digital Resources", available: true, description: "State-of-the-art library with over 100,000 books and e-journals" },
      { name: "Wi-Fi Campus", available: true, description: "High-speed internet connectivity across campus" },
      { name: "Sports Complex", available: true, description: "Indoor and outdoor sports facilities including gym, tennis, basketball courts" }
    ],
    cutoffs: [
      { course: "PGP", year: 2023, general: 99.5, obc: 98.5, sc: 95.0, st: 90.0 },
      { course: "PGP", year: 2022, general: 99.4, obc: 98.3, sc: 94.5, st: 89.5 },
      { course: "PGP", year: 2021, general: 99.3, obc: 98.0, sc: 94.0, st: 89.0 }
    ],
    placements: [
      { year: 2023, averagePackage: 32.79, highestPackage: 61.48, medianPackage: 30.50, placementRate: 100 },
      { year: 2022, averagePackage: 31.20, highestPackage: 58.00, medianPackage: 29.00, placementRate: 100 },
      { year: 2021, averagePackage: 28.50, highestPackage: 55.00, medianPackage: 27.00, placementRate: 100 }
    ],
    reviews: [
      {
        id: 1,
        studentName: "Rajesh Kumar",
        isAnonymous: false,
        rating: 5,
        date: "October 15, 2024",
        course: "PGP 2022-24 Batch",
        reviewText: "IIM Ahmedabad has been an incredible journey! The faculty is world-class, and the case-study method of teaching really helps in developing analytical and decision-making skills. The peer learning environment is unmatched, and you get to interact with some of the brightest minds in the country. Campus placements are excellent with top companies visiting for recruitment. The alumni network is very strong and helpful.",
        likes: 124,
        dislikes: 3,
        comments: 8
      },
      {
        id: 2,
        isAnonymous: true,
        rating: 4,
        date: "September 28, 2024",
        course: "PGP 2023-25 Batch",
        reviewText: "Great infrastructure and learning environment. The academic rigor is intense but rewarding. However, the fees are quite high, and the workload can be overwhelming at times. The campus facilities including hostel, library, and sports complex are top-notch. Overall, a transformative experience that prepares you well for corporate challenges.",
        likes: 89,
        dislikes: 12,
        comments: 15
      },
      {
        id: 3,
        studentName: "Priya Sharma",
        isAnonymous: false,
        rating: 5,
        date: "August 10, 2024",
        course: "FPM 2021-26 Batch",
        reviewText: "As a research scholar at IIMA, I've had access to exceptional resources and guidance. The faculty mentorship is outstanding, and the research ecosystem encourages innovation and critical thinking. The institute provides excellent support for publishing research papers and attending international conferences. Highly recommended for anyone pursuing an academic career in management.",
        likes: 67,
        dislikes: 1,
        comments: 5
      },
      {
        id: 4,
        isAnonymous: true,
        rating: 4,
        date: "July 22, 2024",
        reviewText: "The curriculum is well-structured and industry-relevant. Guest lectures from industry leaders and live projects provide great practical exposure. The competition is fierce but healthy. Campus life is vibrant with numerous clubs and activities. One area of improvement could be more focus on international exchange programs.",
        likes: 52,
        dislikes: 8,
        comments: 11
      },
      {
        id: 5,
        studentName: "Amit Patel",
        isAnonymous: false,
        rating: 5,
        date: "June 5, 2024",
        course: "PGPX 2023-24 Batch",
        reviewText: "The one-year Executive MBA program has been life-changing! The diverse cohort with experienced professionals from various industries enriches class discussions. The curriculum focuses on strategic thinking and leadership development. Despite being an intensive program, the learning experience is extraordinary. The career support and placement cell is very proactive.",
        likes: 98,
        dislikes: 4,
        comments: 6
      }
    ]
  },
  {
    id: 2,
    name: "IIT Bombay",
    fullName: "Indian Institute of Technology Bombay",
    location: "Powai, Maharashtra",
    rating: 4.4,
    type: "Autonomous",
    accreditation: ["AICTE", "UGC"],
    naacGrade: "A++",
    images: [
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&q=80",
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80",
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80"
    ],
    vision: "To be the fountainhead of new ideas and innovations in science and technology with a global vision, contributing to nation building through excellence in technical education and research.",
    mission: "To create an ambience for nurturing innovation, creativity and excellence in the field of science and technology, and to develop institute-industry partnerships to achieve our vision.",
    coursesOffered: [
      "B.Tech in Various Engineering Disciplines",
      "M.Tech in Computer Science, Mechanical, Electrical, Civil Engineering",
      "M.Sc. in Physics, Chemistry, Mathematics",
      "MBA (Master of Management)",
      "Ph.D. in Engineering and Sciences",
      "Dual Degree Programs (B.Tech + M.Tech)"
    ],
    hostelAvailable: true,
    hostelFees: "₹8,000 - ₹12,000 per semester",
    collegeFees: "₹2.16 Lacs per year (B.Tech)",
    yearEstablished: 1958,
    address: "Powai, Mumbai, Maharashtra 400076, India",
    busAvailable: true,
    facilities: [
      { name: "Central Library", available: true, description: "One of the largest technical libraries in India with 4 lakh+ volumes" },
      { name: "High-Speed Internet", available: true, description: "1 Gbps internet connectivity throughout campus" },
      { name: "Sports & Recreation", available: true, description: "Olympic-size swimming pool, cricket ground, basketball, tennis courts" },
      { name: "Medical Facilities", available: true, description: "24/7 medical center with qualified doctors and ambulance service" }
    ],
    cutoffs: [
      { course: "B.Tech (General)", year: 2023, general: 67, obc: 450, sc: 1200, st: 1800 },
      { course: "B.Tech (General)", year: 2022, general: 77, obc: 520, sc: 1350, st: 1950 },
      { course: "B.Tech (General)", year: 2021, general: 88, obc: 610, sc: 1500, st: 2100 }
    ],
    placements: [
      { year: 2023, averagePackage: 21.82, highestPackage: 3.67, medianPackage: 19.50, placementRate: 85 },
      { year: 2022, averagePackage: 19.45, highestPackage: 2.50, medianPackage: 17.20, placementRate: 83 },
      { year: 2021, averagePackage: 17.50, highestPackage: 1.80, medianPackage: 15.80, placementRate: 80 }
    ],
    reviews: [
      {
        id: 1,
        studentName: "Arjun Verma",
        isAnonymous: false,
        rating: 5,
        date: "November 2, 2024",
        course: "B.Tech Computer Science 2020-24",
        reviewText: "IIT Bombay offers an unparalleled education in engineering and technology. The faculty members are experts in their fields and the research facilities are world-class. The campus is beautiful with excellent infrastructure. The coding culture here is amazing, and you get opportunities to work on cutting-edge projects. Placements are outstanding with top tech companies offering dream packages.",
        likes: 156,
        dislikes: 5,
        comments: 12
      },
      {
        id: 2,
        isAnonymous: true,
        rating: 4,
        date: "October 18, 2024",
        course: "M.Tech Electrical Engineering",
        reviewText: "Great institute with excellent research opportunities. The labs are well-equipped and professors are approachable. However, the academic pressure is intense, and work-life balance can be challenging. The campus has everything you need - library, sports facilities, medical center. The peer group is highly talented and motivating.",
        likes: 78,
        dislikes: 15,
        comments: 9
      },
      {
        id: 3,
        studentName: "Neha Gupta",
        isAnonymous: false,
        rating: 5,
        date: "September 7, 2024",
        course: "Dual Degree Mechanical 2019-24",
        reviewText: "Five years at IIT Bombay have been the best years of my life! The dual degree program allowed me to explore both undergraduate and postgraduate studies deeply. The technical festivals like Techfest and cultural fest Mood Indigo are spectacular. The entrepreneurship cell provides great support for startups. Proud to be an IITian!",
        likes: 203,
        dislikes: 2,
        comments: 18
      },
      {
        id: 4,
        studentName: "Karan Singh",
        isAnonymous: false,
        rating: 4,
        date: "August 25, 2024",
        course: "MBA 2023-25",
        reviewText: "SJMSOM at IIT Bombay offers a unique blend of management and technology. The small batch size ensures personalized attention from faculty. Placements are good with opportunities in consulting, finance, and product management. The campus life and interaction with engineering students provides a different perspective on problem-solving.",
        likes: 91,
        dislikes: 7,
        comments: 14
      }
    ]
  },
  {
    id: 3,
    name: "Chandigarh University",
    fullName: "Chandigarh University",
    location: "Mohali, Punjab",
    rating: 4.4,
    type: "Private University",
    accreditation: ["NCTE", "AICTE"],
    naacGrade: "A+",
    images: [
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80"
    ],
    vision: "To be a globally recognized university that fosters academic excellence, research, and innovation, preparing students to lead and succeed in a dynamic world.",
    mission: "To provide world-class education with industry-oriented curriculum, state-of-the-art infrastructure, and excellent placement opportunities, nurturing holistic development of students.",
    coursesOffered: [
      "B.Tech in Computer Science, Mechanical, Civil, Electrical Engineering",
      "MBA in Marketing, Finance, HR, International Business",
      "BBA, BCA, B.Com",
      "M.Tech in Various Specializations",
      "Bachelor of Design (B.Des)",
      "Bachelor of Hotel Management (BHM)",
      "B.Sc. in Biotechnology, Agriculture",
      "Law Programs (BA LLB, BBA LLB)"
    ],
    hostelAvailable: true,
    hostelFees: "₹1.2 - ₹1.8 Lacs per year",
    collegeFees: "₹3.19 Lacs (First Year MBA)",
    yearEstablished: 2012,
    address: "NH-95 Chandigarh-Ludhiana Highway, Mohali, Punjab 140413, India",
    busAvailable: true,
    facilities: [
      { name: "Modern Library", available: true, description: "Digital and physical library with 50,000+ books" },
      { name: "Campus-Wide WiFi", available: true, description: "Free high-speed WiFi access across campus" },
      { name: "Sports Facilities", available: true, description: "Multi-sport complex with cricket, football, basketball, badminton courts" }
    ],
    cutoffs: [
      { course: "MBA", year: 2023, general: 650, obc: 550, sc: 450, st: 400 },
      { course: "MBA", year: 2022, general: 640, obc: 540, sc: 440, st: 390 },
      { course: "MBA", year: 2021, general: 630, obc: 530, sc: 430, st: 380 },
      { course: "B.Tech", year: 2023, general: 85, obc: 75, sc: 65, st: 55 },
      { course: "B.Tech", year: 2022, general: 82, obc: 72, sc: 62, st: 52 },
      { course: "B.Tech", year: 2021, general: 80, obc: 70, sc: 60, st: 50 }
    ],
    placements: [
      { year: 2023, averagePackage: 8.72, highestPackage: 54.75, medianPackage: 7.50, placementRate: 92 },
      { year: 2022, averagePackage: 7.89, highestPackage: 42.00, medianPackage: 6.80, placementRate: 89 },
      { year: 2021, averagePackage: 7.05, highestPackage: 35.00, medianPackage: 6.20, placementRate: 87 }
    ],
    reviews: [
      {
        id: 1,
        studentName: "Simran Kaur",
        isAnonymous: false,
        rating: 5,
        date: "October 28, 2024",
        course: "MBA Marketing 2022-24",
        reviewText: "Chandigarh University exceeded my expectations! The campus is huge and has state-of-the-art facilities. The faculty is experienced and industry-focused. What impressed me most was the placement support - multiple rounds of mock interviews and personality development sessions. Got placed in a top FMCG company with a great package. Highly recommend CU for MBA!",
        likes: 112,
        dislikes: 8,
        comments: 10
      },
      {
        id: 2,
        isAnonymous: true,
        rating: 4,
        date: "September 15, 2024",
        course: "B.Tech CSE 2021-25",
        reviewText: "Good college with excellent infrastructure and hostel facilities. The university has tie-ups with many international universities for exchange programs. Coding culture is growing, and placement cell is active. However, the batch size is quite large, so competition is high. Overall, a good value for money considering the facilities provided.",
        likes: 87,
        dislikes: 19,
        comments: 22
      },
      {
        id: 3,
        studentName: "Rahul Malhotra",
        isAnonymous: false,
        rating: 5,
        date: "August 30, 2024",
        course: "BBA 2020-23",
        reviewText: "The three years at CU were amazing! The university organizes various fests, workshops, and guest lectures throughout the year. The entrepreneurship cell helped me launch my startup during final year. Faculty members are supportive and encourage innovation. The campus is like a mini city with everything - banks, stores, food courts, gym. Loved every bit of it!",
        likes: 145,
        dislikes: 4,
        comments: 16
      },
      {
        id: 4,
        isAnonymous: true,
        rating: 4,
        date: "July 12, 2024",
        reviewText: "Modern infrastructure and good placement opportunities. The international collaborations provide exposure to global education standards. Sports facilities are excellent - cricket ground, football field, indoor stadium. Library has a vast collection of books and digital resources. WiFi connectivity is good across campus. Some improvement needed in food quality.",
        likes: 63,
        dislikes: 11,
        comments: 7
      },
      {
        id: 5,
        studentName: "Pooja Reddy",
        isAnonymous: false,
        rating: 4,
        date: "June 20, 2024",
        course: "B.Des Fashion Design",
        reviewText: "Great college for design students! The design labs are well-equipped with latest software and hardware. Faculty includes industry professionals who provide practical insights. Regular fashion shows and design exhibitions help build our portfolio. Internship opportunities with leading fashion brands. The creative environment really nurtures your talent.",
        likes: 76,
        dislikes: 3,
        comments: 9
      }
    ]
  },
  {
    id: 4,
    name: "SRCC",
    fullName: "Shri Ram College of Commerce",
    location: "New Delhi, Delhi NCR",
    rating: 4.3,
    type: "Government",
    accreditation: ["AICTE"],
    naacGrade: "A++",
    images: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80"
    ],
    vision: "To be the premier institution for commerce education in India, fostering critical thinking, ethical values, and professional excellence among students.",
    mission: "To provide quality education in commerce and economics, encouraging research, innovation, and entrepreneurship while developing well-rounded individuals with strong ethical foundations.",
    coursesOffered: [
      "B.Com (Hons.)",
      "B.A. (Hons.) Economics",
      "M.Com",
      "Various Certificate and Diploma Courses",
      "Add-on courses in Finance, Analytics, Marketing"
    ],
    hostelAvailable: false,
    collegeFees: "₹32,420 (First Year)",
    yearEstablished: 1926,
    address: "Maurice Nagar, Near Maurice Nagar Police Station, New Delhi, Delhi 110007, India",
    busAvailable: false,
    facilities: [
      { name: "Commerce Library", available: true, description: "Specialized library with extensive collection of commerce and economics literature" },
      { name: "Computer Labs", available: true, description: "Modern computer labs with latest software for analytics and research" },
      { name: "Sports Ground", available: true, description: "Basketball and volleyball courts, gymnasium" }
    ],
    cutoffs: [
      { course: "B.Com (Hons.)", year: 2023, general: 99.75, obc: 99.50, sc: 98.75, st: 98.00 },
      { course: "B.Com (Hons.)", year: 2022, general: 99.50, obc: 99.25, sc: 98.50, st: 97.75 },
      { course: "B.Com (Hons.)", year: 2021, general: 99.25, obc: 99.00, sc: 98.25, st: 97.50 },
      { course: "B.A. (Hons.) Economics", year: 2023, general: 99.50, obc: 99.25, sc: 98.50, st: 97.50 },
      { course: "B.A. (Hons.) Economics", year: 2022, general: 99.25, obc: 99.00, sc: 98.25, st: 97.25 },
      { course: "B.A. (Hons.) Economics", year: 2021, general: 99.00, obc: 98.75, sc: 98.00, st: 97.00 }
    ],
    placements: [
      { year: 2023, averagePackage: 12.50, highestPackage: 32.00, medianPackage: 10.00, placementRate: 95 },
      { year: 2022, averagePackage: 11.20, highestPackage: 28.00, medianPackage: 9.50, placementRate: 93 },
      { year: 2021, averagePackage: 10.50, highestPackage: 25.00, medianPackage: 9.00, placementRate: 91 }
    ],
    reviews: [
      {
        id: 1,
        studentName: "Aditya Mittal",
        isAnonymous: false,
        rating: 5,
        date: "November 5, 2024",
        course: "B.Com (Hons.) 2021-24",
        reviewText: "SRCC is a dream college for commerce students! The legacy and reputation speak for themselves. The faculty is highly qualified, and the peer group is incredibly competitive yet supportive. Being part of SRCC opens doors to amazing opportunities in finance, consulting, and banking. The fest 'Crossroads' is one of the best college fests in Delhi. The alumni network is very strong and helpful in career guidance.",
        likes: 198,
        dislikes: 3,
        comments: 24
      },
      {
        id: 2,
        isAnonymous: true,
        rating: 4,
        date: "October 12, 2024",
        course: "B.A. (Hons.) Economics",
        reviewText: "Great college with excellent academic environment. The cutoffs are sky-high for a reason - the quality of education is top-notch. However, infrastructure could be better as the college building is quite old. No hostel facility is a drawback for outstation students. But the location in North Campus is perfect, and the college societies are very active and provide great learning opportunities.",
        likes: 134,
        dislikes: 28,
        comments: 19
      },
      {
        id: 3,
        studentName: "Ananya Saxena",
        isAnonymous: false,
        rating: 5,
        date: "September 3, 2024",
        course: "B.Com (Hons.) 2020-23",
        reviewText: "Three wonderful years at SRCC! The college has given me so much - knowledge, lifelong friendships, and career opportunities. The societies like Enactus, Finance & Investment Cell, and Marketing Cell provide practical exposure beyond academics. Companies like the Big 4, Goldman Sachs, and top consulting firms recruit from campus. The brand value of SRCC is unmatched!",
        likes: 167,
        dislikes: 5,
        comments: 15
      },
      {
        id: 4,
        studentName: "Vikram Choudhary",
        isAnonymous: false,
        rating: 4,
        date: "July 28, 2024",
        course: "M.Com 2022-24",
        reviewText: "Pursuing M.Com from SRCC has been enriching. The research-oriented approach of the program develops analytical skills. Faculty members are experienced and encourage critical thinking. Placements for M.Com students are decent but not as spectacular as B.Com. The library has excellent resources for research. Overall, a good choice for those interested in academics and research.",
        likes: 72,
        dislikes: 9,
        comments: 8
      }
    ]
  },
  {
    id: 5,
    name: "NALSAR",
    fullName: "NALSAR University of Law",
    location: "Hyderabad, Telangana",
    rating: 4.5,
    type: "Autonomous",
    accreditation: ["BCI", "UGC"],
    naacGrade: "A++",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&q=80",
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&q=80"
    ],
    vision: "To be a premier institution for legal education, producing competent legal professionals who contribute to justice, equality, and social transformation.",
    mission: "To provide comprehensive legal education that combines theory with practice, fostering critical thinking, research excellence, and ethical commitment to the legal profession.",
    coursesOffered: [
      "B.A. LL.B. (Hons.) - 5 Year Integrated Program",
      "LL.M. (Master of Laws)",
      "MBA Business Laws",
      "Ph.D. in Law",
      "Certificate Courses in Intellectual Property, Cyber Law",
      "Executive Programs in Corporate Law"
    ],
    hostelAvailable: true,
    hostelFees: "₹1 Lac per year",
    collegeFees: "₹4.42 Lacs (Total 5 years for BA LLB)",
    yearEstablished: 1998,
    address: "Justice City, Shameerpet, R.R. District, Hyderabad, Telangana 500101, India",
    busAvailable: true,
    facilities: [
      { name: "Law Library", available: true, description: "Comprehensive law library with national and international legal databases" },
      { name: "Moot Court Hall", available: true, description: "State-of-the-art moot court facility for practical training" },
      { name: "WiFi Campus", available: true, description: "24/7 WiFi access throughout campus" },
      { name: "Sports Complex", available: true, description: "Indoor and outdoor sports facilities" }
    ],
    cutoffs: [
      { course: "BA LLB (Hons.)", year: 2023, general: 95, obc: 650, sc: 1200, st: 1500 },
      { course: "BA LLB (Hons.)", year: 2022, general: 102, obc: 720, sc: 1350, st: 1650 },
      { course: "BA LLB (Hons.)", year: 2021, general: 115, obc: 800, sc: 1450, st: 1800 }
    ],
    placements: [
      { year: 2023, averagePackage: 14.50, highestPackage: 25.00, medianPackage: 12.00, placementRate: 88 },
      { year: 2022, averagePackage: 13.20, highestPackage: 22.00, medianPackage: 11.00, placementRate: 85 },
      { year: 2021, averagePackage: 12.00, highestPackage: 20.00, medianPackage: 10.00, placementRate: 82 }
    ],
    reviews: [
      {
        id: 1,
        studentName: "Shreya Iyer",
        isAnonymous: false,
        rating: 5,
        date: "October 20, 2024",
        course: "BA LLB (Hons.) 2019-24",
        reviewText: "NALSAR has been an incredible journey of five years! The rigorous curriculum prepares you exceptionally well for the legal profession. The moot court facilities are excellent, and the college encourages participation in national and international moots. Faculty members are renowned legal experts who bring practical insights to classroom. The library has an extensive collection of legal resources. Campus life is vibrant with debates, conferences, and cultural activities.",
        likes: 143,
        dislikes: 4,
        comments: 17
      },
      {
        id: 2,
        isAnonymous: true,
        rating: 4,
        date: "September 25, 2024",
        course: "BA LLB 2020-25",
        reviewText: "One of the top law schools in India. The academic pressure is intense but manageable with good time management. The campus is located away from the city, which ensures focused study environment. Hostel facilities are good and mandatory for all students. The placement scenario is excellent with top law firms, judiciary, and corporate legal departments recruiting. Some improvement needed in infrastructure maintenance.",
        likes: 89,
        dislikes: 16,
        comments: 13
      },
      {
        id: 3,
        studentName: "Rohan Deshmukh",
        isAnonymous: false,
        rating: 5,
        date: "August 15, 2024",
        course: "LL.M. Corporate Law 2023-24",
        reviewText: "The one-year LL.M. program at NALSAR is intensive and comprehensive. The specialization in corporate law provided deep insights into mergers, acquisitions, securities law, and corporate governance. Faculty includes practitioners and academicians which gives balanced perspective. Research facilities are top-notch. Got placed in a leading corporate law firm. Highly recommend for specialized legal education!",
        likes: 76,
        dislikes: 2,
        comments: 9
      },
      {
        id: 4,
        isAnonymous: true,
        rating: 4,
        date: "July 8, 2024",
        reviewText: "Great college for legal education. The interdisciplinary approach helps in understanding law in broader context. Legal aid clinics provide practical exposure to real cases. The college has active societies for various interests - litigation, corporate law, criminal law, IPR. Networking opportunities with alumni are excellent. Food could be better, but overall campus experience is good.",
        likes: 62,
        dislikes: 11,
        comments: 7
      },
      {
        id: 5,
        studentName: "Meera Nambiar",
        isAnonymous: false,
        rating: 5,
        date: "June 12, 2024",
        course: "BA LLB 2021-26",
        reviewText: "As a third-year student, I can confidently say choosing NALSAR was the best decision! The quality of education and exposure is unparalleled. Regular guest lectures from Supreme Court judges, senior advocates, and legal scholars. The research center encourages students to publish papers. Internship opportunities with top law firms and courts. The competitive yet collaborative environment pushes you to excel.",
        likes: 118,
        dislikes: 3,
        comments: 11
      }
    ]
  },
  {
    id: 6,
    name: "PGIMER",
    fullName: "Post Graduate Institute of Medical Education & Research",
    location: "Chandigarh, Chandigarh",
    rating: 3.9,
    type: "Government",
    accreditation: ["INC", "MCI"],
    naacGrade: "A++",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80",
      "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1200&q=80",
      "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=1200&q=80"
    ],
    vision: "To be a center of excellence in medical education, research, and patient care, advancing healthcare through innovation and compassion.",
    mission: "To provide world-class postgraduate medical education, conduct cutting-edge research, and deliver high-quality tertiary healthcare services to the community.",
    coursesOffered: [
      "MD/MS in Various Medical Specializations",
      "DM (Doctorate of Medicine) Super Specialty",
      "M.Ch (Master of Chirurgiae) Super Specialty",
      "MDS (Master of Dental Surgery)",
      "Ph.D. in Medical Sciences",
      "Post Doctoral Fellowship Programs",
      "Nursing Programs (B.Sc., M.Sc. Nursing)"
    ],
    hostelAvailable: true,
    hostelFees: "₹25,000 - ₹40,000 per year",
    collegeFees: "₹3,370 (First Year)",
    yearEstablished: 1962,
    address: "Sector 12, Chandigarh, 160012, India",
    busAvailable: true,
    facilities: [
      { name: "Medical Library", available: true, description: "Extensive medical library with latest journals and research papers" },
      { name: "Research Labs", available: true, description: "Advanced research laboratories with modern equipment" },
      { name: "Campus WiFi", available: true, description: "WiFi connectivity in academic areas" },
      { name: "Recreation Facilities", available: true, description: "Gymnasium, sports grounds for staff and students" }
    ],
    cutoffs: [
      { course: "MD/MS", year: 2023, general: 650, obc: 12000, sc: 25000, st: 35000 },
      { course: "MD/MS", year: 2022, general: 720, obc: 13500, sc: 27000, st: 38000 },
      { course: "MD/MS", year: 2021, general: 800, obc: 15000, sc: 29000, st: 40000 }
    ],
    placements: [
      { year: 2023, averagePackage: 18.00, highestPackage: 45.00, medianPackage: 16.00, placementRate: 78 },
      { year: 2022, averagePackage: 16.50, highestPackage: 42.00, medianPackage: 15.00, placementRate: 75 },
      { year: 2021, averagePackage: 15.20, highestPackage: 38.00, medianPackage: 14.00, placementRate: 72 }
    ],
    reviews: [
      {
        id: 1,
        studentName: "Dr. Kavita Reddy",
        isAnonymous: false,
        rating: 5,
        date: "November 8, 2024",
        course: "MD General Medicine 2021-24",
        reviewText: "PGIMER is one of the finest medical institutions in India! The learning environment is exceptional with exposure to diverse clinical cases. The faculty comprises experienced doctors who are excellent teachers and mentors. The patient load ensures adequate hands-on training. Research facilities are world-class. The hospital infrastructure and medical equipment are state-of-the-art. Proud to be a part of PGIMER!",
        likes: 156,
        dislikes: 2,
        comments: 14
      },
      {
        id: 2,
        isAnonymous: true,
        rating: 4,
        date: "October 5, 2024",
        course: "DM Cardiology",
        reviewText: "Excellent institute for super-specialty training. The department has all modern facilities including cath labs and advanced imaging. Case variety is excellent which helps in building strong clinical skills. However, the workload is extremely high with long duty hours. Hostel facilities are basic but adequate. The academic sessions and journal clubs are regular and informative. Overall, great for those serious about academics.",
        likes: 94,
        dislikes: 18,
        comments: 11
      },
      {
        id: 3,
        studentName: "Rohit Khanna",
        isAnonymous: false,
        rating: 5,
        date: "September 18, 2024",
        course: "M.Ch Neurosurgery 2020-23",
        reviewText: "Three years of rigorous training at PGIMER have been transformative! The neurosurgery department handles complex cases from across North India. Got extensive exposure to all neurosurgical procedures under expert guidance. The department has modern operation theaters with latest equipment. Research culture is strong with opportunities to present at international conferences. The training has prepared me well for independent practice.",
        likes: 128,
        dislikes: 3,
        comments: 9
      },
      {
        id: 4,
        isAnonymous: true,
        rating: 4,
        date: "August 22, 2024",
        course: "MS Orthopedics",
        reviewText: "Good institute with excellent clinical exposure. The emergency wing sees high patient volume giving great learning opportunities. Faculty is supportive and teaches practical aspects thoroughly. Library has good collection of medical journals and books. However, the work-life balance is poor during residency years. Campus has basic amenities - cafeteria, gym, medical store. Placement support for private sector could be better.",
        likes: 67,
        dislikes: 14,
        comments: 8
      },
      {
        id: 5,
        studentName: "Anjali Sharma",
        isAnonymous: false,
        rating: 5,
        date: "July 10, 2024",
        course: "M.Sc. Nursing 2022-24",
        reviewText: "PGIMER's nursing program is outstanding! The curriculum is comprehensive covering both theoretical and practical aspects. Clinical postings in various departments provide diverse learning experiences. Faculty members are highly qualified and supportive. The institute provides scholarships which helps financially. Campus is well-maintained with good security. The learning environment encourages professional growth and research. Excellent choice for nursing career!",
        likes: 103,
        dislikes: 1,
        comments: 12
      }
    ]
  }
];
