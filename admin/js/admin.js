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
  AUTH: 'mollick_db_auth',
  SESSION: 'mollick_admin_session'
};

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

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    name: 'Suman Chatterjee',
    phone: '9830124455',
    email: 'suman.chatterjee@gmail.com',
    subject: 'Complete 3BHK Electrical & False Ceiling in New Town',
    message: 'Hello Nasim Bhai, we just received handover of our 3BHK flat in Action Area I. Need complete false ceiling with cove lighting and concealed wiring inspection. Can you visit this Sunday?',
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
  contractorName: 'Nasim Mollick',
  contractorRole: 'Founder & Licensed Master Contractor',
  contractorLicense: 'Govt. Electrical Contractor Lic #WB/KOL/2014-9982',
  phone: '6290858744',
  altPhone: '8777688287',
  email: 'mollicknasim810@gmail.com',
  address: 'Rajarhat Main Road, Near Chinar Park, Kolkata, West Bengal 700136',
  serviceAreas: 'New Town, Salt Lake, Rajarhat, EM Bypass, Lake Town, Behala, Kolkata',
  workingHours: 'Monday – Sunday: 8:00 AM – 9:00 PM',
  heroTitle: 'Powering Spaces, Defining Lifestyles',
  heroDescription: 'Kolkata’s premier electrical engineering & turnkey interior craftsmanship. Directly supervised on-site by Govt. Licensed Master Contractor Nasim Mollick.',
  ctaText: 'Get Free Site Inspection',
  emergencyText: '24/7 Rapid Emergency Response: 6290858744',
  experienceYears: '12+',
  completedProjects: '850+',
  guaranteeYears: '5-Year Workmanship Warranty',
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
    name: 'Nasim Mollick',
    role: 'Master Contractor & Chief Engineer',
    department: 'Electrical & Turnkey Management',
    phone: '6290858744',
    bloodGroup: 'B+',
    joiningDate: '2014-04-10',
    validThru: '2028-12-31',
    licenseRef: 'WB-ELE-88421',
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
    }

    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
      localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    } else {
      try {
        const curr = JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
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
    const unread = messages.filter(m => m.status === 'unread').length;

    return {
      totalServices: services.length,
      activeServices: services.filter(s => s.active).length,
      totalProjects: projects.length,
      totalGallery: gallery.length,
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
        username: 'nasim.mollick',
        passwordHash: defaultHash,
        name: 'Nasim Mollick',
        role: 'Master Admin'
      };
      localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(authData));
    }
  },

  async login(identifier, password, rememberMe = false) {
    await this.init();
    const authData = JSON.parse(localStorage.getItem(DB_KEYS.AUTH) || '{}');
    const inputHash = await sha256(password.trim());

    const cleanInput = identifier.trim().toLowerCase();
    const isUserMatch = (cleanInput === authData.email.toLowerCase() || cleanInput === authData.username.toLowerCase());

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
    return { success: true, message: 'Password updated successfully!' };
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
    if (adminAvatarEl && settings.contractorName) {
      const initials = settings.contractorName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
      adminAvatarEl.textContent = initials || 'NM';
    }
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
  if (!dropzoneEl || !fileInputEl) return;

  dropzoneEl.addEventListener('click', () => {
    fileInputEl.click();
  });

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

  fileInputEl.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  });
}

