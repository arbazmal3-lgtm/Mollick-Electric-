/**
 * ==============================================================================
 * MOLLICK ELECTRIC & INTERIOR - SCRIPT.JS
 * Vanilla JavaScript (ES6+) - Clean, Modular, Production-Ready
 * No frameworks, no external dependencies, fully compatible with VS Code
 * ==============================================================================
 */

/* ------------------------------------------------------------------------------
   0. ADMIN ACCESS SHORTCUT & HASH ROUTER (#admin)
   When "#admin" is typed in URL (e.g. site.com/#admin), clicked as link,
   or typed on the keyboard, immediately open the Admin Panel.
   ------------------------------------------------------------------------------ */
(function setupAdminAccess() {
  function getAdminPath() {
    if (window.location.pathname.includes('/admin/')) {
      return 'index.html';
    }
    return 'admin/index.html';
  }

  function handleAdminCheck() {
    try {
      const rawHash = window.location.hash || '';
      const hash = rawHash.trim().toLowerCase();
      if (
        hash === '#admin' ||
        hash === '#adminpanel' ||
        hash === '#admin-panel' ||
        hash === '#adminportal' ||
        hash === '#login' ||
        hash.startsWith('#admin?') ||
        hash.startsWith('#admin/')
      ) {
        window.location.href = getAdminPath();
        return true;
      }
    } catch (err) {
      console.warn('Admin hash routing warning:', err);
    }
    return false;
  }

  // Check immediately upon script execution (before DOMContentLoaded)
  handleAdminCheck();

  // Listen for hash changes (e.g., user types #admin in the URL bar and hits Enter)
  window.addEventListener('hashchange', handleAdminCheck);
  window.addEventListener('DOMContentLoaded', handleAdminCheck);
  window.addEventListener('pageshow', handleAdminCheck);

  // Keyboard detection:
  // 1. Secret typing sequence: typing "#admin" or "admin" on keyboard
  // 2. Keyboard shortcut: Ctrl+Shift+A or Alt+A
  let typedBuffer = '';
  let resetBufferTimer = null;

  window.addEventListener('keydown', (e) => {
    // 1. Direct keyboard shortcut (Ctrl+Shift+A or Alt+A)
    if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))) {
      e.preventDefault();
      window.location.href = getAdminPath();
      return;
    }

    const activeEl = document.activeElement;
    const isInput = activeEl && (
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.isContentEditable
    );

    // If user typed inside an input and pressed Enter, check if value is "#admin"
    if (isInput) {
      if (e.key === 'Enter') {
        const val = (activeEl.value || '').trim().toLowerCase();
        if (val === '#admin' || val === 'admin' || val === '#adminpanel') {
          e.preventDefault();
          window.location.href = getAdminPath();
          return;
        }
      }
      return;
    }

    // Capture sequence when typing generally on the page
    if (e.key && e.key.length === 1) {
      typedBuffer += e.key.toLowerCase();
      if (typedBuffer.length > 20) {
        typedBuffer = typedBuffer.slice(-20);
      }

      clearTimeout(resetBufferTimer);
      resetBufferTimer = setTimeout(() => {
        typedBuffer = '';
      }, 3500);

      if (
        typedBuffer.endsWith('#admin') ||
        typedBuffer.endsWith('admin#') ||
        typedBuffer.endsWith('#adminpanel') ||
        typedBuffer.endsWith('#login')
      ) {
        typedBuffer = '';
        window.location.href = getAdminPath();
      }
    }
  });

  // Intercept click on any link with href="#admin"
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href="#admin"], a[href="#adminpanel"], a[href="#login"]');
    if (link) {
      e.preventDefault();
      window.location.href = getAdminPath();
    }
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initActiveNavLink();
  initCounters();
  initProjectFilter();
  initGalleryLightbox();
  initFaqAccordion();
  initBackToTop();
  initContactForm();
  initFeedbackSystem();
  initServiceModal();
  initLivspaceEstimator();
  initLivspaceRoomGallery();
  initHomeTours();
  initLivspaceConsultModal();
  initHeroQuickEstimate();
  syncPublicSiteWithAdminDB();
});

/* ------------------------------------------------------------------------------
   1. MOBILE NAVIGATION DRAWER
   ------------------------------------------------------------------------------ */
function initMobileMenu() {
  const hamburger = document.querySelector('#hamburgerBtn');
  const mobileMenu = document.querySelector('#mobileMenu');
  const mobileOverlay = document.querySelector('#mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu || !mobileOverlay) return;

  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-active');
    mobileOverlay.classList.toggle('is-active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  }

  function closeMenu() {
    hamburger.classList.remove('is-active');
    mobileMenu.classList.remove('is-active');
    mobileOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ------------------------------------------------------------------------------
   2. STICKY HEADER SCROLL EFFECT
   ------------------------------------------------------------------------------ */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ------------------------------------------------------------------------------
   3. ACTIVE NAVIGATION LINK STATE
   ------------------------------------------------------------------------------ */
function initActiveNavLink() {
  const path = window.location.pathname;
  const currentPage = path.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ------------------------------------------------------------------------------
   4. ANIMATED NUMBER COUNTERS (INTERSECTION OBSERVER)
   ------------------------------------------------------------------------------ */
function initCounters() {
  const counterElements = document.querySelectorAll('.stat-number');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800; // milliseconds
        const frameRate = 30;
        const totalSteps = duration / frameRate;
        let currentStep = 0;

        const counterInterval = setInterval(() => {
          currentStep++;
          const progress = currentStep / totalSteps;
          const currentNumber = Math.floor(targetValue * easeOutQuad(progress));
          el.textContent = currentNumber + suffix;

          if (currentStep >= totalSteps) {
            el.textContent = targetValue + suffix;
            clearInterval(counterInterval);
          }
        }, frameRate);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));

  function easeOutQuad(t) {
    return t * (2 - t);
  }
}

/* ------------------------------------------------------------------------------
   5. PROJECT FILTER SYSTEM
   ------------------------------------------------------------------------------ */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ------------------------------------------------------------------------------
   6. GALLERY & FULLSCREEN LIGHTBOX
   ------------------------------------------------------------------------------ */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('#lightboxModal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-caption-title');
  const lightboxSub = lightbox.querySelector('.lightbox-caption-sub');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-prev-btn');
  const nextBtn = lightbox.querySelector('.lightbox-next-btn');

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = itemsArray[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || 'Project Showcase';
    const cat = item.getAttribute('data-category') || 'Mollick Electric & Interior';
    const tagline = item.querySelector('.project-spec-tagline')?.textContent || '';
    const materials = item.querySelector('.project-spec-materials')?.textContent || '';

    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = title;
      lightboxImg.style.display = 'block';
    } else {
      lightboxImg.style.display = 'none';
    }
    lightboxTitle.textContent = title;
    lightboxSub.textContent = [cat, tagline, materials].filter(Boolean).join(' • ');

    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % itemsArray.length;
    openLightbox(currentIndex);
  }

  itemsArray.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  // Close when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

/* ------------------------------------------------------------------------------
   7. SERVICES DATA STORE & MODAL SYSTEM
   ------------------------------------------------------------------------------ */
const SERVICES_DATA = {
  'electric': {
    title: 'Concealed Electrical & Smart Wiring',
    desc: 'Complete industrial & residential electrification. Includes copper conduit pipe fitting, distribution board installation, MCB/RCCB safety breakers, phase load balancing, luxury smart touch switches, inverter setup, and certified fire-safe testing.',
    points: [
      'Short-circuit & shock prevention wiring',
      'Havells/Finolex ISI-grade copper cables',
      'Smart home automation and sensor controls',
      'Phase load calculation and safety certification'
    ]
  },
  'ceiling': {
    title: 'Designer POP & Gypsum False Ceiling',
    desc: 'Architectural suspended false ceilings tailored for living rooms, bedrooms, and dining halls. Features seamless cove profiles, indirect warm amber LED troughing, magnetic track spotlights, and sound dampening gypsum boards.',
    points: [
      'Zero-crack GI metal framing infrastructure',
      'Hidden warm LED cove trough profile',
      'Spotlight and pendant light integration',
      'Moisture-resistant drywall boards'
    ]
  },
  'kitchen': {
    title: 'Modular Acrylic & PU Kitchens',
    desc: 'Engineered for Indian cooking conditions. Heavy-duty waterproof marine-grade BWR/BWP plywood carcass, acrylic / PU high gloss shutters, soft-close Blum/Hettich tandem boxes, corner carousels, and quartz stone countertops.',
    points: [
      '100% boiling water-proof (BWP) plywood',
      'German soft-close drawer slides & hinges',
      'Under-cabinet sensor task lighting',
      'Heat, stain, and scratch-resistant finishes'
    ]
  },
  'tv-unit': {
    title: 'Contemporary TV Entertainment Units',
    desc: 'Bespoke entertainment walls featuring Italian marble sheets or nano-white backdrops, acoustic fluted charcoal/teak louvers, concealed wire management, soundbar floating shelves, and back-lit LED aura.',
    points: [
      'Zero visible cables or power cords',
      'Acoustic wooden slatted side paneling',
      'Statuario marble backdrop with backlights',
      'Push-to-open soft closing media storage'
    ]
  },
  'wardrobe': {
    title: 'Sliding & Walk-In Wardrobes',
    desc: 'Floor-to-ceiling space-maximizing wardrobes with smooth aluminum profile sliding tracks, tinted fluted glass shutters, integrated automatic sensor strip lights, and customized internal organizers for jewelry and clothing.',
    points: [
      'Heavy-gauge anti-jump sliding rollers',
      'Automatic LED sensor lights on opening',
      'Customized trouser racks & vanity mirrors',
      'Termite and borer-proof treated ply'
    ]
  },
  'mandir': {
    title: 'Customized CNC Jaali Pooja Mandir',
    desc: 'Sacred, peaceful temple sanctuaries designed with precision CNC cut backlit jaali, teak/corian pillars, holy bell accents, brass fittings, pullout diya trays, and storage drawers for pooja essentials.',
    points: [
      'Intricate CNC laser cut backlit backdrop',
      'Integrated soft warm golden glow illumination',
      'Smoke-resistant brass and wood finishes',
      'Dedicated pullout aarti and diya tray'
    ]
  },
  'cctv': {
    title: 'CCTV Surveillance & Security Networking',
    desc: 'High-definition 4K color-night-vision CCTV cameras, IP cameras, 8-channel NVR, encrypted remote smartphone view, motion sensor alarms, and video door phone integration.',
    points: [
      'Clear color night vision recording',
      'Live viewing on mobile phones anywhere',
      'Concealed underground & wall cabling',
      'Motion detection push notifications'
    ]
  },
  'tiles': {
    title: 'Italian Marble & Large Slab Tiles Fitting',
    desc: 'Precision laser-leveled flooring installation of Italian marble, granite, and 4x2 / 6x4 vitrified tiles. Includes epoxy grout sealing, diamond mirror polishing, and waterproof bathroom tile work.',
    points: [
      'Laser-guided leveling with zero lippage',
      'Waterproof epoxy grouting in bathrooms',
      'High-gloss diamond crystalline polishing',
      'Skirting flush alignment with wall'
    ]
  },
  'paint': {
    title: 'Luxury Emulsion Paint, Putty & Wallpapers',
    desc: 'Flawless 3-coat putty sanding, primer base, and Royal luxury emulsion finish (Asian Paints / Dulux). Includes Italian metallic texture designs, accent stencil walls, and imported 3D textured wallpapers.',
    points: [
      'Smooth mirror-like surface sanding machine work',
      'Anti-fungal and washable paint formulations',
      'Imported heavy-grade non-woven wallpapers',
      'Odorless and low-VOC safe indoor paints'
    ]
  },
  'bed': {
    title: 'Designer Storage Beds & Headboards',
    desc: 'Custom-crafted hydraulic lift-up beds with ample under-bed storage, cushioned velvet/leatherette fluted headboards, integrated side tables with USB charging ports, and solid hardwood framing.',
    points: [
      'Heavy-duty hydraulic lift cylinders',
      'Plush high-density foam headboard cushioning',
      'Integrated dual nightstands with switch plates',
      'Creak-free engineered wood foundation'
    ]
  }
};

function initServiceModal() {
  const serviceButtons = document.querySelectorAll('.service-btn[data-service]');
  const modal = document.querySelector('#serviceModal');
  if (!modal || !serviceButtons.length) return;

  const modalTitle = modal.querySelector('#serviceModalTitle');
  const modalDesc = modal.querySelector('#serviceModalDesc');
  const modalPoints = modal.querySelector('#serviceModalPoints');
  const closeBtn = modal.querySelector('.modal-close');

  function openServiceModal(serviceKey) {
    const data = SERVICES_DATA[serviceKey];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    modalPoints.innerHTML = '';
    data.points.forEach(pt => {
      const li = document.createElement('li');
      li.textContent = pt;
      modalPoints.appendChild(li);
    });

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      openServiceModal(serviceKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeServiceModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeServiceModal();
  });
}

/* ------------------------------------------------------------------------------
   8. CLIENT-SIDE CONTACT & QUOTE FORM VALIDATION
   ------------------------------------------------------------------------------ */
function initContactForm() {
  const contactForm = document.querySelector('#contactQuoteForm');
  if (!contactForm) return;

  const nameInput = contactForm.querySelector('#contactName');
  const phoneInput = contactForm.querySelector('#contactPhone');
  const emailInput = contactForm.querySelector('#contactEmail');
  const serviceSelect = contactForm.querySelector('#contactService');
  const messageInput = contactForm.querySelector('#contactMessage');
  const whatsappBtn = contactForm.querySelector('#sendWhatsAppBtn');

  // Validate single field helper
  function validateField(input, condition, errorMsg) {
    const feedback = input.parentElement.querySelector('.form-feedback');
    if (!condition) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (feedback) {
        feedback.textContent = errorMsg;
        feedback.classList.add('error');
      }
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (feedback) {
        feedback.classList.remove('error');
      }
      return true;
    }
  }

  // Real-time blur validation
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters).');
  });

  phoneInput.addEventListener('blur', () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phoneInput.value.replace(/\D/g, '');
    validateField(phoneInput, phoneRegex.test(cleanPhone), 'Please enter a valid 10-digit Indian mobile number.');
  });

  emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'Please provide a valid email address.');
  });

  // Submit Handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name.');
    const cleanPhone = phoneInput.value.replace(/\D/g, '');
    const isPhoneValid = validateField(phoneInput, /^[6-9]\d{9}$/.test(cleanPhone), 'Please enter a valid 10-digit mobile number.');
    const isEmailValid = validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Please provide a valid email address.');
    const isServiceValid = validateField(serviceSelect, serviceSelect.value !== '', 'Please select a required service.');

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isServiceValid) {
      showToast('Please correct the highlighted fields in the form.', 'error');
      return;
    }

    // Save lead inquiry locally and sync directly into Admin Messages DB
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newInquiry = {
      id: 'msg-' + Date.now(),
      name: nameInput.value.trim(),
      phone: cleanPhone,
      email: emailInput.value.trim(),
      subject: serviceSelect.value || 'Consultation Request',
      message: messageInput.value.trim(),
      date: dateStr,
      status: 'unread'
    };

    // Save to both inquiry logs and shared admin messages store
    const existingInquiries = JSON.parse(localStorage.getItem('mollick_inquiries') || '[]');
    existingInquiries.push(newInquiry);
    localStorage.setItem('mollick_inquiries', JSON.stringify(existingInquiries));

    const adminMsgs = JSON.parse(localStorage.getItem('mollick_db_messages') || '[]');
    adminMsgs.unshift(newInquiry);
    localStorage.setItem('mollick_db_messages', JSON.stringify(adminMsgs));

    contactForm.reset();
    contactForm.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-valid'));

    showToast('Inquiry received! Najmul Mollick & team will call you within 2 business hours.', 'success');
  });

  // Direct WhatsApp Connect
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'Valued Client';
      const service = serviceSelect.value || 'Electrical & Interior Work';
      const userMsg = messageInput.value.trim() || 'I want a quotation for my home.';
      
      const whatsappText = `Hello Mollick Electric & Interior, my name is ${name}. I am looking for ${service}. Note: ${userMsg}`;
      const encodedMsg = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/916290858744?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }
}

/* ------------------------------------------------------------------------------
   9. USER-FRIENDLY CUSTOMER FEEDBACK & REVIEW SYSTEM
   Synchronized with Admin Panel Reviews Store (MollickDB.getReviews)
   ------------------------------------------------------------------------------ */
const DEFAULT_REVIEWS = [
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

function initFeedbackSystem() {
  const reviewsContainer = document.querySelector('#reviewsContainer');
  const feedbackForm = document.querySelector('#customerFeedbackForm');
  const starButtons = document.querySelectorAll('.star-btn');
  const ratingInput = document.querySelector('#selectedRating');

  function getReviewsData() {
    try {
      const dbRevs = localStorage.getItem('mollick_db_reviews');
      if (dbRevs) {
        const parsed = JSON.parse(dbRevs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    try {
      const saved = localStorage.getItem('mollick_customer_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return [...parsed, ...DEFAULT_REVIEWS];
      }
    } catch (e) {}
    return DEFAULT_REVIEWS;
  }

  function renderReviews() {
    const container = document.querySelector('#reviewsContainer');
    if (!container) return;
    container.innerHTML = '';

    const list = getReviewsData();
    list.forEach(rev => {
      const card = document.createElement('div');
      card.className = 'review-card';

      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        starsHtml += i < (rev.rating || 5) ? '★' : '☆';
      }

      card.innerHTML = `
        <div>
          <div class="review-header">
            <div>
              <div class="reviewer-name">${escapeHtml(rev.name || 'Verified Client')}</div>
              <div class="reviewer-service">${escapeHtml(rev.service || 'Electrical & Interior Work')}</div>
            </div>
            <div style="color: var(--accent-gold); font-size: 1.1rem; letter-spacing: 1px;">${starsHtml}</div>
          </div>
          <p class="review-body">"${escapeHtml(rev.comment || '')}"</p>
        </div>
        <div class="review-footer">
          <span>Verified Client</span>
          <span>${escapeHtml(rev.date || 'Recent')}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  window.renderCustomerReviews = renderReviews;
  renderReviews();

  // Star Rating Selector
  if (starButtons.length) {
    starButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = parseInt(btn.getAttribute('data-value'), 10);
        if (ratingInput) ratingInput.value = rating;

        starButtons.forEach(b => {
          const val = parseInt(b.getAttribute('data-value'), 10);
          if (val <= rating) {
            b.classList.add('is-active');
            b.textContent = '★';
          } else {
            b.classList.remove('is-active');
            b.textContent = '☆';
          }
        });
      });
    });
  }

  // Handle Feedback Submission
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameField = feedbackForm.querySelector('#feedbackName');
      const serviceField = feedbackForm.querySelector('#feedbackService');
      const commentField = feedbackForm.querySelector('#feedbackComment');
      const rating = ratingInput ? parseInt(ratingInput.value, 10) : 5;

      if (!nameField.value.trim() || !commentField.value.trim()) {
        showToast('Please provide your name and your feedback comments.', 'error');
        return;
      }

      const cleanName = nameField.value.trim().slice(0, 100);
      const cleanComment = commentField.value.trim().slice(0, 1000);
      const cleanService = (serviceField.value || 'General Electric & Interior Service').slice(0, 100);

      const newReview = {
        name: cleanName,
        service: cleanService,
        rating: Math.min(5, Math.max(1, rating)),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        comment: cleanComment
      };

      let customerReviews = [];
      try {
        customerReviews = JSON.parse(localStorage.getItem('mollick_customer_reviews') || '[]');
      } catch (e) {
        customerReviews = [];
      }
      customerReviews.unshift(newReview);
      localStorage.setItem('mollick_customer_reviews', JSON.stringify(customerReviews));

      try {
        const dbRevs = JSON.parse(localStorage.getItem('mollick_db_reviews') || '[]');
        dbRevs.unshift(newReview);
        localStorage.setItem('mollick_db_reviews', JSON.stringify(dbRevs));
      } catch (e) {}

      // Dispatch real-time sync event to other tabs
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('mollick_db_channel');
          bc.postMessage({ type: 'reviews', timestamp: Date.now() });
          bc.close();
        }
      } catch (e) {}

      renderReviews();

      feedbackForm.reset();
      if (ratingInput) ratingInput.value = '5';
      showToast('Thank you! Your verified review was published.', 'success');
      starButtons.forEach(b => {
        b.classList.add('is-active');
        b.textContent = '★';
      });

      showToast('Thank you! Your feedback has been published successfully.', 'success');

      // Scroll to reviews
      if (reviewsContainer) {
        reviewsContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }
}

/* ------------------------------------------------------------------------------
   10. FAQ ACCORDION
   ------------------------------------------------------------------------------ */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      // Close other accordions
      faqItems.forEach(other => other.classList.remove('is-active'));

      if (!isActive) {
        item.classList.add('is-active');
      }
    });
  });
}

/* ------------------------------------------------------------------------------
   11. BACK TO TOP BUTTON
   ------------------------------------------------------------------------------ */
function initBackToTop() {
  const backToTopBtn = document.querySelector('#backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ------------------------------------------------------------------------------
   12. TOAST NOTIFICATION HELPER
   ------------------------------------------------------------------------------ */
function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  let icon = '✔';
  if (type === 'error') icon = '✖';
  if (type === 'info') icon = 'ℹ';

  toast.innerHTML = `<span style="color: var(--accent-gold); font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
  toast.classList.add('is-show');

  if (toast.timer) clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 4200);
}

// Global hook for inline onclick buttons if needed
window.showToast = showToast;

/* ------------------------------------------------------------------------------
   11. REAL-TIME DATA SYNCHRONIZATION WITH ADMIN PANEL
   Reflects changes made in Admin Panel (Logo, Name, Services, Projects, Gallery, Settings)
   ------------------------------------------------------------------------------ */
function syncPublicSiteWithAdminDB() {
  // Sync Settings (Logo, Brand Name, Phone, Address, Hero text)
  try {
    const rawSettings = localStorage.getItem('mollick_db_settings');
    if (rawSettings) {
      const settings = JSON.parse(rawSettings);

      // Apply CSS variable theme updates dynamically
      const primaryColor = settings.primaryColor || '#0b1320';
      let accentColor = settings.accentColor;
      if (!accentColor || accentColor === '#d97706' || accentColor === '#f5b301') {
        accentColor = '#e11d24'; // Havells Electric Red
      }
      document.documentElement.style.setProperty('--primary-navy', primaryColor);
      document.documentElement.style.setProperty('--accent-gold', accentColor);
      document.documentElement.style.setProperty('--accent-amber', accentColor);
      document.documentElement.style.setProperty('--border-gold', accentColor + '55');
      document.documentElement.style.setProperty('--shadow-gold', `0 6px 20px ${accentColor}44`);

      // 1. Dynamic Logo & Brand Name Sync
      if (settings.logoText || settings.websiteName || settings.logoImageUrl) {
        const logoText = settings.logoText || 'MOLLICK';
        const tagline = settings.logoTagline || 'ELECTRIC & INTERIOR';
        const icon = settings.logoIcon || '⚡';
        const logoImg = settings.logoImageUrl || '';
        const isStandalone = settings.logoDisplayMode === 'standalone' && logoImg;

        // Render dynamic header/mobile logo
        const headerLogos = document.querySelectorAll('.site-logo, .mobile-menu .site-logo, .mobile-menu div:first-child');
        headerLogos.forEach(container => {
          if (container.classList.contains('site-logo')) {
            if (isStandalone) {
              container.innerHTML = `
                <div class="dynamic-brand-logo" style="display:inline-flex; align-items:center; text-decoration:none;">
                  <img src="${logoImg}" alt="${settings.websiteName || logoText}" style="max-height:42px; max-width:210px; object-fit:contain; display:block;">
                </div>
              `;
            } else {
              const iconContent = logoImg
                ? `<img src="${logoImg}" alt="Logo" style="width:100%; height:100%; object-fit:contain; border-radius:6px;">`
                : `${icon}`;
              container.innerHTML = `
                <div class="dynamic-brand-logo" style="display:inline-flex; align-items:center; gap:10px; text-decoration:none;">
                  <div style="width:38px; height:38px; border-radius:8px; background:#0b1320; border:1.5px solid ${accentColor}; display:flex; align-items:center; justify-content:center; font-size:1.25rem; color:#ffffff; flex-shrink:0; overflow:hidden; padding:2px;">
                    ${iconContent}
                  </div>
                  <div style="display:flex; flex-direction:column; line-height:1.15; text-align:left;">
                    <span style="font-family:'Plus Jakarta Sans', system-ui, sans-serif; font-weight:900; font-size:1.15rem; letter-spacing:1.5px; color:#0b1320; text-transform:uppercase;">
                      ${logoText}
                    </span>
                    <span style="font-size:0.65rem; font-weight:800; letter-spacing:1.8px; color:${accentColor}; text-transform:uppercase;">
                      ${tagline}
                    </span>
                  </div>
                </div>
              `;
            }
          }
        });

        // Render dynamic footer logo
        const footerLogoContainer = document.querySelector('.footer-logo, .footer-brand-logo');
        if (footerLogoContainer) {
          if (isStandalone) {
            footerLogoContainer.innerHTML = `
              <div class="dynamic-footer-logo" style="display:inline-flex; align-items:center; text-decoration:none;">
                <img src="${logoImg}" alt="${settings.websiteName || logoText}" style="max-height:48px; max-width:230px; object-fit:contain; display:block;">
              </div>
            `;
          } else {
            const footerIconContent = logoImg
              ? `<img src="${logoImg}" alt="Logo" style="width:100%; height:100%; object-fit:contain; border-radius:8px;">`
              : `${icon}`;
            footerLogoContainer.innerHTML = `
              <div class="dynamic-footer-logo" style="display:inline-flex; align-items:center; gap:12px; text-decoration:none;">
                <div style="width:42px; height:42px; border-radius:10px; background:#070e1a; border:1.5px solid ${accentColor}; display:flex; align-items:center; justify-content:center; font-size:1.35rem; color:#ffffff; flex-shrink:0; overflow:hidden; padding:2px;">
                  ${footerIconContent}
                </div>
                <div style="display:flex; flex-direction:column; line-height:1.15; text-align:left;">
                  <span style="font-family:'Plus Jakarta Sans', system-ui, sans-serif; font-weight:900; font-size:1.25rem; letter-spacing:1.5px; color:#ffffff; text-transform:uppercase;">
                    ${logoText}
                  </span>
                  <span style="font-size:0.68rem; font-weight:800; letter-spacing:2px; color:${accentColor}; text-transform:uppercase;">
                    ${tagline}
                  </span>
                </div>
              </div>
            `;
          }
        }

        // Update brand name text mentions
        if (settings.websiteName) {
          document.querySelectorAll('.brand-name, .company-name').forEach(el => {
            el.textContent = settings.websiteName;
          });
        }
      }
      
      // 2. Update phone links
      if (settings.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
          link.href = `tel:${settings.phone}`;
          if (link.textContent.includes('62908') || link.textContent.includes('87776') || link.textContent.includes('+91')) {
            link.textContent = `+91 ${settings.phone}`;
          }
        });

        // Update WhatsApp click-to-chat numbers
        document.querySelectorAll('a[href*="wa.me"]').forEach(wa => {
          const clean = (settings.whatsappNumber || settings.phone).replace(/[^0-9]/g, '');
          wa.href = wa.href.replace(/wa\.me\/\d+/, `wa.me/${clean}`);
        });
      }

      // 3. Update Email mentions
      if (settings.email) {
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
          link.href = `mailto:${settings.email}`;
          link.textContent = settings.email;
        });
      }

      // 4. Update Address
      if (settings.address) {
        document.querySelectorAll('.office-address, .footer-address').forEach(el => {
          el.textContent = settings.address;
        });
      }

      // 5. Update Contractor name, photo, bio & role across all pages
      if (settings.contractorName) {
        document.querySelectorAll('.contractor-name, .lead-name, #contractorNameEl, #contractorHeadingName, .contractor-crest-title').forEach(el => {
          el.textContent = settings.contractorName;
        });
        // Update initials monogram
        const initials = settings.contractorName.trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'NM';
        document.querySelectorAll('#contractorSpotlightMonogram, .contractor-crest-monogram').forEach(m => {
          m.textContent = initials;
        });
      }
      if (settings.contractorRole) {
        document.querySelectorAll('#contractorRoleEl, #contractorSubRole, .contractor-role').forEach(el => {
          el.textContent = settings.contractorRole;
        });
      }
      if (settings.contractorLicense || settings.wpNo) {
        const badgeLabel = settings.wpNo ? `W. P. No.: ${settings.wpNo}` : (settings.contractorLicense || 'GOVERNMENT OF WEST BENGAL');
        document.querySelectorAll('#contractorLicenseBadge, .contractor-crest-badge').forEach(el => {
          el.textContent = badgeLabel;
        });
      }
      if (settings.wpNo) {
        document.querySelectorAll('.permit-wp-no').forEach(el => {
          el.textContent = `W. P. No.: ${settings.wpNo}`;
        });
      }
      if (settings.permitAuthority) {
        document.querySelectorAll('.permit-authority').forEach(el => {
          el.textContent = settings.permitAuthority;
        });
      }
      if (settings.gstin) {
        document.querySelectorAll('.permit-gstin').forEach(el => {
          el.textContent = `GSTIN: ${settings.gstin}`;
        });
      }
      if (settings.contractorBio) {
        const cleanBio = settings.contractorBio.replace(/^["'\s]+|["'\s]+$/g, '');
        document.querySelectorAll('#contractorBioEl, .contractor-bio').forEach(el => {
          el.textContent = `"${cleanBio}"`;
        });
      }
      if (settings.contractorPhoto) {
        document.querySelectorAll('#contractorPhotoContainer, .contractor-photo-container').forEach(c => {
          c.style.display = 'flex';
        });
        document.querySelectorAll('#contractorSpotlightImg, .contractor-spotlight-img').forEach(img => {
          img.src = settings.contractorPhoto;
          if (settings.contractorPhotoPosition) {
            img.style.objectPosition = settings.contractorPhotoPosition;
          }
          img.onerror = () => {
            const container = img.closest('.contractor-crest')?.querySelector('.contractor-photo-container, #contractorPhotoContainer');
            if (container) container.style.display = 'none';
            const mono = img.closest('.contractor-crest')?.querySelector('.contractor-crest-monogram, #contractorSpotlightMonogram');
            if (mono) mono.style.display = 'flex';
          };
        });
        document.querySelectorAll('#contractorSpotlightMonogram, .contractor-crest-monogram').forEach(m => {
          m.style.display = 'none';
        });
      } else {
        document.querySelectorAll('#contractorPhotoContainer, .contractor-photo-container').forEach(c => {
          c.style.display = 'none';
        });
        document.querySelectorAll('#contractorSpotlightMonogram, .contractor-crest-monogram').forEach(m => {
          m.style.display = 'flex';
        });
      }

      // 6. Update Hero badge, title, desc & background image on homepage
      if (settings.heroImage) {
        document.querySelectorAll('#heroSection, .hero').forEach(hero => {
          hero.style.backgroundImage = `linear-gradient(135deg, rgba(6, 11, 20, 0.88) 0%, rgba(12, 20, 36, 0.82) 50%, rgba(19, 34, 56, 0.88) 100%), url('${settings.heroImage}')`;
          hero.style.backgroundPosition = 'center center';
          hero.style.backgroundSize = 'cover';
          hero.style.backgroundRepeat = 'no-repeat';
        });
      }
      if (settings.heroBadge) {
        const heroBadge = document.querySelector('#heroBadgeTag');
        if (heroBadge) heroBadge.textContent = settings.heroBadge;
      }
      if (settings.heroTitle) {
        const heroTitle = document.querySelector('#heroTitleEl, .hero-title');
        if (heroTitle) {
          heroTitle.innerHTML = settings.heroTitle.replace(/\n/g, '<br>');
        }
      }
      if (settings.heroDescription) {
        const heroDesc = document.querySelector('#heroDescEl, .hero-subtitle, .hero-description');
        if (heroDesc) {
          heroDesc.textContent = settings.heroDescription;
        }
      }

      // 7. Refresh estimator rates if function available
      if (typeof window.recalculateEstimator === 'function') {
        window.recalculateEstimator();
      }
    }
  } catch (err) {
    console.warn('Could not sync settings from admin store:', err);
  }

  // Always refresh room designs if section is present
  if (typeof window.renderLivspaceRoomGallery === 'function') {
    try { window.renderLivspaceRoomGallery(); } catch (e) { console.warn(e); }
  }

  // Always refresh Kolkata Home Tours if section is present
  if (typeof window.renderHomeTours === 'function') {
    try { window.renderHomeTours(); } catch (e) { console.warn(e); }
  }

  // Always refresh customer reviews if function available
  if (typeof window.renderCustomerReviews === 'function') {
    try { window.renderCustomerReviews(); } catch (e) { console.warn(e); }
  }

  // Cross-tab and live event listeners for real-time reactivity
  if (!window._hasBoundStorageSync) {
    window._hasBoundStorageSync = true;
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('mollick_db_')) {
        syncPublicSiteWithAdminDB();
      }
    });
    window.addEventListener('mollick_db_updated', () => {
      syncPublicSiteWithAdminDB();
    });
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('mollick_db_channel');
        bc.onmessage = () => {
          syncPublicSiteWithAdminDB();
        };
      }
    } catch (e) {}
  }

  // Helper for vector icon matching
  function getSpecIcon(cat) {
    const c = (cat || '').toLowerCase();
    if (c.includes('electric')) return 'assets/icons/electric.svg';
    if (c.includes('ceil')) return 'assets/icons/ceiling.svg';
    if (c.includes('kitchen')) return 'assets/icons/kitchen.svg';
    if (c.includes('tv') || c.includes('living')) return 'assets/icons/tv-unit.svg';
    if (c.includes('wardrobe') || c.includes('wood')) return 'assets/icons/wardrobe.svg';
    if (c.includes('mandir')) return 'assets/icons/mandir.svg';
    if (c.includes('cctv') || c.includes('security')) return 'assets/icons/cctv.svg';
    if (c.includes('tile') || c.includes('floor')) return 'assets/icons/tiles.svg';
    if (c.includes('paint')) return 'assets/icons/paint.svg';
    return 'assets/icons/bed.svg';
  }

  // 1. Sync Projects on projects.html AND on index.html (Featured Projects)
  try {
    const rawProjects = localStorage.getItem('mollick_db_projects');
    const isProjectsPage = window.location.pathname.includes('projects.html');
    const isIndexPage = !isProjectsPage && !window.location.pathname.includes('gallery.html') && !window.location.pathname.includes('admin');

    if (rawProjects) {
      const allProjects = JSON.parse(rawProjects);

      // On projects.html: render all projects
      const projectsGrid = document.querySelector('#projectsGrid, .projects-grid');
      if (isProjectsPage && projectsGrid && allProjects.length > 0) {
        projectsGrid.innerHTML = allProjects.map(p => {
          const isPhoto = Boolean(p.image && p.image.trim() !== '' && !p.image.endsWith('.svg'));
          const icon = (p.image && p.image.endsWith('.svg')) ? p.image : getSpecIcon(p.category);

          const visualHeader = isPhoto ? `
            <div style="position: relative; height: 220px; overflow: hidden; border-radius: var(--radius-sm) var(--radius-sm) 0 0; background: #071529;">
              <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null;this.src='assets/icons/ceiling.svg'">
              <span class="project-badge" style="position: absolute; top: 14px; left: 14px; z-index: 2;">${p.category || 'Engineering'}</span>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(7,21,41,0.9), transparent); padding: 10px 14px; color: #ffffff; font-size: 0.8rem; font-weight: 600;">
                ⚡ Certified Workmanship • 5-Yr Guarantee
              </div>
            </div>
          ` : `
            <div class="project-spec-visual" style="height: 220px; border-radius: var(--radius-sm) var(--radius-sm) 0 0;">
              <span class="project-badge">${p.category || 'Engineering'}</span>
              <div class="project-spec-icon-box">
                <img src="${icon}" alt="${p.title}">
              </div>
              <div class="project-spec-tagline">${p.title}</div>
              <div class="project-spec-materials">⚡ Certified Workmanship • 5-Yr Guarantee</div>
            </div>
          `;

          return `
          <div class="project-card" data-category="${(p.category || 'other').toLowerCase()}">
            ${visualHeader}
            <div class="project-card-body">
              <h3 class="project-card-title">${p.title}</h3>
              <p class="project-card-desc">${p.description}</p>
              <div class="project-card-meta">
                <span>📍 ${p.location || 'Kolkata'}</span>
                <span>📅 ${p.completionDate || 'Recent'}</span>
              </div>
            </div>
          </div>
        `;
        }).join('');

        initProjectFilter();
      }

      // On index.html: render featured projects into #featuredProjectsGrid
      const featuredGrid = document.querySelector('#featuredProjectsGrid, #projectsSection .projects-grid');
      if (isIndexPage && featuredGrid && allProjects.length > 0) {
        let showcaseProjects = allProjects.filter(p => p.featured);
        if (showcaseProjects.length === 0) {
          showcaseProjects = allProjects.slice(0, 6);
        }

        featuredGrid.innerHTML = showcaseProjects.map(p => {
          const isPhoto = Boolean(p.image && p.image.trim() !== '' && !p.image.endsWith('.svg'));
          const icon = (p.image && p.image.endsWith('.svg')) ? p.image : getSpecIcon(p.category);

          const visualHeader = isPhoto ? `
            <div style="position: relative; height: 220px; overflow: hidden; border-radius: var(--radius-sm) var(--radius-sm) 0 0; background: #071529;">
              <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null;this.src='assets/icons/ceiling.svg'">
              <span class="project-badge" style="position: absolute; top: 14px; left: 14px; z-index: 2;">${p.category || 'Engineering'}</span>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(7,21,41,0.9), transparent); padding: 10px 14px; color: #ffffff; font-size: 0.8rem; font-weight: 600;">
                ⚡ Certified Workmanship • 5-Yr Guarantee
              </div>
            </div>
          ` : `
            <div class="project-spec-visual" style="height: 220px; border-radius: var(--radius-sm) var(--radius-sm) 0 0;">
              <span class="project-badge">${p.category || 'Engineering'}</span>
              <div class="project-spec-icon-box">
                <img src="${icon}" alt="${p.title}">
              </div>
              <div class="project-spec-tagline">${p.title}</div>
              <div class="project-spec-materials">⚡ Certified Workmanship • 5-Yr Guarantee</div>
            </div>
          `;

          return `
          <article class="project-card" data-category="${(p.category || 'other').toLowerCase()}">
            ${visualHeader}
            <div class="project-info">
              <h3 class="project-title">${p.title}</h3>
              <p class="project-desc">${p.description}</p>
              <div class="project-footer">
                <span>📍 ${p.location || 'Kolkata'}</span>
                <span style="color: var(--accent-amber); font-weight: 600;">${p.completionDate || 'Turnkey'}</span>
              </div>
            </div>
          </article>
        `;
        }).join('');

        initProjectFilter();
      }
    }
  } catch (err) {
    console.warn('Could not sync projects from admin store:', err);
  }

  // 2. Sync Gallery on gallery.html
  try {
    const rawGallery = localStorage.getItem('mollick_db_gallery');
    const galleryGrid = document.querySelector('#galleryGrid, .gallery-grid');
    if (rawGallery && galleryGrid && window.location.pathname.includes('gallery.html')) {
      const gallery = JSON.parse(rawGallery);
      if (gallery && gallery.length > 0) {
        galleryGrid.innerHTML = gallery.map(item => {
          const isPhoto = Boolean(item.image && item.image.trim() !== '' && !item.image.endsWith('.svg'));
          const icon = (item.image && item.image.endsWith('.svg')) ? item.image : getSpecIcon(item.category);

          const visualContent = isPhoto ? `
            <div style="position: relative; width: 100%; height: 100%; min-height: 260px; overflow: hidden; background: #071529;">
              <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null;this.src='assets/icons/ceiling.svg'">
              <span class="project-badge" style="position: absolute; top: 14px; left: 14px; z-index: 2;">${item.category || 'Engineering'}</span>
              ${item.featured ? '<span class="project-badge" style="position: absolute; top: 14px; right: 14px; z-index: 2; background: #e11d24;">★ Featured</span>' : ''}
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(7,21,41,0.85), transparent); padding: 12px 16px; color: #ffffff; font-size: 0.82rem; font-weight: 600;">
                ✨ Direct Site Supervision • Verified Materials
              </div>
            </div>
          ` : `
            <div class="project-spec-visual" style="height: 100%; min-height: 260px;">
              <span class="project-badge">${item.category || 'Engineering'}</span>
              ${item.featured ? '<span class="project-badge" style="position: absolute; top: 14px; right: 14px; z-index: 2; background: #e11d24;">★ Featured</span>' : ''}
              <div class="project-spec-icon-box">
                <img src="${icon}" alt="${item.title}">
              </div>
              <div class="project-spec-tagline">${item.title}</div>
              <div class="project-spec-materials">✨ Direct Site Supervision • Verified Materials</div>
            </div>
          `;

          return `
          <div class="gallery-item" data-title="${item.title}" data-category="${item.category || 'Engineering'}">
            ${visualContent}
            <div class="gallery-overlay">
              <div class="gallery-info">
                <span class="gallery-badge">${item.category || 'Engineering'}</span>
                <h3 class="gallery-title">${item.title}</h3>
              </div>
            </div>
          </div>
        `;
        }).join('');

        // Re-initialize lightbox & filter
        initGalleryLightbox();
        initGalleryFilter();
      }
    }
  } catch (err) {
    console.warn('Could not sync gallery from admin store:', err);
  }

  // 3. Sync Livspace Room Designs if present on page
  if (typeof renderLivspaceRoomGallery === 'function') {
    try {
      renderLivspaceRoomGallery();
    } catch (e) {
      console.warn('Could not re-render room designs:', e);
    }
  }

  // 4. Sync Real Home Tours if present on page
  if (typeof renderHomeTours === 'function') {
    try {
      renderHomeTours();
    } catch (e) {
      console.warn('Could not re-render home tours:', e);
    }
  }
}

function initGalleryFilter() {
  const filterTabs = document.querySelector('#galleryFilterTabs');
  const items = document.querySelectorAll('.gallery-item');
  if (!filterTabs || !items.length) return;

  const buttons = filterTabs.querySelectorAll('.filter-btn');
  buttons.forEach(button => {
    button.onclick = () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterVal = (button.getAttribute('data-filter') || 'all').toLowerCase();
      items.forEach(item => {
        const cat = (item.getAttribute('data-category') || '').toLowerCase();
        const title = (item.getAttribute('data-title') || '').toLowerCase();
        if (filterVal === 'all' || cat.includes(filterVal) || title.includes(filterVal)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    };
  });
}

/* ------------------------------------------------------------------------------
   13. LIVSPACE-STYLE INTERACTIVE INTERIOR COST ESTIMATOR
   ------------------------------------------------------------------------------ */
function initLivspaceEstimator() {
  const estimatorSection = document.querySelector('#costEstimatorSection');
  if (!estimatorSection) return;

  let selectedBhk = '2BHK';
  let selectedTier = 'premium';
  const selectedSpaces = new Set(['kitchen', 'living', 'wardrobe', 'ceiling', 'electric', 'paint']);

  function getEstimatorConfig() {
    let settings = {};
    try {
      const raw = localStorage.getItem('mollick_db_settings');
      if (raw) settings = JSON.parse(raw);
    } catch (e) {}

    const baseRates = {
      '1BHK': settings.estimator1Bhk ? parseInt(settings.estimator1Bhk, 10) : 220000,
      '2BHK': settings.estimator2Bhk ? parseInt(settings.estimator2Bhk, 10) : 385000,
      '3BHK': settings.estimator3Bhk ? parseInt(settings.estimator3Bhk, 10) : 560000,
      '4BHK': settings.estimator4Bhk ? parseInt(settings.estimator4Bhk, 10) : 820000
    };

    const spaceRatios = {
      kitchen: (parseFloat(settings.estSpaceKitchen) || 32) / 100,
      living: (parseFloat(settings.estSpaceLiving) || 18) / 100,
      wardrobe: (parseFloat(settings.estSpaceWardrobe) || 24) / 100,
      ceiling: (parseFloat(settings.estSpaceCeiling) || 10) / 100,
      electric: (parseFloat(settings.estSpaceElectric) || 9) / 100,
      paint: (parseFloat(settings.estSpacePaint) || 7) / 100
    };

    const tierMultipliers = {
      essential: (parseFloat(settings.estTierEssential) || 85) / 100,
      premium: (parseFloat(settings.estTierPremium) || 100) / 100,
      luxe: (parseFloat(settings.estTierLuxe) || 138) / 100
    };

    const marginHighMult = 1 + ((parseFloat(settings.estMarginHigh) || 18) / 100);

    return { baseRates, spaceRatios, tierMultipliers, marginHighMult };
  }

  function formatRupees(num) {
    return '₹' + num.toLocaleString('en-IN');
  }

  function recalculate() {
    const config = getEstimatorConfig();
    const baseRate = config.baseRates[selectedBhk] || 385000;
    const tierMult = config.tierMultipliers[selectedTier] || 1.0;

    let selectedSpaceRatioSum = 0;
    Object.keys(config.spaceRatios).forEach(key => {
      if (selectedSpaces.has(key)) {
        selectedSpaceRatioSum += config.spaceRatios[key];
      }
    });

    // If no space selected, default to full sum so price doesn't hit 0
    if (selectedSpaceRatioSum === 0) selectedSpaceRatioSum = 1.0;

    const baseCost = baseRate * tierMult * selectedSpaceRatioSum;
    const lowPrice = Math.round(baseCost / 1000) * 1000;
    const highPrice = Math.round((baseCost * config.marginHighMult) / 1000) * 1000;

    const priceRangeEl = document.querySelector('#estPriceRange');
    if (priceRangeEl) {
      priceRangeEl.textContent = `${formatRupees(lowPrice)} – ${formatRupees(highPrice)}`;
    }

    // Update individual space breakdowns
    const breakdownConfig = [
      { key: 'kitchen', rowId: '#rowKitchen', valId: '#valKitchen' },
      { key: 'living', rowId: '#rowLiving', valId: '#valLiving' },
      { key: 'wardrobe', rowId: '#rowWardrobe', valId: '#valWardrobe' },
      { key: 'ceiling', rowId: '#rowCeiling', valId: '#valCeiling' },
      { key: 'electric', rowId: '#rowElectric', valId: '#valElectric' },
      { key: 'paint', rowId: '#rowPaint', valId: '#valPaint' }
    ];

    breakdownConfig.forEach(item => {
      const row = document.querySelector(item.rowId);
      const val = document.querySelector(item.valId);
      const isSelected = selectedSpaces.has(item.key);

      if (row) {
        row.style.opacity = isSelected ? '1' : '0.4';
        row.style.textDecoration = isSelected ? 'none' : 'line-through';
      }
      if (val) {
        if (isSelected) {
          const itemVal = Math.round((baseRate * tierMult * config.spaceRatios[item.key]) / 500) * 500;
          val.textContent = formatRupees(itemVal);
        } else {
          val.textContent = 'Excluded';
        }
      }
    });
  }

  // Expose global recalculator for settings sync
  window.recalculateEstimator = recalculate;

  // 1. BHK Selector
  const bhkButtons = document.querySelectorAll('#bhkSelector .bhk-option-btn');
  bhkButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      bhkButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedBhk = btn.getAttribute('data-bhk') || '2BHK';
      recalculate();
    });
  });

  // 2. Spaces Checkbox Grid
  const spaceCheckboxes = document.querySelectorAll('#spacesToggleGrid input[type="checkbox"]');
  spaceCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const card = cb.closest('.space-toggle-card');
      const val = cb.value;

      if (cb.checked) {
        selectedSpaces.add(val);
        if (card) card.classList.add('active');
      } else {
        // Prevent unchecking all spaces
        if (selectedSpaces.size <= 1) {
          cb.checked = true;
          return;
        }
        selectedSpaces.delete(val);
        if (card) card.classList.remove('active');
      }
      recalculate();
    });
  });

  // 3. Tier Selector
  const tierCards = document.querySelectorAll('#tierSelector .tier-option-card');
  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      tierCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedTier = card.getAttribute('data-tier') || 'premium';
      recalculate();
    });
  });

  // 4. Send Estimate to WhatsApp Button
  const btnWhatsApp = document.querySelector('#btnEstSendWhatsApp');
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      const rangeText = document.querySelector('#estPriceRange')?.textContent || '';
      const spaceNames = Array.from(selectedSpaces).map(s => {
        if (s === 'kitchen') return 'Modular Kitchen';
        if (s === 'living') return 'Living & TV Unit';
        if (s === 'wardrobe') return 'Wardrobes & Woodwork';
        if (s === 'ceiling') return 'False Ceiling';
        if (s === 'electric') return 'Concealed Electric';
        if (s === 'paint') return 'Putty & Paint';
        return s;
      }).join(', ');

      const msg = `Hello Najmul Da, I calculated an interior estimate on your website for a *${selectedBhk}* flat in Kolkata.\n\n` +
                  `⭐ *Finish Tier:* ${selectedTier.toUpperCase()}\n` +
                  `🏠 *Spaces Included:* ${spaceNames}\n` +
                  `💰 *Estimated Cost Range:* ${rangeText}\n\n` +
                  `Please share sample 3D designs and arrange a free on-site survey at my flat.`;

      let waNum = '916290858744';
      try {
        const raw = localStorage.getItem('mollick_db_settings');
        if (raw) {
          const s = JSON.parse(raw);
          if (s.whatsappNumber) waNum = s.whatsappNumber.replace(/[^0-9]/g, '');
        }
      } catch (e) {}

      window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // 5. Book Free Site Survey Button
  const btnBookSurvey = document.querySelector('#btnEstBookSiteSurvey');
  if (btnBookSurvey) {
    btnBookSurvey.addEventListener('click', () => {
      openConsultModal({
        bhk: selectedBhk === '1BHK' ? '1 BHK' : selectedBhk === '2BHK' ? '2 BHK' : selectedBhk === '3BHK' ? '3 BHK' : '4 BHK / Villa',
        interest: `Turnkey Interior (${selectedBhk} - ${selectedTier.toUpperCase()} Tier)`
      });
    });
  }

  // Initial calculation
  recalculate();
}

/* ------------------------------------------------------------------------------
   14. HERO QUICK ESTIMATE & CONSULTATION FORM
   ------------------------------------------------------------------------------ */
function initHeroQuickEstimate() {
  const form = document.querySelector('#heroQuickEstimateForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const bhk = document.querySelector('#heroQuickBhk')?.value || '2 BHK';
    const scope = document.querySelector('#heroQuickScope')?.value || 'Full Turnkey Home';
    const locationInput = document.querySelector('#heroQuickLocation');
    const location = locationInput ? locationInput.value.trim() : '';
    const phoneInput = document.querySelector('#heroQuickPhone');
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!location) {
      alert('Please type your flat / site location (e.g. New Town Action Area 2, Rajarhat, Salt Lake, etc.).');
      if (locationInput) locationInput.focus();
      return;
    }

    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile or WhatsApp number.');
      if (phoneInput) phoneInput.focus();
      return;
    }

    // Save lead to local DB
    try {
      const messages = JSON.parse(localStorage.getItem('mollick_db_messages') || '[]');
      messages.unshift({
        id: 'msg_' + Date.now(),
        name: `Quick Lead (${phone})`,
        phone: phone,
        email: '',
        service: scope,
        bhk: bhk,
        location: location,
        message: `Quick estimate requested for ${bhk} at ${location}. Scope: ${scope}`,
        date: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('mollick_db_messages', JSON.stringify(messages));
    } catch (err) {
      console.warn('Could not save quick lead:', err);
    }

    // Open WhatsApp
    let waNum = '916290858744';
    try {
      const raw = localStorage.getItem('mollick_db_settings');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.whatsappNumber) waNum = s.whatsappNumber.replace(/[^0-9]/g, '');
      }
    } catch (e) {}

    const text = `Hello Najmul Da, I submitted a quick estimate request on your website:\n\n` +
                 `🏠 *Home Layout:* ${bhk}\n` +
                 `🔨 *Scope of Work:* ${scope}\n` +
                 `📍 *Location:* ${location}\n` +
                 `📞 *Contact Number:* ${phone}\n\n` +
                 `Please contact me with a customized 3D design and quotation.`;

    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(text)}`, '_blank');

    alert('Thank you! Your inquiry has been registered. Opening WhatsApp now to connect with Najmul Mollick directly.');
    form.reset();
  });
}

/* ------------------------------------------------------------------------------
   15. LIVSPACE ROOM-BY-ROOM INSPIRATION GALLERY FILTER & DYNAMIC RENDERING
   Dynamically loads user-provided room looks, custom photos & prices from Admin Panel
   Stock Unsplash images removed completely as requested.
   ------------------------------------------------------------------------------ */
function getRoomDesignIcon(room) {
  const r = (room || '').toLowerCase();
  if (r.includes('kitchen')) return '🍳';
  if (r.includes('living') || r.includes('tv')) return '📺';
  if (r.includes('wardrobe') || r.includes('bed')) return '🚪';
  if (r.includes('ceil')) return '✨';
  if (r.includes('mandir')) return '🛕';
  return '🏠';
}

function renderLivspaceRoomGallery() {
  const grid = document.querySelector('#roomGalleryGrid');
  if (!grid) return;

  let designs = [];
  try {
    const raw = localStorage.getItem('mollick_db_designs');
    if (raw) designs = JSON.parse(raw);
  } catch (e) {}

  // If empty or first time, use baseline designs with clean photo-upload placeholder
  if (!designs || designs.length === 0) {
    designs = [
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
  }

  // Filter only active designs
  const activeDesigns = designs.filter(d => d.active !== false);

  if (activeDesigns.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; background: #ffffff; border-radius: var(--radius-md); border: 1.5px dashed var(--border-light);">
        <div style="font-size: 2.4rem; margin-bottom: 10px;">🎨</div>
        <h3 style="font-family: var(--font-heading); color: var(--primary-navy); margin-bottom: 6px;">Room Designs Being Updated</h3>
        <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 480px; margin: 0 auto 16px;">
          Designs and photos can be added and configured directly from the Admin Panel.
        </p>
        <a href="admin/designs.html" class="btn btn-sm btn-primary">Go to Room Designs Admin &rarr;</a>
      </div>
    `;
    return;
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string || '';
    return div.innerHTML;
  }

  grid.innerHTML = activeDesigns.map(item => {
    const hasPhoto = Boolean(item.image && item.image.trim() !== '');

    const photoWrap = hasPhoto ? `
      <div class="livspace-room-photo-wrap">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'livspace-room-photo-placeholder\\'><div class=\\'livspace-placeholder-icon\\'>${getRoomDesignIcon(item.room)}</div><div class=\\'livspace-placeholder-label\\'>Direct Site Photo</div><span class=\\'livspace-room-category-badge\\'>${escapeHtml(item.categoryName || item.room)}</span><span class=\\'livspace-room-warranty-badge\\'>${escapeHtml(item.warrantyBadge || '⚡ Certified Quality')}</span></div>';">
        <span class="livspace-room-category-badge">${escapeHtml(item.categoryName || item.room)}</span>
        <span class="livspace-room-warranty-badge">${escapeHtml(item.warrantyBadge || '⚡ Certified Quality')}</span>
      </div>
    ` : `
      <div class="livspace-room-photo-wrap">
        <div class="livspace-room-photo-placeholder">
          <div class="livspace-placeholder-icon">${getRoomDesignIcon(item.room)}</div>
          <div class="livspace-placeholder-label">Direct Site Photo</div>
          <span class="livspace-room-category-badge">${escapeHtml(item.categoryName || item.room)}</span>
          <span class="livspace-room-warranty-badge">${escapeHtml(item.warrantyBadge || '⚡ Certified Quality')}</span>
        </div>
      </div>
    `;

    return `
      <article class="livspace-room-card" data-room="${(item.room || 'all').toLowerCase()}">
        ${photoWrap}
        <div class="livspace-room-info">
          <div>
            <h3 class="livspace-room-title">${escapeHtml(item.title)}</h3>
            <p class="livspace-room-specs">${escapeHtml(item.specs || '')}</p>
            <div class="livspace-room-materials">
              <span>⚡</span> ${escapeHtml(item.materials || 'BWP Plywood • Precision Hardware')}
            </div>
          </div>
          <div class="livspace-room-card-footer">
            <span class="livspace-room-price-est">${escapeHtml(item.price || 'Price on request')}</span>
            <button type="button" class="btn btn-sm btn-primary btn-book-look" data-room-title="${escapeHtml(item.title)}">Book This Look &rarr;</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Re-bind "Book This Look" buttons
  grid.querySelectorAll('.btn-book-look').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const lookTitle = btn.getAttribute('data-room-title') || 'Custom Interior Design';
      openConsultModal({
        interest: `Design Look: ${lookTitle}`
      });
    });
  });

  // Re-apply filter based on currently active tab
  const activeBtn = document.querySelector('#roomFilterTabs .filter-btn.active');
  if (activeBtn) {
    const filter = activeBtn.getAttribute('data-room-filter') || 'all';
    applyRoomFilter(filter);
  }
}

function applyRoomFilter(filter) {
  const cards = document.querySelectorAll('#roomGalleryGrid .livspace-room-card');
  cards.forEach(card => {
    const roomCategory = card.getAttribute('data-room') || '';
    if (filter === 'all' || roomCategory === filter) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

window.renderLivspaceRoomGallery = renderLivspaceRoomGallery;

function initLivspaceRoomGallery() {
  const filterTabs = document.querySelectorAll('#roomFilterTabs .filter-btn');

  // Render initial dynamic designs
  renderLivspaceRoomGallery();

  if (filterTabs.length) {
    filterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        filterTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-room-filter') || 'all';
        applyRoomFilter(filter);
      });
    });
  }
}

/* ------------------------------------------------------------------------------
   15B. REAL HOME MAKEOVERS & KOLKATA HOME TOURS (DYNAMIC ADMIN SYNC)
   Pulls flat makeover case studies & photos directly from Admin Panel (mollick_db_tours)
   ------------------------------------------------------------------------------ */
function renderHomeTours() {
  const grid = document.querySelector('#homeToursGrid, .hometours-grid');
  if (!grid) return;

  let tours = [];
  try {
    const raw = localStorage.getItem('mollick_db_tours');
    if (raw) tours = JSON.parse(raw);
  } catch (e) {}

  // Fallback defaults if database empty
  if (!tours || tours.length === 0) {
    tours = [
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
  }

  const activeTours = tours.filter(t => t.active !== false);
  if (activeTours.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; background: #ffffff; border-radius: 12px; border: 1.5px dashed var(--border-light);">
        <div style="font-size: 2.4rem; margin-bottom: 10px;">🏠</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 6px;">Real Home Tours Being Updated</h3>
        <p style="color: #64748b; font-size: 0.88rem; max-width: 460px; margin: 0 auto;">
          Kolkata home makeovers and site completion photos can be added directly via the Admin Panel.
        </p>
      </div>
    `;
    return;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  grid.innerHTML = activeTours.map(t => {
    const hasPhoto = Boolean(t.image && t.image.trim() !== '');

    const photoHtml = hasPhoto ? `
      <div class="hometour-photo" style="height: 230px; overflow: hidden; position: relative; background: #0f172a;">
        <img src="${t.image}" alt="${escapeHtml(t.title)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.parentElement.innerHTML='<div style=\\'height:230px;background:linear-gradient(135deg,#071529,#1e293b);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:20px;position:relative;\\'><div style=\\'font-size:2.8rem;margin-bottom:8px;\\'>🏠</div><div style=\\'font-weight:700;font-size:0.95rem;color:#f1f5f9;\\'>Real Flat Makeover</div><span class=\\'hometour-pill\\'>${escapeHtml(t.bhk)}</span></div>';">
        <span class="hometour-pill">${escapeHtml(t.bhk)}</span>
      </div>
    ` : `
      <div class="hometour-photo" style="height: 230px; background: linear-gradient(135deg, #071529 0%, #1e293b 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; text-align: center; padding: 20px; position: relative;">
        <div style="font-size: 2.8rem; margin-bottom: 8px;">🏠</div>
        <div style="font-weight: 700; font-size: 0.95rem; color: #f1f5f9; letter-spacing: 0.5px;">Real Flat Makeover</div>
        <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 4px;">Verified Kolkata Site Handover</div>
        <span class="hometour-pill">${escapeHtml(t.bhk)}</span>
      </div>
    `;

    return `
      <article class="hometour-card">
        ${photoHtml}
        <div class="hometour-content">
          <div class="hometour-location">${escapeHtml(t.location)}</div>
          <h3 class="hometour-title">${escapeHtml(t.title)}</h3>
          <p class="hometour-scope">${escapeHtml(t.scope)}</p>
          <div class="hometour-stats-row">
            <div class="hometour-stat-box">
              <div class="hometour-stat-val">${escapeHtml(t.budget)}</div>
              <div class="hometour-stat-lbl">Turnkey Budget</div>
            </div>
            <div class="hometour-stat-box">
              <div class="hometour-stat-val">${escapeHtml(t.handoverDays)}</div>
              <div class="hometour-stat-lbl">Handover Time</div>
            </div>
            <div class="hometour-stat-box">
              <div class="hometour-stat-val">${escapeHtml(t.featureBadge ? t.featureBadge.split(' ')[0] : '100%')}</div>
              <div class="hometour-stat-lbl">${escapeHtml(t.featureBadge || 'CESC Certified')}</div>
            </div>
          </div>
          ${t.clientQuote ? `
            <blockquote class="hometour-client-quote">
              "${escapeHtml(t.clientQuote)}"
              ${t.clientAuthor ? `<div class="hometour-client-author">${escapeHtml(t.clientAuthor)}</div>` : ''}
            </blockquote>
          ` : ''}
          <div style="margin-top: 14px;">
            <button type="button" class="btn btn-outline btn-sm btn-tour-book" data-tour-bhk="${escapeHtml(t.bhk)}" data-tour-title="${escapeHtml(t.title)}" style="width: 100%; justify-content: center; font-size: 0.8rem; font-weight: 700;">
              Book Similar Design &rarr;
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('.btn-tour-book').forEach(btn => {
    btn.addEventListener('click', () => {
      const bhkRaw = btn.getAttribute('data-tour-bhk') || '2 BHK';
      const bhkClean = bhkRaw.split('•')[0].trim();
      const title = btn.getAttribute('data-tour-title') || 'Home Makeover';
      openConsultModal({
        bhk: bhkClean,
        interest: `Similar Makeover: ${title}`
      });
    });
  });
}

window.renderHomeTours = renderHomeTours;

function initHomeTours() {
  renderHomeTours();
}

/* ------------------------------------------------------------------------------
   16. LIVSPACE 3D DESIGN CONSULTATION MODAL
   ------------------------------------------------------------------------------ */
function openConsultModal(prefillData = {}) {
  const modal = document.querySelector('#livspaceConsultModal');
  if (!modal) return;

  if (prefillData.bhk) {
    const bhkSelect = document.querySelector('#consultBhk');
    if (bhkSelect) bhkSelect.value = prefillData.bhk;
  }
  if (prefillData.interest) {
    const interestInput = document.querySelector('#consultInterest');
    if (interestInput) interestInput.value = prefillData.interest;
  }

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeConsultModal() {
  const modal = document.querySelector('#livspaceConsultModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function initLivspaceConsultModal() {
  const modal = document.querySelector('#livspaceConsultModal');
  if (!modal) return;

  // Open triggers
  const triggers = document.querySelectorAll('#btnHeroOpenConsult, #btnExploreConsult, #btnContractorConsult');
  triggers.forEach(btn => {
    btn.addEventListener('click', () => openConsultModal());
  });

  // Close trigger
  const closeBtn = document.querySelector('#btnCloseConsultModal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeConsultModal);
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeConsultModal();
    }
  });

  // Form submission
  const form = document.querySelector('#livspaceConsultForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.querySelector('#consultName')?.value.trim();
      const phone = document.querySelector('#consultPhone')?.value.trim();
      const bhk = document.querySelector('#consultBhk')?.value || '2 BHK';
      const interest = document.querySelector('#consultInterest')?.value.trim() || 'Turnkey Home Interior';
      const location = document.querySelector('#consultLocation')?.value.trim() || 'Kolkata';

      if (!name || !phone || phone.length < 10) {
        alert('Please enter your full name and valid 10-digit mobile number.');
        return;
      }

      // Save to database
      try {
        const messages = JSON.parse(localStorage.getItem('mollick_db_messages') || '[]');
        messages.unshift({
          id: 'msg_' + Date.now(),
          name: name,
          phone: phone,
          email: '',
          service: interest,
          bhk: bhk,
          location: location,
          message: `Consultation booked for ${bhk} at ${location}. Service of interest: ${interest}`,
          date: new Date().toISOString(),
          read: false
        });
        localStorage.setItem('mollick_db_messages', JSON.stringify(messages));
      } catch (err) {
        console.warn('Could not save consultation inquiry:', err);
      }

      // Open WhatsApp
      let waNum = '916290858744';
      try {
        const raw = localStorage.getItem('mollick_db_settings');
        if (raw) {
          const s = JSON.parse(raw);
          if (s.whatsappNumber) waNum = s.whatsappNumber.replace(/[^0-9]/g, '');
        }
      } catch (e) {}

      const text = `Hello Najmul Da, I would like to book a Free 3D Design Consultation & Site Survey:\n\n` +
                   `👤 *Name:* ${name}\n` +
                   `📞 *Phone:* ${phone}\n` +
                   `🏠 *Flat Layout:* ${bhk}\n` +
                   `📍 *Site Location:* ${location}\n` +
                   `✨ *Requirement:* ${interest}\n\n` +
                   `Please let me know when you can visit for laser measurement.`;

      window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(text)}`, '_blank');

      alert('Thank you, ' + name + '! Your consultation request has been booked. Opening WhatsApp now to coordinate the site survey date with Najmul Mollick.');
      closeConsultModal();
      form.reset();
    });
  }
}

