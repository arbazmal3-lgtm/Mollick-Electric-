/**
 * ==============================================================================
 * MOLLICK ELECTRIC & INTERIOR - SCRIPT.JS
 * Vanilla JavaScript (ES6+) - Clean, Modular, Production-Ready
 * No frameworks, no external dependencies, fully compatible with VS Code
 * ==============================================================================
 */

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

    showToast('Inquiry received! Nasim Mollick & team will call you within 2 business hours.', 'success');
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
   Solves customer feedback urgency: live interactive rating, saves to local storage,
   updates review list instantly!
   ------------------------------------------------------------------------------ */
const DEFAULT_REVIEWS = [
  {
    name: 'Anirban Banerjee (New Town, Action Area IIB)',
    service: 'Complete 3BHK Concealed Wiring & Gyproc False Ceiling',
    rating: 5,
    date: 'August 28, 2026',
    comment: 'Nasim Bhai is a thorough professional. He personally inspected our flat, re-routed all main circuits with Havells 4 sq.mm flame-retardant wires, and installed Siemens RCCB breakers. The cove false ceiling in our living room was completed in just 8 days with zero dust mess.'
  },
  {
    name: 'Somenath & Debolina Dutta (Salt Lake, Sector 2)',
    service: 'BWP 710 Acrylic Modular Kitchen & Countertop',
    rating: 5,
    date: 'August 14, 2026',
    comment: 'Finding a reliable carpenter-electrician team in Salt Lake who don’t overcharge is tough. Nasim Mollick gave us an honest itemized estimate with genuine Greenply 710 marine plywood and Blum soft-close fittings. Completed strictly within budget.'
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

  // Load reviews (merged from default + localStorage)
  let savedReviews = JSON.parse(localStorage.getItem('mollick_customer_reviews') || '[]');
  const allReviews = [...savedReviews, ...DEFAULT_REVIEWS];

  function renderReviews() {
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = '';

    allReviews.forEach(rev => {
      const card = document.createElement('div');
      card.className = 'review-card';

      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        starsHtml += i < rev.rating ? '★' : '☆';
      }

      card.innerHTML = `
        <div>
          <div class="review-header">
            <div>
              <div class="reviewer-name">${escapeHtml(rev.name)}</div>
              <div class="reviewer-service">${escapeHtml(rev.service)}</div>
            </div>
            <div style="color: var(--accent-gold); font-size: 1.1rem; letter-spacing: 1px;">${starsHtml}</div>
          </div>
          <p class="review-body">"${escapeHtml(rev.comment)}"</p>
        </div>
        <div class="review-footer">
          <span>Verified Client</span>
          <span>${escapeHtml(rev.date)}</span>
        </div>
      `;
      reviewsContainer.appendChild(card);
    });
  }

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

      const newReview = {
        name: nameField.value.trim(),
        service: serviceField.value || 'General Electric & Interior Service',
        rating: rating,
        date: 'Just now',
        comment: commentField.value.trim()
      };

      savedReviews.unshift(newReview);
      localStorage.setItem('mollick_customer_reviews', JSON.stringify(savedReviews));

      allReviews.unshift(newReview);
      renderReviews();

      feedbackForm.reset();
      if (ratingInput) ratingInput.value = '5';
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

      // 5. Update Contractor name
      if (settings.contractorName) {
        document.querySelectorAll('.contractor-name, .lead-name').forEach(el => {
          el.textContent = settings.contractorName;
        });
      }

      // 6. Update Hero title & desc on homepage
      if (settings.heroTitle) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !heroTitle.querySelector('span')) {
          heroTitle.textContent = settings.heroTitle;
        }
      }
      if (settings.heroDescription) {
        const heroDesc = document.querySelector('.hero-subtitle, .hero-description');
        if (heroDesc) {
          heroDesc.textContent = settings.heroDescription;
        }
      }
    }
  } catch (err) {
    console.warn('Could not sync settings from admin store:', err);
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

  // Sync Projects on projects.html
  try {
    const rawProjects = localStorage.getItem('mollick_db_projects');
    const projectsGrid = document.querySelector('#projectsGrid, .projects-grid');
    if (rawProjects && projectsGrid && window.location.pathname.includes('projects.html')) {
      const projects = JSON.parse(rawProjects);
      if (projects && projects.length > 0) {
        projectsGrid.innerHTML = projects.map(p => {
          const isPhoto = p.image && (p.image.startsWith('data:') || p.image.startsWith('http') || p.image.includes('.jpg') || p.image.includes('.png') || p.image.includes('.webp'));
          const icon = (p.image && !p.image.includes('.jpg')) ? p.image : getSpecIcon(p.category);

          const visualHeader = isPhoto ? `
            <div style="position: relative; height: 220px; overflow: hidden; border-radius: var(--radius-sm) var(--radius-sm) 0 0; background: #071529;">
              <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='assets/icons/ceiling.svg'">
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

        // Re-initialize filter tabs
        initProjectFilter();
      }
    }
  } catch (err) {
    console.warn('Could not sync projects from admin store:', err);
  }

  // Sync Gallery on gallery.html
  try {
    const rawGallery = localStorage.getItem('mollick_db_gallery');
    const galleryGrid = document.querySelector('#galleryGrid, .gallery-grid');
    if (rawGallery && galleryGrid && window.location.pathname.includes('gallery.html')) {
      const gallery = JSON.parse(rawGallery);
      if (gallery && gallery.length > 0) {
        galleryGrid.innerHTML = gallery.map(item => {
          const isPhoto = item.image && (item.image.startsWith('data:') || item.image.startsWith('http') || item.image.includes('.jpg') || item.image.includes('.png') || item.image.includes('.webp'));
          const icon = (item.image && !item.image.includes('.jpg')) ? item.image : getSpecIcon(item.category);

          const visualContent = isPhoto ? `
            <div style="position: relative; width: 100%; height: 100%; min-height: 260px; overflow: hidden; background: #071529;">
              <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='assets/icons/ceiling.svg'">
              <span class="project-badge" style="position: absolute; top: 14px; left: 14px; z-index: 2;">${item.category || 'Engineering'}</span>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(7,21,41,0.85), transparent); padding: 12px 16px; color: #ffffff; font-size: 0.82rem; font-weight: 600;">
                ✨ Direct Site Supervision • Verified Materials
              </div>
            </div>
          ` : `
            <div class="project-spec-visual" style="height: 100%; min-height: 260px;">
              <span class="project-badge">${item.category || 'Engineering'}</span>
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
        initProjectFilter();
      }
    }
  } catch (err) {
    console.warn('Could not sync gallery from admin store:', err);
  }
}

