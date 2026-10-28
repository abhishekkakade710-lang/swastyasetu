/* SwasthyaSetu - Core Application Logic, View Routing, Booking Wizard, Teleconsultation & Accessibility */

// Global State
const appState = {
  currentLang: 'en',
  currentView: 'view-home',
  currentUser: null,
  activeRadius: 25,
  activeTypeFilter: 'ALL',
  searchQuery: '',
  selectedCentreId: 'phc-wadgaon',
  bookingData: {
    centreId: '',
    department: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    symptoms: ''
  },
  activeCallDoctor: null,
  callTimerInterval: null,
  callSeconds: 0
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initLanguage();
  initNavigation();
  initFiltersAndSearch();
  initBookingWizard();
  initTeleconsultation();
  initMedicineSearch();
  initSchemes();
  initMockMap();
  initAccessibilityControls();
  renderAppointmentsList();
  renderCentresList();
  renderMedicinesList();
  renderSchemesList();
});

/* -------------------------------------------------------------
   1. LOCAL STORAGE & USER PROFILE MANAGEMENT
-------------------------------------------------------------- */
function initStorage() {
  const savedUser = localStorage.getItem('swasthyasetu_user');
  if (savedUser) {
    try {
      appState.currentUser = JSON.parse(savedUser);
    } catch (e) {
      appState.currentUser = null;
    }
  } else {
    // Default demo profile for rural citizen
    appState.currentUser = {
      name: "Ramesh Tukaram Patil",
      mobile: "9823101234",
      age: 42,
      gender: "Male",
      village: "Vill. Wadgaon, Khed Taluka",
      district: "Pune",
      pinCode: "410501",
      abhaId: "91-4829-1029-4821",
      preferredLang: "mr"
    };
    localStorage.setItem('swasthyasetu_user', JSON.stringify(appState.currentUser));
  }

  // Load existing appointments or seed default
  if (!localStorage.getItem('swasthyasetu_appointments')) {
    localStorage.setItem('swasthyasetu_appointments', JSON.stringify(mockAppointments));
  }

  updateUserUI();
}

function updateUserUI() {
  const userGreetingEl = document.getElementById('user-greeting-name');
  const userHeaderBtn = document.getElementById('header-user-btn');
  const userBadgeName = document.getElementById('user-badge-name');
  const userLocationBadge = document.getElementById('dashboard-location-text');

  if (appState.currentUser) {
    if (userGreetingEl) userGreetingEl.textContent = appState.currentUser.name;
    if (userBadgeName) userBadgeName.textContent = appState.currentUser.name.split(' ')[0];
    if (userLocationBadge) userLocationBadge.textContent = `${appState.currentUser.village} (GPS 📍)`;
    if (userHeaderBtn) {
      userHeaderBtn.innerHTML = `
        <span class="user-badge-avatar">${appState.currentUser.name.charAt(0)}</span>
        <span id="user-badge-name">${appState.currentUser.name.split(' ')[0]}</span>
      `;
      userHeaderBtn.onclick = () => switchView('view-dashboard');
    }
  }
}

/* -------------------------------------------------------------
   2. MULTI-LANGUAGE (ENGLISH, HINDI, MARATHI) & TTS READ-ALOUD
-------------------------------------------------------------- */
function initLanguage() {
  const savedLang = localStorage.getItem('swasthyasetu_lang') || 'en';
  setLanguage(savedLang);

  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  appState.currentLang = lang;
  localStorage.setItem('swasthyasetu_lang', lang);

  // Apply translations to all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Re-render dynamic components that contain language-specific fields
  renderCentresList();
  renderMedicinesList();
  renderSchemesList();
  renderTeleDoctors();
}

// Text-to-Speech Accessibility for semi-literate rural patients
function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (appState.currentLang === 'hi') {
    utterance.lang = 'hi-IN';
  } else if (appState.currentLang === 'mr') {
    utterance.lang = 'mr-IN';
  } else {
    utterance.lang = 'en-IN';
  }
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// Voice Search Simulation for rural users
function triggerVoiceSearch() {
  const modal = document.getElementById('voice-search-modal');
  if (modal) modal.classList.add('active');

  const voiceStatus = document.getElementById('voice-status-text');
  if (voiceStatus) {
    const t = translations[appState.currentLang];
    voiceStatus.textContent = t.speak_now || "Listening... Speak your requirement";
  }

  // Simulate rural voice recognition
  setTimeout(() => {
    const sampleQueries = {
      en: ["Paracetamol in Wadgaon PHC", "Pediatric doctor near me", "Snake antivenom", "Janani delivery scheme"],
      hi: ["वडगांव पीएचसी में बुखार की दवा", "बच्चों के डॉक्टर", "सांप काटने का टीका", "जननी सुरक्षा योजना"],
      mr: ["वडगाव केंद्रात तापाचे औषध", "लहान मुलांचे डॉक्टर", "सर्पदंश लस साठा", "आयुष्मान भारत योजना"]
    };
    const randomQuery = sampleQueries[appState.currentLang][Math.floor(Math.random() * sampleQueries[appState.currentLang].length)];
    
    if (voiceStatus) {
      voiceStatus.innerHTML = `<strong>Heard:</strong> "${randomQuery}"... Searching!`;
    }

    setTimeout(() => {
      closeModal('voice-search-modal');
      switchView('view-finder');
      const searchInput = document.getElementById('centre-search-input');
      if (searchInput) {
        searchInput.value = randomQuery;
        appState.searchQuery = randomQuery.toLowerCase();
        renderCentresList();
      }
    }, 1200);
  }, 1800);
}

/* -------------------------------------------------------------
   3. NAVIGATION & VIEW SWITCHER
-------------------------------------------------------------- */
function initNavigation() {
  document.querySelectorAll('[data-target-view]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target-view');
      switchView(target);
    });
  });
}

function switchView(viewId) {
  document.querySelectorAll('.page-view').forEach((view) => {
    view.classList.remove('active');
  });

  const targetEl = document.getElementById(viewId);
  if (targetEl) {
    targetEl.classList.add('active');
    appState.currentView = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update navigation link highlights
  document.querySelectorAll('.nav-link, .mobile-nav-item').forEach((item) => {
    if (item.getAttribute('data-target-view') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  if (viewId === 'view-dashboard') {
    renderAppointmentsList();
  }
}

/* -------------------------------------------------------------
   4. HEALTHCARE CENTRE FINDER & MAP
-------------------------------------------------------------- */
function initFiltersAndSearch() {
  const searchInput = document.getElementById('centre-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.toLowerCase().trim();
      renderCentresList();
    });
  }

  // Radius Slider
  const radiusSlider = document.getElementById('radius-slider');
  const radiusValDisplay = document.getElementById('radius-val-display');
  if (radiusSlider) {
    radiusSlider.addEventListener('input', (e) => {
      appState.activeRadius = parseInt(e.target.value, 10);
      if (radiusValDisplay) radiusValDisplay.textContent = `${appState.activeRadius} km`;
      renderCentresList();
      renderMockMapPins();
    });
  }

  // Type Filter Pills
  document.querySelectorAll('.filter-pill[data-type]').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-type]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      appState.activeTypeFilter = pill.getAttribute('data-type');
      renderCentresList();
      renderMockMapPins();
    });
  });

  // Doctor on duty checkbox
  const docDutyToggle = document.getElementById('filter-doc-duty');
  if (docDutyToggle) {
    docDutyToggle.addEventListener('change', renderCentresList);
  }

  // 24x7 Emergency checkbox
  const emergToggle = document.getElementById('filter-emergency');
  if (emergToggle) {
    emergToggle.addEventListener('change', renderCentresList);
  }
}

function getFilteredCentres() {
  const docDutyOnly = document.getElementById('filter-doc-duty')?.checked || false;
  const emergencyOnly = document.getElementById('filter-emergency')?.checked || false;

  return healthcareCentres.filter((centre) => {
    // Radius check
    if (centre.distance > appState.activeRadius) return false;

    // Type filter
    if (appState.activeTypeFilter !== 'ALL' && centre.type !== appState.activeTypeFilter) return false;

    // Doctor on duty
    if (docDutyOnly && !centre.doctors.some(d => d.onDuty)) return false;

    // Emergency 24x7
    if (emergencyOnly && !centre.emergency24x7) return false;

    // Search query match
    if (appState.searchQuery) {
      const q = appState.searchQuery;
      const matchName = centre.name.toLowerCase().includes(q) ||
        (centre.name_hi && centre.name_hi.toLowerCase().includes(q)) ||
        (centre.name_mr && centre.name_mr.toLowerCase().includes(q));
      const matchTaluka = centre.taluka.toLowerCase().includes(q);
      const matchServices = centre.services.some(s => s.toLowerCase().includes(q));
      const matchDoctors = centre.doctors.some(d => d.name.toLowerCase().includes(q) || d.department.toLowerCase().includes(q));

      if (!matchName && !matchTaluka && !matchServices && !matchDoctors) return false;
    }

    return true;
  });
}

function renderCentresList() {
  const container = document.getElementById('centres-list-container');
  if (!container) return;

  const centres = getFilteredCentres();
  const t = translations[appState.currentLang];

  if (centres.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1.5px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 0.5rem;">No healthcare centres found matching these filters.</p>
        <p style="font-size: 0.9rem; color: var(--text-light);">Try increasing the search radius to 50 km or clearing specific filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = centres.map((centre) => {
    const displayName = appState.currentLang === 'hi' && centre.name_hi ? centre.name_hi :
      (appState.currentLang === 'mr' && centre.name_mr ? centre.name_mr : centre.name);
    const activeDocsCount = centre.doctors.filter(d => d.onDuty).length;

    return `
      <div class="centre-card" id="card-${centre.id}">
        <div class="centre-card-header">
          <div class="centre-card-title-group">
            <h4>${displayName}</h4>
            <div class="centre-card-meta">
              <span class="distance-badge">📍 ${centre.distance} km (${centre.travelTime})</span>
              <span>⭐ ${centre.rating} (${centre.reviewsCount} villagers)</span>
            </div>
          </div>
          <span class="badge-tag ${centre.type === 'PHC' ? 'qa-blue' : (centre.type === 'CHC' ? 'qa-teal' : 'qa-purple')}" style="color: #fff;">
            ${centre.typeLabel}
          </span>
        </div>

        <div class="centre-badges-strip">
          ${activeDocsCount > 0 ? `<span class="badge-tag badge-doc-active">🟢 ${activeDocsCount} Doctor${activeDocsCount > 1 ? 's' : ''} On Duty</span>` : `<span class="badge-tag" style="background:#fee2e2; color:#b91c1c;">🔴 Doctor in Transit</span>`}
          ${centre.emergency24x7 ? `<span class="badge-tag badge-emergency">🚨 24x7 Emergency</span>` : ''}
          ${centre.snakebiteAntivenomReady ? `<span class="badge-tag badge-medicine">💉 Antivenom Ready</span>` : ''}
        </div>

        <div class="centre-card-details-snip">
          <div>
            <div class="snip-label">Services</div>
            <div class="snip-val">${centre.services.slice(0, 2).join(', ')}...</div>
          </div>
          <div>
            <div class="snip-label">Working Hours</div>
            <div class="snip-val">${centre.emergency24x7 ? '24x7 Casualty' : '09:00 AM - 05:00 PM'}</div>
          </div>
        </div>

        <div class="centre-card-actions">
          <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.88rem;" onclick="openCentreDetails('${centre.id}')">
            ${t.view_details || 'View Details'}
          </button>
          <button class="btn-secondary" style="padding: 0.48rem 0.95rem; font-size: 0.88rem;" onclick="startBooking('${centre.id}')">
            📅 ${t.book_appointment || 'Book Token'}
          </button>
          <button class="tool-btn" style="color: var(--primary); border-color: var(--border-subtle); padding: 0.5rem 0.8rem; font-weight: 600;" onclick="showDirectionsModal('${centre.id}')">
            🧭 ${t.get_directions || 'Directions'}
          </button>
          <a href="tel:${centre.phone}" class="tool-btn" style="color: var(--success); border-color: var(--border-subtle); padding: 0.5rem 0.8rem; font-weight: 600;">
            📞 Call
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/* -------------------------------------------------------------
   5. MOCK INTERACTIVE MAP (SVG BASED FOR PERFECT CROSS-PLATFORM)
-------------------------------------------------------------- */
function initMockMap() {
  renderMockMapPins();
}

function renderMockMapPins() {
  const mapOverlay = document.getElementById('map-pins-overlay');
  if (!mapOverlay) return;

  const centres = getFilteredCentres();

  mapOverlay.innerHTML = `
    <!-- User current location GPS beacon -->
    <div class="user-current-pin" style="left: 45%; top: 52%;" title="Your Location: Vill. Wadgaon">
      <div class="user-gps-pulse"></div>
    </div>
  ` + centres.map((centre) => {
    return `
      <div class="map-pin ${centre.type.toLowerCase()}" style="left: ${centre.coordinates.x}%; top: ${centre.coordinates.y}%;" onclick="openCentreDetails('${centre.id}')" title="${centre.name}">
        <div class="map-pin-inner">
          <span>${centre.type === 'PHC' ? '🏥' : (centre.type === 'CHC' ? '🏨' : '🩺')}</span>
          <span>${centre.name.split(' ')[0]}</span>
          <span style="background: rgba(0,0,0,0.25); padding: 1px 4px; border-radius: 4px; font-size: 0.7rem;">${centre.distance}km</span>
        </div>
      </div>
    `;
  }).join('');
}

/* -------------------------------------------------------------
   6. CENTRE DETAILS DEEP DIVE
-------------------------------------------------------------- */
function openCentreDetails(centreId) {
  const centre = healthcareCentres.find(c => c.id === centreId);
  if (!centre) return;

  appState.selectedCentreId = centreId;
  const container = document.getElementById('centre-details-view-container');
  if (!container) return;

  const t = translations[appState.currentLang];
  const displayName = appState.currentLang === 'hi' && centre.name_hi ? centre.name_hi :
    (appState.currentLang === 'mr' && centre.name_mr ? centre.name_mr : centre.name);

  container.innerHTML = `
    <div class="details-hero">
      <div class="details-hero-info">
        <span class="badge-tag qa-blue" style="color: #fff; margin-bottom: 0.5rem;">${centre.typeLabel} • Taluka ${centre.taluka}</span>
        <h2>${displayName}</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem;">📍 ${centre.address}</p>
        <div style="display: flex; gap: 1rem; margin-top: 0.75rem; flex-wrap: wrap; font-size: 0.95rem;">
          <span style="font-weight: 700; color: var(--primary);">Distance: ${centre.distance} km (${centre.travelTime})</span>
          <span style="font-weight: 700; color: var(--warning);">⭐ ${centre.rating} / 5.0 (${centre.reviewsCount} villager reviews)</span>
          <span style="font-weight: 700; color: var(--success);">📞 ${centre.phone}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <button class="btn-primary" style="padding: 0.85rem 1.75rem; font-size: 1.05rem;" onclick="startBooking('${centre.id}')">
          📅 ${t.book_appointment || 'Book OPD Token'}
        </button>
        <button class="btn-secondary" onclick="showDirectionsModal('${centre.id}')">
          🧭 ${t.get_directions || 'Get Directions'}
        </button>
        <button class="tool-btn" style="color: var(--text-main);" onclick="speakText('${displayName}. Located at ${centre.address}. Distance is ${centre.distance} kilometers. Emergency is open 24 hours.')">
          🔊 ${t.read_aloud || 'Listen Information'}
        </button>
      </div>
    </div>

    <div class="details-grid">
      <div>
        <!-- Available Doctors -->
        <div class="details-section-card">
          <h4>👨‍⚕️ ${t.doctors_list || 'Available Medical Officers & Specialists'}</h4>
          <div>
            ${centre.doctors.map((doc) => `
              <div class="doctor-item-row">
                <img src="${doc.photo}" alt="${doc.name}" class="doc-avatar-img">
                <div class="doc-details-col">
                  <div class="doc-name">${doc.name}</div>
                  <div class="doc-qual">${doc.qualification} • <em>${doc.designation}</em></div>
                  <span class="doc-dept-badge">${doc.department}</span>
                  <div style="font-size: 0.82rem; color: var(--text-light); margin-top: 0.3rem;">
                    📍 ${doc.roomNo} | Slot: <strong style="color: var(--primary);">${doc.nextSlot}</strong>
                  </div>
                </div>
                <div style="text-align: right;">
                  ${doc.onDuty ? `
                    <span class="status-pill in-stock">🟢 Available Now</span>
                    <div style="font-size: 0.78rem; color: var(--text-light); margin-top: 0.3rem;">${doc.currentQueue} in queue</div>
                  ` : `
                    <span class="status-pill out-of-stock">Off Duty</span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Medical Services -->
        <div class="details-section-card">
          <h4>🏥 ${t.services_offered || 'Available Medical Services'}</h4>
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem;">
            ${centre.services.map(s => `
              <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.92rem;">
                <span style="color: var(--success); font-weight: bold;">✔</span> ${s}
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Medicine Stock Snapshot -->
        <div class="details-section-card">
          <h4>💊 ${t.med_availability || 'Live Medicine Availability Snapshot'}</h4>
          <table class="stock-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Status</th>
                <th>Approx Qty</th>
              </tr>
            </thead>
            <tbody>
              ${centre.medicinesStockSnapshot.map(m => `
                <tr>
                  <td><strong>${m.name}</strong></td>
                  <td>
                    <span class="status-pill ${m.status}">
                      ${m.status === 'in-stock' ? 'In Stock' : (m.status === 'limited' ? 'Limited' : 'Out of Stock')}
                    </span>
                  </td>
                  <td>${m.qty} units</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Diagnostics & Working Hours & Reviews -->
      <div>
        <div class="details-section-card">
          <h4>🔬 ${t.diagnostics || 'Diagnostic Tests'}</h4>
          <ul style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${centre.diagnostics.map(d => `
              <li style="display: flex; justify-content: space-between; font-size: 0.9rem; padding-bottom: 0.5rem; border-bottom: 1px dotted var(--border-subtle);">
                <span>${d.name}</span>
                <strong style="color: ${d.available ? 'var(--success)' : 'var(--danger)'};">${d.fee}</strong>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="details-section-card">
          <h4>🕒 ${t.working_hours || 'Working Hours'}</h4>
          <p style="font-size: 0.95rem; color: var(--text-main); font-weight: 600; line-height: 1.5;">
            ${centre.openingHours}
          </p>
          <div style="margin-top: 1rem; background: var(--danger-light); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.88rem; color: var(--danger);">
            🚨 <strong>24x7 Ambulance & Snakebite:</strong> Direct emergency medical officer available on phone.
          </div>
        </div>

        <div class="details-section-card">
          <h4>💬 ${t.patient_reviews || 'Villager Feedback'}</h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${centre.reviews.map(r => `
              <div style="background: var(--bg-page); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.88rem;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 0.25rem;">
                  <span>${r.author} (${r.village})</span>
                  <span style="color: var(--warning);">⭐ ${r.rating}/5</span>
                </div>
                <p style="color: var(--text-muted); font-style: italic;">"${r.text}"</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  switchView('view-centre-details');
}

/* -------------------------------------------------------------
   7. STEP-BY-STEP APPOINTMENT BOOKING WIZARD
-------------------------------------------------------------- */
function initBookingWizard() {
  // Populate centre dropdown
  const centreSelect = document.getElementById('booking-centre-select');
  if (centreSelect) {
    centreSelect.innerHTML = healthcareCentres.map(c => `
      <option value="${c.id}">${c.name} (${c.distance} km)</option>
    `).join('');

    centreSelect.addEventListener('change', (e) => {
      populateBookingDoctors(e.target.value);
    });
  }

  // Set default dates (Today, Tomorrow, Day after)
  const dateInput = document.getElementById('booking-date-input');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  // Slot selector pills
  document.querySelectorAll('.slot-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.slot-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      appState.bookingData.timeSlot = pill.getAttribute('data-slot');
    });
  });

  // Pre-fill patient details if logged in
  if (appState.currentUser) {
    const nameEl = document.getElementById('patient-name-input');
    const ageEl = document.getElementById('patient-age-input');
    const genderEl = document.getElementById('patient-gender-select');
    if (nameEl) nameEl.value = appState.currentUser.name;
    if (ageEl) ageEl.value = appState.currentUser.age;
    if (genderEl) genderEl.value = appState.currentUser.gender;
  }
}

function startBooking(centreId) {
  switchView('view-booking');
  const centreSelect = document.getElementById('booking-centre-select');
  if (centreSelect && centreId) {
    centreSelect.value = centreId;
    populateBookingDoctors(centreId);
  }
  // Reset confirmation state
  document.getElementById('booking-wizard-step-form').style.display = 'block';
  document.getElementById('booking-confirmation-container').style.display = 'none';
}

function populateBookingDoctors(centreId) {
  const centre = healthcareCentres.find(c => c.id === centreId) || healthcareCentres[0];
  const docSelect = document.getElementById('booking-doctor-select');
  if (docSelect) {
    docSelect.innerHTML = `
      <option value="any">First Available Doctor (Fastest OPD Token)</option>
    ` + centre.doctors.map(d => `
      <option value="${d.id}">${d.name} - ${d.qualification} (${d.department})</option>
    `).join('');
  }
}

function submitBookingForm(e) {
  e.preventDefault();
  const centreSelect = document.getElementById('booking-centre-select');
  const deptSelect = document.getElementById('booking-dept-select');
  const docSelect = document.getElementById('booking-doctor-select');
  const dateInput = document.getElementById('booking-date-input');
  const nameInput = document.getElementById('patient-name-input');
  const ageInput = document.getElementById('patient-age-input');
  const genderSelect = document.getElementById('patient-gender-select');
  const symptomsInput = document.getElementById('patient-symptoms-input');

  const selectedCentre = healthcareCentres.find(c => c.id === centreSelect.value) || healthcareCentres[0];
  let doctorName = "Duty Medical Officer";
  if (docSelect.value !== 'any') {
    const foundDoc = selectedCentre.doctors.find(d => d.id === docSelect.value);
    if (foundDoc) doctorName = foundDoc.name;
  }

  const activeSlotPill = document.querySelector('.slot-pill.active');
  const slotTime = activeSlotPill ? activeSlotPill.getAttribute('data-slot') : '10:00 AM - 10:30 AM';

  const newAppointment = {
    id: 'SST-2026-' + Math.floor(10000 + Math.random() * 90000),
    centreId: selectedCentre.id,
    centreName: selectedCentre.name,
    doctorName: doctorName,
    department: deptSelect.value,
    patientName: nameInput.value || "Patient",
    patientAge: ageInput.value || 35,
    patientGender: genderSelect.value || "Male",
    date: dateInput.value || new Date().toISOString().split('T')[0],
    timeSlot: slotTime,
    tokenNumber: "TOKEN #" + Math.floor(10 + Math.random() * 30),
    status: "Confirmed",
    symptoms: symptomsInput.value || "Routine OPD checkup",
    createdAt: new Date().toISOString()
  };

  // Save to LocalStorage
  const existing = JSON.parse(localStorage.getItem('swasthyasetu_appointments') || '[]');
  existing.unshift(newAppointment);
  localStorage.setItem('swasthyasetu_appointments', JSON.stringify(existing));

  // Render Confirmation Slip
  showBookingConfirmation(newAppointment);
}

function showBookingConfirmation(appointment) {
  document.getElementById('booking-wizard-step-form').style.display = 'none';
  const confirmContainer = document.getElementById('booking-confirmation-container');
  confirmContainer.style.display = 'block';

  confirmContainer.innerHTML = `
    <div class="token-slip-card" id="printable-token">
      <div class="token-slip-header">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">Government of Maharashtra Public Health Department</div>
        <h3 style="font-size: 1.35rem; color: var(--primary-navy); margin: 0.3rem 0;">SwasthyaSetu Digital OPD Token</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${appointment.centreName}</p>
        <div class="token-big-badge">${appointment.tokenNumber}</div>
        <div style="color: var(--success); font-weight: 700; font-size: 0.95rem;">✅ Token Confirmed & Valid</div>
      </div>

      <div class="token-row">
        <span class="token-row-label">Appointment ID</span>
        <span class="token-row-val">${appointment.id}</span>
      </div>
      <div class="token-row">
        <span class="token-row-label">Patient Name</span>
        <span class="token-row-val">${appointment.patientName} (${appointment.patientAge}y / ${appointment.patientGender})</span>
      </div>
      <div class="token-row">
        <span class="token-row-label">Doctor / OPD</span>
        <span class="token-row-val">${appointment.doctorName}</span>
      </div>
      <div class="token-row">
        <span class="token-row-label">Department</span>
        <span class="token-row-val">${appointment.department}</span>
      </div>
      <div class="token-row">
        <span class="token-row-label">Date & Time Slot</span>
        <span class="token-row-val" style="color: var(--primary);">${appointment.date} | ${appointment.timeSlot}</span>
      </div>
      <div class="token-row">
        <span class="token-row-label">Reported Symptoms</span>
        <span class="token-row-val">${appointment.symptoms}</span>
      </div>

      <div class="token-qr-code">
        <!-- SVG Mock QR Code -->
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" style="background:#fff; padding:6px; border:1px solid #ccc; border-radius:8px;">
          <rect width="100" height="100" fill="white"/>
          <rect x="10" y="10" width="25" height="25" fill="#092c48"/>
          <rect x="15" y="15" width="15" height="15" fill="white"/>
          <rect x="18" y="18" width="9" height="9" fill="#092c48"/>
          
          <rect x="65" y="10" width="25" height="25" fill="#092c48"/>
          <rect x="70" y="15" width="15" height="15" fill="white"/>
          <rect x="73" y="18" width="9" height="9" fill="#092c48"/>
          
          <rect x="10" y="65" width="25" height="25" fill="#092c48"/>
          <rect x="15" y="70" width="15" height="15" fill="white"/>
          <rect x="18" y="73" width="9" height="9" fill="#092c48"/>
          
          <rect x="42" y="15" width="8" height="16" fill="#0284c7"/>
          <rect x="42" y="42" width="16" height="16" fill="#092c48"/>
          <rect x="65" y="42" width="10" height="20" fill="#0284c7"/>
          <rect x="42" y="70" width="20" height="12" fill="#092c48"/>
          <rect x="70" y="70" width="18" height="18" fill="#0284c7"/>
        </svg>
      </div>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.85rem; color: #166534; text-align: center; margin-bottom: 1.25rem;">
        📱 SMS sent to registered mobile! Show this token on your phone at OPD Room 1 to bypass the general registration crowd.
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
        <button class="btn-primary" onclick="window.print()">🖨️ Print / Save Token</button>
        <button class="btn-secondary" onclick="switchView('view-dashboard')">View in My Dashboard</button>
      </div>
    </div>
  `;
}

/* -------------------------------------------------------------
   8. TELECONSULTATION PORTAL & LIVE VIDEO CALL SIMULATION
-------------------------------------------------------------- */
function initTeleconsultation() {
  renderTeleDoctors();
}

function renderTeleDoctors() {
  const container = document.getElementById('tele-doctors-grid');
  if (!container) return;

  const t = translations[appState.currentLang];

  container.innerHTML = teleDoctors.map(doc => {
    const spec = appState.currentLang === 'hi' && doc.specialization_hi ? doc.specialization_hi :
      (appState.currentLang === 'mr' && doc.specialization_mr ? doc.specialization_mr : doc.specialization);

    return `
      <div class="tele-doc-card">
        <div class="tele-doc-header">
          <div class="tele-doc-avatar-wrap">
            <img src="${doc.photo}" alt="${doc.name}" class="tele-avatar-img">
            <span class="tele-online-dot ${doc.status}"></span>
          </div>
          <div>
            <h4 style="font-size: 1.15rem; font-weight: 750; color: var(--text-main);">${doc.name}</h4>
            <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">${spec}</div>
            <div style="font-size: 0.78rem; color: var(--text-light);">${doc.qualification}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.86rem; background: var(--bg-page); padding: 0.75rem; border-radius: var(--radius-md);">
          <div>🗣️ <strong>${t.languages_spoken || 'Languages'}:</strong> ${doc.languages.join(', ')}</div>
          <div>⏱️ <strong>${t.queue_wait || 'Wait'}:</strong> <span style="color: ${doc.status === 'online' ? 'var(--success)' : 'var(--warning)'}; font-weight: 700;">${doc.estimatedWait}</span></div>
          <div>⭐ <strong>Rating:</strong> ${doc.rating} / 5.0 (${doc.consultationsCount} consultations)</div>
        </div>

        <button class="${doc.status === 'online' ? 'btn-primary' : 'btn-secondary'}" style="width: 100%; justify-content: center; padding: 0.75rem;" onclick="startTeleCall('${doc.id}')">
          📹 ${doc.status === 'online' ? (t.start_call_btn || 'Connect Video Call Now') : 'Schedule Appointment'}
        </button>
      </div>
    `;
  }).join('');
}

function startTeleCall(docId) {
  const doc = teleDoctors.find(d => d.id === docId) || teleDoctors[0];
  appState.activeCallDoctor = doc;

  const modal = document.getElementById('tele-call-modal');
  if (!modal) return;

  modal.classList.add('active');
  document.getElementById('video-call-doc-name').textContent = doc.name;
  document.getElementById('video-call-doc-role').textContent = doc.specialization;
  document.getElementById('video-doc-feed-img').src = doc.photo;

  // Start Call Timer
  appState.callSeconds = 0;
  clearInterval(appState.callTimerInterval);
  appState.callTimerInterval = setInterval(() => {
    appState.callSeconds++;
    const mins = String(Math.floor(appState.callSeconds / 60)).padStart(2, '0');
    const secs = String(appState.callSeconds % 60).padStart(2, '0');
    const timerEl = document.getElementById('call-timer-display');
    if (timerEl) timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}

function endTeleCall() {
  clearInterval(appState.callTimerInterval);
  const modal = document.getElementById('tele-call-modal');
  if (modal) modal.classList.remove('active');

  alert("Teleconsultation ended successfully! Your digital e-prescription with Dr. Sunita Deshmukh has been saved to your dashboard and SMS has been sent.");
  switchView('view-dashboard');
}

function toggleCallMute(btn) {
  btn.classList.toggle('danger');
  const isMuted = btn.classList.contains('danger');
  btn.innerHTML = isMuted ? '🔇' : '🎤';
}

function toggleCallVideo(btn) {
  btn.classList.toggle('danger');
  const isOff = btn.classList.contains('danger');
  btn.innerHTML = isOff ? '🚫' : '📹';
  const selfFeed = document.querySelector('.patient-self-feed');
  if (selfFeed) {
    selfFeed.style.opacity = isOff ? '0.3' : '1';
  }
}

/* -------------------------------------------------------------
   9. MEDICINE AVAILABILITY SEARCH & REAL-TIME STOCK
-------------------------------------------------------------- */
function initMedicineSearch() {
  const searchInput = document.getElementById('med-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', renderMedicinesList);
  }

  const centreFilter = document.getElementById('med-centre-filter');
  if (centreFilter) {
    centreFilter.innerHTML = `
      <option value="ALL">All Nearby Government Centres</option>
    ` + healthcareCentres.map(c => `
      <option value="${c.id}">${c.name}</option>
    `).join('');

    centreFilter.addEventListener('change', renderMedicinesList);
  }
}

function renderMedicinesList() {
  const container = document.getElementById('medicine-cards-grid');
  if (!container) return;

  const query = (document.getElementById('med-search-input')?.value || '').toLowerCase().trim();
  const selectedCentre = document.getElementById('med-centre-filter')?.value || 'ALL';
  const t = translations[appState.currentLang];

  const filtered = medicineCatalog.filter(med => {
    const matchName = med.name.toLowerCase().includes(query) ||
      med.brandExample.toLowerCase().includes(query) ||
      med.category.toLowerCase().includes(query) ||
      (med.category_hi && med.category_hi.toLowerCase().includes(query)) ||
      (med.category_mr && med.category_mr.toLowerCase().includes(query));

    if (!matchName) return false;

    if (selectedCentre !== 'ALL') {
      return med.centres.some(c => c.centreId === selectedCentre);
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1.5px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; color: var(--text-muted);">No medicine found matching "${query}".</p>
        <p style="font-size: 0.9rem; color: var(--text-light); margin-top: 0.4rem;">Try searching for "Paracetamol", "ORS", "Metformin", or "Antivenom".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(med => {
    const cat = appState.currentLang === 'hi' && med.category_hi ? med.category_hi :
      (appState.currentLang === 'mr' && med.category_mr ? med.category_mr : med.category);

    return `
      <div class="med-card">
        <div>
          <div class="med-card-header">
            <div>
              <div class="med-name">${med.name}</div>
              <div class="med-generic-tag">${med.brandExample} • ${cat}</div>
            </div>
            <div class="med-price-badge">${med.govtPrice}</div>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.75rem 0; line-height: 1.4;">
            ${med.description}
          </p>
          <div style="font-size: 0.82rem; color: var(--text-light); margin-bottom: 0.75rem;">
            Private Market Price: <span style="text-decoration: line-through; color: var(--danger);">${med.marketPrice}</span> (Save 100% under Govt Free Drug Policy)
          </div>
        </div>

        <div>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.4rem;">
            ${t.med_stock_status || 'Availability Across Nearby Centres'}:
          </div>
          <div class="med-centres-stock-list">
            ${med.centres.map(c => `
              <div class="med-centre-row">
                <span class="med-centre-name">${c.centreName}</span>
                <span class="status-pill ${c.status}">
                  ${c.status === 'in-stock' ? `In Stock (${c.qty})` : (c.status === 'limited' ? `Low (${c.qty})` : 'Out of Stock')}
                </span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 0.75rem; text-align: right;">
            <button class="tool-btn" style="color: var(--primary); font-weight: 600;" onclick="switchView('view-finder'); document.getElementById('centre-search-input').value='${med.name.split(' ')[0]}'; appState.searchQuery='${med.name.split(' ')[0].toLowerCase()}'; renderCentresList();">
              📍 Find Nearest Centre with Stock →
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* -------------------------------------------------------------
   10. GOVERNMENT HEALTH SCHEMES & ELIGIBILITY CHECKER
-------------------------------------------------------------- */
function initSchemes() {
  // Setup interactive eligibility quiz
}

function renderSchemesList() {
  const container = document.getElementById('schemes-cards-grid');
  if (!container) return;

  const t = translations[appState.currentLang];

  container.innerHTML = governmentSchemes.map(scheme => {
    const title = appState.currentLang === 'hi' && scheme.name_hi ? scheme.name_hi :
      (appState.currentLang === 'mr' && scheme.name_mr ? scheme.name_mr : scheme.name);
    const tag = appState.currentLang === 'hi' && scheme.tagline_hi ? scheme.tagline_hi :
      (appState.currentLang === 'mr' && scheme.tagline_mr ? scheme.tagline_mr : scheme.tagline);

    return `
      <div class="scheme-card">
        <div>
          <span class="scheme-top-badge">🌟 ${t.eligible_badge || 'Government Welfare Scheme'}</span>
          <h3 class="scheme-title">${title}</h3>
          <p style="font-size: 0.92rem; color: var(--accent-teal); font-weight: 600; margin: 0.4rem 0 1rem;">
            ${tag}
          </p>
          <div class="scheme-benefit-highlight">
            ${scheme.benefitAmount}
          </div>
        </div>

        <div>
          <h5 style="font-size: 0.95rem; font-weight: 750; color: var(--primary-navy); margin-bottom: 0.5rem;">Main Benefits:</h5>
          <ul class="scheme-bullets">
            ${scheme.mainBenefits.slice(0, 3).map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>

        <div style="background: var(--bg-page); padding: 0.9rem; border-radius: var(--radius-md); font-size: 0.85rem;">
          <strong style="color: var(--text-main);">Required Documents:</strong>
          <div style="color: var(--text-muted); margin-top: 0.25rem;">
            ${scheme.documents.join(' • ')}
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem;">
          <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="openEligibilityModal('${scheme.id}')">
            📋 ${t.check_eligibility || 'Check My Eligibility'}
          </button>
          <button class="tool-btn" style="color: var(--text-main);" onclick="speakText('${title}. Benefit is ${scheme.benefitAmount}. ${tag}')">
            🔊
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openEligibilityModal(schemeId) {
  const scheme = governmentSchemes.find(s => s.id === schemeId) || governmentSchemes[0];
  const modal = document.getElementById('eligibility-modal');
  if (!modal) return;

  document.getElementById('eligibility-modal-scheme-title').textContent = scheme.name;
  document.getElementById('eligibility-quiz-step').style.display = 'block';
  document.getElementById('eligibility-result-step').style.display = 'none';

  modal.classList.add('active');
}

function submitEligibilityQuiz(e) {
  e.preventDefault();
  document.getElementById('eligibility-quiz-step').style.display = 'none';
  const resStep = document.getElementById('eligibility-result-step');
  resStep.style.display = 'block';

  resStep.innerHTML = `
    <div style="text-align: center; padding: 1.5rem 0;">
      <div style="width: 60px; height: 60px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem;">
        ✓
      </div>
      <h3 style="font-size: 1.5rem; color: var(--primary-navy); margin-bottom: 0.5rem;">Congratulations! You Are Eligible</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
        Based on your rural location in Khed Taluka and Ration Card criteria, your family qualifies for <strong>₹5,00,000 Free Cashless Hospitalization</strong> under Ayushman Bharat PM-JAY.
      </p>

      <div style="background: var(--bg-page); padding: 1rem; border-radius: var(--radius-md); text-align: left; font-size: 0.9rem; margin-bottom: 1.5rem;">
        <strong>Next 2 Simple Steps to get your Golden Card:</strong>
        <ol style="margin-left: 1.25rem; margin-top: 0.5rem; line-height: 1.6; color: var(--text-muted);">
          <li>Take your <strong>Aadhaar Card</strong> and <strong>Ration Card</strong> to the nearest Gram Panchayat CSC or Wadgaon PHC.</li>
          <li>Ayushman Mitra will take your biometric thumb scan and print your PVC Golden Card on the spot!</li>
        </ol>
      </div>

      <button class="btn-primary" onclick="closeModal('eligibility-modal'); startBooking('phc-wadgaon');">
        📅 Book Free Health Checkup at Wadgaon PHC
      </button>
    </div>
  `;
}

/* -------------------------------------------------------------
   11. DASHBOARD & APPOINTMENTS MANAGEMENT
-------------------------------------------------------------- */
function renderAppointmentsList() {
  const container = document.getElementById('dashboard-appointments-list');
  if (!container) return;

  const appointments = JSON.parse(localStorage.getItem('swasthyasetu_appointments') || '[]');

  if (appointments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 1.5rem; background: var(--bg-page); border-radius: var(--radius-md);">
        <p style="color: var(--text-muted);">No upcoming appointments scheduled.</p>
        <button class="btn-primary" style="margin-top: 0.75rem;" onclick="switchView('view-booking')">Book Your First OPD Token</button>
      </div>
    `;
    return;
  }

  container.innerHTML = appointments.map((apt, index) => `
    <div style="background: var(--bg-surface); border: 1.5px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
        <div>
          <span style="font-weight: 800; color: var(--primary); font-size: 1.15rem;">${apt.tokenNumber}</span>
          <span style="font-size: 0.8rem; color: var(--text-light); margin-left: 0.5rem;">(${apt.id})</span>
        </div>
        <span class="status-pill in-stock">🟢 ${apt.status}</span>
      </div>

      <div style="font-size: 1.05rem; font-weight: 700; color: var(--primary-navy);">${apt.centreName}</div>
      <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.6rem;">
        👨‍⚕️ ${apt.doctorName} • <em>${apt.department}</em>
      </div>

      <div style="background: var(--primary-light); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.88rem; color: var(--primary-dark); font-weight: 600; display: flex; justify-content: space-between;">
        <span>📅 ${apt.date}</span>
        <span>⏰ ${apt.timeSlot}</span>
      </div>

      <div style="display: flex; gap: 0.5rem; margin-top: 0.85rem; justify-content: flex-end;">
        <button class="tool-btn" style="color: var(--danger);" onclick="cancelAppointment(${index})">Cancel</button>
        <button class="tool-btn" style="color: var(--primary);" onclick="showDirectionsModal('${apt.centreId}')">Get Route</button>
      </div>
    </div>
  `).join('');
}

function cancelAppointment(index) {
  if (confirm("Are you sure you want to cancel this appointment token?")) {
    const existing = JSON.parse(localStorage.getItem('swasthyasetu_appointments') || '[]');
    existing.splice(index, 1);
    localStorage.setItem('swasthyasetu_appointments', JSON.stringify(existing));
    renderAppointmentsList();
  }
}

/* -------------------------------------------------------------
   12. DIRECTIONS MODAL WITH STEP-BY-STEP RURAL ROUTE
-------------------------------------------------------------- */
function showDirectionsModal(centreId) {
  const centre = healthcareCentres.find(c => c.id === centreId) || healthcareCentres[0];
  const modal = document.getElementById('directions-modal');
  if (!modal) return;

  document.getElementById('directions-centre-name').textContent = centre.name;
  document.getElementById('directions-centre-address').textContent = centre.address;
  document.getElementById('directions-distance-badge').textContent = `Distance: ${centre.distance} km (${centre.travelTime} by auto/bike)`;

  const routeStepsContainer = document.getElementById('directions-steps-list');
  if (routeStepsContainer) {
    routeStepsContainer.innerHTML = `
      <div style="position: relative; padding-left: 2rem; border-left: 2px solid var(--primary); display: flex; flex-direction: column; gap: 1.25rem;">
        <div>
          <strong style="color: var(--primary);">Step 1: Start from your village</strong>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Proceed from Wadgaon Gram Panchayat road towards Khed-Manchar highway (0.8 km).</p>
        </div>
        <div>
          <strong style="color: var(--primary);">Step 2: Cross river bridge</strong>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Take the right fork at Wadgaon bridge junction onto Primary Health Road (1.4 km).</p>
        </div>
        <div>
          <strong style="color: var(--success);">Step 3: Arrive at ${centre.name}</strong>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Center is on your left with emergency gate and ambulance bay (600 m ahead).</p>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
}

/* -------------------------------------------------------------
   13. ACCESSIBILITY CONTROLS & EMERGENCY SOS
-------------------------------------------------------------- */
function initAccessibilityControls() {
  const contrastBtn = document.getElementById('toggle-contrast-btn');
  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
    });
  }

  const fontBtn = document.getElementById('toggle-font-btn');
  if (fontBtn) {
    let fontState = 0; // 0: normal, 1: large, 2: xlarge
    fontBtn.addEventListener('click', () => {
      fontState = (fontState + 1) % 3;
      document.body.classList.remove('font-large', 'font-xlarge');
      if (fontState === 1) document.body.classList.add('font-large');
      if (fontState === 2) document.body.classList.add('font-xlarge');
    });
  }
}

function triggerEmergencySOS() {
  const modal = document.getElementById('emergency-sos-modal');
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// User Registration Modal
function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('active');
}

function submitAuthForm(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name-input')?.value || "Rural Citizen";
  const mobile = document.getElementById('reg-mobile-input')?.value || "9823100000";
  const age = document.getElementById('reg-age-input')?.value || "40";
  const gender = document.getElementById('reg-gender-select')?.value || "Male";
  const village = document.getElementById('reg-village-input')?.value || "Vill. Wadgaon";

  appState.currentUser = {
    name,
    mobile,
    age: parseInt(age, 10),
    gender,
    village,
    district: "Pune",
    pinCode: "410501"
  };

  localStorage.setItem('swasthyasetu_user', JSON.stringify(appState.currentUser));
  updateUserUI();
  closeModal('auth-modal');
  alert(`Welcome, ${name}! Your rural patient profile is verified.`);
}
