/**
 * Efevresis Interactive Logic, i18n & Particle Tech Grid
 */

// Global State & Data
let clientsData = null;
let currentFilter = 'all';
let currentLang = localStorage.getItem('efevresis_lang') || 'el';
let currentTheme = localStorage.getItem('efevresis_theme') || 'dark';

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initI18n();
  initHeroCanvas();
  initHeaderScroll();
  initMobileMenu();
  initClientsExplorer();
  initCalculator();
  initContactForm();
  initQuoteModal();
  initScrollAnimations();
  initCard3DTilt();
  initQuickConnect();
  initChatbotBubbleTuning();
  initLegalModals();
  initCookieConsent();
});

/* ==========================================================================
   0. THEME TOGGLE ENGINE (DARK & LIGHT MODE)
   ========================================================================== */
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('efevresis_theme', theme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    const tooltip = theme === 'light'
      ? (currentLang === 'en' ? 'Switch to Dark Mode' : 'Εναλλαγή σε Σκοτεινό Θέμα')
      : (currentLang === 'en' ? 'Switch to Light Mode' : 'Εναλλαγή σε Φωτεινό Θέμα');
    btn.setAttribute('title', tooltip);
    btn.setAttribute('aria-label', tooltip);

    const label = btn.querySelector('.theme-label');
    if (label) {
      label.textContent = theme === 'light'
        ? (translations[currentLang]?.['theme_toggle_label_dark'] || (currentLang === 'en' ? 'Dark Mode' : 'Σκοτεινό Θέμα'))
        : (translations[currentLang]?.['theme_toggle_label'] || (currentLang === 'en' ? 'Light Mode' : 'Φωτεινό Θέμα'));
    }
  });
}

function initThemeToggle() {
  applyTheme(currentTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });
}

/* ==========================================================================
   0.1 INTERNATIONALIZATION (i18n) ENGINE
   ========================================================================== */
function initI18n() {
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('efevresis_lang', lang);
    document.documentElement.lang = lang;

    // Update active button state
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Translate DOM elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Translate dynamic input placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    // Translate client search placeholder
    const searchInput = document.getElementById('client-search');
    if (searchInput && translations[lang]['client_search_placeholder']) {
      searchInput.placeholder = translations[lang]['client_search_placeholder'];
    }

    // Refresh theme button tooltips/labels
    applyTheme(currentTheme);

    // Refresh dynamic calculator estimate and client badges
    if (typeof updateCalculatorEstimate === 'function') {
      updateCalculatorEstimate();
    }
    if (typeof updateClientCountDisplay === 'function') {
      updateClientCountDisplay();
    }
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // Apply language on initial load
  setLanguage(currentLang);
}

/* ==========================================================================
   1. HERO TECH PARTICLE CANVAS (CYBER GRID & LIGHT NODES)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 65;
  const connectionDistance = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      const isLight = currentTheme === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(2, 132, 199, ${this.alpha * 0.8})` : `rgba(0, 240, 255, ${this.alpha})`;
      ctx.shadowBlur = isLight ? 4 : 8;
      ctx.shadowColor = isLight ? '#0284c7' : '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = currentTheme === 'light';

    // Draw particle lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const lineAlpha = (1 - dist / connectionDistance) * (isLight ? 0.18 : 0.22);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${lineAlpha})` : `rgba(0, 240, 255, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. HEADER & NAVIGATION SCROLL BEHAVIOR
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-menu-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    drawer.classList.toggle('active');
    const isOpen = drawer.classList.contains('active');
    toggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
  });

  drawer.querySelectorAll('.nav-link, .btn').forEach(item => {
    item.addEventListener('click', () => {
      drawer.classList.remove('active');
      toggle.innerHTML = '<i class="bi bi-list"></i>';
    });
  });
}

/* ==========================================================================
   4. CLIENTS DATABASE EXPLORER & LIVE SEARCH
   ========================================================================== */
let updateClientCountDisplay = () => {};

function normalizeGreekSearch(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .trim();
}

async function initClientsExplorer() {
  const grid = document.getElementById('clients-container');
  const countBadge = document.getElementById('client-count');
  const searchInput = document.getElementById('client-search');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const sectorCards = document.querySelectorAll('.sector-stat-card');
  let visibleLimit = 60;

  // 1. Instant load from window.EFEVRESIS_CLIENTS_DATA if present
  if (window.EFEVRESIS_CLIENTS_DATA) {
    clientsData = window.EFEVRESIS_CLIENTS_DATA;
    renderClients();
  } else {
    try {
      const res = await fetch('assets/clients_data.json');
      clientsData = await res.json();
      renderClients();
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  }

  function getFilteredList() {
    if (!clientsData) return [];
    let list = [];
    const filterClean = (currentFilter || 'all').replace(/&amp;/g, '&').trim();

    if (filterClean === 'all') {
      Object.values(clientsData).forEach(arr => {
        if (Array.isArray(arr)) list.push(...arr);
      });
    } else if (clientsData[filterClean]) {
      list = [...clientsData[filterClean]];
    } else {
      // Fallback matching normalized keys
      const normTarget = normalizeGreekSearch(filterClean);
      for (const [key, arr] of Object.entries(clientsData)) {
        if (normalizeGreekSearch(key) === normTarget && Array.isArray(arr)) {
          list = [...arr];
          break;
        }
      }
    }

    const query = searchInput ? normalizeGreekSearch(searchInput.value) : '';
    if (query) {
      list = list.filter(item => normalizeGreekSearch(item).includes(query));
    }
    return list;
  }

  function renderClients() {
    if (!grid) return;
    const list = getFilteredList();
    const suffix = currentLang === 'en' ? 'Entities' : 'Φορείς';
    if (countBadge) countBadge.textContent = `${list.length} ${suffix}`;

    if (list.length === 0) {
      const emptyMsg = currentLang === 'en' 
        ? 'No results found for your query. Try searching with another keyword.' 
        : 'Δεν βρέθηκαν αποτελέσματα για την αναζήτησή σας. Δοκιμάστε με διαφορετική λέξη-κλειδί.';
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; color: var(--text-muted); font-size: 1.05rem;">
        <i class="bi bi-search" style="font-size: 2rem; display: block; margin-bottom: 12px; color: var(--text-muted); opacity: 0.6;"></i>
        ${emptyMsg}
      </div>`;
      return;
    }

    const displayItems = list.slice(0, visibleLimit);
    let html = displayItems.map(item => `
      <div class="client-item-card">
        <div class="client-item-icon"><i class="bi bi-building-check"></i></div>
        <div class="client-item-name">${item}</div>
      </div>
    `).join('');

    if (list.length > visibleLimit) {
      const remaining = list.length - visibleLimit;
      const loadMoreText = currentLang === 'en' 
        ? `Show More (+${remaining > 60 ? 60 : remaining} of ${remaining} remaining)` 
        : `Εμφάνιση Περισσότερων (+${remaining > 60 ? 60 : remaining} από ${remaining} ακόμη)`;
      html += `
        <div class="clients-load-more-wrapper" style="grid-column: 1/-1; text-align: center; margin-top: 24px;">
          <button type="button" id="clients-load-more-btn" class="btn btn-secondary" style="padding: 12px 32px; font-size: 0.95rem;">
            <i class="bi bi-chevron-down"></i> ${loadMoreText}
          </button>
        </div>
      `;
    }

    grid.innerHTML = html;

    const loadMoreBtn = document.getElementById('clients-load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        visibleLimit += 60;
        renderClients();
      });
    }
  }

  updateClientCountDisplay = renderClients;

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      visibleLimit = 60;
      renderClients();
    });
  }

  function syncActiveFilters(activeFilterValue) {
    const normActive = normalizeGreekSearch(activeFilterValue);
    filterTabs.forEach(t => {
      const tabFilter = normalizeGreekSearch(t.getAttribute('data-filter') || t.dataset.filter);
      t.classList.toggle('active', tabFilter === normActive);
    });
    sectorCards.forEach(c => {
      const cardFilter = normalizeGreekSearch(c.getAttribute('data-filter') || c.dataset.filter);
      c.classList.toggle('active', cardFilter === normActive);
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      currentFilter = tab.getAttribute('data-filter') || tab.dataset.filter;
      visibleLimit = 60;
      syncActiveFilters(currentFilter);
      renderClients();
    });
  });

  sectorCards.forEach(card => {
    card.addEventListener('click', () => {
      currentFilter = card.getAttribute('data-filter') || card.dataset.filter;
      visibleLimit = 60;
      syncActiveFilters(currentFilter);
      if (searchInput) searchInput.value = '';
      renderClients();
      // Smooth scroll to directory view
      const toolbar = document.querySelector('.clients-toolbar');
      if (toolbar) {
        toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Support keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE VALUE & PROJECT ESTIMATOR
   ========================================================================== */
let updateCalculatorEstimate = () => {};

function initCalculator() {
  const form = document.getElementById('project-calculator');
  const etaText = document.getElementById('calc-eta-text');
  const summaryText = document.getElementById('calc-summary-text');
  if (!form) return;

  function updateEstimate() {
    const org = form.querySelector('input[name="org_type"]:checked')?.value || 'public';
    const service = form.querySelector('input[name="service_type"]:checked')?.value || 'automation';
    const scale = form.querySelector('input[name="scale"]:checked')?.value || 'medium';

    let days = currentLang === 'en' ? '15-20 Business Days' : '15-20 Εργάσιμες Ημέρες';
    let summary = currentLang === 'en' 
      ? 'Comprehensive automation assessment and deployment with tailored AI workflow bots.'
      : 'Ολοκληρωμένη μελέτη και εφαρμογή αυτοματισμού με προσαρμοσμένες AI ροές.';

    if (service === 'software') {
      days = scale === 'large' 
        ? (currentLang === 'en' ? '30-45 Business Days' : '30-45 Εργάσιμες')
        : (currentLang === 'en' ? '20-25 Business Days' : '20-25 Εργάσιμες');
      summary = currentLang === 'en'
        ? 'Software procurement, full system installation, tailor-made parametrization & user training.'
        : 'Προμήθεια, εγκατάσταση, πλήρης παραμετροποίηση λογισμικού & εκπαίδευση.';
    } else if (service === 'training') {
      days = currentLang === 'en' ? '7-12 Business Days' : '7-12 Εργάσιμες';
      summary = currentLang === 'en'
        ? 'Intensive staff up-skilling program & hands-on certified interactive workshops.'
        : 'Εντατικό πρόγραμμα κατάρτισης προσωπικού & hands-on πιστοποιημένα workshops.';
    } else if (service === 'all') {
      days = currentLang === 'en' ? '35-60 Business Days' : '35-60 Εργάσιμες';
      summary = currentLang === 'en'
        ? 'Full-scale digital transformation (integrated software, automated AI pipelines & executive training).'
        : 'Πλήρης ψηφιακός μετασχηματισμός (λογισμικό, αυτοματισμοί & εκπαίδευση).';
    }

    const orgLabel = org === 'public' 
      ? (currentLang === 'en' ? 'Public Entity' : 'Δημόσιο Φορέα')
      : org === 'edu' 
        ? (currentLang === 'en' ? 'Educational Institution' : 'Εκπαιδευτικό Ίδρυμα')
        : (currentLang === 'en' ? 'Private Enterprise' : 'Ιδιωτική Επιχείρηση');

    const tailoredText = currentLang === 'en' ? `Tailored for ${orgLabel}.` : `Προσαρμοσμένο για ${orgLabel}.`;

    if (etaText) etaText.textContent = days;
    if (summaryText) summaryText.textContent = `${summary} ${tailoredText}`;
  }

  updateCalculatorEstimate = updateEstimate;

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', updateEstimate);
  });
  updateEstimate();

  // 1-Click Send Quote from Calculator
  const sendQuoteBtn = document.getElementById('calc-send-quote-btn');
  if (sendQuoteBtn) {
    sendQuoteBtn.addEventListener('click', () => {
      const org = form.querySelector('input[name="org_type"]:checked')?.value || 'public';
      const service = form.querySelector('input[name="service_type"]:checked')?.value || 'automation';
      const scale = form.querySelector('input[name="scale"]:checked')?.value || 'medium';
      const eta = etaText ? etaText.textContent : '';
      const summary = summaryText ? summaryText.textContent : '';

      const modal = document.getElementById('quote-modal');
      const calcSummaryBox = document.getElementById('modal-calc-summary');
      const calcDetails = document.getElementById('modal-calc-details');
      const interestSelect = document.getElementById('quote-interest');

      if (calcSummaryBox && calcDetails) {
        calcSummaryBox.style.display = 'flex';
        
        const orgName = org === 'public' 
          ? (currentLang === 'en' ? 'Public Entity' : 'Δημόσιος Φορέας')
          : org === 'edu' 
            ? (currentLang === 'en' ? 'Educational Inst.' : 'Εκπαιδευτικό Ίδρυμα')
            : (currentLang === 'en' ? 'Private Enterprise' : 'Ιδιωτική Επιχείρηση');

        const scaleName = scale === 'small' 
          ? (currentLang === 'en' ? '1-10 Users' : '1-10 Χρήστες')
          : scale === 'medium' 
            ? (currentLang === 'en' ? '10-50 Users' : '10-50 Χρήστες')
            : (currentLang === 'en' ? '50+ Users' : '50+ Χρήστες');

        calcDetails.innerHTML = `<strong>${orgName}</strong> &bull; <strong>${scaleName}</strong> &bull; ⏱️ <em>${eta}</em><br><span style="font-size: 0.82rem; color: #cbd5e1;">${summary}</span>`;
      }

      if (interestSelect) {
        if (service === 'automation') interestSelect.selectedIndex = 0;
        else if (service === 'software') interestSelect.selectedIndex = 1;
        else if (service === 'training') interestSelect.selectedIndex = 2;
        else if (service === 'all') interestSelect.selectedIndex = 3;
      }

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

/* ==========================================================================
   6. CONTACT FORM SUBMISSION & REAL-TIME VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> <span>${currentLang === 'en' ? 'Sending...' : 'Αποστολή...'}</span>`;
    btn.disabled = true;

    const payload = {
      _subject: "Νέο Μήνυμα Επικοινωνίας (Efevresis Website)",
      name: document.getElementById('contact-name')?.value || '',
      email: document.getElementById('contact-email')?.value || '',
      phone: document.getElementById('contact-phone')?.value || '',
      organization: document.getElementById('contact-org')?.value || 'N/A',
      interest: document.getElementById('contact-subject')?.value || 'Γενικό Ενδιαφέρον',
      message: document.getElementById('contact-message')?.value || '',
      _captcha: "false"
    };

    try {
      await fetch('https://formsubmit.co/ajax/ilias@toner-melania.gr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Form submission notice:', err);
    }

    form.reset();
    btn.innerHTML = originalText;
    btn.disabled = false;
    const successMsg = currentLang === 'en'
      ? 'Your message has been sent successfully to ilias@toner-melania.gr! The Efevresis team will contact you shortly.'
      : 'Το μήνυμά σας εστάλη με επιτυχία στο ilias@toner-melania.gr! Η ομάδα της Efevresis θα επικοινωνήσει μαζί σας άμεσα.';
    showToast(successMsg);
  });
}

/* ==========================================================================
   7. QUOTE MODAL SYSTEM
   ========================================================================== */
function initQuoteModal() {
  const modal = document.getElementById('quote-modal');
  const openBtns = document.querySelectorAll('[data-open-quote]');
  const closeBtn = document.querySelector('.modal-close');
  const calcSummaryBox = document.getElementById('modal-calc-summary');
  const calcDetails = document.getElementById('modal-calc-details');
  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If clicked from standard buttons, hide calc summary if not from calc
      if (btn.id !== 'calc-send-quote-btn' && calcSummaryBox) {
        calcSummaryBox.style.display = 'none';
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const modalForm = document.getElementById('modal-quote-form');
  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> <span>${currentLang === 'en' ? 'Submitting...' : 'Υποβολή...'}</span>`;
      submitBtn.disabled = true;

      const calcEstimateIncluded = calcSummaryBox && calcSummaryBox.style.display !== 'none';
      const payload = {
        _subject: "Νέο Αίτημα Προσφοράς Έργου (Efevresis Website)",
        name: document.getElementById('quote-name')?.value || '',
        email: document.getElementById('quote-email')?.value || '',
        phone: document.getElementById('quote-phone')?.value || '',
        service_interest: document.getElementById('quote-interest')?.value || '',
        attached_estimator_specs: calcEstimateIncluded ? (calcDetails?.innerText || 'Ναι') : 'Χωρίς υπολογιστή',
        _captcha: "false"
      };

      try {
        await fetch('https://formsubmit.co/ajax/ilias@toner-melania.gr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Quote submission notice:', err);
      }

      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
      closeModal();
      modalForm.reset();
      if (calcSummaryBox) calcSummaryBox.style.display = 'none';
      const successMsg = currentLang === 'en'
        ? 'Your quote request has been sent to ilias@toner-melania.gr! You will receive an estimate within 24 hours.'
        : 'Η αίτησή σας για προσφορά καταχωρήθηκε και εστάλη στο ilias@toner-melania.gr! Θα λάβετε εκτίμηση εντός 24 ωρών.';
      showToast(successMsg);
    });
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="bi bi-check-circle-fill" style="color: var(--accent-cyan); font-size: 1.2rem;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* ==========================================================================
   9. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  // All elements are visible by default
}

/* ==========================================================================
   10. 3D CARD TILT & DYNAMIC NEON SPOTLIGHT ENGINE
   ========================================================================== */
function initCard3DTilt() {
  const cards = document.querySelectorAll(
    '.stat-box, .about-feat-item, .mv-card, .calc-result-box, .office-card, .sector-stat-card, .tilt-card'
  );

  cards.forEach(card => {
    card.style.opacity = '1';
    card.style.visibility = 'visible';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for spotlight glow
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate tilt rotation (-8deg to +8deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
}

/* ==========================================================================
   11. QUICK CONNECT FLOATING HUB CONTROLLER
   ========================================================================== */
function initQuickConnect() {
  const toggleBtn = document.getElementById('quick-connect-toggle');
  const menu = document.getElementById('quick-connect-menu');
  if (!toggleBtn || !menu) return;

  function toggleMenu(e) {
    if (e) e.stopPropagation();
    const isActive = menu.classList.toggle('active');
    toggleBtn.classList.toggle('active', isActive);
    menu.setAttribute('aria-hidden', (!isActive).toString());
  }

  function closeMenu() {
    menu.classList.remove('active');
    toggleBtn.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', toggleMenu);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#quick-connect')) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu when clicking a quote trigger inside the quick connect
  const quoteItem = menu.querySelector('.qc-quote');
  if (quoteItem) {
    quoteItem.addEventListener('click', () => {
      closeMenu();
    });
  }
}

/* ==========================================================================
   12. ELFSIGHT CHATBOT BUBBLE CONTROLLER
   ========================================================================== */
function initChatbotBubbleTuning() {
  const tuneChatbotBubbles = () => {
    // Target the welcome window quick replies container and buttons specifically
    const welcomeWindow = document.querySelector('[class*="widget-welcome-window"]');
    if (welcomeWindow) {
      const quickReplies = welcomeWindow.querySelectorAll(
        '[class*="QuickRepliesContainer"], [class*="quick-reply-button"], .es-quick-reply-button'
      );
      quickReplies.forEach(el => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('height', '0px', 'important');
        el.style.setProperty('margin', '0px', 'important');
        el.style.setProperty('padding', '0px', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
      });

      // On mobile screens, ensure the welcome bubble sits ABOVE the chat button instead of beside it
      if (window.innerWidth <= 768) {
        welcomeWindow.style.setProperty('bottom', '92px', 'important');
        welcomeWindow.style.setProperty('right', '16px', 'important');
        welcomeWindow.style.setProperty('left', 'auto', 'important');
        welcomeWindow.style.setProperty('top', 'auto', 'important');
        welcomeWindow.style.setProperty('transform', 'none', 'important');
        welcomeWindow.style.setProperty('max-width', 'calc(100vw - 32px)', 'important');
      }
    }
  };

  tuneChatbotBubbles();

  // Continuously listen to DOM changes so if Elfsight renders or re-renders, it applies immediately
  const observer = new MutationObserver(tuneChatbotBubbles);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('resize', tuneChatbotBubbles, { passive: true });
}

/* ==========================================================================
   14. LEGAL MODALS (PRIVACY POLICY, TERMS OF USE, COOKIE SETTINGS)
   ========================================================================== */
function initLegalModals() {
  const legalTriggers = document.querySelectorAll('[data-open-legal]');
  const legalModals = {
    privacy: document.getElementById('privacy-modal'),
    terms: document.getElementById('terms-modal'),
    cookies: document.getElementById('cookies-modal')
  };

  function openLegalModal(type) {
    const targetModal = legalModals[type];
    if (!targetModal) return;

    // Close any other open modal first
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));

    // Temporarily hide bottom cookie banner so it never covers the modal or its buttons
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';

    targetModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // If opening cookies modal, sync toggle switches with saved preferences
    if (type === 'cookies') {
      syncCookieToggles();
    }
  }

  function closeAllLegalModals() {
    document.querySelectorAll('.legal-modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
    // Restore overflow if quote modal is not active
    const quoteModal = document.getElementById('quote-modal');
    if (!quoteModal || !quoteModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }

    // If user closed without having saved consent yet, restore cookie banner
    const banner = document.getElementById('cookie-consent-banner');
    const saved = localStorage.getItem('efevresis_cookie_consent');
    if (!saved && banner) {
      banner.style.display = 'block';
    }
  }

  legalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.getAttribute('data-open-legal');
      openLegalModal(type);
    });
  });

  // Close buttons inside legal modals
  document.querySelectorAll('.legal-modal-close, .legal-modal-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllLegalModals();
    });
  });

  // Close on backdrop click
  document.querySelectorAll('.legal-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllLegalModals();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllLegalModals();
    }
  });

  window.openLegalModal = openLegalModal;
}

/* ==========================================================================
   15. COOKIE CONSENT BANNER & PREFERENCES MANAGER
   ========================================================================== */
function syncCookieToggles() {
  const saved = localStorage.getItem('efevresis_cookie_consent');
  const funcToggle = document.getElementById('cookie-pref-functional');
  const analyticsToggle = document.getElementById('cookie-pref-analytics');

  if (saved) {
    try {
      const prefs = JSON.parse(saved);
      if (funcToggle) funcToggle.checked = prefs.functional !== false;
      if (analyticsToggle) analyticsToggle.checked = prefs.analytics !== false;
    } catch (e) {
      if (funcToggle) funcToggle.checked = true;
      if (analyticsToggle) analyticsToggle.checked = true;
    }
  } else {
    if (funcToggle) funcToggle.checked = true;
    if (analyticsToggle) analyticsToggle.checked = true;
  }
}

function initCookieConsent() {
  const banner = document.getElementById('cookie-consent-banner');
  const acceptAllBtn = document.getElementById('cookie-accept-all-btn');
  const rejectBtn = document.getElementById('cookie-reject-btn');
  const settingsBtn = document.getElementById('cookie-settings-btn');
  const savePrefsBtn = document.getElementById('cookie-save-prefs-btn');
  const modalAcceptAllBtn = document.getElementById('cookie-modal-accept-all');
  const cookiesModal = document.getElementById('cookies-modal');

  const savedConsent = localStorage.getItem('efevresis_cookie_consent');

  // If user hasn't made a choice yet, set cookies-active class and display banner
  if (!savedConsent && banner) {
    document.body.classList.add('cookies-active');
    setTimeout(() => {
      banner.style.display = 'block';
    }, 1200);
  }

  function saveConsent(preferences, toastMsg) {
    const consentData = {
      necessary: true,
      functional: preferences.functional,
      analytics: preferences.analytics,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('efevresis_cookie_consent', JSON.stringify(consentData));
    document.body.classList.remove('cookies-active');

    if (banner) banner.style.display = 'none';
    if (cookiesModal) {
      cookiesModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toastMsg) {
      showToast(toastMsg);
    }
  }

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', () => {
      const msg = currentLang === 'en'
        ? 'All cookies accepted. Thank you!'
        : 'Όλα τα cookies έγιναν αποδεκτά. Σας ευχαριστούμε!';
      saveConsent({ functional: true, analytics: true }, msg);
    });
  }

  if (modalAcceptAllBtn) {
    modalAcceptAllBtn.addEventListener('click', () => {
      const msg = currentLang === 'en'
        ? 'All cookies accepted. Thank you!'
        : 'Όλα τα cookies έγιναν αποδεκτά. Σας ευχαριστούμε!';
      saveConsent({ functional: true, analytics: true }, msg);
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      const msg = currentLang === 'en'
        ? 'Non-essential cookies declined.'
        : 'Αποθηκεύτηκαν μόνο τα απολύτως απαραίτητα cookies.';
      saveConsent({ functional: false, analytics: false }, msg);
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      if (banner) banner.style.display = 'none';
      if (typeof window.openLegalModal === 'function') {
        window.openLegalModal('cookies');
      }
    });
  }

  if (savePrefsBtn) {
    savePrefsBtn.addEventListener('click', () => {
      const funcChecked = document.getElementById('cookie-pref-functional')?.checked ?? true;
      const analyticsChecked = document.getElementById('cookie-pref-analytics')?.checked ?? false;
      const msg = currentLang === 'en'
        ? 'Your privacy preferences have been saved.'
        : 'Οι προτιμήσεις απορρήτου σας αποθηκεύτηκαν με επιτυχία.';
      saveConsent({ functional: funcChecked, analytics: analyticsChecked }, msg);
    });
  }
}
