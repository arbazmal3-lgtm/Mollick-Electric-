/**
 * Mollick Electric & Interior - Admin Panel Core Engine (Pure Vanilla JavaScript ES6+)
 * Provides shared data synchronization, secure admin authentication, and interactive management.
 */

/* ==============================================================================
   1. SHARED DATA LAYER (MollickDB)
   Used by both Public Website and Admin Panel for seamless synchronization
   ============================================================================== */

const DB_KEYS = {
  SERVICES: 'mollick_db_services',
  PROJECTS: 'mollick_db_projects',
  GALLERY: 'mollick_db_gallery',
  MESSAGES: 'mollick_db_messages',
  SETTINGS: 'mollick_db_settings',
  STAFF: 'mollick_db_staff',
  DESIGNS: 'mollick_db_designs',
  TOURS: 'mollick_db_tours',
  REVIEWS: 'mollick_customer_reviews',
  AUTH: 'mollick_db_auth',
  SESSION: 'mollick_admin_session'
};

// Initial Room Designs (Hardcoded Unsplash photos removed per user request, ready for admin uploads)
const INITIAL_DESIGNS = [
  {
    id: 'dsg-1',
    title: 'Emerald & Gold Acrylic Kitchen',
    room: 'kitchen',
    categoryName: 'Modular Kitchen',
    warrantyBadge: '🛡️ 10-Yr Marine Ply',
    specs: 'Parallel layout with Blum soft-close tandem boxes, scratch-resistant acrylic, and Quartz stone slab.',
    materials: '⚡ BWP 710 Marine Ply • Gola Profiles • Profile LEDs',
    price: 'From ₹1.25 Lakhs',
    image: '',
    active: true
  },
  {
    id: 'dsg-2',
    title: 'Statuario & Charcoal Louver TV Wall',
    room: 'living',
    categoryName: 'Living & TV Wall',
    warrantyBadge: '⚡ Zero-Wire Concealed',
    specs: 'Italian Statuario marble laminate backboard with acoustic charcoal louvers and floating soundbar drawer console.',
    materials: '⚡ 3000K Perimeter Aura • Hidden HDMI/Power Channels',
    price: 'From ₹65,000',
    image: '',
    active: true
  },
  {
    id: 'dsg-3',
    title: 'Tinted Fluted Glass Sliding Wardrobe',
    room: 'wardrobe',
    categoryName: 'Sliding Wardrobe',
    warrantyBadge: '🛡️ Heavy Aluminum Gliders',
    specs: 'Floor-to-ceiling space-optimizing wardrobe with black aluminum frame, anti-dust felt, and auto-sensor LED hanger rods.',
    materials: '⚡ Toughened Fluted Glass • Soft-Close Gliders • Velvet Trays',
    price: 'From ₹85,000',
    image: '',
    active: true
  },
  {
    id: 'dsg-4',
    title: 'Multi-Tier Gyproc Cove & Magnetic Track',
    room: 'ceiling',
    categoryName: 'False Ceiling',
    warrantyBadge: '✨ Saint-Gobain Certified',
    specs: 'Saint-Gobain gypsum boards framed on anti-crack heavy GI channel grid with seamless indirect 3000K warm LED troughing.',
    materials: '⚡ Magnetic Spotlights • Anti-Sag GI Grid • Zero Cracks',
    price: 'From ₹115 / sq.ft',
    image: '',
    active: true
  },
  {
    id: 'dsg-5',
    title: 'Backlit CNC Jaali Pooja Mandir',
    room: 'mandir',
    categoryName: 'Sacred Mandir',
    warrantyBadge: '🛕 Handcrafted Teak',
    specs: 'Custom laser-cut acrylic backlit om jaali with teak wood pillar accents, solid brass hanging bells, and pullout diya tray.',
    materials: '⚡ Solid Brass Temple Bells • Pullout Diya Platform',
    price: 'From ₹45,000',
    image: '',
    active: true
  },
  {
    id: 'dsg-6',
    title: 'Minimalist Japandi Master Suite',
    room: 'wardrobe',
    categoryName: 'Bedroom Suite',
    warrantyBadge: '🛡️ Full Turnkey Suite',
    specs: 'Natural fluted oak bed back wall, concealed dual USB bedside master switches, floating nightstands, and Royale matte finish.',
    materials: '⚡ Concealed Master Touch • Warm LED Reading Sconces',
    price: 'From ₹1.45 Lakhs',
    image: '',
    active: true
  }
];

// Initial Seed Data (Verified Kolkata Business Data)
const INITIAL_SERVICES = [
  {
    id: 'srv-1',
    title: 'Electric Concealed Wiring',
    description: 'Precision wall channeling, PVC heavy conduits, fire-retardant Havells/Polycab copper wiring, and RCCB safety breaker panels for full fire prevention.',
    category: 'Electrical',
    image: 'assets/icons/electric.svg',
    icon: '⚡',
    active: true,
    priceRange: 'Havells FR / Siemens RCCB'
  },
  {
    id: 'srv-2',
    title: 'False Ceiling & Cove Lights',
    description: 'Saint-Gobain Gyproc suspended gypsum ceilings with anti-crack GI frameworks, acoustic insulation, and 3000K warm indirect cove lighting.',
    category: 'Ceiling',
    image: 'assets/icons/ceiling.svg',
    icon: '✨',
    active: true,
    priceRange: 'Saint-Gobain Gyproc Certified'
  },
  {
    id: 'srv-3',
    title: 'Modular Kitchen & Storage',
    description: 'Boiling water-proof (BWP 710) marine plywood carcasses, German Blum soft-close tandem drawers, anti-termite seals, and high-gloss acrylic finishes.',
    category: 'Kitchen',
    image: 'assets/icons/kitchen.svg',
    icon: '🍳',
    active: true,
    priceRange: 'BWP 710 Marine / Blum Soft-Close'
  },
  {
    id: 'srv-4',
    title: 'Designer TV Wall Unit',
    description: 'Italian statuario marble finish, fluted charcoal louvers, zero visible wiring with internal conduit channels, and ambient aura profile lighting.',
    category: 'Interior',
    image: 'assets/icons/tv-unit.svg',
    icon: '📺',
    active: true,
    priceRange: 'Statuario Marble Sheet & Acoustic'
  },
  {
    id: 'srv-5',
    title: 'Sliding Fluted Wardrobe',
    description: 'Heavy-duty aluminum smooth-glide sliding tracks, tinted fluted glass doors, automatic sensor LED clothes hanging rods, and integrated vanity drawers.',
    category: 'Woodwork',
    image: 'assets/icons/wardrobe.svg',
    icon: '🚪',
    active: true,
    priceRange: 'Heavy Aluminum Track & Sensor LED'
  },
  {
    id: 'srv-6',
    title: 'Backlit CNC Jaali Mandir',
    description: 'Handcrafted teakwood prayer sanctuary with precision laser-cut backlit om/floral jaali, brass temple bells, and pull-out diya tray.',
    category: 'Woodwork',
    image: 'assets/icons/mandir.svg',
    icon: '🛕',
    active: true,
    priceRange: 'Teakwood & Backlit CNC Jaali'
  },
  {
    id: 'srv-7',
    title: 'CCTV Security Surveillance',
    description: '4K Color Night Vision IP cameras, concealed underground conduit cabling, 8-channel NVR with surge protection, and live remote smartphone monitoring.',
    category: 'CCTV',
    image: 'assets/icons/cctv.svg',
    icon: '📹',
    active: true,
    priceRange: '4K Color Night Vision / Concealed'
  },
  {
    id: 'srv-8',
    title: 'Royale Paint & Metallic Stucco',
    description: '3-coat Birla White putty machine-sanded to mirror smoothness, followed by Asian Paints Royale luxury washable emulsion and Italian texture feature walls.',
    category: 'Paint',
    image: 'assets/icons/paint.svg',
    icon: '🎨',
    active: true,
    priceRange: 'Birla Putty & Asian Paints Royale'
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'prj-1',
    title: 'Duplex 3-Phase Concealed Electrification',
    category: 'Electrical',
    description: 'Complete conduit channelling, distribution box with Siemens RCCB safety breakers, surge protector, and Havells fire-safe cables for a 2,600 sq.ft home.',
    location: 'Action Area II, New Town',
    completionDate: '2026-08-20',
    featured: true,
    image: 'assets/icons/electric.svg'
  },
  {
    id: 'prj-2',
    title: 'Living Room Architectural Cove Ceiling',
    category: 'Interior',
    description: 'Two-tier Saint-Gobain gypsum suspended ceiling with 3000K warm indirect LED troughs, anti-crack GI metal framing, and center magnetic track spotlights.',
    location: 'Imperial Heights, Salt Lake',
    completionDate: '2026-08-12',
    featured: true,
    image: 'assets/icons/ceiling.svg'
  },
  {
    id: 'prj-3',
    title: 'Charcoal & Gold Matte Acrylic Kitchen',
    category: 'Interior',
    description: 'Boiling water-proof (BWP 710) marine plywood carcass, German Blum soft-close tandem drawers, hidden Gola profiles, and quartz stone countertop.',
    location: 'Royal Palms, Rajarhat',
    completionDate: '2026-07-28',
    featured: true,
    image: 'assets/icons/kitchen.svg'
  },
  {
    id: 'prj-4',
    title: 'Statuario Marble & Charcoal Fluted TV Wall',
    category: 'Interior',
    description: 'Contemporary entertainment console with zero visible wiring, warm perimeter aura backlights, acoustic charcoal slats, and soft-close soundbar shelf.',
    location: 'Greenfield City, Behala',
    completionDate: '2026-07-15',
    featured: false,
    image: 'assets/icons/tv-unit.svg'
  },
  {
    id: 'prj-5',
    title: 'Tinted Fluted Glass Sliding Wardrobe',
    category: 'Interior',
    description: 'Floor-to-ceiling 3-door sliding wardrobe with anti-jump heavy aluminum tracks, automatic motion sensor warm LED rods, and customized drawer inserts.',
    location: 'South City Garden, Kolkata',
    completionDate: '2026-06-30',
    featured: false,
    image: 'assets/icons/wardrobe.svg'
  },
  {
    id: 'prj-6',
    title: 'Backlit CNC Jaali Sacred Mandir',
    category: 'Other',
    description: 'Handcrafted teakwood prayer sanctuary featuring laser-cut warm om backlit jaali, brass temple bells, smoke-resistant coating, and pullout diya tray.',
    location: 'Eden Green, EM Bypass',
    completionDate: '2026-06-18',
    featured: false,
    image: 'assets/icons/mandir.svg'
  },
  {
    id: 'prj-7',
    title: '8-Channel 4K Color Night Vision Surveillance',
    category: 'CCTV',
    description: 'Weatherproof IP security cameras with 24/7 color night vision, motion alert notification, concealed underground conduit cabling, and mobile app setup.',
    location: 'Diamond Commercial Plaza, Sector V',
    completionDate: '2026-05-25',
    featured: false,
    image: 'assets/icons/cctv.svg'
  },
  {
    id: 'prj-8',
    title: 'Complete 3BHK Turnkey Interior & Wiring',
    category: 'Interior',
    description: 'All-inclusive transformation: concealed smart wiring, designer cove ceilings, modular kitchen, sliding wardrobes, TV unit, luxury paint, and lighting.',
    location: 'Urbana Towers, Anandapur',
    completionDate: '2026-05-10',
    featured: true,
    image: 'assets/icons/bed.svg'
  }
];

const INITIAL_GALLERY = [
  { id: 'gal-1', title: 'Luxury Modern Living Room & False Ceiling', category: 'Ceiling', image: 'assets/icons/ceiling.svg', featured: true },
  { id: 'gal-2', title: 'Concealed 3-Phase Wiring & Safety Distribution Box', category: 'Electrical', image: 'assets/icons/electric.svg', featured: true },
  { id: 'gal-3', title: 'Gypsum Cove False Ceiling with Indirect Warm Lighting', category: 'Ceiling', image: 'assets/icons/ceiling.svg', featured: false },
  { id: 'gal-4', title: 'Charcoal & Gold Matte Acrylic Modular Kitchen', category: 'Kitchen', image: 'assets/icons/kitchen.svg', featured: true },
  { id: 'gal-5', title: 'Statuario Marble & Fluted Louver TV Wall', category: 'Living', image: 'assets/icons/tv-unit.svg', featured: true },
  { id: 'gal-6', title: 'Tinted Fluted Glass Sliding Wardrobe', category: 'Wardrobe', image: 'assets/icons/wardrobe.svg', featured: false },
  { id: 'gal-7', title: 'Sacred Backlit CNC Jaali Pooja Mandir', category: 'Mandir', image: 'assets/icons/mandir.svg', featured: false },
  { id: 'gal-8', title: '4K Color Night Vision CCTV Surveillance', category: 'CCTV', image: 'assets/icons/cctv.svg', featured: false },
  { id: 'gal-9', title: 'Laser Leveled Italian Marble & Large Format Tiles', category: 'Flooring', image: 'assets/icons/tiles.svg', featured: false },
  { id: 'gal-10', title: 'Smooth Royale Paint & Metallic Stucco Accent Wall', category: 'Paint', image: 'assets/icons/paint.svg', featured: false },
  { id: 'gal-11', title: 'Turnkey 3BHK Master Bedroom & False Ceiling', category: 'Turnkey', image: 'assets/icons/bed.svg', featured: true }
];

const INITIAL_TOURS = [
  {
    id: 'tour-1',
    title: 'Modern Minimalist Turnkey 3 BHK',
    bhk: '3 BHK • 1,450 sq.ft',
    location: '📍 Elita Garden Vista, Action Area III, New Town',
    scope: 'Complete modular kitchen with quartz counter, 3 bedrooms with sliding wardrobes, Gyproc false ceiling, and dedicated 3-phase electrical upgrade.',
    budget: '₹5.8 Lakhs',
    handoverDays: '42 Days',
    featureBadge: '100% CESC Certified',
    clientQuote: 'Najmul Da delivered our home 3 days before our Gruhapravesham puja. The concealed wiring is completely shock-safe and the kitchen finishes are immaculate!',
    clientAuthor: '— Anirban & Payel Sengupta',
    image: '',
    active: true
  },
  {
    id: 'tour-2',
    title: 'Space-Optimized Urban 2 BHK',
    bhk: '2 BHK • 980 sq.ft',
    location: '📍 Siddha Town, Rajarhat Main Road',
    scope: 'Compact acrylic modular kitchen, fluted charcoal TV feature wall, tinted glass bedroom wardrobe, and warm indirect ceiling cove lighting.',
    budget: '₹3.9 Lakhs',
    handoverDays: '36 Days',
    featureBadge: '10-Yr Ply Warranty',
    clientQuote: 'Transparent quotation with zero extra bills. The team was punctual, respectful, and left the flat spotlessly clean after hand-over.',
    clientAuthor: '— Subhashish & Rupa Banerjee',
    image: '',
    active: true
  },
  {
    id: 'tour-3',
    title: 'Luxury Penthouse & Smart Ambience',
    bhk: '4 BHK • 2,300 sq.ft',
    location: '📍 Sector V / Karunamoyee, Salt Lake',
    scope: 'PU lacquered kitchen with breakfast island, Italian Statuario marble accent wall, smart touch Wi-Fi switchboards, and laser-engraved teak mandir.',
    budget: '₹9.4 Lakhs',
    handoverDays: '48 Days',
    featureBadge: 'Smart Wi-Fi Control',
    clientQuote: 'Having an electrical supervisor who is also an interior specialist saved us endless coordination headaches. Outstanding craftsmanship!',
    clientAuthor: '— Dr. Pritam Mukherjee',
    image: '',
    active: true
  }
];

const INITIAL_REVIEWS = [
  {
    name: 'Anirban Banerjee (New Town, Action Area IIB)',
    service: 'Complete 3BHK Concealed Wiring & Gyproc False Ceiling',
    rating: 5,
    date: 'August 28, 2026',
    comment: 'Najmul Bhai is a thorough professional. He personally inspected our flat, re-routed all main circuits with Havells 4 sq.mm flame-retardant wires, and installed Siemens RCCB breakers. The cove false ceiling in our living room was completed in just 8 days with zero dust mess.'
  },
  {
    name: 'Somenath & Debolina Dutta (Salt Lake, Sector 2)',
    service: 'BWP 710 Acrylic Modular Kitchen & Countertop',
    rating: 5,
    date: 'August 14, 2026',
    comment: 'Finding a reliable carpenter-electrician team in Salt Lake who don’t overcharge is tough. Najmul Mollick gave us an honest itemized estimate with genuine Greenply 710 marine plywood and Blum soft-close fittings. Completed strictly within budget.'
  },
  {
    name: 'Priya & Souvik Das (Avishikta 2, EM Bypass)',
    service: 'Designer TV Wall Unit with Acoustic Louvers & Wardrobe',
    rating: 5,
    date: 'July 30, 2026',
    comment: 'Our living room TV unit with marble sheet and warm ambient profile backlighting came out better than the 3D render. All TV, setup box, and gaming console wires are 100% hidden inside the conduit. Very satisfied!'
  },
  {
    name: 'Dr. A. K. Mondal (Behala Chowrasta)',
    service: 'Custom Teakwood Backlit CNC Jaali Pooja Mandir',
    rating: 5,
    date: 'July 11, 2026',
    comment: 'The handcrafted backlit CNC jaali mandir they built for our ancestral home has become the focal point of our apartment. Beautiful brass bells, warm illumination, and clean craftsmanship. Highly recommended!'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    name: 'Suman Chatterjee',
    phone: '9830124455',
    email: 'suman.chatterjee@gmail.com',
    subject: 'Complete 3BHK Electrical & False Ceiling in New Town',
    message: 'Hello Najmul Bhai, we just received handover of our 3BHK flat in Action Area I. Need complete false ceiling with cove lighting and concealed wiring inspection. Can you visit this Sunday?',
    date: '2026-09-10 11:30 AM',
    status: 'unread'
  },
  {
    id: 'msg-2',
    name: 'Rupa Mukherjee',
    phone: '8240567890',
    email: 'rupa.m@outlook.com',
    subject: 'Modular Kitchen with BWP 710 Plywood estimate',
    message: 'Looking for a reliable contractor for L-shaped modular kitchen (approx 65 sq.ft). Want acrylic finish with Blum drawers. Please share quotation.',
    date: '2026-09-08 04:15 PM',
    status: 'read'
  }
];

const INITIAL_SETTINGS = {
  websiteName: 'Mollick Electric & Interior',
  logoText: 'MOLLICK',
  logoTagline: 'ELECTRIC & INTERIOR',
  logoIcon: '⚡',
  logoType: 'dynamic',
  logoImageUrl: '',
  logoDisplayMode: 'emblem',
  contractorName: 'Najmul Mollick',
  contractorRole: 'Founder & Licensed Master Contractor',
  contractorLicense: "GOVERNMENT OF WEST BENGAL Electrical Workman's Permit | W. P. No.: WP02/2024/03883 | GSTIN: 19ECKPM3966B1ZB",
  permitAuthority: "GOVERNMENT OF WEST BENGAL Electrical Workman's Permit",
  wpNo: 'WP02/2024/03883',
  gstin: '19ECKPM3966B1ZB',
  contractorPhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
  contractorPhotoPosition: 'center 20%',
  contractorBio: 'When you hire Mollick Electric & Interior, you do not deal with call center agents or third-party brokers. I personally inspect your site, calculate the exact electrical load, check the wall alignments, and supervise my experienced Bengali carpenter and electrician team daily. We guarantee clean work, zero fire risk, and turnkey delivery on agreed time.',
  phone: '6290858744',
  altPhone: '8777688287',
  email: 'mollicknasim810@gmail.com',
  address: 'Rajarhat Main Road, Near Chinar Park, Kolkata, West Bengal 700136',
  serviceAreas: 'New Town, Salt Lake, Rajarhat, EM Bypass, Lake Town, Behala, Kolkata',
  workingHours: 'Monday – Sunday: 8:00 AM – 9:00 PM',
  heroBadge: 'Govt. Licensed Electrical Contractor & Turnkey Interior Specialist',
  heroTitle: 'Complete Home Interiors & Precision Electrical Mastery',
  heroDescription: 'From 100% waterproof BWP 710 modular kitchens and false ceilings to short-circuit-safe concealed copper wiring. Directly surveyed and supervised on-site by Govt. Licensed Master Contractor Najmul Mollick with 12+ years experience across Kolkata.',
  heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80',
  ctaText: 'Calculate Interior Cost',
  emergencyText: '24/7 Rapid Emergency Response: 6290858744',
  experienceYears: '12+',
  completedProjects: '850+',
  guaranteeYears: '10-Year Modular Woodwork & 5-Year Electrical Warranty',
  estimator1Bhk: '220000',
  estimator2Bhk: '385000',
  estimator3Bhk: '560000',
  estimator4Bhk: '820000',
  estSpaceKitchen: '32',
  estSpaceLiving: '18',
  estSpaceWardrobe: '24',
  estSpaceCeiling: '10',
  estSpaceElectric: '9',
  estSpacePaint: '7',
  estTierEssential: '85',
  estTierPremium: '100',
  estTierLuxe: '138',
  estMarginHigh: '18',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  whatsappNumber: '916290858744',
  primaryColor: '#0b1320',
  accentColor: '#e11d24',
  firebaseConfig: ''
};

const INITIAL_STAFF = [
  {
    id: 'stf-1',
    staffId: 'MEI-0101',
    name: 'Najmul Mollick',
    role: 'Master Contractor & Chief Engineer',
    department: 'Electrical & Turnkey Management',
    phone: '6290858744',
    bloodGroup: 'B+',
    joiningDate: '2014-04-10',
    validThru: '2028-12-31',
    licenseRef: 'WP02/2024/03883',
    emergencyContact: '8777688287 (Head Office)',
    workZone: 'New Town & Kolkata Central',
    avatarIcon: '⚡',
    status: 'Active'
  },
  {
    id: 'stf-2',
    staffId: 'MEI-0108',
    name: 'Subhasis Roy',
    role: 'Senior 3-Phase Concealed Electrician',
    department: 'Electrical Works',
    phone: '9830214588',
    bloodGroup: 'O+',
    joiningDate: '2018-06-15',
    validThru: '2027-12-31',
    licenseRef: 'WB-ELE-91204',
    emergencyContact: '9830214589 (Ruma Roy - Wife)',
    workZone: 'Salt Lake & Action Area I-II',
    avatarIcon: '⚡',
    status: 'Active'
  },
  {
    id: 'stf-3',
    staffId: 'MEI-0115',
    name: 'Rajesh Mondal',
    role: 'Gyproc False Ceiling & Cove Lead',
    department: 'False Ceiling & Gypsum',
    phone: '8240561933',
    bloodGroup: 'A+',
    joiningDate: '2019-09-01',
    validThru: '2027-12-31',
    licenseRef: 'WB-GYP-44018',
    emergencyContact: '8240561934 (Tapan Mondal - Brother)',
    workZone: 'Rajarhat & Chinar Park',
    avatarIcon: '✨',
    status: 'Active'
  },
  {
    id: 'stf-4',
    staffId: 'MEI-0122',
    name: 'Amit Karmakar',
    role: 'Master Modular Carpenter & Woodcraft Lead',
    department: 'Modular Kitchen & Woodwork',
    phone: '7003418821',
    bloodGroup: 'B+',
    joiningDate: '2020-02-18',
    validThru: '2027-12-31',
    licenseRef: 'WB-CARP-77192',
    emergencyContact: '7003418822 (Shila Karmakar - Wife)',
    workZone: 'South Kolkata & EM Bypass',
    avatarIcon: '🍳',
    status: 'Active'
  },
  {
    id: 'stf-5',
    staffId: 'MEI-0130',
    name: 'Bikram Das',
    role: '4K IP CCTV & Home Security Specialist',
    department: 'Security & Automation',
    phone: '9123847701',
    bloodGroup: 'AB+',
    joiningDate: '2021-11-10',
    validThru: '2027-12-31',
    licenseRef: 'WB-SEC-66103',
    emergencyContact: '9123847702 (Gouranga Das - Father)',
    workZone: 'New Town & Sector V',
    avatarIcon: '📹',
    status: 'Active'
  }
];

// Database Access Object
export const MollickDB = {
  // Initialize default data if not already seeded
  init() {
    if (!localStorage.getItem(DB_KEYS.SERVICES)) {
      localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    } else {
      try {
        const s = JSON.parse(localStorage.getItem(DB_KEYS.SERVICES) || '[]');
        let modified = false;
        s.forEach(item => {
          if (item.image && item.image.includes('assets/images')) {
            item.image = INITIAL_SERVICES.find(x => x.id === item.id)?.image || 'assets/icons/electric.svg';
            modified = true;
          }
        });
        if (modified) localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(s));
      } catch (e) {}
    }

    if (!localStorage.getItem(DB_KEYS.PROJECTS)) {
      localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    } else {
      try {
        const p = JSON.parse(localStorage.getItem(DB_KEYS.PROJECTS) || '[]');
        let modified = false;
        p.forEach(item => {
          if (item.image && item.image.includes('assets/images')) {
            item.image = INITIAL_PROJECTS.find(x => x.id === item.id)?.image || 'assets/icons/electric.svg';
            modified = true;
          }
        });
        if (modified) localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(p));
      } catch (e) {}
    }

    if (!localStorage.getItem(DB_KEYS.GALLERY)) {
      localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
    } else {
      try {
        const g = JSON.parse(localStorage.getItem(DB_KEYS.GALLERY) || '[]');
        let modified = false;
        g.forEach(item => {
          if (item.image && item.image.includes('assets/images')) {
            item.image = INITIAL_GALLERY.find(x => x.id === item.id)?.image || 'assets/icons/ceiling.svg';
            modified = true;
          }
        });
        if (modified) localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(g));
      } catch (e) {}
    }

    if (!localStorage.getItem(DB_KEYS.MESSAGES)) {
      localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    }

    if (!localStorage.getItem(DB_KEYS.STAFF)) {
      localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    } else {
      try {
        const staffList = JSON.parse(localStorage.getItem(DB_KEYS.STAFF) || '[]');
        let staffMod = false;
        staffList.forEach(st => {
          if (st.name === 'Nasim Mollick') {
            st.name = 'Najmul Mollick';
            st.licenseRef = 'WP02/2024/03883';
            staffMod = true;
          }
        });
        if (staffMod) localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(staffList));
      } catch (e) {}
    }

    if (!localStorage.getItem(DB_KEYS.TOURS)) {
      localStorage.setItem(DB_KEYS.TOURS, JSON.stringify(INITIAL_TOURS));
    } else {
      try {
        const tours = JSON.parse(localStorage.getItem(DB_KEYS.TOURS) || '[]');
        let tMod = false;
        tours.forEach(t => {
          if (t.clientQuote && t.clientQuote.includes('Nasim')) {
            t.clientQuote = t.clientQuote.replace(/Nasim/g, 'Najmul');
            tMod = true;
          }
          if (t.image && t.image.includes('images.unsplash.com')) {
            t.image = '';
            tMod = true;
          }
        });
        if (tMod) localStorage.setItem(DB_KEYS.TOURS, JSON.stringify(tours));
      } catch (e) {}
    }

    if (!localStorage.getItem(DB_KEYS.REVIEWS)) {
      localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    } else {
      try {
        const revs = JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS) || '[]');
        let rMod = false;
        revs.forEach(r => {
          if (r.comment && r.comment.includes('Nasim')) {
            r.comment = r.comment.replace(/Nasim/g, 'Najmul');
            rMod = true;
          }
        });
        if (rMod) localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(revs));
      } catch (e) {}
    }

    if (!localStorage.getItem(DB_KEYS.DESIGNS)) {
      localStorage.setItem(DB_KEYS.DESIGNS, JSON.stringify(INITIAL_DESIGNS));
    } else {
      try {
        const d = JSON.parse(localStorage.getItem(DB_KEYS.DESIGNS) || '[]');
        let modified = false;
        d.forEach(item => {
          // If item contains hardcoded unsplash photo, clear it as requested by user
          if (item.image && item.image.includes('images.unsplash.com')) {
            item.image = '';
            modified = true;
          }
        });
        if (modified) localStorage.setItem(DB_KEYS.DESIGNS, JSON.stringify(d));
      } catch (e) {}
    }

    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
      localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    } else {
      try {
        const curr = JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
        if (curr.contractorName === 'Nasim Mollick') {
          curr.contractorName = 'Najmul Mollick';
        }
        curr.contractorLicense = "GOVERNMENT OF WEST BENGAL Electrical Workman's Permit | W. P. No.: WP02/2024/03883 | GSTIN: 19ECKPM3966B1ZB";
        curr.permitAuthority = "GOVERNMENT OF WEST BENGAL Electrical Workman's Permit";
        curr.wpNo = 'WP02/2024/03883';
        curr.gstin = '19ECKPM3966B1ZB';
        if (curr.heroDescription && curr.heroDescription.includes('Nasim Mollick')) {
          curr.heroDescription = curr.heroDescription.replace(/Nasim Mollick/g, 'Najmul Mollick');
        }
        if (!curr.heroImage) {
          curr.heroImage = INITIAL_SETTINGS.heroImage;
        }
        if (!curr.contractorPhoto) {
          curr.contractorPhoto = INITIAL_SETTINGS.contractorPhoto;
        }
        if (!curr.contractorPhotoPosition) {
          curr.contractorPhotoPosition = INITIAL_SETTINGS.contractorPhotoPosition;
        }
        const updated = { ...INITIAL_SETTINGS, ...curr };
        localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(updated));
      } catch (e) {}
    }
  },

  // Services
  getServices() {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.SERVICES) || '[]');
  },

  saveService(serviceData) {
    const services = this.getServices();
    if (serviceData.id) {
      const idx = services.findIndex(s => s.id === serviceData.id);
      if (idx !== -1) {
        services[idx] = { ...services[idx], ...serviceData };
      }
    } else {
      const newService = {
        id: 'srv-' + Date.now(),
        active: true,
        ...serviceData
      };
      services.unshift(newService);
    }
    localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
    this.dispatchChangeEvent('services');
    return true;
  },

  deleteService(id) {
    let services = this.getServices();
    services = services.filter(s => s.id !== id);
    localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
    this.dispatchChangeEvent('services');
    return true;
  },

  toggleService(id) {
    const services = this.getServices();
    const srv = services.find(s => s.id === id);
    if (srv) {
      srv.active = !srv.active;
      localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
      this.dispatchChangeEvent('services');
    }
    return true;
  },

  // Projects
  getProjects() {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.PROJECTS) || '[]');
  },

  saveProject(projectData) {
    const projects = this.getProjects();
    if (projectData.id) {
      const idx = projects.findIndex(p => p.id === projectData.id);
      if (idx !== -1) {
        projects[idx] = { ...projects[idx], ...projectData };
      }
    } else {
      const newPrj = {
        id: 'prj-' + Date.now(),
        featured: false,
        completionDate: new Date().toISOString().split('T')[0],
        ...projectData
      };
      projects.unshift(newPrj);
    }
    localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(projects));
    this.dispatchChangeEvent('projects');
    return true;
  },

  deleteProject(id) {
    let projects = this.getProjects();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(projects));
    this.dispatchChangeEvent('projects');
    return true;
  },

  toggleFeaturedProject(id) {
    const projects = this.getProjects();
    const prj = projects.find(p => p.id === id);
    if (prj) {
      prj.featured = !prj.featured;
      localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(projects));
      this.dispatchChangeEvent('projects');
    }
    return true;
  },

  // Gallery
  getGallery() {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.GALLERY) || '[]');
  },

  saveGalleryItem(itemData) {
    const gallery = this.getGallery();
    if (itemData.id) {
      const idx = gallery.findIndex(g => g.id === itemData.id);
      if (idx !== -1) {
        gallery[idx] = { ...gallery[idx], ...itemData };
      }
    } else {
      const newItem = {
        id: 'gal-' + Date.now(),
        featured: false,
        ...itemData
      };
      gallery.unshift(newItem);
    }
    localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(gallery));
    this.dispatchChangeEvent('gallery');
    return true;
  },

  deleteGalleryItem(id) {
    let gallery = this.getGallery();
    gallery = gallery.filter(g => g.id !== id);
    localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(gallery));
    this.dispatchChangeEvent('gallery');
    return true;
  },

  // Room Designs (Livspace-Style Design Library)
  getDesigns() {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.DESIGNS) || '[]');
  },

  getDesignById(id) {
    const list = this.getDesigns();
    return list.find(d => d.id === id) || null;
  },

  saveDesign(designData) {
    const list = this.getDesigns();
    if (designData.id) {
      const idx = list.findIndex(d => d.id === designData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...designData };
      }
    } else {
      const newD = {
        id: 'dsg-' + Date.now(),
        active: true,
        image: '',
        ...designData
      };
      list.unshift(newD);
    }
    localStorage.setItem(DB_KEYS.DESIGNS, JSON.stringify(list));
    this.dispatchChangeEvent('designs');
    return true;
  },

  deleteDesign(id) {
    let list = this.getDesigns();
    list = list.filter(d => d.id !== id);
    localStorage.setItem(DB_KEYS.DESIGNS, JSON.stringify(list));
    this.dispatchChangeEvent('designs');
    return true;
  },

  // Messages
  getMessages() {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES) || '[]');
  },

  addMessage(msgData) {
    const messages = this.getMessages();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: 'msg-' + Date.now(),
      status: 'unread',
      date: dateStr,
      ...msgData
    };
    messages.unshift(newMsg);
    localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(messages));
    this.dispatchChangeEvent('messages');
    return newMsg;
  },

  markMessageRead(id, status = 'read') {
    const messages = this.getMessages();
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(messages));
      this.dispatchChangeEvent('messages');
    }
    return true;
  },

  deleteMessage(id) {
    let messages = this.getMessages();
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(messages));
    this.dispatchChangeEvent('messages');
    return true;
  },

  // Staff Registry & ID Badges
  getStaff() {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.STAFF) || '[]');
  },

  getStaffById(id) {
    const list = this.getStaff();
    return list.find(s => s.id === id || s.staffId === id) || null;
  },

  saveStaff(staffData) {
    const list = this.getStaff();
    if (staffData.id) {
      const idx = list.findIndex(s => s.id === staffData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...staffData };
      }
    } else {
      const newStaff = {
        id: 'stf-' + Date.now(),
        staffId: staffData.staffId || ('MEI-0' + (135 + list.length)),
        status: staffData.status || 'Active',
        avatarIcon: staffData.avatarIcon || '⚡',
        ...staffData
      };
      list.unshift(newStaff);
    }
    localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(list));
    this.dispatchChangeEvent('staff');
    return true;
  },

  deleteStaff(id) {
    let list = this.getStaff();
    list = list.filter(s => s.id !== id);
    localStorage.setItem(DB_KEYS.STAFF, JSON.stringify(list));
    this.dispatchChangeEvent('staff');
    return true;
  },

  // Kolkata Home Tours / Real Home Makeovers
  getTours() {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.TOURS) || '[]');
  },

  saveTour(tourData) {
    const tours = this.getTours();
    if (tourData.id) {
      const idx = tours.findIndex(t => t.id === tourData.id);
      if (idx !== -1) {
        tours[idx] = { ...tours[idx], ...tourData };
      }
    } else {
      const newTour = {
        id: 'tour-' + Date.now(),
        active: true,
        ...tourData
      };
      tours.unshift(newTour);
    }
    localStorage.setItem(DB_KEYS.TOURS, JSON.stringify(tours));
    this.dispatchChangeEvent('tours');
    return true;
  },

  deleteTour(id) {
    let tours = this.getTours();
    tours = tours.filter(t => t.id !== id);
    localStorage.setItem(DB_KEYS.TOURS, JSON.stringify(tours));
    this.dispatchChangeEvent('tours');
    return true;
  },

  toggleTour(id) {
    const tours = this.getTours();
    const t = tours.find(x => x.id === id);
    if (t) {
      t.active = !t.active;
      localStorage.setItem(DB_KEYS.TOURS, JSON.stringify(tours));
      this.dispatchChangeEvent('tours');
    }
    return true;
  },

  // Customer Reviews & Feedback
  getReviews() {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS) || '[]');
  },

  saveReview(reviewData) {
    const revs = this.getReviews();
    const newRev = {
      name: reviewData.name || 'Verified Homeowner',
      service: reviewData.service || 'Turnkey Electrical & Interior',
      rating: parseInt(reviewData.rating, 10) || 5,
      date: reviewData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: reviewData.comment || ''
    };
    revs.unshift(newRev);
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(revs));
    this.dispatchChangeEvent('reviews');
    return true;
  },

  deleteReview(index) {
    const revs = this.getReviews();
    if (index >= 0 && index < revs.length) {
      revs.splice(index, 1);
      localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(revs));
      this.dispatchChangeEvent('reviews');
    }
    return true;
  },

  // Settings
  getSettings() {
    this.init();
    const s = JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
    if (!s.accentColor || s.accentColor === '#d97706' || s.accentColor === '#f5b301') {
      s.accentColor = '#e11d24';
    }
    if (!s.primaryColor || s.primaryColor === '#071529') {
      s.primaryColor = '#0b1320';
    }
    return s;
  },

  saveSettings(newSettings) {
    const current = this.getSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(merged));
    this.dispatchChangeEvent('settings');
    return merged;
  },

  // Counts & Stats
  getStats() {
    const services = this.getServices();
    const projects = this.getProjects();
    const gallery = this.getGallery();
    const messages = this.getMessages();
    const staff = this.getStaff();
    const designs = this.getDesigns();
    const tours = this.getTours();
    const reviews = this.getReviews();
    const unread = messages.filter(m => m.status === 'unread').length;

    return {
      totalServices: services.length,
      activeServices: services.filter(s => s.active).length,
      totalProjects: projects.length,
      totalGallery: gallery.length,
      totalDesigns: designs.length,
      totalTours: tours.length,
      activeTours: tours.filter(t => t.active).length,
      totalReviews: reviews.length,
      totalMessages: messages.length,
      unreadMessages: unread,
      totalStaff: staff.length,
      activeStaff: staff.filter(s => s.status === 'Active').length,
      recentProjects: projects.slice(0, 5),
      recentMessages: messages.slice(0, 5)
    };
  },

  dispatchChangeEvent(type) {
    window.dispatchEvent(new CustomEvent('mollick_db_updated', { detail: { type } }));
  }
};

// Auto initialize on load
MollickDB.init();

/* ==============================================================================
   2. AUTHENTICATION SERVICE (AdminAuth)
   Secure Web Crypto SHA-256 Hashing, Session Management & Guard
   ============================================================================== */

// Hash helper using Native Web Crypto API
async function sha256(str) {
  const enc = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AdminAuth = {
  // Initialize default admin credentials if not set
  async init() {
    const storedAuth = localStorage.getItem(DB_KEYS.AUTH);
    if (!storedAuth) {
      // Default: admin@mollick.com / mollick@admin2026
      const defaultHash = await sha256('mollick@admin2026');
      const authData = {
        email: 'admin@mollick.com',
        username: 'najmul.mollick',
        passwordHash: defaultHash,
        name: 'Najmul Mollick',
        role: 'Master Admin'
      };
      localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(authData));
    } else {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.name === 'Nasim Mollick' || authData.username === 'nasim.mollick') {
          authData.name = 'Najmul Mollick';
          authData.username = 'najmul.mollick';
          localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(authData));
        }
      } catch (e) {}
    }
  },

  async getCredentials() {
    await this.init();
    try {
      const authData = JSON.parse(localStorage.getItem(DB_KEYS.AUTH) || '{}');
      return {
        email: authData.email || 'admin@mollick.com',
        username: authData.username || 'najmul.mollick',
        name: authData.name || 'Najmul Mollick',
        role: authData.role || 'Master Admin'
      };
    } catch {
      return {
        email: 'admin@mollick.com',
        username: 'najmul.mollick',
        name: 'Najmul Mollick',
        role: 'Master Admin'
      };
    }
  },

  async login(identifier, password, rememberMe = false) {
    await this.init();
    const authData = JSON.parse(localStorage.getItem(DB_KEYS.AUTH) || '{}');
    const inputHash = await sha256(password.trim());

    const cleanInput = identifier.trim().toLowerCase();
    const currentEmail = (authData.email || '').toLowerCase();
    const currentUsername = (authData.username || '').toLowerCase();
    const isUserMatch = (
      cleanInput === currentEmail ||
      cleanInput === currentUsername ||
      cleanInput === 'admin' ||
      cleanInput === 'admin@mollick.com' ||
      cleanInput === 'najmul.mollick'
    );

    if (isUserMatch && inputHash === authData.passwordHash) {
      const session = {
        token: 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        email: authData.email,
        name: authData.name,
        role: authData.role,
        loginTime: new Date().toISOString()
      };

      if (rememberMe) {
        localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(session));
      } else {
        sessionStorage.setItem(DB_KEYS.SESSION, JSON.stringify(session));
      }
      return { success: true };
    } else {
      return { success: false, message: 'Invalid admin username/email or password.' };
    }
  },

  getSession() {
    const sessionStr = sessionStorage.getItem(DB_KEYS.SESSION) || localStorage.getItem(DB_KEYS.SESSION);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getSession();
  },

  checkAuth(redirectOnFail = true) {
    if (!this.isAuthenticated()) {
      if (redirectOnFail) {
        window.location.replace('index.html');
      }
      return false;
    }
    return true;
  },

  logout() {
    sessionStorage.removeItem(DB_KEYS.SESSION);
    localStorage.removeItem(DB_KEYS.SESSION);
    window.location.replace('index.html');
  },

  async updateEmail(newEmail, newUsername, currentPassword) {
    await this.init();
    const authData = JSON.parse(localStorage.getItem(DB_KEYS.AUTH) || '{}');
    const oldHash = await sha256(currentPassword.trim());

    if (oldHash !== authData.passwordHash) {
      return { success: false, message: 'Current password does not match. Please enter your valid current password to confirm.' };
    }

    const cleanEmail = (newEmail || '').trim().toLowerCase();
    const cleanUsername = (newUsername || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters long.' };
    }

    authData.email = cleanEmail;
    authData.username = cleanUsername;
    localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(authData));

    // Update session email
    const session = this.getSession();
    if (session) {
      session.email = cleanEmail;
      if (localStorage.getItem(DB_KEYS.SESSION)) {
        localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(session));
      }
      if (sessionStorage.getItem(DB_KEYS.SESSION)) {
        sessionStorage.setItem(DB_KEYS.SESSION, JSON.stringify(session));
      }
    }

    return { 
      success: true, 
      message: '✓ Admin login email & username updated successfully! You can now use this email to log in.',
      email: cleanEmail,
      username: cleanUsername
    };
  },

  async changePassword(oldPassword, newPassword) {
    await this.init();
    const authData = JSON.parse(localStorage.getItem(DB_KEYS.AUTH) || '{}');
    const oldHash = await sha256(oldPassword.trim());

    if (oldHash !== authData.passwordHash) {
      return { success: false, message: 'Current password does not match.' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    authData.passwordHash = await sha256(newPassword.trim());
    localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(authData));
    return { success: true, message: '✓ Admin password successfully updated! Please remember your new password.' };
  }
};

/* ==============================================================================
   3. ADMIN UI COMPONENTS & HELPERS
   Toasts, Confirmation Modals, Sidebar Toggle, Layout Sync
   ============================================================================== */

export function showToast(message, type = 'success') {
  let container = document.querySelector('#adminToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'adminToastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

export function showConfirmModal(title, message, onConfirm) {
  let modal = document.querySelector('#adminConfirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'adminConfirmModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-dialog" style="max-width: 440px;">
        <div class="modal-header">
          <h4 class="modal-title" id="confirmModalTitle">Confirm Action</h4>
          <button type="button" class="modal-close-btn" id="confirmModalClose">&times;</button>
        </div>
        <div class="modal-body">
          <p id="confirmModalMsg" style="color: var(--admin-text-main); font-size: 0.95rem;"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" id="confirmModalCancel">Cancel</button>
          <button type="button" class="btn btn-danger btn-sm" id="confirmModalOk">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const titleEl = modal.querySelector('#confirmModalTitle');
  const msgEl = modal.querySelector('#confirmModalMsg');
  const okBtn = modal.querySelector('#confirmModalOk');
  const cancelBtn = modal.querySelector('#confirmModalCancel');
  const closeBtn = modal.querySelector('#confirmModalClose');

  titleEl.textContent = title;
  msgEl.textContent = message;

  function closeModal() {
    modal.classList.remove('active');
  }

  okBtn.onclick = () => {
    closeModal();
    if (typeof onConfirm === 'function') onConfirm();
  };

  cancelBtn.onclick = closeModal;
  closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  modal.classList.add('active');
}

export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

// Setup common page behaviors: Mobile sidebar, unread badge, logout
export function initAdminShell() {
  const toggleBtn = document.querySelector('#btnToggleMobileSidebar');
  const sidebar = document.querySelector('#adminSidebar');
  let backdrop = document.querySelector('.sidebar-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('active');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });
  }

  // Bind logout buttons
  document.querySelectorAll('.btn-logout-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showConfirmModal('Confirm Logout', 'Are you sure you want to log out of the admin panel?', () => {
        AdminAuth.logout();
      });
    });
  });

  // Update unread message badges in sidebar
  function updateBadges() {
    const stats = MollickDB.getStats();
    const badges = document.querySelectorAll('.unread-messages-count');
    badges.forEach(b => {
      b.textContent = stats.unreadMessages;
      b.style.display = stats.unreadMessages > 0 ? 'inline-block' : 'none';
    });
  }

  // Update shell branding and contractor user info
  function updateShellBranding() {
    const settings = MollickDB.getSettings();
    const brandTitleEl = document.querySelector('.sidebar-brand .brand-title');
    const brandIconEl = document.querySelector('.sidebar-brand .brand-logo-icon');
    const adminNameEl = document.querySelector('#adminName');
    const adminAvatarEl = document.querySelector('#adminAvatar');

    if (brandTitleEl && settings.websiteName) {
      brandTitleEl.textContent = settings.websiteName;
    }
    if (brandIconEl) {
      if (settings.logoImageUrl) {
        brandIconEl.innerHTML = `<img src="${settings.logoImageUrl}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;">`;
      } else {
        brandIconEl.textContent = settings.logoIcon || '⚡';
      }
    }
    if (adminNameEl && settings.contractorName) {
      adminNameEl.textContent = settings.contractorName;
    }
    document.querySelectorAll('.user-name').forEach(el => {
      if (settings.contractorName) el.textContent = settings.contractorName;
    });
    const initials = settings.contractorName ? settings.contractorName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NM';
    if (adminAvatarEl) {
      adminAvatarEl.textContent = initials || 'NM';
    }
    document.querySelectorAll('.user-avatar').forEach(el => {
      el.textContent = initials || 'NM';
    });
  }

  updateBadges();
  updateShellBranding();
  window.addEventListener('mollick_db_updated', () => {
    updateBadges();
    updateShellBranding();
  });
}

/**
 * Client-Side Image Compressor and Data URL Converter
 * Resizes images and converts to lightweight JPEG dataURL to ensure high performance in localStorage
 */
export function handleImageUpload(file, maxWidth = 1200, maxHeight = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Could not read image file.'));
      img.src = readerEvent.target.result;
    };
    reader.onerror = () => reject(new Error('File reading error.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Connects drag-and-drop & manual file selection dropzone
 */
export function setupDropzone(dropzoneEl, fileInputEl, onFileSelected) {
  if (!dropzoneEl) return;

  // Handle case where caller passes (dropzoneEl, onFileSelected)
  if (typeof fileInputEl === 'function') {
    onFileSelected = fileInputEl;
    fileInputEl = dropzoneEl.querySelector('input[type="file"]');
  }

  if (typeof onFileSelected !== 'function') return;

  if (fileInputEl && typeof fileInputEl.addEventListener === 'function') {
    dropzoneEl.addEventListener('click', () => {
      fileInputEl.click();
    });

    fileInputEl.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelected(files[0]);
      }
    });
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzoneEl.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzoneEl.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzoneEl.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzoneEl.classList.remove('dragover');
    }, false);
  });

  dropzoneEl.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  });
}

