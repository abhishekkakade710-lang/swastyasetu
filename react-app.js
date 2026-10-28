/* SwasthyaSetu - Component-Based React 18 Application */

const { useState, useEffect, useMemo, useRef, useCallback } = React;

function App() {
  // Global React States
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('swasthyasetu_lang') || 'en');
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('swasthyasetu_user'));
  const [contrastMode, setContrastMode] = useState(false);
  const [fontSizeState, setFontSizeState] = useState(0); // 0: Normal, 1: Large, 2: X-Large
  const [selectedCentreId, setSelectedCentreId] = useState('phc-wadgaon');
  
  // User Profile (null = not logged in → show RoleBasedLoginPage)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('swasthyasetu_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  // Appointments
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('swasthyasetu_appointments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return mockAppointments; }
    }
    return mockAppointments;
  });

  // Modals
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('swasthyasetu_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('swasthyasetu_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('swasthyasetu_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Handle Accessibility classes on body
  useEffect(() => {
    if (contrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [contrastMode]);

  useEffect(() => {
    document.body.classList.remove('font-large', 'font-xlarge');
    if (fontSizeState === 1) document.body.classList.add('font-large');
    if (fontSizeState === 2) document.body.classList.add('font-xlarge');
  }, [fontSizeState]);

  // Current translation dictionary
  const t = translations[currentLang] || translations.en;

  // Speech Helper
  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (currentLang === 'hi') utterance.lang = 'hi-IN';
    else if (currentLang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const navigateTo = (view, centreId = null) => {
    if (centreId) setSelectedCentreId(centreId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers (RBAC-aware)
  const handleLogin = (user) => {
    localStorage.setItem('swasthyasetu_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
    // Patients start on 'home', other roles render their dedicated dashboard
    setCurrentView('home');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout from SwasthyaSetu?')) {
      localStorage.removeItem('swasthyasetu_user');
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  };

  // Show Role-Based Login Page if not authenticated
  if (!isLoggedIn || !currentUser) {
    return (
      <RoleBasedLoginPage
        onLogin={handleLogin}
        defaultLang={currentLang}
        setCurrentLang={setCurrentLang}
      />
    );
  }

  // Route to dedicated dashboards for non-patient roles
  const userRole = currentUser.role || 'patient';

  if (userRole === 'doctor') {
    return <DoctorDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }
  if (userRole === 'staff') {
    return <StaffDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }
  if (userRole === 'admin') {
    return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="app-root">
      {/* 1. Emergency Top Bar */}
      <TopEmergencyBar 
        t={t}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        contrastMode={contrastMode}
        setContrastMode={setContrastMode}
        fontSizeState={fontSizeState}
        setFontSizeState={setFontSizeState}
      />

      {/* 2. Main Header */}
      <Header 
        t={t}
        currentView={currentView}
        navigateTo={navigateTo}
        currentUser={currentUser}
        onOpenAuth={() => setActiveModal('auth')}
        onEmergency={() => setActiveModal('emergency')}
        onLogout={handleLogout}
      />

      {/* 3. Mobile Bottom Navigation */}
      <MobileBottomNav 
        t={t}
        currentView={currentView}
        navigateTo={navigateTo}
        userRole={userRole}
      />

      {/* 4. Page Views */}
      <main className="app-content">
        {currentView === 'home' && (
          <HomeView 
            t={t} 
            navigateTo={navigateTo} 
            onVoiceSearch={() => setActiveModal('voice')}
            onEmergency={() => setActiveModal('emergency')}
          />
        )}

        {currentView === 'finder' && (
          <FinderView 
            t={t} 
            currentLang={currentLang}
            navigateTo={navigateTo}
            onShowDirections={(centre) => { setModalData(centre); setActiveModal('directions'); }}
            onVoiceSearch={() => setActiveModal('voice')}
          />
        )}

        {currentView === 'details' && (
          <CentreDetailsView 
            t={t} 
            currentLang={currentLang}
            centreId={selectedCentreId}
            navigateTo={navigateTo}
            speak={speak}
            onShowDirections={(centre) => { setModalData(centre); setActiveModal('directions'); }}
          />
        )}

        {currentView === 'booking' && (
          <BookingView 
            t={t}
            currentLang={currentLang}
            preselectedCentreId={selectedCentreId}
            currentUser={currentUser}
            onBookingCreated={(newApt) => {
              setAppointments(prev => [newApt, ...prev]);
            }}
            navigateTo={navigateTo}
          />
        )}

        {currentView === 'tele' && (
          <TeleconsultationView 
            t={t}
            currentLang={currentLang}
            onStartCall={(doc) => { setModalData(doc); setActiveModal('videocall'); }}
          />
        )}

        {currentView === 'medicines' && (
          <MedicinesView 
            t={t}
            currentLang={currentLang}
            navigateTo={navigateTo}
          />
        )}

        {currentView === 'schemes' && (
          <SchemesView 
            t={t}
            currentLang={currentLang}
            speak={speak}
            onCheckEligibility={(scheme) => { setModalData(scheme); setActiveModal('eligibility'); }}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView 
            t={t}
            currentUser={currentUser}
            appointments={appointments}
            onCancelAppointment={(id) => {
              if (confirm("Are you sure you want to cancel this token?")) {
                setAppointments(prev => prev.filter(a => a.id !== id));
              }
            }}
            onShowDirections={(centreId) => {
              const centre = healthcareCentres.find(c => c.id === centreId) || healthcareCentres[0];
              setModalData(centre);
              setActiveModal('directions');
            }}
            navigateTo={navigateTo}
          />
        )}
      </main>

      {/* 5. Footer */}
      <Footer t={t} navigateTo={navigateTo} />

      {/* 6. Dynamic Modals */}
      {activeModal === 'auth' && (
        <AuthModal 
          t={t}
          currentUser={currentUser}
          onSave={(updated) => { setCurrentUser(updated); setActiveModal(null); }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'voice' && (
        <VoiceSearchModal 
          t={t}
          currentLang={currentLang}
          onSelectQuery={(query) => {
            setActiveModal(null);
            navigateTo('finder');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'directions' && (
        <DirectionsModal 
          t={t}
          centre={modalData || healthcareCentres[0]}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'emergency' && (
        <EmergencyModal 
          t={t}
          onNavigateCasualty={() => {
            setActiveModal(null);
            navigateTo('details', 'phc-wadgaon');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'eligibility' && (
        <EligibilityModal 
          t={t}
          scheme={modalData || governmentSchemes[0]}
          onBookFacility={() => {
            setActiveModal(null);
            navigateTo('booking', 'phc-wadgaon');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'videocall' && (
        <VideoCallModal 
          t={t}
          doctor={modalData || teleDoctors[0]}
          speak={speak}
          onEndCall={() => {
            setActiveModal(null);
            alert("Teleconsultation ended. Digital e-Prescription saved to your Dashboard!");
            navigateTo('dashboard');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: TopEmergencyBar
------------------------------------------------------------------------- */
function TopEmergencyBar({ t, currentLang, setCurrentLang, contrastMode, setContrastMode, fontSizeState, setFontSizeState }) {
  return (
    <aside className="emergency-topbar">
      <div className="container">
        <div className="emergency-dial-group">
          <span className="pulse-dot"></span>
          <span>{t.emergency_call}:</span>
          <a href="tel:108" className="sos-call-pill">
            🚨 <span>108 (Ambulance Toll-Free)</span>
          </a>
        </div>

        <div className="topbar-tools">
          <button 
            className="tool-btn" 
            onClick={() => setFontSizeState((fontSizeState + 1) % 3)}
            title="Scale text size for elderly citizens"
          >
            A <strong>{fontSizeState === 1 ? 'A+' : (fontSizeState === 2 ? 'A++' : 'A')}</strong>
          </button>
          
          <button 
            className="tool-btn" 
            onClick={() => setContrastMode(!contrastMode)}
            title="High contrast mode for outdoor sunlight"
          >
            👁️ <span>{contrastMode ? 'Normal Mode' : t.contrast_mode}</span>
          </button>

          <select 
            className="lang-dropdown"
            value={currentLang} 
            onChange={(e) => setCurrentLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: Header
------------------------------------------------------------------------- */
function Header({ t, currentView, navigateTo, currentUser, onOpenAuth, onEmergency, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const firstName = currentUser ? currentUser.name.split(' ')[0] : 'Citizen';
  const userRole = (currentUser && currentUser.role) || 'patient';

  return (
    <header className="main-header">
      <div className="container nav-wrap">
        <div className="brand-logo" onClick={() => navigateTo('home')}>
          <div className="logo-symbol">➕</div>
          <div className="brand-text">
            <h1>{t.app_title}</h1>
            <p>{t.tagline}</p>
          </div>
        </div>

        {/* Patient Navigation */}
        {userRole === 'patient' && (
          <nav className="desktop-nav">
            <button className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>
              <span>🏠</span> <span>{t.nav_home}</span>
            </button>
            <button className={`nav-link ${currentView === 'finder' ? 'active' : ''}`} onClick={() => navigateTo('finder')}>
              <span>🏥</span> <span>{t.nav_centres || 'Find Care'}</span>
            </button>
            <button className={`nav-link ${currentView === 'booking' ? 'active' : ''}`} onClick={() => navigateTo('booking')}>
              <span>📅</span> <span>{t.nav_booking || 'Appointments'}</span>
            </button>
            <button className={`nav-link ${currentView === 'schemes' ? 'active' : ''}`} onClick={() => navigateTo('schemes')}>
              <span>📜</span> <span>{t.nav_schemes || 'Schemes'}</span>
            </button>
          </nav>
        )}

        <div className="header-user-actions">
          {/* User badge with dropdown */}
          <div style={{ position: 'relative' }}>
            <div className="user-badge" onClick={() => setShowUserMenu(!showUserMenu)} style={{ cursor: 'pointer' }}>
              <span className="user-badge-avatar">{firstName.charAt(0)}</span>
              <span>{firstName}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▾</span>
            </div>
            {showUserMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', padding: '0.5rem', minWidth: '180px',
                boxShadow: 'var(--shadow-lg)', zIndex: 1000, animation: 'fadeIn 0.15s ease'
              }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary-navy)' }}>{currentUser?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📱 +91 {currentUser?.mobile}</div>
                </div>
                <button onClick={() => { setShowUserMenu(false); navigateTo('dashboard'); }}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'none', border: 'none',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                    color: 'var(--text-body)' }}
                  onMouseEnter={e => e.target.style.background = 'var(--bg-page)'}
                  onMouseLeave={e => e.target.style.background = 'none'}>
                  📊 My Dashboard
                </button>
                <button onClick={() => { setShowUserMenu(false); onLogout(); }}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'none', border: 'none',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                    color: '#dc2626' }}
                  onMouseEnter={e => e.target.style.background = '#fef2f2'}
                  onMouseLeave={e => e.target.style.background = 'none'}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
          <button className="btn-danger" onClick={onEmergency} style={{ padding: '0.55rem 1rem', fontSize: '0.9rem' }}>
            🚨 SOS
          </button>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: MobileBottomNav
------------------------------------------------------------------------- */
function MobileBottomNav({ t, currentView, navigateTo, userRole }) {
  // Only shown for patient role (other roles have sidebar nav)
  if (userRole !== 'patient') return null;
  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-items">
        <div className={`mobile-nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>
          <span>🏠</span>
          <span>{t.nav_home}</span>
        </div>
        <div className={`mobile-nav-item ${currentView === 'finder' ? 'active' : ''}`} onClick={() => navigateTo('finder')}>
          <span>🏥</span>
          <span>{t.nav_centres}</span>
        </div>
        <div className={`mobile-nav-item ${currentView === 'booking' ? 'active' : ''}`} onClick={() => navigateTo('booking')}>
          <span>📅</span>
          <span>{t.nav_booking}</span>
        </div>
        <div className={`mobile-nav-item ${currentView === 'tele' ? 'active' : ''}`} onClick={() => navigateTo('tele')}>
          <span>📱</span>
          <span>{t.nav_tele}</span>
        </div>
        <div className={`mobile-nav-item ${currentView === 'medicines' ? 'active' : ''}`} onClick={() => navigateTo('medicines')}>
          <span>💊</span>
          <span>{t.nav_medicines}</span>
        </div>
        <div className={`mobile-nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => navigateTo('dashboard')}>
          <span>👤</span>
          <span>{t.nav_dashboard}</span>
        </div>
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: HomeView
------------------------------------------------------------------------- */
function HomeView({ t, navigateTo, onVoiceSearch, onEmergency }) {
  return (
    <section className="page-view active">
      {/* Hero */}
      <div className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              <span>🇮🇳</span> National Rural Public Health Initiative
            </div>
            <h2>
              Public Healthcare <br />
              <span>Within Your Reach.</span>
            </h2>
            <p className="hero-subtitle">{t.sub_tagline}</p>

            <div className="hero-cta-group">
              <button className="btn-primary" onClick={() => navigateTo('finder')}>
                🏥 {t.qa_find_centre}
              </button>
              <button className="btn-secondary" onClick={() => navigateTo('booking')}>
                📅 {t.qa_book}
              </button>
              <button className="voice-search-trigger" onClick={onVoiceSearch}>
                <span className="voice-mic-icon">🎙️</span>
                <span>{t.voice_search}</span>
              </button>
            </div>

            <div className="hero-quick-features">
              <div className="hero-feature-item">
                <span style={{ color: 'var(--success)' }}>✓</span> Live Doctor Rosters
              </div>
              <div className="hero-feature-item">
                <span style={{ color: 'var(--success)' }}>✓</span> Free Medicine Stock
              </div>
              <div className="hero-feature-item">
                <span style={{ color: 'var(--success)' }}>✓</span> ₹5 Lakh Ayushman Cover
              </div>
            </div>
          </div>

          {/* Hero Visual Live PHC Card */}
          <div className="hero-card-visual">
            <div className="hero-active-card">
              <div className="hero-card-header">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  📍 Nearest PHC (Auto-Detected)
                </div>
                <div className="badge-live">
                  <span className="live-beacon"></span> LIVE OPD
                </div>
              </div>

              <div className="centre-mini-preview">
                <div className="centre-mini-avatar">🏥</div>
                <div className="centre-mini-info">
                  <h4>Wadgaon Primary Health Centre</h4>
                  <p>Khed Taluka • 2.8 km away (~10 mins)</p>
                </div>
              </div>

              <div className="hero-card-stats">
                <div className="stat-pill">
                  <span className="stat-pill-label">Doctors Active</span>
                  <span className="stat-pill-value" style={{ color: 'var(--success)' }}>🟢 2 On Duty</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-pill-label">OPD Queue</span>
                  <span className="stat-pill-value">4 Patients</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-pill-label">Snake Antivenom</span>
                  <span className="stat-pill-value" style={{ color: 'var(--primary)' }}>18 Vials Ready</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-pill-label">Ambulance</span>
                  <span className="stat-pill-value" style={{ color: 'var(--success)' }}>At Gate 108</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }} onClick={() => navigateTo('details', 'phc-wadgaon')}>
                  View Full Roster
                </button>
                <button className="btn-secondary" style={{ fontSize: '0.9rem' }} onClick={() => navigateTo('booking', 'phc-wadgaon')}>
                  Book Token #
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Touch Cards */}
      <section className="quick-actions-section container">
        <div className="section-heading">
          <h3>{t.tagline}</h3>
          <p>Designed with large buttons and simple icons so anyone can access healthcare with zero confusion.</p>
        </div>

        <div className="quick-actions-grid">
          <div className="qa-card" onClick={() => navigateTo('finder')}>
            <div className="qa-icon-wrap qa-blue">🏥</div>
            <div className="qa-body">
              <h4>{t.qa_find_centre}</h4>
              <p>{t.qa_find_centre_desc}</p>
              <span className="qa-action-link">Explore Map & List →</span>
            </div>
          </div>

          <div className="qa-card" onClick={() => navigateTo('booking')}>
            <div className="qa-icon-wrap qa-teal">📅</div>
            <div className="qa-body">
              <h4>{t.qa_book}</h4>
              <p>{t.qa_book_desc}</p>
              <span className="qa-action-link">Get Instant Token →</span>
            </div>
          </div>

          <div className="qa-card" onClick={() => navigateTo('tele')}>
            <div className="qa-icon-wrap qa-purple">📱</div>
            <div className="qa-body">
              <h4>{t.qa_tele}</h4>
              <p>{t.qa_tele_desc}</p>
              <span className="qa-action-link">Start Video Consult →</span>
            </div>
          </div>

          <div className="qa-card" onClick={() => navigateTo('medicines')}>
            <div className="qa-icon-wrap qa-emerald">💊</div>
            <div className="qa-body">
              <h4>{t.qa_medicines}</h4>
              <p>{t.qa_medicines_desc}</p>
              <span className="qa-action-link">Check 100% Free Stock →</span>
            </div>
          </div>

          <div className="qa-card" onClick={() => navigateTo('schemes')}>
            <div className="qa-icon-wrap qa-amber">📜</div>
            <div className="qa-body">
              <h4>{t.qa_schemes}</h4>
              <p>{t.qa_schemes_desc}</p>
              <span className="qa-action-link">Check Eligibility →</span>
            </div>
          </div>

          <div className="qa-card" onClick={onEmergency}>
            <div className="qa-icon-wrap qa-red">🚨</div>
            <div className="qa-body">
              <h4>{t.qa_emergency}</h4>
              <p>{t.qa_emergency_desc}</p>
              <span className="qa-action-link" style={{ color: 'var(--danger)' }}>One-Tap SOS →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Realistic Healthcare Metrics */}
      <section className="container">
        <div className="metrics-section">
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-number">14,280+</div>
              <div className="metric-label">{t.stat_centres}</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">850,000+</div>
              <div className="metric-label">{t.stat_patients}</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">4,200+</div>
              <div className="metric-label">{t.stat_tele}</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">98.4%</div>
              <div className="metric-label">{t.stat_medicines}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Comparison */}
      <section className="comparison-section container">
        <div className="section-heading">
          <h3>{t.pvs_title}</h3>
          <p>{t.pvs_subtitle}</p>
        </div>

        <div className="comparison-grid">
          <div className="comparison-col col-problem">
            <h4><span>⚠️</span> {t.problem_heading}</h4>
            <div className="comparison-list">
              <div className="comparison-item">
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✕</span> <span>{t.prob_1}</span>
              </div>
              <div className="comparison-item">
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✕</span> <span>{t.prob_2}</span>
              </div>
              <div className="comparison-item">
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✕</span> <span>{t.prob_3}</span>
              </div>
              <div className="comparison-item">
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✕</span> <span>{t.prob_4}</span>
              </div>
            </div>
          </div>

          <div className="comparison-col col-solution">
            <h4><span>✅</span> {t.solution_heading}</h4>
            <div className="comparison-list">
              <div className="comparison-item">
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>{t.sol_1}</span>
              </div>
              <div className="comparison-item">
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>{t.sol_2}</span>
              </div>
              <div className="comparison-item">
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>{t.sol_3}</span>
              </div>
              <div className="comparison-item">
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>{t.sol_4}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: FinderView (Interactive Map & Centre Cards)
------------------------------------------------------------------------- */
function FinderView({ t, currentLang, navigateTo, onShowDirections, onVoiceSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRadius, setActiveRadius] = useState(25);
  const [activeType, setActiveType] = useState('ALL');
  const [docDutyOnly, setDocDutyOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  // Filter logic
  const filteredCentres = useMemo(() => {
    return healthcareCentres.filter((c) => {
      if (c.distance > activeRadius) return false;
      if (activeType !== 'ALL' && c.type !== activeType) return false;
      if (docDutyOnly && !c.doctors.some(d => d.onDuty)) return false;
      if (emergencyOnly && !c.emergency24x7) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q) ||
          (c.name_hi && c.name_hi.toLowerCase().includes(q)) ||
          (c.name_mr && c.name_mr.toLowerCase().includes(q));
        const matchTaluka = c.taluka.toLowerCase().includes(q);
        const matchServices = c.services.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchTaluka && !matchServices) return false;
      }
      return true;
    });
  }, [searchQuery, activeRadius, activeType, docDutyOnly, emergencyOnly]);

  return (
    <section className="container" style={{ paddingTop: '2rem' }}>
      <div className="section-heading" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        <h3>{t.qa_find_centre}</h3>
        <p>Locate Primary Health Centres (PHC), Community Health Centres (CHC), and Civil Hospitals with verified doctor presence.</p>
      </div>

      {/* Finder Controls */}
      <div className="finder-controls">
        <div className="search-bar-wrap">
          <div className="search-input-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search_placeholder}
            />
          </div>
          <button className="voice-search-trigger" onClick={onVoiceSearch}>
            <span className="voice-mic-icon">🎙️</span>
            <span>Speak</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills-row">
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.4rem' }}>Type:</span>
          <button className={`filter-pill ${activeType === 'ALL' ? 'active' : ''}`} onClick={() => setActiveType('ALL')}>
            {t.filter_all}
          </button>
          <button className={`filter-pill ${activeType === 'PHC' ? 'active' : ''}`} onClick={() => setActiveType('PHC')}>
            {t.filter_phc}
          </button>
          <button className={`filter-pill ${activeType === 'CHC' ? 'active' : ''}`} onClick={() => setActiveType('CHC')}>
            {t.filter_chc}
          </button>
          <button className={`filter-pill ${activeType === 'Hospital' ? 'active' : ''}`} onClick={() => setActiveType('Hospital')}>
            {t.filter_hospital}
          </button>
          <button className={`filter-pill ${activeType === 'Clinic' ? 'active' : ''}`} onClick={() => setActiveType('Clinic')}>
            {t.filter_clinic}
          </button>
        </div>

        {/* Radius & Toggles */}
        <div className="filter-secondary-row">
          <div className="radius-slider-group">
            <span>{t.radius_label}:</span>
            <input 
              type="range" 
              min="5" 
              max="50" 
              step="5" 
              value={activeRadius} 
              onChange={(e) => setActiveRadius(Number(e.target.value))}
            />
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{activeRadius} km</span>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label className="checkbox-toggle-label">
              <input type="checkbox" checked={docDutyOnly} onChange={(e) => setDocDutyOnly(e.target.checked)} />
              <span>{t.doctor_on_duty}</span>
            </label>

            <label className="checkbox-toggle-label">
              <input type="checkbox" checked={emergencyOnly} onChange={(e) => setEmergencyOnly(e.target.checked)} />
              <span>{t.emergency_24x7}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Layout: Interactive SVG Map + Centre Cards */}
      <div className="finder-layout">
        {/* Interactive SVG Mock Map */}
        <div className="map-container">
          <svg className="mock-map-canvas" viewBox="0 0 800 600" preserveAspectRatio="none">
            <rect width="800" height="600" fill="#f8fafc" />
            <path d="M 0,0 L 250,0 Q 280,120 180,240 Q 90,320 0,400 Z" fill="#e2f5ea" opacity="0.6" />
            <path d="M 500,600 L 800,600 L 800,350 Q 680,380 620,480 Z" fill="#fef9c3" opacity="0.4" />
            <path d="M 600,0 L 800,0 L 800,200 Q 720,180 650,80 Z" fill="#e2f5ea" opacity="0.5" />
            
            {/* River & Roads */}
            <path d="M 0,220 Q 200,260 400,210 T 800,290" fill="none" stroke="#bae6fd" strokeWidth="18" strokeLinecap="round" />
            <path d="M 0,220 Q 200,260 400,210 T 800,290" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="8 6" />

            <path d="M 120,600 L 320,380 L 450,220 L 580,0" fill="none" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
            <path d="M 120,600 L 320,380 L 450,220 L 580,0" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="10 8" />

            <path d="M 320,380 Q 420,440 620,460" fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <path d="M 320,380 L 180,280" fill="none" stroke="#e2e8f0" strokeWidth="6" />

            <text x="310" y="470" fontSize="14" fontWeight="700" fill="#64748b">Wadgaon Gram</text>
            <text x="540" y="320" fontSize="14" fontWeight="700" fill="#64748b">Manchar Kasba</text>
            <text x="180" y="560" fontSize="14" fontWeight="700" fill="#64748b">Chakan SDH</text>
          </svg>

          {/* User GPS Pin */}
          <div className="user-current-pin" style={{ left: '45%', top: '52%' }} title="Your Location: Vill. Wadgaon">
            <div className="user-gps-pulse"></div>
          </div>

          {/* Centre Pins */}
          {filteredCentres.map((c) => (
            <div 
              key={c.id}
              className={`map-pin ${c.type.toLowerCase()}`} 
              style={{ left: `${c.coordinates.x}%`, top: `${c.coordinates.y}%` }}
              onClick={() => navigateTo('details', c.id)}
              title={c.name}
            >
              <div className="map-pin-inner">
                <span>{c.type === 'PHC' ? '🏥' : (c.type === 'CHC' ? '🏨' : '🩺')}</span>
                <span>{c.name.split(' ')[0]}</span>
                <span style={{ background: 'rgba(0,0,0,0.25)', padding: '1px 4px', borderRadius: '4px', fontSize: '0.7rem' }}>{c.distance}km</span>
              </div>
            </div>
          ))}

          {/* Map Legend */}
          <div className="map-legend">
            <div className="map-legend-item">
              <span className="legend-dot" style={{ background: 'var(--primary)' }}></span>
              <span>PHC</span>
            </div>
            <div className="map-legend-item">
              <span className="legend-dot" style={{ background: '#0d9488' }}></span>
              <span>CHC</span>
            </div>
            <div className="map-legend-item">
              <span className="legend-dot" style={{ background: '#4f46e5' }}></span>
              <span>Hospital</span>
            </div>
            <div className="map-legend-item">
              <span className="legend-dot" style={{ background: '#0284c7', border: '2px solid #fff' }}></span>
              <span>📍 GPS Location</span>
            </div>
          </div>
        </div>

        {/* Centre Cards List */}
        <div className="centres-list-wrap">
          {filteredCentres.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1.5px dashed var(--border-subtle)' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>No healthcare centres found matching these filters.</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Try increasing search radius or clearing active filters.</p>
            </div>
          ) : (
            filteredCentres.map((centre) => {
              const displayName = currentLang === 'hi' && centre.name_hi ? centre.name_hi :
                (currentLang === 'mr' && centre.name_mr ? centre.name_mr : centre.name);
              const activeDocs = centre.doctors.filter(d => d.onDuty).length;

              return (
                <div key={centre.id} className="centre-card">
                  <div className="centre-card-header">
                    <div className="centre-card-title-group">
                      <h4>{displayName}</h4>
                      <div className="centre-card-meta">
                        <span className="distance-badge">📍 {centre.distance} km ({centre.travelTime})</span>
                        <span>⭐ {centre.rating} ({centre.reviewsCount} villagers)</span>
                      </div>
                    </div>
                    <span className="badge-tag qa-blue" style={{ color: '#fff' }}>
                      {centre.typeLabel}
                    </span>
                  </div>

                  <div className="centre-badges-strip">
                    {activeDocs > 0 ? (
                      <span className="badge-tag badge-doc-active">🟢 {activeDocs} Doctor{activeDocs > 1 ? 's' : ''} On Duty</span>
                    ) : (
                      <span className="badge-tag" style={{ background: '#fee2e2', color: '#b91c1c' }}>🔴 Doctor in Transit</span>
                    )}
                    {centre.emergency24x7 && <span className="badge-tag badge-emergency">🚨 24x7 Emergency</span>}
                    {centre.snakebiteAntivenomReady && <span className="badge-tag badge-medicine">💉 Antivenom Ready</span>}
                  </div>

                  <div className="centre-card-details-snip">
                    <div>
                      <div className="snip-label">Services</div>
                      <div className="snip-val">{centre.services.slice(0, 2).join(', ')}...</div>
                    </div>
                    <div>
                      <div className="snip-label">Working Hours</div>
                      <div className="snip-val">{centre.emergency24x7 ? '24x7 Casualty' : '09:00 AM - 05:00 PM'}</div>
                    </div>
                  </div>

                  <div className="centre-card-actions">
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }} onClick={() => navigateTo('details', centre.id)}>
                      {t.view_details}
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.48rem 0.95rem', fontSize: '0.88rem' }} onClick={() => navigateTo('booking', centre.id)}>
                      📅 {t.book_appointment}
                    </button>
                    <button className="tool-btn" style={{ color: 'var(--primary)', borderColor: 'var(--border-subtle)', padding: '0.5rem 0.8rem', fontWeight: 600 }} onClick={() => onShowDirections(centre)}>
                      🧭 {t.get_directions}
                    </button>
                    <a href={`tel:${centre.phone}`} className="tool-btn" style={{ color: 'var(--success)', borderColor: 'var(--border-subtle)', padding: '0.5rem 0.8rem', fontWeight: 600 }}>
                      📞 Call
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: CentreDetailsView
------------------------------------------------------------------------- */
function CentreDetailsView({ t, currentLang, centreId, navigateTo, speak, onShowDirections }) {
  const centre = healthcareCentres.find(c => c.id === centreId) || healthcareCentres[0];
  const displayName = currentLang === 'hi' && centre.name_hi ? centre.name_hi :
    (currentLang === 'mr' && centre.name_mr ? centre.name_mr : centre.name);

  return (
    <section className="container" style={{ paddingTop: '2rem' }}>
      <button className="tool-btn" onClick={() => navigateTo('finder')} style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>
        ← Back to Centres List
      </button>

      <div className="details-hero">
        <div className="details-hero-info">
          <span className="badge-tag qa-blue" style={{ color: '#fff', marginBottom: '0.5rem' }}>
            {centre.typeLabel} • Taluka {centre.taluka}
          </span>
          <h2>{displayName}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>📍 {centre.address}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap', fontSize: '0.95rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Distance: {centre.distance} km ({centre.travelTime})</span>
            <span style={{ fontWeight: 700, color: 'var(--warning)' }}>⭐ {centre.rating} / 5.0 ({centre.reviewsCount} villager reviews)</span>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>📞 {centre.phone}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }} onClick={() => navigateTo('booking', centre.id)}>
            📅 {t.book_appointment}
          </button>
          <button className="btn-secondary" onClick={() => onShowDirections(centre)}>
            🧭 {t.get_directions}
          </button>
          <button className="tool-btn" style={{ color: 'var(--text-main)' }} onClick={() => speak(`${displayName}. Located at ${centre.address}. Distance is ${centre.distance} kilometers. Emergency is open 24 hours.`)}>
            🔊 {t.read_aloud}
          </button>
        </div>
      </div>

      <div className="details-grid">
        <div>
          {/* Available Doctors */}
          <div className="details-section-card">
            <h4>👨‍⚕️ {t.doctors_list}</h4>
            <div>
              {centre.doctors.map((doc) => (
                <div key={doc.id} className="doctor-item-row">
                  <img src={doc.photo} alt={doc.name} className="doc-avatar-img" />
                  <div className="doc-details-col">
                    <div className="doc-name">{doc.name}</div>
                    <div className="doc-qual">{doc.qualification} • <em>{doc.designation}</em></div>
                    <span className="doc-dept-badge">{doc.department}</span>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.3rem' }}>
                      📍 {doc.roomNo} | Slot: <strong style={{ color: 'var(--primary)' }}>{doc.nextSlot}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {doc.onDuty ? (
                      <div>
                        <span className="status-pill in-stock">🟢 Available Now</span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.3rem' }}>{doc.currentQueue} in queue</div>
                      </div>
                    ) : (
                      <span className="status-pill out-of-stock">Off Duty</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services Offered */}
          <div className="details-section-card">
            <h4>🏥 {t.services_offered}</h4>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {centre.services.map((s, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✔</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Live Medicine Stock Snapshot */}
          <div className="details-section-card">
            <h4>💊 {t.med_availability}</h4>
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Status</th>
                  <th>Quantity Available</th>
                </tr>
              </thead>
              <tbody>
                {centre.medicinesStockSnapshot.map((m, idx) => (
                  <tr key={idx}>
                    <td><strong>{m.name}</strong></td>
                    <td>
                      <span className={`status-pill ${m.status}`}>
                        {m.status === 'in-stock' ? 'In Stock' : (m.status === 'limited' ? 'Limited' : 'Out of Stock')}
                      </span>
                    </td>
                    <td>{m.qty} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostics & Hours */}
        <div>
          <div className="details-section-card">
            <h4>🔬 {t.diagnostics}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {centre.diagnostics.map((d, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: '0.5rem', borderBottom: '1px dotted var(--border-subtle)' }}>
                  <span>{d.name}</span>
                  <strong style={{ color: d.available ? 'var(--success)' : 'var(--danger)' }}>{d.fee}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="details-section-card">
            <h4>🕒 {t.working_hours}</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.5 }}>
              {centre.openingHours}
            </p>
            <div style={{ marginTop: '1rem', background: 'var(--danger-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: 'var(--danger)' }}>
              🚨 <strong>24x7 Ambulance & Snakebite:</strong> Direct emergency medical officer available on phone.
            </div>
          </div>

          <div className="details-section-card">
            <h4>💬 {t.patient_reviews}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {centre.reviews.map((r, idx) => (
                <div key={idx} style={{ background: 'var(--bg-page)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>{r.author} ({r.village})</span>
                    <span style={{ color: 'var(--warning)' }}>⭐ {r.rating}/5</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: BookingView (6-Step Wizard)
------------------------------------------------------------------------- */
function BookingView({ t, currentLang, preselectedCentreId, currentUser, onBookingCreated, navigateTo }) {
  const [centreId, setCentreId] = useState(preselectedCentreId || 'phc-wadgaon');
  const [department, setDepartment] = useState('General Medicine & Fever OPD');
  const [doctorId, setDoctorId] = useState('any');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [patientName, setPatientName] = useState(currentUser?.name || 'Ramesh Patil');
  const [patientAge, setPatientAge] = useState(currentUser?.age || 42);
  const [patientGender, setPatientGender] = useState(currentUser?.gender || 'Male');
  const [symptoms, setSymptoms] = useState('High fever and headache since 3 days');
  const [generatedToken, setGeneratedToken] = useState(null);

  const selectedCentre = healthcareCentres.find(c => c.id === centreId) || healthcareCentres[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    let docName = "Duty Medical Officer";
    if (doctorId !== 'any') {
      const found = selectedCentre.doctors.find(d => d.id === doctorId);
      if (found) docName = found.name;
    }

    const newApt = {
      id: 'SST-2026-' + Math.floor(10000 + Math.random() * 90000),
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      doctorName: docName,
      department: department,
      patientName: patientName,
      patientAge: patientAge,
      patientGender: patientGender,
      date: date,
      timeSlot: timeSlot,
      tokenNumber: "TOKEN #" + Math.floor(10 + Math.random() * 30),
      status: "Confirmed",
      symptoms: symptoms,
      createdAt: new Date().toISOString()
    };

    onBookingCreated(newApt);
    setGeneratedToken(newApt);
  };

  return (
    <section className="container" style={{ paddingTop: '2rem' }}>
      <div className="wizard-card">
        <div className="section-heading" style={{ marginBottom: '2rem' }}>
          <h3>{t.nav_booking}</h3>
          <p>Generate a digital OPD queue slip and avoid standing in long rural hospital lines.</p>
        </div>

        {/* Wizard Step Nodes */}
        <div className="wizard-steps-indicator">
          <div className="wizard-step-node completed">
            <div className="step-circle">1</div>
            <span className="step-title-text">{t.step_centre}</span>
          </div>
          <div className="wizard-step-node completed">
            <div className="step-circle">2</div>
            <span className="step-title-text">{t.step_dept}</span>
          </div>
          <div className="wizard-step-node completed">
            <div className="step-circle">3</div>
            <span className="step-title-text">{t.step_doctor}</span>
          </div>
          <div className={`wizard-step-node ${!generatedToken ? 'active' : 'completed'}`}>
            <div className="step-circle">4</div>
            <span className="step-title-text">{t.step_date_slot}</span>
          </div>
          <div className={`wizard-step-node ${generatedToken ? 'active' : ''}`}>
            <div className="step-circle">5</div>
            <span className="step-title-text">{t.step_confirm}</span>
          </div>
        </div>

        {!generatedToken ? (
          <form onSubmit={handleSubmit}>
            <div className="booking-form-grid">
              <div className="form-group form-group-full">
                <label>{t.step_centre}</label>
                <select className="form-control" value={centreId} onChange={(e) => setCentreId(e.target.value)} required>
                  {healthcareCentres.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.distance} km)</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t.step_dept}</label>
                <select className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                  <option value="General Medicine & Fever OPD">General Medicine & Fever OPD</option>
                  <option value="Maternal & Antenatal Care (ANC)">Maternal & Antenatal Care (ANC)</option>
                  <option value="Child Health & Immunization">Child Health & Immunization</option>
                  <option value="Diabetes & Hypertension Clinic">Diabetes & Hypertension Clinic</option>
                  <option value="Orthopedic & Bone Care">Orthopedic & Bone Care</option>
                  <option value="Dental OPD">Dental OPD</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.step_doctor}</label>
                <select className="form-control" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                  <option value="any">First Available Doctor (Fastest OPD Token)</option>
                  {selectedCentre.doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t.step_date_slot}</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group form-group-full">
                <label>Select Available Time Slot</label>
                <div className="slot-selection-grid">
                  {['09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:30 AM - 12:00 PM', '04:00 PM - 04:30 PM'].map((slot, idx) => (
                    <div 
                      key={idx}
                      className={`slot-pill ${timeSlot === slot ? 'active' : ''}`}
                      onClick={() => setTimeSlot(slot)}
                    >
                      {slot.split(' - ')[0]}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>{t.patient_name}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label>{t.patient_age}</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={patientAge} 
                    onChange={(e) => setPatientAge(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label>{t.patient_gender}</label>
                  <select className="form-control" value={patientGender} onChange={(e) => setPatientGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group form-group-full">
                <label>{t.symptoms}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={symptoms} 
                  onChange={(e) => setSymptoms(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem' }}>
                🎟️ {t.book_now_btn}
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation OPD Token Slip */
          <div className="token-slip-card">
            <div className="token-slip-header">
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Government of Maharashtra Public Health Department
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-navy)', margin: '0.3rem 0' }}>
                SwasthyaSetu Digital OPD Token
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{generatedToken.centreName}</p>
              <div className="token-big-badge">{generatedToken.tokenNumber}</div>
              <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.95rem' }}>✅ Token Confirmed & Active</div>
            </div>

            <div className="token-row">
              <span className="token-row-label">Appointment ID</span>
              <span className="token-row-val">{generatedToken.id}</span>
            </div>
            <div className="token-row">
              <span className="token-row-label">Patient Name</span>
              <span className="token-row-val">{generatedToken.patientName} ({generatedToken.patientAge}y / {generatedToken.patientGender})</span>
            </div>
            <div className="token-row">
              <span className="token-row-label">Doctor / OPD</span>
              <span className="token-row-val">{generatedToken.doctorName}</span>
            </div>
            <div className="token-row">
              <span className="token-row-label">Department</span>
              <span className="token-row-val">{generatedToken.department}</span>
            </div>
            <div className="token-row">
              <span className="token-row-label">Date & Time Slot</span>
              <span className="token-row-val" style={{ color: 'var(--primary)' }}>{generatedToken.date} | {generatedToken.timeSlot}</span>
            </div>

            <div className="token-qr-code">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" style={{ background: '#fff', padding: '6px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#092c48" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#092c48" />
                <rect x="65" y="10" width="25" height="25" fill="#092c48" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#092c48" />
                <rect x="10" y="65" width="25" height="25" fill="#092c48" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#092c48" />
                <rect x="42" y="15" width="8" height="16" fill="#0284c7" />
                <rect x="42" y="42" width="16" height="16" fill="#092c48" />
                <rect x="65" y="42" width="10" height="20" fill="#0284c7" />
                <rect x="42" y="70" width="20" height="12" fill="#092c48" />
              </svg>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: '#166534', textAlign: 'center', marginBottom: '1.25rem' }}>
              📱 SMS confirmation sent! Show this token on your phone at Room 1 OPD desk to bypass registration queue.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => window.print()}>🖨️ Print / Save Token</button>
              <button className="btn-secondary" onClick={() => navigateTo('dashboard')}>View in Dashboard</button>
              <button className="tool-btn" onClick={() => setGeneratedToken(null)}>Book Another Token</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: TeleconsultationView
------------------------------------------------------------------------- */
function TeleconsultationView({ t, currentLang, onStartCall }) {
  return (
    <section className="container" style={{ paddingTop: '2rem' }}>
      <div className="section-heading" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h3>{t.tele_title}</h3>
        <p>{t.tele_desc}</p>
      </div>

      <div className="tele-grid">
        {teleDoctors.map((doc) => {
          const spec = currentLang === 'hi' && doc.specialization_hi ? doc.specialization_hi :
            (currentLang === 'mr' && doc.specialization_mr ? doc.specialization_mr : doc.specialization);

          return (
            <div key={doc.id} className="tele-doc-card">
              <div className="tele-doc-header">
                <div className="tele-doc-avatar-wrap">
                  <img src={doc.photo} alt={doc.name} className="tele-avatar-img" />
                  <span className={`tele-online-dot ${doc.status}`}></span>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 750, color: 'var(--text-main)' }}>{doc.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{spec}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{doc.qualification}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.86rem', background: 'var(--bg-page)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div>🗣️ <strong>{t.languages_spoken}:</strong> {doc.languages.join(', ')}</div>
                <div>⏱️ <strong>{t.queue_wait}:</strong> <span style={{ color: doc.status === 'online' ? 'var(--success)' : 'var(--warning)', fontWeight: 700 }}>{doc.estimatedWait}</span></div>
                <div>⭐ <strong>Rating:</strong> {doc.rating} / 5.0 ({doc.consultationsCount} consultations)</div>
              </div>

              <button 
                className={doc.status === 'online' ? 'btn-primary' : 'btn-secondary'} 
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }} 
                onClick={() => onStartCall(doc)}
              >
                📹 {doc.status === 'online' ? t.start_call_btn : 'Schedule Call'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: MedicinesView
------------------------------------------------------------------------- */
function MedicinesView({ t, currentLang, navigateTo }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCentre, setSelectedCentre] = useState('ALL');

  const filtered = useMemo(() => {
    return medicineCatalog.filter(med => {
      const q = searchQuery.toLowerCase().trim();
      const matchName = med.name.toLowerCase().includes(q) ||
        med.brandExample.toLowerCase().includes(q) ||
        med.category.toLowerCase().includes(q) ||
        (med.category_hi && med.category_hi.toLowerCase().includes(q)) ||
        (med.category_mr && med.category_mr.toLowerCase().includes(q));

      if (!matchName) return false;
      if (selectedCentre !== 'ALL') {
        return med.centres.some(c => c.centreId === selectedCentre);
      }
      return true;
    });
  }, [searchQuery, selectedCentre]);

  return (
    <section className="container" style={{ paddingTop: '2rem' }}>
      <div className="medicine-search-header">
        <div className="section-heading" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <h3>{t.nav_medicines}</h3>
          <p>Check stock of free government medicines before traveling. Avoid out-of-pocket medical expenses.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'center' }}>
          <div className="search-input-box">
            <span className="search-icon">💊</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.med_search_placeholder}
            />
          </div>
          <select className="form-control" value={selectedCentre} onChange={(e) => setSelectedCentre(e.target.value)}>
            <option value="ALL">All Nearby Government Centres</option>
            {healthcareCentres.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="medicine-cards-grid">
        {filtered.map((med) => {
          const cat = currentLang === 'hi' && med.category_hi ? med.category_hi :
            (currentLang === 'mr' && med.category_mr ? med.category_mr : med.category);

          return (
            <div key={med.id} className="med-card">
              <div>
                <div className="med-card-header">
                  <div>
                    <div className="med-name">{med.name}</div>
                    <div className="med-generic-tag">{med.brandExample} • {cat}</div>
                  </div>
                  <div className="med-price-badge">{med.govtPrice}</div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.75rem 0', lineHeight: 1.4 }}>
                  {med.description}
                </p>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                  Private Market Price: <span style={{ textDecoration: 'line-through', color: 'var(--danger)' }}>{med.marketPrice}</span> (100% Free at PHC)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  {t.med_stock_status}:
                </div>
                <div className="med-centres-stock-list">
                  {med.centres.map((c, idx) => (
                    <div key={idx} className="med-centre-row">
                      <span className="med-centre-name">{c.centreName}</span>
                      <span className={`status-pill ${c.status}`}>
                        {c.status === 'in-stock' ? `In Stock (${c.qty})` : (c.status === 'limited' ? `Low (${c.qty})` : 'Out of Stock')}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                  <button 
                    className="tool-btn" 
                    style={{ color: 'var(--primary)', fontWeight: 600 }}
                    onClick={() => navigateTo('finder')}
                  >
                    📍 Find Nearest Centre with Stock →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: SchemesView
------------------------------------------------------------------------- */
function SchemesView({ t, currentLang, speak, onCheckEligibility }) {
  return (
    <section className="container" style={{ paddingTop: '2rem' }}>
      <div className="section-heading" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h3>{t.schemes_title}</h3>
        <p>{t.schemes_subtitle}</p>
      </div>

      <div className="schemes-grid">
        {governmentSchemes.map((scheme) => {
          const title = currentLang === 'hi' && scheme.name_hi ? scheme.name_hi :
            (currentLang === 'mr' && scheme.name_mr ? scheme.name_mr : scheme.name);
          const tag = currentLang === 'hi' && scheme.tagline_hi ? scheme.tagline_hi :
            (currentLang === 'mr' && scheme.tagline_mr ? scheme.tagline_mr : scheme.tagline);

          return (
            <div key={scheme.id} className="scheme-card">
              <div>
                <span className="scheme-top-badge">🌟 {t.eligible_badge}</span>
                <h3 className="scheme-title">{title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--accent-teal)', fontWeight: 600, margin: '0.4rem 0 1rem' }}>
                  {tag}
                </p>
                <div className="scheme-benefit-highlight">
                  {scheme.benefitAmount}
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 750, color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>Main Benefits:</h5>
                <ul className="scheme-bullets">
                  {scheme.mainBenefits.slice(0, 3).map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              </div>

              <div style={{ background: 'var(--bg-page)', padding: '0.9rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>{t.documents_needed}:</strong>
                <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {scheme.documents.join(' • ')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onCheckEligibility(scheme)}>
                  📋 {t.check_eligibility}
                </button>
                <button className="tool-btn" style={{ color: 'var(--text-main)' }} onClick={() => speak(`${title}. Benefit is ${scheme.benefitAmount}. ${tag}`)}>
                  🔊
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: DashboardView
------------------------------------------------------------------------- */
function DashboardView({ t, currentUser, appointments, onCancelAppointment, onShowDirections, navigateTo }) {
  return (
    <section className="container" style={{ paddingTop: '2rem' }}>
      <div className="dashboard-hero-banner">
        <div className="dashboard-user-greeting">
          <h2>{t.welcome}, <span>{currentUser?.name || 'Citizen'}</span></h2>
          <p>Welcome to your rural health record and digital service portal.</p>
        </div>
        <div className="dashboard-location-pill">
          {currentUser?.village || 'Vill. Wadgaon, Khed Taluka'} (GPS 📍)
        </div>
      </div>

      <div className="dashboard-widgets-grid">
        <div>
          <div className="dashboard-card">
            <h4>
              <span>📅 Upcoming Appointments</span>
              <button className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }} onClick={() => navigateTo('booking')}>
                + New Token
              </button>
            </h4>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-page)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No upcoming appointments scheduled.</p>
                <button className="btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => navigateTo('booking')}>Book Token</button>
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.15rem' }}>{apt.tokenNumber}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '0.5rem' }}>({apt.id})</span>
                    </div>
                    <span className="status-pill in-stock">🟢 {apt.status}</span>
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-navy)' }}>{apt.centreName}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    👨‍⚕️ {apt.doctorName} • <em>{apt.department}</em>
                  </div>

                  <div style={{ background: 'var(--primary-light)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--primary-dark)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>📅 {apt.date}</span>
                    <span>⏰ {apt.timeSlot}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', justifyContent: 'flex-end' }}>
                    <button className="tool-btn" style={{ color: 'var(--danger)' }} onClick={() => onCancelAppointment(apt.id)}>Cancel</button>
                    <button className="tool-btn" style={{ color: 'var(--primary)' }} onClick={() => onShowDirections(apt.centreId)}>Get Route</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="dashboard-card">
            <h4><span>📱 Teleconsultation History & e-Prescriptions</span></h4>
            <div style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Dr. Sunita Deshmukh (General Medicine)</span>
                <span style={{ color: 'var(--success)' }}>Completed</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                Consultation on 10 Sept 2026 • Rx: Paracetamol 500mg, ORS
              </div>
              <button className="tool-btn" style={{ color: 'var(--primary)', marginTop: '0.5rem' }} onClick={() => alert('Downloading official digital signed prescription PDF...')}>
                📥 Download Signed e-Prescription (Rx)
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderColor: '#bbf7d0' }}>
            <h4 style={{ color: '#166534' }}><span>🌟 Ayushman Bharat Card Status</span></h4>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', marginBottom: '0.4rem' }}>
              ₹5,00,000 Free Cover Active
            </div>
            <p style={{ fontSize: '0.88rem', color: '#166534', marginBottom: '1rem' }}>
              ABHA ID: <strong>{currentUser?.abhaId || '91-4829-1029-4821'}</strong><br />
              Empaneled at Manchar CHC, Chakan Hospital & 28,000+ hospitals.
            </p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#15803d' }} onClick={() => navigateTo('schemes')}>
              View Scheme Benefits
            </button>
          </div>

          <div className="dashboard-card" style={{ background: '#fff5f5', borderColor: '#fecaca' }}>
            <h4 style={{ color: 'var(--danger)' }}><span>🚨 24x7 Emergency Contact</span></h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              For sudden chest pain, snakebite, accident, or delivery labor:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <a href="tel:108" className="btn-danger" style={{ justifyContent: 'center' }}>
                📞 Call 108 (Free Govt Ambulance)
              </a>
              <a href="tel:102" className="btn-secondary" style={{ justifyContent: 'center', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                🚑 Call 102 (Janani Shishu Transport)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   MODAL COMPONENTS
------------------------------------------------------------------------- */
function AuthModal({ t, currentUser, onSave, onClose }) {
  const [name, setName] = useState(currentUser?.name || 'Ramesh Tukaram Patil');
  const [mobile, setMobile] = useState(currentUser?.mobile || '9823101234');
  const [age, setAge] = useState(currentUser?.age || 42);
  const [gender, setGender] = useState(currentUser?.gender || 'Male');
  const [village, setVillage] = useState(currentUser?.village || 'Vill. Wadgaon, Khed Taluka');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, mobile, age, gender, village });
  };

  return (
    <div className="app-modal-overlay active">
      <div className="modal-dialog">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', marginBottom: '0.3rem' }}>{t.login_btn}</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Simple 1-step login designed for rural citizens.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Mobile Number</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="tel" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              <button type="button" className="tool-btn" style={{ background: 'var(--primary)', color: '#fff', padding: '0 1rem' }} onClick={() => alert('Demo OTP: 4321')}>
                Get OTP
              </button>
            </div>
            <small style={{ color: 'var(--success)', fontWeight: 600 }}>Demo OTP: 4321 (Auto-filled)</small>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Full Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label>Age</label>
              <input type="number" className="form-control" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Village / Taluka</label>
            <input type="text" className="form-control" value={village} onChange={(e) => setVillage(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
            ✓ Save Profile & Login
          </button>
        </form>
      </div>
    </div>
  );
}

function VoiceSearchModal({ t, currentLang, onSelectQuery, onClose }) {
  const [status, setStatus] = useState(t.speak_now);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      const sampleQueries = {
        en: ["Paracetamol in Wadgaon PHC", "Pediatric doctor near me", "Snake antivenom", "Janani delivery scheme"],
        hi: ["वडगांव पीएचसी में बुखार की दवा", "बच्चों के डॉक्टर", "सांप काटने का टीका", "जननी सुरक्षा योजना"],
        mr: ["वडगाव केंद्रात तापाचे औषध", "लहान मुलांचे डॉक्टर", "सर्पदंश लस साठा", "आयुष्मान भारत योजना"]
      };
      const queries = sampleQueries[currentLang] || sampleQueries.en;
      const heard = queries[Math.floor(Math.random() * queries.length)];
      setStatus(`Heard: "${heard}"... Searching!`);

      setTimeout(() => {
        onSelectQuery(heard);
      }, 1200);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  return (
    <div className="app-modal-overlay active">
      <div className="modal-dialog" style={{ textAlign: 'center' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <div style={{ width: '80px', height: '80px', background: 'var(--danger-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.25rem' }}>
          🎙️
        </div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>{t.voice_search}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>{status}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <span className="live-beacon" style={{ background: 'var(--danger)', width: '12px', height: '12px' }}></span>
          <span className="live-beacon" style={{ background: 'var(--danger)', width: '12px', height: '12px', animationDelay: '0.2s' }}></span>
          <span className="live-beacon" style={{ background: 'var(--danger)', width: '12px', height: '12px', animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
}

function DirectionsModal({ t, centre, onClose }) {
  return (
    <div className="app-modal-overlay active">
      <div className="modal-dialog">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <div style={{ display: 'inline-block', background: 'var(--primary-light)', color: 'var(--primary-dark)', fontWeight: 700, fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
          Distance: {centre.distance} km ({centre.travelTime} by auto/bike)
        </div>
        <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-navy)', marginBottom: '0.3rem' }}>{centre.name}</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{centre.address}</p>

        <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <strong style={{ color: 'var(--primary)' }}>Step 1: Start from your village</strong>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Proceed from Wadgaon Gram Panchayat road towards Khed-Manchar highway (0.8 km).</p>
          </div>
          <div>
            <strong style={{ color: 'var(--primary)' }}>Step 2: Cross river bridge</strong>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Take the right fork at Wadgaon bridge junction onto Primary Health Road (1.4 km).</p>
          </div>
          <div>
            <strong style={{ color: 'var(--success)' }}>Step 3: Arrive at {centre.name}</strong>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Center is on your left with emergency gate and ambulance bay (600 m ahead).</p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
            Close Route
          </button>
        </div>
      </div>
    </div>
  );
}

function EmergencyModal({ t, onNavigateCasualty, onClose }) {
  return (
    <div className="app-modal-overlay active">
      <div className="modal-dialog" style={{ border: '2px solid var(--danger)' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: '70px', height: '70px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 0.75rem' }}>
            🚨
          </div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--danger)' }}>Emergency SOS Assistance</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Your GPS Coordinates: <strong>18.8241° N, 73.9102° E (Wadgaon Village)</strong>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <a href="tel:108" className="btn-danger" style={{ justifyContent: 'center', padding: '0.9rem', fontSize: '1.05rem' }}>
            📞 Dial 108 Ambulance (Free Govt Dispatch)
          </a>
          <a href="tel:102" className="btn-secondary" style={{ justifyContent: 'center', padding: '0.85rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            🚑 Dial 102 Pregnant Mother & Child Transport
          </a>
          <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={onNavigateCasualty}>
            🏥 Navigate to Nearest 24/7 Casualty (Wadgaon PHC - 2.8 km)
          </button>
        </div>

        <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: '#991b1b' }}>
          ℹ️ <strong>Snakebite Advice:</strong> Keep patient calm and still. Do NOT cut or tie tight tourniquet. Wadgaon PHC has 18 vials of anti-venom in stock right now.
        </div>
      </div>
    </div>
  );
}

function EligibilityModal({ t, scheme, onBookFacility, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="app-modal-overlay active">
      <div className="modal-dialog">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '0.3rem' }}>
          {scheme.name}
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Answer 3 quick questions in simple words to check your eligibility.
        </p>

        {!submitted ? (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>1. What color is your Family Ration Card?</label>
              <select className="form-control" required defaultValue="orange">
                <option value="yellow">Yellow (BPL - Antyodaya Anna Yojana)</option>
                <option value="orange">Orange (Priority Household)</option>
                <option value="white">White (Above Poverty Line)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>2. Primary Household Occupation</label>
              <select className="form-control" required defaultValue="farmer">
                <option value="farmer">Small Farmer / Agricultural Laborer</option>
                <option value="worker">Daily Wage Rural Worker / Artisan</option>
                <option value="self">Small Shop / Self-employed</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>3. Do you have an Aadhaar Card?</label>
              <select className="form-control" required defaultValue="yes">
                <option value="yes">Yes, all family members have Aadhaar</option>
                <option value="partial">Only some members have Aadhaar</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
              Check Eligibility Result →
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '60px', height: '60px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              Congratulations! You Are Eligible
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Based on your rural location in Khed Taluka and Ration Card, your family qualifies for <strong>₹5,00,000 Free Cashless Hospitalization</strong>.
            </p>

            <div style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <strong>Next 2 Simple Steps to get your Golden Card:</strong>
              <ol style={{ marginLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                <li>Take your <strong>Aadhaar Card</strong> and <strong>Ration Card</strong> to Wadgaon PHC or Manchar CHC.</li>
                <li>Ayushman Mitra will take your thumb biometric scan and print your PVC card on the spot!</li>
              </ol>
            </div>

            <button className="btn-primary" onClick={onBookFacility}>
              📅 Book Free Health Checkup at Wadgaon PHC
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoCallModal({ t, doctor, speak, onEndCall, onClose }) {
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
  const secs = String(callSeconds % 60).padStart(2, '0');

  return (
    <div className="tele-call-modal-overlay active">
      <div className="video-call-interface">
        <div className="video-call-topbar">
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 750 }}>{doctor.name}</h4>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{doctor.specialization} • e-Sanjeevani</span>
          </div>
          <div className="call-timer-badge">
            <span className="live-beacon" style={{ background: '#ef4444' }}></span>
            <span>{mins}:{secs}</span>
          </div>
        </div>

        <div className="video-screens-grid">
          <div className="doctor-video-feed">
            <img src={doctor.photo} alt="Doctor Live Video" />
            <div className="doctor-video-overlay-info">
              🟢 Encrypted High-Definition Tele-Health Link
            </div>
            <div className="patient-self-feed" style={{ opacity: isVideoOff ? 0.3 : 1 }}>
              <span style={{ fontSize: '1.4rem' }}>🧑</span>
              <span>You (Patient)</span>
            </div>
          </div>

          <div className="tele-rx-panel">
            <div className="rx-header">
              <strong>📋 Live Doctor's Rx</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>Verified</span>
            </div>
            <div className="rx-list">
              <div className="rx-item">
                <strong>1. Paracetamol 500mg</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 tab after meals 3 times daily for 3 days</div>
              </div>
              <div className="rx-item">
                <strong>2. ORS Hydration Sachet</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dissolve in 1 liter clean water, sip throughout day</div>
              </div>
              <div className="rx-item">
                <strong>3. Cetirizine 10mg</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 tablet at night for running nose</div>
              </div>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'center' }}>
              Free drug collection available at Wadgaon PHC counter.
            </div>
          </div>
        </div>

        <div className="video-call-controls">
          <button className={`call-ctl-btn ${isMuted ? 'danger' : ''}`} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? '🔇' : '🎤'}
          </button>
          <button className={`call-ctl-btn ${isVideoOff ? 'danger' : ''}`} onClick={() => setIsVideoOff(!isVideoOff)}>
            {isVideoOff ? '🚫' : '📹'}
          </button>
          <button className="call-ctl-btn" onClick={() => speak('Doctor says: Take the paracetamol medicine three times a day and drink plenty of boiled water.')} title="Voice Guidance">
            🔊
          </button>
          <button className="call-ctl-btn danger" onClick={onEndCall} title="End Call">
            📞
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   COMPONENT: Footer
------------------------------------------------------------------------- */
function Footer({ t, navigateTo }) {
  return (
    <footer className="app-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>{t.app_title}</h3>
          <p>{t.sub_tagline}</p>
          <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            Supported by Ministry of Health & Family Welfare (MoHFW) & State Public Health Department.
          </div>
        </div>

        <div className="footer-col">
          <h5>Quick Access</h5>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('finder'); }}>Find Healthcare Centres</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('booking'); }}>Book Digital OPD Token</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('tele'); }}>Teleconsultation</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('medicines'); }}>Check Free Medicines</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Welfare Schemes</h5>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('schemes'); }}>Ayushman Bharat PM-JAY</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('schemes'); }}>Pradhan Mantri Matru Vandana</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('schemes'); }}>Janani Suraksha Yojana</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('schemes'); }}>Jan Aushadhi Generic Drugs</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Emergency Helplines</h5>
          <ul>
            <li><strong style={{ color: '#f87171' }}>108</strong> - National Ambulance</li>
            <li><strong style={{ color: '#38bdf8' }}>102</strong> - Janani Shishu Express</li>
            <li><strong style={{ color: '#4ade80' }}>104</strong> - State Health Helpdesk</li>
            <li><strong style={{ color: '#fbbf24' }}>14555</strong> - Ayushman Bharat Toll-free</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom-bar">
        <div>
          © 2026 SwasthyaSetu Rural Healthcare Access Platform. Built with React Component Framework for Universal Access.
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>React 18 Architecture</span>
          <span>WCAG 2.1 AAA Compliant</span>
          <span>Tri-Lingual Enabled</span>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   COMPONENT: LoginPage
   Full-screen auth screen — Login via Mobile+OTP or Register as new user
========================================================================= */
function LoginPage({ onLogin, defaultLang, setCurrentLang }) {
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('mobile');
  const [lang, setLang] = useState(defaultLang || 'en');

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpError, setOtpError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [regData, setRegData] = useState({
    name: '', age: '', gender: 'Male', village: '',
    district: '', pinCode: '', abhaId: '', langPref: 'en'
  });
  const [newUser, setNewUser] = useState(null);

  const ref0 = useRef(); const ref1 = useRef(); const ref2 = useRef();
  const ref3 = useRef(); const ref4 = useRef(); const ref5 = useRef();
  const otpRefs = [ref0, ref1, ref2, ref3, ref4, ref5];

  const t = window.translations && window.translations[lang] ? window.translations[lang] : {};

  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, otpTimer]);

  const handleLangChange = (l) => { setLang(l); setCurrentLang(l); };

  const handleSendOtp = () => {
    if (mobile.length !== 10) { alert('Please enter a valid 10-digit mobile number.'); return; }
    setOtpSent(true); setOtpTimer(30); setOtpError(''); setStep('otp');
    setTimeout(() => { if (otpRefs[0].current) otpRefs[0].current.focus(); }, 100);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp); setOtpError('');
    if (value && index < 5 && otpRefs[index + 1].current) otpRefs[index + 1].current.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs[index - 1].current)
      otpRefs[index - 1].current.focus();
  };

  const handleVerifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 6) { setOtpError('Please enter all 6 digits.'); return; }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (mode === 'login') {
        const saved = localStorage.getItem('swasthyasetu_user');
        if (saved) {
          try { const u = JSON.parse(saved); if (u.mobile === mobile) { setNewUser(u); setStep('success'); return; } } catch(e) {}
        }
        const quickUser = {
          name: 'Citizen ' + mobile.slice(-4), mobile, age: '', gender: 'Male',
          village: '', district: '', pinCode: '',
          abhaId: '91-' + (1000+Math.floor(Math.random()*8999)) + '-' + (1000+Math.floor(Math.random()*8999)) + '-' + (1000+Math.floor(Math.random()*8999)),
          langPref: lang
        };
        setNewUser(quickUser); setStep('success');
      } else { setStep('details'); }
    }, 1200);
  };

  const handleRegister = () => {
    if (!regData.name.trim()) { alert('Please enter your full name.'); return; }
    const user = {
      ...regData, mobile,
      abhaId: '91-' + (1000+Math.floor(Math.random()*8999)) + '-' + (1000+Math.floor(Math.random()*8999)) + '-' + (1000+Math.floor(Math.random()*8999))
    };
    setNewUser(user); setStep('success');
  };

  const handleEnterApp = () => { if (newUser) onLogin(newUser); };

  return (
    <div className="login-page-root">

      {/* ── LEFT HERO PANEL ────────────────────────────────── */}
      <div className="login-hero-panel">
        <div className="login-hero-blob-1"></div>
        <div className="login-hero-blob-2"></div>
        <div className="login-brand-block">
          <div className="login-brand-icon">➕</div>
          <div>
            <h1>SwasthyaSetu</h1>
            <p>🇮🇳 Powered by National Health Mission</p>
          </div>
        </div>
        <div className="login-hero-content">
          <h2>Healthcare at<br/><span className="hero-teal-word">Every Doorstep</span></h2>
          <p>Your digital gateway to government PHCs, CHCs, Sub-Centres, free medicines, teleconsultation, and Ayushman Bharat benefits — in your language.</p>
          <div className="login-feature-pills">
            {['🏥 Free OPD Tokens','💊 Medicine Stock','📱 Tele-Doctor','📜 Govt Schemes','🗺️ Nearest PHC','🆘 Emergency SOS'].map(f => (
              <span key={f} className="login-feat-pill">{f}</span>
            ))}
          </div>
        </div>
        <div className="login-hero-stats">
          {[['1,500+','Govt Centres'],['4L+','Citizens Served'],['100%','Free Services']].map(([num,lbl]) => (
            <div key={lbl} className="login-stat-box">
              <span className="login-stat-num">{num}</span>
              <span className="login-stat-label">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ───────────────────────────────── */}
      <div className="login-form-panel">

        {/* Language switcher */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.5rem' }}>
          <div className="lang-pref-group" style={{ maxWidth:'260px' }}>
            {[['en','English'],['hi','हिन्दी'],['mr','मराठी']].map(([code,label]) => (
              <div key={code} className={`lang-pref-card ${lang===code?'selected':''}`}
                onClick={() => handleLangChange(code)}>{label}</div>
            ))}
          </div>
        </div>

        {/* MOBILE STEP */}
        {step === 'mobile' && (
          <div style={{ animation:'fadeIn 0.3s ease' }}>
            <div className="login-step-tabs">
              <button className={`login-tab-btn ${mode==='login'?'active':''}`} onClick={() => setMode('login')}>🔑 Login</button>
              <button className={`login-tab-btn ${mode==='register'?'active':''}`} onClick={() => setMode('register')}>📝 New Registration</button>
            </div>
            <div className="login-form-heading">
              <h3>{mode==='login' ? 'Welcome Back 👋' : 'Create Account ✨'}</h3>
              <p>{mode==='login' ? 'Enter your registered mobile to receive an OTP.' : 'Register your mobile to access free government health services.'}</p>
            </div>
            <div className="form-group" style={{ position:'relative' }}>
              <label className="form-label">Mobile Number</label>
              <div style={{ position:'relative' }}>
                <span className="mobile-flag-prefix">🇮🇳 +91</span>
                <input id="login-mobile-input" type="tel" className="form-control"
                  style={{ paddingLeft:'4rem', fontSize:'1.1rem', fontWeight:600, letterSpacing:'0.05em' }}
                  placeholder="98XXXXXXXX" maxLength={10} value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g,'').slice(0,10))}
                  onKeyDown={e => e.key==='Enter' && handleSendOtp()} />
              </div>
              <small style={{ color:'var(--text-light)', fontSize:'0.8rem' }}>📲 A 6-digit OTP will be sent via SMS</small>
            </div>
            <button id="send-otp-btn" className="btn btn-primary"
              style={{ width:'100%', marginTop:'1rem', padding:'1rem', fontSize:'1.05rem', fontWeight:800 }}
              onClick={handleSendOtp} disabled={mobile.length !== 10}>
              {mobile.length !== 10 ? '📱 Enter 10-digit Number' : '🔐 Send OTP'}
            </button>
            <div className="form-or-divider">or</div>
            <button className="btn btn-secondary"
              style={{ width:'100%', padding:'0.85rem' }}
              onClick={() => { setMobile('9823101234'); setTimeout(() => handleSendOtp(), 50); }}>
              🏥 Demo Login (Test ABHA Account)
            </button>
            <div className="login-trust-row">
              <span className="login-trust-item">🔒 Secured by MoHFW</span>
              <span className="login-trust-item">🏛️ Government of India</span>
              <span className="login-trust-item">🛡️ Data Protected</span>
            </div>
          </div>
        )}

        {/* OTP STEP */}
        {step === 'otp' && (
          <div style={{ animation:'fadeIn 0.3s ease' }}>
            <button onClick={() => { setStep('mobile'); setOtp(['','','','','','']); setOtpError(''); }}
              style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:700, cursor:'pointer', marginBottom:'1rem', fontSize:'0.92rem' }}>
              ← Back
            </button>
            <div className="login-form-heading">
              <h3>Verify OTP 🔐</h3>
              <p>Enter the 6-digit code sent to <strong>+91 {mobile}</strong></p>
            </div>
            <div className="otp-sent-badge">✅ OTP sent to +91 {mobile}</div>
            <div className="otp-box-grid">
              {otp.map((digit, i) => (
                <input key={i} ref={otpRefs[i]} type="text" inputMode="numeric" maxLength={1}
                  className={`otp-digit-box ${digit ? 'filled' : ''}`} value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)} onFocus={e => e.target.select()} />
              ))}
            </div>
            {otpError && <p style={{ color:'#dc2626', fontSize:'0.88rem', textAlign:'center', fontWeight:600, marginBottom:'0.5rem' }}>⚠️ {otpError}</p>}
            <div className="otp-resend-row">
              {otpTimer > 0
                ? <>Resend in <strong>00:{String(otpTimer).padStart(2,'0')}</strong></>
                : <button className="otp-resend-btn" onClick={() => { setOtp(['','','','','','']); setOtpSent(true); setOtpTimer(30); }}>🔄 Resend OTP</button>}
            </div>
            <button className="btn btn-primary"
              style={{ width:'100%', marginTop:'1.5rem', padding:'1rem', fontSize:'1.05rem', fontWeight:800 }}
              onClick={handleVerifyOtp} disabled={otp.join('').length < 6 || verifying}>
              {verifying ? '⏳ Verifying...' : '✅ Verify & Continue'}
            </button>
            <p style={{ fontSize:'0.82rem', color:'var(--text-light)', textAlign:'center', marginTop:'1rem' }}>
              💡 Demo: Enter any 6 digits (e.g. 123456) to proceed
            </p>
          </div>
        )}

        {/* DETAILS STEP (Registration) */}
        {step === 'details' && (
          <div style={{ animation:'fadeIn 0.3s ease' }}>
            <div className="login-form-heading">
              <h3>Complete Profile 📋</h3>
              <p>Help us personalize your healthcare experience</p>
            </div>
            <div className="reg-form-grid">
              <div className="form-group reg-form-full">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Ramesh Tukaram Patil"
                  value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" className="form-control" placeholder="35" min={1} max={120}
                  value={regData.age} onChange={e => setRegData({...regData, age: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="gender-radio-group">
                  {[['♂️','Male'],['♀️','Female'],['⚧','Other']].map(([icon,g]) => (
                    <label key={g} className={`gender-radio-card ${regData.gender===g?'selected':''}`}
                      onClick={() => setRegData({...regData, gender: g})}>
                      <input type="radio" name="gender" value={g} readOnly />
                      <span className="gender-icon">{icon}</span>{g}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Village / Ward</label>
                <input type="text" className="form-control" placeholder="Vill. Wadgaon"
                  value={regData.village} onChange={e => setRegData({...regData, village: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input type="text" className="form-control" placeholder="Pune"
                  value={regData.district} onChange={e => setRegData({...regData, district: e.target.value})} />
              </div>
              <div className="form-group reg-form-full">
                <label className="form-label">PIN Code</label>
                <input type="text" className="form-control" placeholder="410501" maxLength={6}
                  value={regData.pinCode} onChange={e => setRegData({...regData, pinCode: e.target.value.replace(/\D/g,'').slice(0,6)})} />
              </div>
              <div className="form-group reg-form-full">
                <label className="form-label">Preferred Language</label>
                <div className="lang-pref-group">
                  {[['en','English 🇬🇧'],['hi','हिन्दी 🇮🇳'],['mr','मराठी']].map(([code,label]) => (
                    <div key={code} className={`lang-pref-card ${regData.langPref===code?'selected':''}`}
                      onClick={() => setRegData({...regData, langPref: code})}>{label}</div>
                  ))}
                </div>
              </div>
            </div>
            <button className="btn btn-primary"
              style={{ width:'100%', padding:'1rem', fontSize:'1.05rem', fontWeight:800 }}
              onClick={handleRegister}>
              🎉 Create My Health Profile
            </button>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && newUser && (
          <div className="login-success-screen">
            <div className="login-success-avatar">🎉</div>
            <h3>{mode==='login' ? 'Welcome back,' : 'Registration Complete!'}</h3>
            <h3 style={{ color:'var(--primary)', marginTop:'-0.4rem' }}>{newUser.name} 👋</h3>
            <p>{mode==='login'
              ? 'You are now securely logged in. Your health records and appointments are ready.'
              : 'Your health profile is created. Access all government healthcare services for free.'}</p>
            <div className="abha-card-preview">
              <div className="abha-card-label">🏥 Ayushman Bharat Health Account</div>
              <div className="abha-card-name">{newUser.name}</div>
              <div className="abha-card-id">ABHA ID: {newUser.abhaId}</div>
              {newUser.village && <div style={{ fontSize:'0.82rem', opacity:0.75, marginTop:'0.2rem' }}>📍 {newUser.village}{newUser.district ? ', '+newUser.district : ''}</div>}
              <div style={{ fontSize:'0.82rem', opacity:0.75 }}>📱 +91 {newUser.mobile}</div>
            </div>
            <button id="enter-app-btn" className="btn btn-primary"
              style={{ width:'100%', padding:'1.1rem', fontSize:'1.1rem', fontWeight:800, marginBottom:'0.75rem' }}
              onClick={handleEnterApp}>
              🏥 Enter SwasthyaSetu →
            </button>
            <div className="login-trust-row">
              <span className="login-trust-item">🔒 AES-256 Encrypted</span>
              <span className="login-trust-item">🏛️ NHA Compliant</span>
              <span className="login-trust-item">🛡️ DPDP Act Protected</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Mount React App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

