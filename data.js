/* SwasthyaSetu - Comprehensive Realistic Healthcare Data */

const healthcareCentres = [
  {
    id: "phc-wadgaon",
    type: "PHC",
    typeLabel: "Primary Health Centre",
    name: "Wadgaon Primary Health Centre (PHC)",
    name_hi: "वडगांव प्राथमिक स्वास्थ्य केंद्र (PHC)",
    name_mr: "वडगाव प्राथमिक आरोग्य केंद्र (PHC)",
    address: "Main Road, Near Gram Panchayat, Wadgaon, Khed Taluka, Pune - 410501",
    district: "Pune",
    taluka: "Khed",
    distance: 2.8, // km
    travelTime: "8-10 mins",
    coordinates: { x: 38, y: 44 }, // relative percent on map
    phone: "+91 98231 44510",
    rating: 4.7,
    reviewsCount: 142,
    emergency24x7: true,
    ambulanceStationed: true,
    snakebiteAntivenomReady: true,
    openingHours: "Open 24x7 for Casualty | OPD: 08:30 AM - 01:30 PM & 04:00 PM - 06:00 PM",
    doctors: [
      {
        id: "doc-1",
        name: "Dr. Aniruddh Joshi",
        qualification: "MBBS, DCH (Child Health)",
        designation: "Medical Officer In-Charge",
        department: "General Medicine & Pediatrics",
        roomNo: "Room 1 (OPD)",
        onDuty: true,
        currentQueue: 4,
        nextSlot: "Today 09:30 AM",
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
      },
      {
        id: "doc-2",
        name: "Dr. Sunita Gaikwad",
        qualification: "MBBS, DGO (Obstetrics & Gynecology)",
        designation: "Women & Child Medical Officer",
        department: "Maternity & Antenatal Care",
        roomNo: "Room 3 (Maternity Wing)",
        onDuty: true,
        currentQueue: 2,
        nextSlot: "Today 10:00 AM",
        photo: "https://images.unsplash.com/photo-1594824813501-4475459392e2?w=150&auto=format&fit=crop&q=80"
      },
      {
        id: "doc-3",
        name: "Dr. Sanjay Shinde",
        qualification: "BAMS, CCH",
        designation: "Community Health Officer (CHO)",
        department: "Ayush & Chronic Illness",
        roomNo: "Room 4",
        onDuty: false,
        currentQueue: 0,
        nextSlot: "Tomorrow 09:00 AM",
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
      }
    ],
    services: [
      "24x7 Emergency Casualty",
      "Safe Delivery / Labor Room (Janani Suraksha)",
      "Child Routine Immunization (Polio, BCG, Pentavalent)",
      "Snakebite & Scorpion Sting Antivenom Protocol",
      "Free Jan Aushadhi Pharmacy",
      "TB DOTS Treatment & Sputum Testing",
      "Malaria & Dengue Rapid Diagnostic Testing",
      "Free Family Planning Counselling"
    ],
    diagnostics: [
      { name: "Blood Glucose (Sugar)", available: true, fee: "FREE" },
      { name: "Hemoglobin (Hb Test)", available: true, fee: "FREE" },
      { name: "Urine Routine", available: true, fee: "FREE" },
      { name: "Rapid Malaria & Typhoid Kit", available: true, fee: "FREE" },
      { name: "ECG (Tele-ECG via AIIMS)", available: true, fee: "FREE" },
      { name: "Digital X-Ray", available: false, fee: "Referred to CHC (8 km)" }
    ],
    medicinesStockSnapshot: [
      { name: "Paracetamol 500mg", status: "in-stock", qty: 2400 },
      { name: "Amoxicillin 250mg", status: "in-stock", qty: 950 },
      { name: "ORS Hydration Sachets", status: "in-stock", qty: 1500 },
      { name: "Polyvalent Snake Antivenom", status: "in-stock", qty: 18 },
      { name: "Metformin 500mg (Diabetes)", status: "in-stock", qty: 1200 },
      { name: "Iron & Folic Acid Tablets", status: "in-stock", qty: 3100 },
      { name: "Rabies Vaccine (ARV)", status: "limited", qty: 12 },
      { name: "Cetirizine 10mg", status: "in-stock", qty: 850 }
    ],
    reviews: [
      {
        author: "Tukaram Bhujbal",
        village: "Wadgaon",
        rating: 5,
        date: "2 days ago",
        text: "Dr. Joshi inspected my child's viral fever very attentively. Free medicines were given at the counter within 5 minutes."
      },
      {
        author: "Meenakshi Kadam",
        village: "Chakan Fata",
        rating: 5,
        date: "1 week ago",
        text: "Sister attended delivery at 2 AM safely. Clean labor ward and 108 ambulance dropped us home safely under JSY."
      }
    ]
  },
  {
    id: "chc-manchar",
    type: "CHC",
    typeLabel: "Community Health Centre",
    name: "Manchar Community Health Centre (CHC / Rural Hospital)",
    name_hi: "मंचर सामुदायिक स्वास्थ्य केंद्र (ग्रामीण अस्पताल)",
    name_mr: "मंचर ग्रामीण रुग्णालय व सामुदायिक आरोग्य केंद्र (CHC)",
    address: "National Highway 60, Manchar, Ambegaon Taluka, Pune - 410503",
    district: "Pune",
    taluka: "Ambegaon",
    distance: 8.4,
    travelTime: "18-22 mins",
    coordinates: { x: 58, y: 32 },
    phone: "+91 94220 18923",
    rating: 4.8,
    reviewsCount: 318,
    emergency24x7: true,
    ambulanceStationed: true,
    snakebiteAntivenomReady: true,
    openingHours: "24 Hours Open (30-Bedded Hospital with Operation Theatre)",
    doctors: [
      {
        id: "doc-4",
        name: "Dr. Vikram Deshmukh",
        qualification: "MS (General Surgery)",
        designation: "Medical Superintendent",
        department: "Surgery & Trauma",
        roomNo: "Room 101",
        onDuty: true,
        currentQueue: 7,
        nextSlot: "Today 11:00 AM",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
      },
      {
        id: "doc-5",
        name: "Dr. Vandana Jadhav",
        qualification: "MD (Gynecology & Obstetrics)",
        designation: "Senior Gynecologist",
        department: "Women's Health & High-Risk Pregnancy",
        roomNo: "Room 105",
        onDuty: true,
        currentQueue: 5,
        nextSlot: "Today 10:30 AM",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
      },
      {
        id: "doc-6",
        name: "Dr. Nilesh Bhor",
        qualification: "MD (Anesthesiology & Critical Care)",
        designation: "ICU Specialist",
        department: "Critical Care & Casualty",
        roomNo: "Emergency Ward",
        onDuty: true,
        currentQueue: 1,
        nextSlot: "Available Now",
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
      }
    ],
    services: [
      "24x7 Trauma & Emergency Unit with 4 ICU Beds",
      "Modular Operation Theatre for C-Section & General Surgery",
      "Newborn Care Corner (SNCU)",
      "Digital X-Ray & Ultrasound Sonography",
      "Automated Pathology Blood Bank & Component Centre",
      "Ayushman Bharat PM-JAY Helpdesk (Free ₹5 Lakh Treatment)",
      "Free 24x7 Pharmacy (Jan Aushadhi Scheme)"
    ],
    diagnostics: [
      { name: "Digital X-Ray", available: true, fee: "FREE" },
      { name: "Ultrasound Sonography (USG)", available: true, fee: "FREE (Tue & Fri)" },
      { name: "Complete Blood Count (CBC)", available: true, fee: "FREE" },
      { name: "Liver & Kidney Function Tests (LFT/KFT)", available: true, fee: "FREE" },
      { name: "Thyroid & Lipid Profile", available: true, fee: "FREE" },
      { name: "ECG 12-Channel", available: true, fee: "FREE" }
    ],
    medicinesStockSnapshot: [
      { name: "Paracetamol 500mg", status: "in-stock", qty: 5800 },
      { name: "Amoxicillin 250mg", status: "in-stock", qty: 2200 },
      { name: "Ceftriaxone 1g Injection", status: "in-stock", qty: 450 },
      { name: "Polyvalent Snake Antivenom", status: "in-stock", qty: 42 },
      { name: "Rabies Vaccine (ARV)", status: "in-stock", qty: 110 },
      { name: "Insulin (Human Mixtard)", status: "in-stock", qty: 85 },
      { name: "Salbutamol Asthma Inhaler", status: "in-stock", qty: 160 },
      { name: "Amlodipine 5mg (BP)", status: "in-stock", qty: 3400 }
    ],
    reviews: [
      {
        author: "Dnyaneshwar Shinde",
        village: "Ghodegaon",
        rating: 5,
        date: "3 days ago",
        text: "Ayushman Bharat card was verified immediately at the counter. My father's hernia surgery was done completely free of charge!"
      }
    ]
  },
  {
    id: "hospital-chakan",
    type: "Hospital",
    typeLabel: "Sub-District Hospital",
    name: "Chakan Sub-District Hospital (50-Bedded)",
    name_hi: "चाकण उप-जिला अस्पताल (50 बिस्तर)",
    name_mr: "चाकण उपजिल्हा रुग्णालय (५० खाटांचे)",
    address: "Talegaon-Chakan Highway, Chakan, Khed Taluka, Pune - 410501",
    district: "Pune",
    taluka: "Khed",
    distance: 12.3,
    travelTime: "25-30 mins",
    coordinates: { x: 26, y: 68 },
    phone: "+91 91580 99401",
    rating: 4.6,
    reviewsCount: 420,
    emergency24x7: true,
    ambulanceStationed: true,
    snakebiteAntivenomReady: true,
    openingHours: "Open 24x7 | Full Specialty Medical Services",
    doctors: [
      {
        id: "doc-7",
        name: "Dr. Ashish Kale",
        qualification: "MS (Orthopedics)",
        designation: "Consultant Orthopedic Surgeon",
        department: "Bone & Trauma Care",
        roomNo: "Room 14",
        onDuty: true,
        currentQueue: 8,
        nextSlot: "Today 11:30 AM",
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
      },
      {
        id: "doc-8",
        name: "Dr. Pratibha More",
        qualification: "MD (General Medicine)",
        designation: "Senior Physician",
        department: "Diabetes, Heart & Hypertension",
        roomNo: "Room 8",
        onDuty: true,
        currentQueue: 6,
        nextSlot: "Today 10:15 AM",
        photo: "https://images.unsplash.com/photo-1594824813501-4475459392e2?w=150&auto=format&fit=crop&q=80"
      }
    ],
    services: [
      "24x7 Critical Care ICU and Casualty Ward",
      "Specialist Orthopedics & Fracture Casting",
      "Dialysis Unit (Free under PM National Dialysis Program)",
      "Pediatric Sick Newborn Care Unit (SNCU)",
      "Comprehensive Eye Examination & Cataract Camp",
      "Free Blood Storage Centre"
    ],
    diagnostics: [
      { name: "Digital X-Ray & Ortho Views", available: true, fee: "FREE" },
      { name: "Haemodialysis", available: true, fee: "FREE under PMNDP" },
      { name: "Automated Biochemistry Lab", available: true, fee: "FREE" },
      { name: "Eye Refraction & Slit Lamp", available: true, fee: "FREE" }
    ],
    medicinesStockSnapshot: [
      { name: "Paracetamol 500mg", status: "in-stock", qty: 9200 },
      { name: "Amoxicillin 250mg", status: "in-stock", qty: 3800 },
      { name: "Rabies Vaccine (ARV)", status: "in-stock", qty: 220 },
      { name: "Polyvalent Snake Antivenom", status: "in-stock", qty: 65 },
      { name: "Insulin (Human Mixtard)", status: "in-stock", qty: 190 },
      { name: "Metformin 500mg", status: "in-stock", qty: 4100 }
    ],
    reviews: [
      {
        author: "Subhash Pawar",
        village: "Mahalunge",
        rating: 5,
        date: "5 days ago",
        text: "Clean wards, orderly token system, and dialysis facilities have been a lifesaver for rural kidney patients."
      }
    ]
  },
  {
    id: "clinic-khed-wellness",
    type: "Clinic",
    typeLabel: "Ayushman Arogya Mandir (Wellness Clinic)",
    name: "Khed Khurd Ayushman Arogya Mandir",
    name_hi: "खेड खुर्द आयुष्मान आरोग्य मंदिर (आरोग्य उपकेंद्र)",
    name_mr: "खेड खुर्द आयुष्मान आरोग्य मंदिर (उपकेंद्र)",
    address: "Bazar Peth, Khed Khurd, Pune - 410505",
    district: "Pune",
    taluka: "Khed",
    distance: 4.1,
    travelTime: "10-12 mins",
    coordinates: { x: 74, y: 55 },
    phone: "+91 97632 00192",
    rating: 4.5,
    reviewsCount: 78,
    emergency24x7: false,
    ambulanceStationed: false,
    snakebiteAntivenomReady: false,
    openingHours: "Monday to Saturday: 09:00 AM - 05:00 PM (Emergency referred to Wadgaon PHC)",
    doctors: [
      {
        id: "doc-9",
        name: "Dr. Rupali Kulkarni",
        qualification: "BAMS (CHO)",
        designation: "Community Health Officer",
        department: "Preventive Care & Tele-OPD Hub",
        roomNo: "Consultation Desk",
        onDuty: true,
        currentQueue: 2,
        nextSlot: "Available Now",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
      }
    ],
    services: [
      "Tele-consultation Hub with District Specialists",
      "Non-Communicable Disease (NCD) Screening (BP, Sugar, Cancer)",
      "Maternal & Child Health Care (ANC/PNC)",
      "Elderly Care & Yoga / Wellness Sessions",
      "Essential Drug Dispensing (14 Free Basic Medicines)"
    ],
    diagnostics: [
      { name: "Blood Pressure Monitoring", available: true, fee: "FREE" },
      { name: "Blood Glucose Test", available: true, fee: "FREE" },
      { name: "Hemoglobin Spot Test", available: true, fee: "FREE" },
      { name: "Urine Albumin / Sugar", available: true, fee: "FREE" }
    ],
    medicinesStockSnapshot: [
      { name: "Paracetamol 500mg", status: "in-stock", qty: 850 },
      { name: "ORS Hydration Sachets", status: "in-stock", qty: 600 },
      { name: "Iron & Folic Acid", status: "in-stock", qty: 1100 },
      { name: "Amlodipine 5mg", status: "in-stock", qty: 700 },
      { name: "Polyvalent Snake Antivenom", status: "out-of-stock", qty: 0 }
    ],
    reviews: [
      {
        author: "Shantabai Gavhane",
        village: "Khed Khurd",
        rating: 4,
        date: "2 weeks ago",
        text: "Sister tests my blood pressure and sugar every month without going to city. Very convenient for elders."
      }
    ]
  }
];

// Teleconsultation Specialist Doctors
const teleDoctors = [
  {
    id: "tele-1",
    name: "Dr. Sunita Deshmukh",
    qualification: "MBBS, DNB (General Medicine) - Govt Medical College",
    specialization: "General Physician & Fever Specialist",
    specialization_hi: "जनरल फिजिशियन एवं बुखार विशेषज्ञ",
    specialization_mr: "जनरल फिजिशियन व ताप विशेषज्ञ",
    experience: "14 Years Experience",
    languages: ["Marathi", "Hindi", "English"],
    rating: 4.9,
    consultationsCount: 1420,
    status: "online",
    estimatedWait: "Direct Connect (0 mins)",
    availableTime: "Today 09:00 AM - 06:00 PM",
    photo: "https://images.unsplash.com/photo-1594824813501-4475459392e2?w=160&auto=format&fit=crop&q=80"
  },
  {
    id: "tele-2",
    name: "Dr. Rajesh Verma",
    qualification: "MD (Pediatrics) - AIIMS New Delhi",
    specialization: "Pediatrician (Child Specialist)",
    specialization_hi: "शिशु एवं बाल रोग विशेषज्ञ",
    specialization_mr: "बालरोग व नवजात शिशु तज्ज्ञ",
    experience: "11 Years Experience",
    languages: ["Hindi", "English"],
    rating: 4.8,
    consultationsCount: 980,
    status: "busy",
    estimatedWait: "In Call (Wait ~8 mins)",
    availableTime: "Today 10:00 AM - 04:00 PM",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=160&auto=format&fit=crop&q=80"
  },
  {
    id: "tele-3",
    name: "Dr. Ananya Kulkarni",
    qualification: "MS (Obstetrics & Gynaecology)",
    specialization: "Women's Health & Maternal Guidance",
    specialization_hi: "महिला स्वास्थ्य एवं प्रसूति रोग विशेषज्ञ",
    specialization_mr: "स्त्रीरोग व प्रसूती तज्ज्ञ",
    experience: "9 Years Experience",
    languages: ["Marathi", "Hindi", "English"],
    rating: 4.9,
    consultationsCount: 1120,
    status: "online",
    estimatedWait: "Direct Connect (0 mins)",
    availableTime: "Today 09:30 AM - 05:30 PM",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&auto=format&fit=crop&q=80"
  },
  {
    id: "tele-4",
    name: "Dr. Arvind Patel",
    qualification: "MD, DM (Cardiology) - KEM Hospital",
    specialization: "Cardiology & Blood Pressure Specialist",
    specialization_hi: "हृदय रोग एवं उच्च रक्तचाप विशेषज्ञ",
    specialization_mr: "हृदयरोग व रक्तदाब तज्ज्ञ",
    experience: "16 Years Experience",
    languages: ["Hindi", "English", "Gujarati"],
    rating: 4.9,
    consultationsCount: 750,
    status: "offline",
    estimatedWait: "Next Shift at 02:00 PM",
    availableTime: "Today 02:00 PM - 07:00 PM",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=160&auto=format&fit=crop&q=80"
  }
];

// Medicine Directory with Live Availability Across Rural Centres
const medicineCatalog = [
  {
    id: "med-1",
    name: "Paracetamol 500mg",
    brandExample: "Crocin / Calpol generic",
    category: "Fever & Pain Relief",
    category_hi: "बुखार और दर्द निवारक",
    category_mr: "ताप आणि अंगदुखी",
    dosage: "Tablet (Strip of 10)",
    govtPrice: "FREE (₹0)",
    marketPrice: "₹32.00",
    description: "Standard medicine for fever, headache, body ache and viral infections in adults and children above 12 years.",
    centres: [
      { centreId: "phc-wadgaon", centreName: "Wadgaon PHC", status: "in-stock", qty: 2400, lastUpdated: "Today 08:30 AM" },
      { centreId: "chc-manchar", centreName: "Manchar CHC", status: "in-stock", qty: 5800, lastUpdated: "Today 07:45 AM" },
      { centreId: "hospital-chakan", centreName: "Chakan SDH", status: "in-stock", qty: 9200, lastUpdated: "Today 09:00 AM" },
      { centreId: "clinic-khed-wellness", centreName: "Khed Khurd Clinic", status: "in-stock", qty: 850, lastUpdated: "Yesterday" }
    ]
  },
  {
    id: "med-2",
    name: "Amoxicillin 250mg / 500mg",
    brandExample: "Novamox generic",
    category: "Antibiotic for Bacterial Infections",
    category_hi: "संक्रमण रोधी एंटीबायोटिक",
    category_mr: "जंतूसंसर्ग प्रतिबंधक अँटीबायोटिक",
    dosage: "Capsule / Pediatric Syrup",
    govtPrice: "FREE (₹0)",
    marketPrice: "₹85.00",
    description: "Antibiotic used for chest infections, tonsillitis, ear infections, and dental abscesses prescribed by medical officer.",
    centres: [
      { centreId: "phc-wadgaon", centreName: "Wadgaon PHC", status: "in-stock", qty: 950, lastUpdated: "Today 08:30 AM" },
      { centreId: "chc-manchar", centreName: "Manchar CHC", status: "in-stock", qty: 2200, lastUpdated: "Today 07:45 AM" },
      { centreId: "hospital-chakan", centreName: "Chakan SDH", status: "in-stock", qty: 3800, lastUpdated: "Today 09:00 AM" },
      { centreId: "clinic-khed-wellness", centreName: "Khed Khurd Clinic", status: "out-of-stock", qty: 0, lastUpdated: "Yesterday" }
    ]
  },
  {
    id: "med-3",
    name: "ORS (Oral Rehydration Salts)",
    brandExample: "Electral WHO formula",
    category: "Dehydration & Diarrhea",
    category_hi: "दस्त एवं निर्जलीकरण से बचाव",
    category_mr: "अतिसार व डिहायड्रेशनवरील जीवनजल",
    dosage: "Powder Sachet (21.8g for 1 Litre)",
    govtPrice: "FREE (₹0)",
    marketPrice: "₹24.50",
    description: "WHO recommended formula to restore lost fluids and electrolytes during loose motions and sunstroke.",
    centres: [
      { centreId: "phc-wadgaon", centreName: "Wadgaon PHC", status: "in-stock", qty: 1500, lastUpdated: "Today 08:30 AM" },
      { centreId: "chc-manchar", centreName: "Manchar CHC", status: "in-stock", qty: 4100, lastUpdated: "Today 07:45 AM" },
      { centreId: "hospital-chakan", centreName: "Chakan SDH", status: "in-stock", qty: 6200, lastUpdated: "Today 09:00 AM" },
      { centreId: "clinic-khed-wellness", centreName: "Khed Khurd Clinic", status: "in-stock", qty: 600, lastUpdated: "Yesterday" }
    ]
  },
  {
    id: "med-4",
    name: "Polyvalent Snake Antivenom (ASV)",
    brandExample: "Bharat Serums / Haffkine",
    category: "Critical Life-Saving Antidote",
    category_hi: "सर्पदंश जीवनरक्षक एंटीवेनम",
    category_mr: "सर्पदंश प्रतिबंधक जीवनरक्षक लस",
    dosage: "10ml Injection Vial (Cold Chain 2-8°C)",
    govtPrice: "FREE (₹0)",
    marketPrice: "₹1,250.00 / vial",
    description: "Neutralizes venom of Cobra, Krait, Russell's Viper, and Saw-scaled Viper. 24x7 emergency administration.",
    centres: [
      { centreId: "phc-wadgaon", centreName: "Wadgaon PHC", status: "in-stock", qty: 18, lastUpdated: "Verified 1 hr ago" },
      { centreId: "chc-manchar", centreName: "Manchar CHC", status: "in-stock", qty: 42, lastUpdated: "Verified 2 hrs ago" },
      { centreId: "hospital-chakan", centreName: "Chakan SDH", status: "in-stock", qty: 65, lastUpdated: "Verified Today" },
      { centreId: "clinic-khed-wellness", centreName: "Khed Khurd Clinic", status: "out-of-stock", qty: 0, lastUpdated: "Referred to Wadgaon (4km)" }
    ]
  },
  {
    id: "med-5",
    name: "Anti-Rabies Vaccine (ARV)",
    brandExample: "Rabipur / Abhayrab",
    category: "Animal / Dog Bite Protection",
    category_hi: "कुत्ते व जानवर के काटने पर टीका",
    category_mr: "श्वानदंश व रेबीज प्रतिबंधक लस",
    dosage: "Intramuscular / Intradermal Injection",
    govtPrice: "FREE (₹0)",
    marketPrice: "₹480.00 / dose",
    description: "Mandatory multi-dose post-exposure prophylaxis for dog, monkey, or cat bites to prevent fatal rabies.",
    centres: [
      { centreId: "phc-wadgaon", centreName: "Wadgaon PHC", status: "limited", qty: 12, lastUpdated: "Today 08:30 AM" },
      { centreId: "chc-manchar", centreName: "Manchar CHC", status: "in-stock", qty: 110, lastUpdated: "Today 07:45 AM" },
      { centreId: "hospital-chakan", centreName: "Chakan SDH", status: "in-stock", qty: 220, lastUpdated: "Today 09:00 AM" },
      { centreId: "clinic-khed-wellness", centreName: "Khed Khurd Clinic", status: "out-of-stock", qty: 0, lastUpdated: "N/A" }
    ]
  },
  {
    id: "med-6",
    name: "Metformin 500mg",
    brandExample: "Glycomet generic",
    category: "Diabetes Blood Sugar Control",
    category_hi: "मधुमेह (शुगर) नियंत्रण",
    category_mr: "मधुमेह नियंत्रण गोळ्या",
    dosage: "Tablet (Monthly quota 60 tabs)",
    govtPrice: "FREE (₹0)",
    marketPrice: "₹72.00",
    description: "First-line oral treatment for Type-2 Diabetes Mellitus provided free for registered rural patients monthly.",
    centres: [
      { centreId: "phc-wadgaon", centreName: "Wadgaon PHC", status: "in-stock", qty: 1200, lastUpdated: "Today 08:30 AM" },
      { centreId: "chc-manchar", centreName: "Manchar CHC", status: "in-stock", qty: 4500, lastUpdated: "Today 07:45 AM" },
      { centreId: "hospital-chakan", centreName: "Chakan SDH", status: "in-stock", qty: 4100, lastUpdated: "Today 09:00 AM" },
      { centreId: "clinic-khed-wellness", centreName: "Khed Khurd Clinic", status: "in-stock", qty: 540, lastUpdated: "Yesterday" }
    ]
  },
  {
    id: "med-7",
    name: "Iron & Folic Acid (IFA)",
    brandExample: "Red Sugar Coated IFA",
    category: "Anemia Prevention & Pregnancy",
    category_hi: "खून की कमी (एनीमिया) व गर्भावस्था",
    category_mr: "रक्ताल्पता व गरोदर मातांसाठी लोहयुक्त गोळ्या",
    dosage: "Tablet (100 days supply)",
    govtPrice: "FREE (₹0)",
    marketPrice: "₹45.00",
    description: "Given to all pregnant women, lactating mothers, and adolescent girls under Anemia Mukt Bharat program.",
    centres: [
      { centreId: "phc-wadgaon", centreName: "Wadgaon PHC", status: "in-stock", qty: 3100, lastUpdated: "Today 08:30 AM" },
      { centreId: "chc-manchar", centreName: "Manchar CHC", status: "in-stock", qty: 6500, lastUpdated: "Today 07:45 AM" },
      { centreId: "hospital-chakan", centreName: "Chakan SDH", status: "in-stock", qty: 7800, lastUpdated: "Today 09:00 AM" },
      { centreId: "clinic-khed-wellness", centreName: "Khed Khurd Clinic", status: "in-stock", qty: 1100, lastUpdated: "Yesterday" }
    ]
  },
  {
    id: "med-8",
    name: "Insulin (Human Mixtard 30/70)",
    brandExample: "Human Mixtard 40IU/ml",
    category: "Insulin-Dependent Diabetes",
    category_hi: "इंसुलिन इंजेक्शन",
    category_mr: "इन्सुलिन इंजेक्शन",
    dosage: "10ml Vial (Requires refrigeration)",
    govtPrice: "FREE (₹0)",
    marketPrice: "₹190.00",
    description: "Fast and intermediate acting insulin for severe diabetes control. Stored in PHC solar-powered refrigerators.",
    centres: [
      { centreId: "phc-wadgaon", centreName: "Wadgaon PHC", status: "out-of-stock", qty: 0, lastUpdated: "Restock expected Fri" },
      { centreId: "chc-manchar", centreName: "Manchar CHC", status: "in-stock", qty: 85, lastUpdated: "Today 07:45 AM" },
      { centreId: "hospital-chakan", centreName: "Chakan SDH", status: "in-stock", qty: 190, lastUpdated: "Today 09:00 AM" },
      { centreId: "clinic-khed-wellness", centreName: "Khed Khurd Clinic", status: "out-of-stock", qty: 0, lastUpdated: "N/A" }
    ]
  }
];

// Comprehensive Government Health Schemes with Simple vernacular breakdowns
const governmentSchemes = [
  {
    id: "pmjay",
    name: "Ayushman Bharat - PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
    name_hi: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)",
    name_mr: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
    benefitAmount: "₹5,00,000 / Family / Year",
    tagline: "World's Largest Free Cashless Health Cover",
    tagline_hi: "प्रतिवर्ष ₹5 लाख तक का पूर्णतः मुफ्त इलाज",
    tagline_mr: "प्रत्येक कुटुंबाला दरवर्षी ५ लाख रुपयांपर्यंत मोफत उपचार",
    targetBeneficiaries: "Deprived rural families, SECC listed households, poor and vulnerable citizens.",
    mainBenefits: [
      "Cashless treatment in over 28,000 empaneled government and private hospitals across India.",
      "Covers 1,949 medical procedures including heart surgery, bypass, cancer chemotherapy, neurosurgery, knee replacement, and ICU hospitalization.",
      "Covers 3 days of pre-hospitalization and 15 days of post-hospitalization medicines and diagnostic costs.",
      "No restriction on family size, age, or gender."
    ],
    eligibility: [
      "Families listed in SECC 2011 rural deprivation criteria (D1 to D7).",
      "Yellow or Orange Ration card holders / BPL families.",
      "No earning adult member aged between 16-59 in the household.",
      "Landless households deriving major income from manual casual labor."
    ],
    documents: [
      "Aadhaar Card of all family members",
      "Ration Card (Ration Card number is checked in Ayushman database)",
      "Registered Mobile Number for OTP validation"
    ],
    howToApply: "Visit your nearest Gram Panchayat Common Service Centre (CSC) or the Ayushman Mitra helpdesk at Manchar CHC / Chakan SDH. Carry Aadhaar and Ration card to get your Ayushman Golden PVC Card printed in 10 minutes."
  },
  {
    id: "pmmvy",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    name_hi: "प्रधानमंत्री मातृ वंदना योजना (PMMVY)",
    name_mr: "प्रधानमंत्री मातृ वंदना योजना (गर्भवती महिला अनुदान)",
    benefitAmount: "₹5,000 direct bank cash assistance",
    tagline: "Nutrition & Financial Support for Expectant Mothers",
    tagline_hi: "गर्भवती महिलाओं के पोषण एवं आर्थिक सहयोग हेतु ₹5,000",
    tagline_mr: "गर्भवती व स्तनदा मातांसाठी ५,००० रुपयांचे आर्थिक सहाय्य",
    targetBeneficiaries: "Pregnant women and lactating mothers for the first live birth in the family.",
    mainBenefits: [
      "Cash incentive transferred directly into the pregnant mother's bank account (DBT) in installments.",
      "Compensates for wage loss during pregnancy so mothers can take adequate rest and nourishment.",
      "Ensures early registration of pregnancy, mandatory Antenatal Check-ups (ANC), and institutional safe delivery."
    ],
    eligibility: [
      "All pregnant women and lactating mothers who conceive on or after scheme notification.",
      "Applicant must be at least 19 years old at the time of pregnancy.",
      "Not eligible if mother or husband is in regular central/state government employment or PSU."
    ],
    documents: [
      "Mother and Child Protection (MCP) Card (Mamta Card) issued by Anganwadi/PHC",
      "Aadhaar Card of pregnant woman and husband",
      "Aadhaar-linked Bank Passbook / Post Office account passbook"
    ],
    howToApply: "Register your pregnancy at your village Anganwadi Centre or Wadgaon PHC within 150 days of Last Menstrual Period (LMP). The ASHA worker will submit Form 1A on the PMMVY portal."
  },
  {
    id: "jsy",
    name: "Janani Suraksha Yojana (JSY)",
    name_hi: "जननी सुरक्षा योजना (JSY)",
    name_mr: "जननी सुरक्षा योजना (सुरक्षित बाळंतपण योजना)",
    benefitAmount: "₹1,400 Rural Cash Incentive + Free Transport",
    tagline: "100% Free Institutional Delivery & Transport",
    tagline_hi: "मुफ्त अस्पताल प्रसूति एवं ₹1,400 नकद प्रोत्साहन",
    tagline_mr: "शासकीय रुग्णालयात मोफत प्रसूती व १,४०० रुपये प्रोत्साहन अनुदान",
    targetBeneficiaries: "All pregnant rural mothers delivering in government health institutions.",
    mainBenefits: [
      "Completely free delivery (normal delivery or emergency C-Section surgery).",
      "Zero cost for medicines, blood transfusion, diagnostics, and food during hospital stay.",
      "Free 102/108 ambulance pickup from home to hospital and drop-back after discharge.",
      "Direct cash transfer of ₹1,400 for rural mothers to support post-delivery care."
    ],
    eligibility: [
      "All rural women delivering in Government PHCs, CHCs, or Sub-District Hospitals.",
      "Available to BPL and SC/ST mothers irrespective of age or number of children."
    ],
    documents: [
      "Mamta / MCP Card",
      "Aadhaar Card & Bank Account details",
      "BPL / Ration card (if applicable)"
    ],
    howToApply: "Automatically processed upon admission for delivery at Wadgaon PHC or Manchar CHC. ASHA worker assists with paperwork and the payment is credited directly."
  },
  {
    id: "nikshay",
    name: "National TB Elimination Program (Ni-kshay Poshan Yojana)",
    name_hi: "राष्ट्रीय क्षयरोग उन्मूलन कार्यक्रम (निक्षय पोषण योजना)",
    name_mr: "राष्ट्रीय क्षयरोग निर्मूलन कार्यक्रम (निक्षय पोषण योजना)",
    benefitAmount: "₹500 / Month Nutrition Support + Free Medication",
    tagline: "Complete Free Cure for Tuberculosis",
    tagline_hi: "टीबी की मुफ्त जांच, पूर्ण इलाज और ₹500 प्रति माह आहार सहायता",
    tagline_mr: "टीबीचा पूर्ण मोफत उपचार आणि दरमहा ५०० रुपये पोषण भत्ता",
    targetBeneficiaries: "Every diagnosed tuberculosis (TB) patient undergoing treatment.",
    mainBenefits: [
      "100% free DOTS medication courses for 6 to 9 months.",
      "Free molecular GeneXpert / CB-NAAT cartridge testing and sputum microscopy.",
      "₹500 per month transferred directly to patient's bank account for nutritional food (eggs, milk, pulses) until cured.",
      "Free chest X-Rays and continuous monitoring by TB Health Visitor (TBHV)."
    ],
    eligibility: [
      "Any citizen residing in rural or urban India diagnosed with active pulmonary or extra-pulmonary TB.",
      "Must be registered on the Central Ni-kshay digital portal."
    ],
    documents: [
      "Aadhaar Card",
      "Bank Account details (DBT enabled)",
      "Sputum / Diagnostic Lab report confirming TB"
    ],
    howToApply: "Visit the DOTS centre at Wadgaon PHC or Manchar CHC. If you have cough for more than 2 weeks, give sputum sample for free testing. Upon confirmation, Ni-kshay registration is done on the spot."
  },
  {
    id: "jan-aushadhi",
    name: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
    name_hi: "प्रधानमंत्री भारतीय जन औषधि परियोजना (PMBJP)",
    name_mr: "प्रधानमंत्री भारतीय जनऔषधी योजना (स्वस्त औषध केंद्र)",
    benefitAmount: "50% to 90% Cheaper High-Quality Medicines",
    tagline: "Quality Generic Medicines at Unbelievable Low Prices",
    tagline_hi: "गुणवत्तापूर्ण जेनेरिक दवाइयां 50% से 90% तक कम दाम में",
    tagline_mr: "उत्कृष्ट दर्जाची जेनेरिक औषधे ५०% ते ९०% पर्यंत स्वस्त",
    targetBeneficiaries: "All citizens, especially chronic disease patients needing lifetime BP, sugar, and cardiac medicines.",
    mainBenefits: [
      "Over 1,800 medicines and 300 surgical consumables available.",
      "Heart, blood pressure, kidney, cancer, diabetes, and asthma medicines at a fraction of branded market rates.",
      "Oxo-biodegradable sanitary pads (Suvidha) at only ₹1 per pad.",
      "Certified by WHO-GMP compliant pharmaceutical laboratories."
    ],
    eligibility: [
      "Open to all citizens without any income certificates, ration cards, or criteria."
    ],
    documents: [
      "Valid prescription from any registered doctor (MBBS/BAMS/MD)."
    ],
    howToApply: "Walk into any Jan Aushadhi Kendra located inside Manchar CHC, Chakan Sub-District Hospital, or village marketplace. Hand over your prescription."
  }
];

// Initial mock appointments for demonstration
const mockAppointments = [
  {
    id: "SST-2026-89412",
    centreId: "phc-wadgaon",
    centreName: "Wadgaon Primary Health Centre (PHC)",
    doctorName: "Dr. Aniruddh Joshi",
    department: "General Medicine & Pediatrics",
    patientName: "Ramesh Tukaram Patil",
    patientAge: 42,
    patientGender: "Male",
    date: "2026-09-17",
    timeSlot: "10:00 AM - 10:30 AM",
    tokenNumber: "TOKEN #14",
    status: "Confirmed",
    symptoms: "Persistent fever and headache for 3 days",
    createdAt: "2026-09-16"
  }
];
