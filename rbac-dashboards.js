/* =========================================================================
   SwasthyaSetu – RBAC Multi-Role Dashboard System
   Roles: patient | doctor | staff | admin
   ========================================================================= */

/* -------------------------------------------------------------------------
   DEMO ACCOUNTS (Simulated Authentication)
   ------------------------------------------------------------------------- */
const DEMO_ACCOUNTS = {
  'patient@demo.com': {
    role: 'patient',
    name: 'Ramesh Tukaram Patil',
    email: 'patient@demo.com',
    mobile: '9823101234',
    age: 42,
    gender: 'Male',
    village: 'Vill. Wadgaon, Khed Taluka',
    district: 'Pune',
    pinCode: '410501',
    abhaId: '91-4829-1029-4821',
    preferredLang: 'en',
    bloodGroup: 'B+',
    allergies: 'None known',
    emergencyContact: 'Sunita Patil – 9823101235'
  },
  'doctor@demo.com': {
    role: 'doctor',
    name: 'Dr. Rahul Sharma',
    email: 'doctor@demo.com',
    mobile: '9812345678',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (General Medicine)',
    centre: 'PHC Demo Centre, Wadgaon',
    centreId: 'phc-wadgaon',
    experience: '8 Years',
    registrationNo: 'MH-23451',
    available: true,
    consultFee: 'FREE (Government)',
    languages: ['English', 'Hindi', 'Marathi']
  },
  'staff@demo.com': {
    role: 'staff',
    name: 'Priya Nair',
    email: 'staff@demo.com',
    mobile: '9934567890',
    designation: 'Healthcare Coordinator',
    centre: 'PHC Demo Centre, Wadgaon',
    centreId: 'phc-wadgaon',
    department: 'Administration & Patient Services',
    staffId: 'STAFF-WGN-042'
  },
  'admin@demo.com': {
    role: 'admin',
    name: 'Suresh Kumar IAS',
    email: 'admin@demo.com',
    mobile: '9800000001',
    designation: 'Joint Director, Public Health',
    department: 'Directorate of Health Services, Maharashtra',
    district: 'Pune Division',
    adminId: 'GOV-ADMIN-2026-001',
    clearanceLevel: 'Division Level'
  }
};

/* -------------------------------------------------------------------------
   MOCK DATA for Doctor/Staff/Admin dashboards
   ------------------------------------------------------------------------- */
const DOCTOR_APPOINTMENTS = [
  { id: 'DA-001', patient: 'Ramesh Patil', age: 42, gender: 'M', time: '09:00 AM', status: 'Confirmed', type: 'OPD', symptoms: 'Fever & cough for 3 days', token: 'T-01' },
  { id: 'DA-002', patient: 'Sunita Devi', age: 28, gender: 'F', time: '09:30 AM', status: 'In Progress', type: 'OPD', symptoms: 'Pregnancy check-up (28 weeks)', token: 'T-02' },
  { id: 'DA-003', patient: 'Kiran Jadhav', age: 7, gender: 'M', time: '10:00 AM', status: 'Waiting', type: 'Pediatric', symptoms: 'Vaccination – Polio booster', token: 'T-03' },
  { id: 'DA-004', patient: 'Meena Rane', age: 55, gender: 'F', time: '10:30 AM', status: 'Confirmed', type: 'OPD', symptoms: 'Hypertension follow-up', token: 'T-04' },
  { id: 'DA-005', patient: 'Vijay Kumar', age: 38, gender: 'M', time: '11:00 AM', status: 'Confirmed', type: 'OPD', symptoms: 'Back pain, requested X-ray', token: 'T-05' },
  { id: 'DA-006', patient: 'Asha Shinde', age: 22, gender: 'F', time: '11:30 AM', status: 'Teleconsult', type: 'Tele', symptoms: 'Skin rash, remote diagnosis', token: 'T-06' },
  { id: 'DA-007', patient: 'Raju Borse', age: 65, gender: 'M', time: '12:00 PM', status: 'Confirmed', type: 'OPD', symptoms: 'Diabetes – quarterly review', token: 'T-07' },
  { id: 'DA-008', patient: 'Lalita Pawar', age: 34, gender: 'F', time: '02:00 PM', status: 'Pending', type: 'OPD', symptoms: 'General weakness & fatigue', token: 'T-08' },
];

const TELE_REQUESTS = [
  { id: 'TR-001', patient: 'Ananya Desai', age: 19, location: 'Remote – Ambegaon', time: '10:15 AM', reason: 'Headache & nausea', status: 'Waiting' },
  { id: 'TR-002', patient: 'Manoj Gaikwad', age: 51, location: 'Village – Narayangaon', time: '11:45 AM', reason: 'Post-surgery wound check', status: 'Scheduled' },
  { id: 'TR-003', patient: 'Rekha More', age: 44, location: 'Remote – Shirur', time: '02:30 PM', reason: 'Allergy & skin reaction', status: 'Waiting' },
];

const PATIENT_FEEDBACK_DOCTOR = [
  { patient: 'Ramesh P.', rating: 5, comment: 'Very thorough and explained everything clearly. Highly recommended!', date: '2026-10-05' },
  { patient: 'Sunita D.', rating: 5, comment: 'Dr. Sharma was very caring and answered all my questions patiently.', date: '2026-10-04' },
  { patient: 'Meena R.', rating: 4, comment: 'Good consultation, waiting time was a bit long but the treatment was excellent.', date: '2026-10-03' },
  { patient: 'Vijay K.', rating: 4, comment: 'Professional and knowledgeable. Got my X-ray prescription promptly.', date: '2026-10-01' },
];

const CENTRE_DATA = {
  name: 'Primary Health Centre – Wadgaon',
  type: 'PHC',
  location: 'Wadgaon Village, Khed Taluka, Pune – 410501',
  totalBeds: 30,
  availableBeds: 8,
  doctors: [
    { name: 'Dr. Rahul Sharma', dept: 'General Medicine', available: true, slots: 12 },
    { name: 'Dr. Priya Kulkarni', dept: 'Gynaecology', available: true, slots: 8 },
    { name: 'Dr. Amit Joshi', dept: 'Paediatrics', available: false, slots: 0 },
  ],
  todayAppointments: 48,
  waitingTime: 22,
  services: [
    { name: 'OPD Consultation', active: true },
    { name: 'Antenatal Care (ANC)', active: true },
    { name: 'Immunization', active: true },
    { name: 'Lab Tests (CBC, LFT)', active: true },
    { name: 'Minor Surgery OT', active: false },
    { name: 'X-Ray', active: true },
    { name: 'Dental (Basic)', active: true },
    { name: '24x7 Emergency', active: true },
  ],
  medicines: [
    { name: 'Paracetamol 500mg', stock: 2840, status: 'in-stock' },
    { name: 'Amoxicillin 250mg', stock: 420, status: 'in-stock' },
    { name: 'ORS Sachets', stock: 185, status: 'limited' },
    { name: 'Iron+Folic Acid', stock: 1200, status: 'in-stock' },
    { name: 'Snake Antivenom', stock: 18, status: 'in-stock' },
    { name: 'Metformin 500mg', stock: 65, status: 'limited' },
    { name: 'Chloroquine', stock: 0, status: 'out-of-stock' },
    { name: 'Salbutamol Inhaler', stock: 24, status: 'in-stock' },
  ],
  feedback: [
    { patient: 'Ramesh P.', rating: 5, comment: 'Great service, clean facility!', date: '2026-10-05' },
    { patient: 'Geeta K.', rating: 4, comment: 'Doctors are helpful, wish there was more medicine stock.', date: '2026-10-03' },
    { patient: 'Mohammed I.', rating: 3, comment: 'Long wait time but good treatment.', date: '2026-10-01' },
  ]
};

const ADMIN_STATS = {
  patients: { total: 856420, growth: 12.4, label: 'Registered Patients' },
  doctors: { total: 14820, growth: 8.2, label: 'Active Doctors' },
  workers: { total: 42680, growth: 5.1, label: 'Healthcare Workers' },
  centres: { total: 14280, growth: 3.7, label: 'Healthcare Centres' },
  appointments: { total: 2840560, growth: 18.6, label: 'Appointments (YTD)' },
  teleconsults: { total: 425840, growth: 34.2, label: 'Teleconsultations' },
  avgWait: { total: 24, trend: -8, label: 'Avg Wait Time (min)' },
  satisfaction: { total: 4.3, trend: 0.2, label: 'Patient Satisfaction' },
};

const DISTRICT_DATA = [
  { name: 'Pune', centres: 2842, doctors: 3480, patients: 185600, satisfaction: 4.4, waitTime: 18, gap: 'Low' },
  { name: 'Nashik', centres: 1920, doctors: 2100, patients: 142000, satisfaction: 4.1, waitTime: 26, gap: 'Medium' },
  { name: 'Aurangabad', centres: 1680, doctors: 1820, patients: 128000, satisfaction: 3.9, waitTime: 32, gap: 'High' },
  { name: 'Nagpur', centres: 2140, doctors: 2580, patients: 165000, satisfaction: 4.2, waitTime: 21, gap: 'Low' },
  { name: 'Kolhapur', centres: 1240, doctors: 1340, patients: 98000, satisfaction: 4.0, waitTime: 28, gap: 'Medium' },
  { name: 'Solapur', centres: 1050, doctors: 1120, patients: 82000, satisfaction: 3.8, waitTime: 38, gap: 'High' },
  { name: 'Amravati', centres: 980, doctors: 980, patients: 68000, satisfaction: 3.7, waitTime: 42, gap: 'Critical' },
  { name: 'Latur', centres: 860, doctors: 820, patients: 58000, satisfaction: 3.6, waitTime: 45, gap: 'Critical' },
];

/* =========================================================================
   COMPONENT: RoleBasedLoginPage
   ========================================================================= */
function RoleBasedLoginPage({ onLogin, defaultLang, setCurrentLang }) {
  const [selectedRole, setSelectedRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 'patient', icon: '👤', label: 'Patient / Citizen', color: '#0284c7', bg: '#e0f2fe' },
    { id: 'doctor', icon: '👨‍⚕️', label: 'Doctor', color: '#059669', bg: '#d1fae5' },
    { id: 'staff', icon: '🏥', label: 'Healthcare Staff', color: '#7c3aed', bg: '#ede9fe' },
    { id: 'admin', icon: '🏛️', label: 'Govt Administrator', color: '#b45309', bg: '#fef3c7' },
  ];

  const demoAccounts = {
    patient: { email: 'patient@demo.com', password: 'demo123' },
    doctor: { email: 'doctor@demo.com', password: 'demo123' },
    staff: { email: 'staff@demo.com', password: 'demo123' },
    admin: { email: 'admin@demo.com', password: 'demo123' },
  };

  const fillDemo = () => {
    const demo = demoAccounts[selectedRole];
    setEmail(demo.email);
    setPassword(demo.password);
    setLoginError('');
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter email and password.');
      return;
    }
    setLoading(true);
    setLoginError('');
    setTimeout(() => {
      const account = DEMO_ACCOUNTS[email.toLowerCase().trim()];
      if (account && password === 'demo123') {
        if (account.role !== selectedRole) {
          setLoginError('This account belongs to "' + account.role + '" role. Please select the correct role above.');
          setLoading(false);
          return;
        }
        onLogin(account);
      } else {
        setLoginError('Invalid credentials. Click "Auto-Fill" to use a demo account.');
      }
      setLoading(false);
    }, 900);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };
  const currentRole = roles.find(r => r.id === selectedRole);

  return (
    <div className="rbac-login-root">
      {/* LEFT HERO */}
      <div className="rbac-login-left">
        <div className="rbac-login-brand">
          <div className="rbac-brand-icon">+</div>
          <div>
            <h1>SwasthyaSetu</h1>
            <p>National Rural Healthcare Platform</p>
          </div>
        </div>
        <div className="rbac-login-hero-text">
          <h2>One Platform. Four Portals. Better Healthcare for All.</h2>
          <p>Connecting patients, doctors, healthcare staff and government administrators on a unified digital platform.</p>
        </div>
        <div className="rbac-role-showcase">
          {roles.map(r => (
            <div key={r.id} className="rbac-role-showcase-item">
              <span style={{ fontSize: '1.5rem' }}>{r.icon}</span>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{r.label}</div>
            </div>
          ))}
        </div>
        <div className="rbac-login-badges">
          <span className="rbac-badge">🔒 Secure</span>
          <span className="rbac-badge">🇮🇳 MoHFW</span>
          <span className="rbac-badge">🛡️ DPDP Act</span>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="rbac-login-right">
        <div className="rbac-login-form-card">
          <div className="rbac-demo-banner">
            <span className="rbac-demo-dot"></span>
            <span><strong>Prototype Login</strong> — Demo Accounts Available</span>
          </div>

          <h2 className="rbac-login-title">Sign In to Your Portal</h2>
          <p className="rbac-login-subtitle">Select your role to access the appropriate dashboard</p>

          {/* Role Selector */}
          <div className="rbac-role-selector">
            <label className="rbac-field-label">Select Your Role</label>
            <div className="rbac-role-grid">
              {roles.map(r => (
                <button key={r.id}
                  className={'rbac-role-btn' + (selectedRole === r.id ? ' active' : '')}
                  style={selectedRole === r.id ? { borderColor: r.color, background: r.bg, color: r.color } : {}}
                  onClick={() => { setSelectedRole(r.id); setLoginError(''); setEmail(''); setPassword(''); }}>
                  <span className="rbac-role-btn-icon">{r.icon}</span>
                  <span className="rbac-role-btn-label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Demo fill bar */}
          <div className="rbac-demo-fill-bar">
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Demo: </span>
              <code style={{ fontSize: '0.82rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
                {demoAccounts[selectedRole].email}
              </code>
            </div>
            <button className="rbac-autofill-btn" onClick={fillDemo}>Auto-Fill</button>
          </div>

          {/* Fields */}
          <div className="rbac-field-group">
            <label className="rbac-field-label">Email Address</label>
            <div className="rbac-input-wrap">
              <span className="rbac-input-icon">@</span>
              <input type="email" className="rbac-input"
                placeholder={demoAccounts[selectedRole].email}
                value={email} onChange={e => { setEmail(e.target.value); setLoginError(''); }}
                onKeyDown={handleKeyDown} />
            </div>
          </div>

          <div className="rbac-field-group">
            <label className="rbac-field-label">Password</label>
            <div className="rbac-input-wrap">
              <span className="rbac-input-icon">*</span>
              <input type={showPassword ? 'text' : 'password'} className="rbac-input"
                placeholder="demo123" value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                onKeyDown={handleKeyDown} />
              <button className="rbac-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {loginError && <div className="rbac-login-error">⚠ {loginError}</div>}

          <button className="rbac-login-btn"
            style={{ background: 'linear-gradient(135deg, ' + currentRole.color + ', ' + currentRole.color + 'cc)' }}
            onClick={handleLogin} disabled={loading}>
            {loading ? 'Authenticating...' : currentRole.icon + ' Sign In as ' + currentRole.label}
          </button>

          {/* All Demo Accounts */}
          <div className="rbac-all-demos">
            <div className="rbac-all-demos-title">All Prototype Demo Accounts (Password: demo123)</div>
            <div className="rbac-all-demos-grid">
              {roles.map(r => (
                <div key={r.id} className="rbac-demo-card"
                  onClick={() => { setSelectedRole(r.id); setEmail(demoAccounts[r.id].email); setPassword('demo123'); setLoginError(''); }}>
                  <span>{r.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: r.color }}>{r.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{demoAccounts[r.id].email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rbac-login-footer-note">Prototype only – no real data is stored or used.</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   COMPONENT: DoctorDashboard
   ========================================================================= */
function DoctorDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [availability, setAvailability] = useState(currentUser.available !== false);
  const [appointments, setAppointments] = useState(DOCTOR_APPOINTMENTS);

  const todayAppts = appointments.filter(a => ['Confirmed','In Progress','Waiting'].includes(a.status));

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'tele', icon: '📱', label: 'Teleconsultation' },
    { id: 'availability', icon: '🕐', label: 'Availability' },
    { id: 'feedback', icon: '⭐', label: 'Feedback' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const handleAccept = (id) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmed' } : a));
  const handleDecline = (id) => setAppointments(prev => prev.filter(a => a.id !== id));

  return (
    <div className="role-dashboard-root">
      <aside className="role-sidebar doctor-sidebar">
        <div className="role-sidebar-brand">
          <div className="role-sidebar-logo">+</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>SwasthyaSetu</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.7, color: '#bae6fd' }}>Doctor Portal</div>
          </div>
        </div>
        <div className="role-sidebar-profile">
          <div className="role-sidebar-avatar doctor-avatar">R</div>
          <div className="role-sidebar-profile-info">
            <div className="role-sidebar-name">{currentUser.name}</div>
            <div className="role-sidebar-sub">{currentUser.specialization}</div>
            <div className="role-sidebar-sub" style={{ fontSize: '0.7rem', opacity: 0.7 }}>{currentUser.centre}</div>
          </div>
          <div className={'role-avail-dot ' + (availability ? 'avail-online' : 'avail-offline')}></div>
        </div>
        <nav className="role-sidebar-nav">
          {navItems.map(item => (
            <button key={item.id} className={'role-nav-item' + (activeTab === item.id ? ' active' : '')} onClick={() => setActiveTab(item.id)}>
              <span className="role-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="role-logout-btn" onClick={onLogout}>Logout</button>
      </aside>

      <main className="role-main-content">
        <div className="role-topbar">
          <div>
            <h2 className="role-topbar-title">{(navItems.find(n => n.id === activeTab) || navItems[0]).icon} {(navItems.find(n => n.id === activeTab) || navItems[0]).label}</h2>
            <p className="role-topbar-sub">{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
          </div>
          <div className="role-topbar-actions">
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: availability ? '#059669' : '#dc2626' }}>
              {availability ? 'Available' : 'Unavailable'}
            </span>
            <button className={'avail-toggle-btn ' + (availability ? 'on' : 'off')} onClick={() => setAvailability(!availability)}>
              <span className="avail-toggle-thumb"></span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="role-content-pad">
            <div className="role-stats-grid">
              <div className="role-stat-card doctor-stat">
                <div className="role-stat-icon">📅</div>
                <div className="role-stat-num">{todayAppts.length}</div>
                <div className="role-stat-label">Today's Appointments</div>
              </div>
              <div className="role-stat-card doctor-stat">
                <div className="role-stat-icon">⏳</div>
                <div className="role-stat-num">5</div>
                <div className="role-stat-label">Upcoming</div>
              </div>
              <div className="role-stat-card doctor-stat">
                <div className="role-stat-icon">✅</div>
                <div className="role-stat-num">3</div>
                <div className="role-stat-label">Completed</div>
              </div>
              <div className="role-stat-card doctor-stat">
                <div className="role-stat-icon">📱</div>
                <div className="role-stat-num">{TELE_REQUESTS.length}</div>
                <div className="role-stat-label">Tele Requests</div>
              </div>
            </div>

            <div className="doctor-current-patient">
              <div className="doctor-cp-header">
                <span className="doctor-cp-badge">Currently Consulting</span>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Token T-02 — 09:30 AM</span>
              </div>
              <div className="doctor-cp-body">
                <div className="doctor-cp-avatar">S</div>
                <div className="doctor-cp-info">
                  <h3>Sunita Devi</h3>
                  <p>28 years, Female — Antenatal Care – 28 weeks pregnancy check-up</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="doctor-cp-tag">BP: 118/76</span>
                    <span className="doctor-cp-tag">Weight: 64 kg</span>
                    <span className="doctor-cp-tag">Hb: 10.8 g/dL</span>
                  </div>
                </div>
                <button className="btn-role-primary" onClick={() => alert('Opening e-Prescription writer...')}>Write Prescription</button>
              </div>
            </div>

            <div className="role-quick-grid">
              <button className="role-quick-card" onClick={() => setActiveTab('appointments')}><span>📅</span><span>Appointments</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('patients')}><span>👥</span><span>Patient Requests</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('tele')}><span>📱</span><span>Teleconsultation</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('availability')}><span>🕐</span><span>My Availability</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('feedback')}><span>⭐</span><span>Feedback</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('profile')}><span>👤</span><span>Profile</span></button>
            </div>

            <div className="role-section-card">
              <h3 className="role-section-title">Today's Appointment List</h3>
              <div className="doctor-appt-list">
                {appointments.slice(0, 5).map(a => (
                  <div key={a.id} className="doctor-appt-row">
                    <div className="doctor-appt-token">{a.token}</div>
                    <div className="doctor-appt-main">
                      <div className="doctor-appt-name">{a.patient} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>({a.age}y/{a.gender})</span></div>
                      <div className="doctor-appt-sym">{a.symptoms}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>{a.time}</div>
                      <span className={'doctor-status-pill ' + (a.status === 'In Progress' ? 'status-inprogress' : a.status === 'Waiting' ? 'status-waiting' : 'status-confirmed')}>{a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <h3 className="role-section-title">All Today's Appointments</h3>
              <div className="doctor-appt-list">
                {appointments.map(a => (
                  <div key={a.id} className="doctor-appt-row">
                    <div className="doctor-appt-token">{a.token}</div>
                    <div className="doctor-appt-main">
                      <div className="doctor-appt-name">{a.patient} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>— {a.age}y, {a.gender}, {a.type}</span></div>
                      <div className="doctor-appt-sym">{a.symptoms}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>{a.time}</div>
                      <span className={'doctor-status-pill ' + (a.status === 'In Progress' ? 'status-inprogress' : a.status === 'Waiting' ? 'status-waiting' : a.status === 'Teleconsult' ? 'status-tele' : 'status-confirmed')}>{a.status}</span>
                      {a.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn-accept" onClick={() => handleAccept(a.id)}>Accept</button>
                          <button className="btn-decline" onClick={() => handleDecline(a.id)}>Decline</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <h3 className="role-section-title">Patient Requests</h3>
              <div className="doctor-appt-list">
                {appointments.filter(a => a.status === 'Pending' || a.status === 'Waiting').map(a => (
                  <div key={a.id} className="doctor-appt-row">
                    <div className="doctor-appt-token" style={{ background: '#fef3c7', color: '#b45309' }}>{a.token}</div>
                    <div className="doctor-appt-main">
                      <div className="doctor-appt-name">{a.patient}</div>
                      <div className="doctor-appt-sym">{a.symptoms}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>Age: {a.age} | Gender: {a.gender} | Type: {a.type}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-accept" onClick={() => handleAccept(a.id)}>Accept</button>
                      <button className="btn-decline" onClick={() => handleDecline(a.id)}>Decline</button>
                    </div>
                  </div>
                ))}
                {appointments.filter(a => a.status === 'Pending' || a.status === 'Waiting').length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No pending patient requests.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tele' && (
          <div className="role-content-pad">
            <div className="role-stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              <div className="role-stat-card doctor-stat"><div className="role-stat-icon">📱</div><div className="role-stat-num">{TELE_REQUESTS.filter(t => t.status === 'Waiting').length}</div><div className="role-stat-label">Waiting</div></div>
              <div className="role-stat-card doctor-stat"><div className="role-stat-icon">🗓️</div><div className="role-stat-num">{TELE_REQUESTS.filter(t => t.status === 'Scheduled').length}</div><div className="role-stat-label">Scheduled</div></div>
              <div className="role-stat-card doctor-stat"><div className="role-stat-icon">✅</div><div className="role-stat-num">12</div><div className="role-stat-label">Completed Today</div></div>
            </div>
            <div className="role-section-card">
              <h3 className="role-section-title">Teleconsultation Requests</h3>
              {TELE_REQUESTS.map(req => (
                <div key={req.id} className="tele-request-row">
                  <div className="tele-req-avatar">{req.patient.charAt(0)}</div>
                  <div className="tele-req-main">
                    <div style={{ fontWeight: 700 }}>{req.patient} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>— {req.age}y</span></div>
                    <div style={{ fontSize: '0.83rem', color: '#64748b' }}>{req.location} — {req.time}</div>
                    <div style={{ fontSize: '0.85rem', color: '#0f172a', marginTop: '0.2rem' }}>{req.reason}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
                    <span className={'doctor-status-pill ' + (req.status === 'Waiting' ? 'status-waiting' : 'status-confirmed')}>{req.status}</span>
                    <button className="btn-role-primary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }} onClick={() => alert('Starting mock teleconsultation with ' + req.patient + '...')}>Start Call</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <h3 className="role-section-title">Set Availability and Time Slots</h3>
              <div className="avail-status-banner" style={{ background: availability ? '#d1fae5' : '#fee2e2', borderColor: availability ? '#6ee7b7' : '#fca5a5' }}>
                <span style={{ fontSize: '1.5rem' }}>{availability ? '' : ''}</span>
                <div>
                  <div style={{ fontWeight: 700, color: availability ? '#059669' : '#dc2626' }}>
                    Currently {availability ? 'Available' : 'Unavailable'} — toggle using the top bar button
                  </div>
                </div>
              </div>
              <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Weekly Schedule</h4>
              <div className="avail-week-grid">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => (
                  <div key={day} className={'avail-day-card ' + (i < 6 ? 'avail-active' : 'avail-off')}>
                    <div className="avail-day-name">{day}</div>
                    <div className="avail-day-slots">
                      {i < 6 ? (<><div className="avail-slot">9:00–12:00</div><div className="avail-slot">2:00–5:00</div></>) : <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Day Off</div>}
                    </div>
                  </div>
                ))}
              </div>
              <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Today's Time Slots</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'].map((slot, i) => (
                  <div key={slot} className={'avail-time-slot ' + (i < 5 ? 'slot-booked' : i === 5 ? 'slot-current' : 'slot-free')}>
                    {slot}<div style={{ fontSize: '0.65rem' }}>{i < 5 ? 'Booked' : i === 5 ? 'Current' : 'Free'}</div>
                  </div>
                ))}
              </div>
              <button className="btn-role-primary" style={{ marginTop: '1.5rem' }} onClick={() => alert('Availability saved!')}>Save Availability</button>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="role-content-pad">
            <div className="role-stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              <div className="role-stat-card doctor-stat"><div className="role-stat-icon">⭐</div><div className="role-stat-num">4.6</div><div className="role-stat-label">Average Rating</div></div>
              <div className="role-stat-card doctor-stat"><div className="role-stat-icon">💬</div><div className="role-stat-num">{PATIENT_FEEDBACK_DOCTOR.length}</div><div className="role-stat-label">Total Reviews</div></div>
              <div className="role-stat-card doctor-stat"><div className="role-stat-icon">😊</div><div className="role-stat-num">95%</div><div className="role-stat-label">Satisfaction</div></div>
            </div>
            <div className="role-section-card">
              <h3 className="role-section-title">Patient Feedback</h3>
              {PATIENT_FEEDBACK_DOCTOR.map((fb, i) => (
                <div key={i} className="feedback-card">
                  <div className="feedback-header">
                    <div className="feedback-avatar">{fb.patient.charAt(0)}</div>
                    <div><div style={{ fontWeight: 700 }}>{fb.patient}</div><div style={{ fontSize: '0.78rem', color: '#64748b' }}>{fb.date}</div></div>
                    <div className="feedback-stars">{'★'.repeat(fb.rating)}</div>
                  </div>
                  <p className="feedback-text">"{fb.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <h3 className="role-section-title">Doctor Profile</h3>
              <div className="profile-header-card">
                <div className="profile-avatar-lg doctor-avatar">R</div>
                <div>
                  <h2>{currentUser.name}</h2>
                  <p style={{ color: '#0284c7', fontWeight: 600 }}>{currentUser.specialization}</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{currentUser.qualification}</p>
                </div>
              </div>
              <div className="profile-details-grid">
                {[
                  ['Healthcare Centre', currentUser.centre],
                  ['Registration No.', currentUser.registrationNo],
                  ['Experience', currentUser.experience],
                  ['Consultation Fee', currentUser.consultFee],
                  ['Mobile', '+91 ' + currentUser.mobile],
                  ['Email', currentUser.email],
                  ['Languages', (currentUser.languages || ['English']).join(', ')],
                  ['Status', availability ? 'Active & Available' : 'Off Duty'],
                ].map(([label, value]) => (
                  <div key={label} className="profile-detail-row">
                    <div className="profile-detail-label">{label}</div>
                    <div className="profile-detail-value">{value}</div>
                  </div>
                ))}
              </div>
              <button className="btn-role-primary" style={{ marginTop: '1rem' }} onClick={() => alert('Profile update coming soon!')}>Edit Profile</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================================
   COMPONENT: StaffDashboard
   ========================================================================= */
function StaffDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [medicines, setMedicines] = useState(CENTRE_DATA.medicines);
  const [waitingTime, setWaitingTime] = useState(CENTRE_DATA.waitingTime);

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
    { id: 'doctors', icon: '👨‍⚕️', label: 'Doctors' },
    { id: 'medicines', icon: '💊', label: 'Medicines' },
    { id: 'services', icon: '🏥', label: 'Services' },
    { id: 'feedback', icon: '⭐', label: 'Feedback' },
    { id: 'centre', icon: '🏢', label: 'Centre Profile' },
  ];

  const totalAvailable = CENTRE_DATA.doctors.filter(d => d.available).length;

  return (
    <div className="role-dashboard-root">
      <aside className="role-sidebar staff-sidebar">
        <div className="role-sidebar-brand">
          <div className="role-sidebar-logo" style={{ background: '#7c3aed' }}>H</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>SwasthyaSetu</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.7, color: '#ddd6fe' }}>Staff Portal</div>
          </div>
        </div>
        <div className="role-sidebar-profile">
          <div className="role-sidebar-avatar staff-avatar">{currentUser.name.charAt(0)}</div>
          <div className="role-sidebar-profile-info">
            <div className="role-sidebar-name">{currentUser.name}</div>
            <div className="role-sidebar-sub">{currentUser.designation}</div>
            <div className="role-sidebar-sub" style={{ fontSize: '0.7rem', opacity: 0.7 }}>{currentUser.centre}</div>
          </div>
        </div>
        <nav className="role-sidebar-nav">
          {navItems.map(item => (
            <button key={item.id} className={'role-nav-item' + (activeTab === item.id ? ' active' : '')} onClick={() => setActiveTab(item.id)}>
              <span className="role-nav-icon">{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="role-logout-btn" onClick={onLogout}>Logout</button>
      </aside>

      <main className="role-main-content">
        <div className="role-topbar">
          <div>
            <h2 className="role-topbar-title">{(navItems.find(n => n.id === activeTab) || navItems[0]).icon} {(navItems.find(n => n.id === activeTab) || navItems[0]).label}</h2>
            <p className="role-topbar-sub">{CENTRE_DATA.name} — {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="role-content-pad">
            <div className="role-stats-grid">
              <div className="role-stat-card staff-stat"><div className="role-stat-icon">📅</div><div className="role-stat-num">{CENTRE_DATA.todayAppointments}</div><div className="role-stat-label">Total Appointments</div></div>
              <div className="role-stat-card staff-stat"><div className="role-stat-icon">👨‍⚕️</div><div className="role-stat-num">{totalAvailable}/{CENTRE_DATA.doctors.length}</div><div className="role-stat-label">Doctors Available</div></div>
              <div className="role-stat-card staff-stat"><div className="role-stat-icon">🛏️</div><div className="role-stat-num">{CENTRE_DATA.availableBeds}/{CENTRE_DATA.totalBeds}</div><div className="role-stat-label">Beds Available</div></div>
              <div className="role-stat-card staff-stat"><div className="role-stat-icon">⏱️</div><div className="role-stat-num">{waitingTime} min</div><div className="role-stat-label">Current Wait Time</div></div>
            </div>

            <div className="role-quick-grid">
              <button className="role-quick-card" onClick={() => setActiveTab('appointments')}><span>📅</span><span>Manage Appointments</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('doctors')}><span>👨‍⚕️</span><span>Doctor Availability</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('medicines')}><span>💊</span><span>Medicine Stock</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('services')}><span>🏥</span><span>Centre Services</span></button>
              <button className="role-quick-card" onClick={() => { const t = prompt('New waiting time (minutes):', waitingTime); if(t && !isNaN(t)) setWaitingTime(parseInt(t)); }}>
                <span>⏱️</span><span>Update Wait Time</span>
              </button>
              <button className="role-quick-card" onClick={() => setActiveTab('feedback')}><span>⭐</span><span>View Feedback</span></button>
            </div>

            <div className="role-section-card">
              <h3 className="role-section-title">Medicine Stock Alerts</h3>
              {medicines.filter(m => m.status !== 'in-stock').map(m => (
                <div key={m.name} className={'med-alert-row ' + (m.status === 'out-of-stock' ? 'med-alert-danger' : 'med-alert-warning')}>
                  <span>{m.name}</span>
                  <span style={{ fontWeight: 700 }}>{m.status === 'out-of-stock' ? 'OUT OF STOCK' : 'Low – ' + m.stock + ' units'}</span>
                  <button className="btn-role-secondary" style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }} onClick={() => alert('Raising indent for ' + m.name + '...')}>Raise Indent</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="role-section-title" style={{ margin: 0 }}>Appointments</h3>
                <button className="btn-role-primary" style={{ fontSize: '0.85rem' }} onClick={() => alert('New appointment form...')}>+ New</button>
              </div>
              <div className="doctor-appt-list">
                {DOCTOR_APPOINTMENTS.map(a => (
                  <div key={a.id} className="doctor-appt-row">
                    <div className="doctor-appt-token" style={{ background: '#ede9fe', color: '#7c3aed' }}>{a.token}</div>
                    <div className="doctor-appt-main">
                      <div className="doctor-appt-name">{a.patient} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>— {a.age}y, {a.gender}</span></div>
                      <div className="doctor-appt-sym">{a.symptoms}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7c3aed' }}>{a.time}</div>
                      <span className={'doctor-status-pill ' + (a.status === 'In Progress' ? 'status-inprogress' : a.status === 'Waiting' ? 'status-waiting' : 'status-confirmed')}>{a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="role-section-title" style={{ margin: 0 }}>Doctor Roster</h3>
                <button className="btn-role-primary" style={{ fontSize: '0.85rem' }} onClick={() => alert('Add doctor schedule...')}>+ Add Schedule</button>
              </div>
              {CENTRE_DATA.doctors.map((doc, i) => (
                <div key={i} className="doctor-appt-row" style={{ alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: doc.available ? '#d1fae5' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                    {doc.available ? '🟢' : '🔴'}
                  </div>
                  <div className="doctor-appt-main">
                    <div className="doctor-appt-name">{doc.name}</div>
                    <div className="doctor-appt-sym">{doc.dept}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: doc.available ? '#059669' : '#dc2626', fontSize: '0.9rem' }}>{doc.available ? doc.slots + ' slots' : 'Off Duty'}</div>
                    <button className="btn-role-secondary" style={{ fontSize: '0.78rem', marginTop: '0.3rem' }} onClick={() => alert('Editing schedule for ' + doc.name + '...')}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'medicines' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="role-section-title" style={{ margin: 0 }}>Medicine Inventory</h3>
                <button className="btn-role-primary" style={{ fontSize: '0.85rem' }} onClick={() => alert('Update stock form...')}>+ Update Stock</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    {['Medicine','Stock','Status','Action'].map(h => (
                      <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{m.name}</td>
                      <td style={{ padding: '0.75rem' }}>{m.stock} units</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
                          background: m.status === 'in-stock' ? '#d1fae5' : m.status === 'limited' ? '#fef3c7' : '#fee2e2',
                          color: m.status === 'in-stock' ? '#059669' : m.status === 'limited' ? '#b45309' : '#dc2626' }}>
                          {m.status === 'in-stock' ? 'In Stock' : m.status === 'limited' ? 'Limited' : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <button className="btn-role-secondary" style={{ fontSize: '0.78rem' }}
                          onClick={() => { const q = prompt('Update stock for ' + m.name + ':', m.stock); if(q && !isNaN(q)) setMedicines(prev => prev.map((med, j) => j === i ? { ...med, stock: parseInt(q), status: parseInt(q) === 0 ? 'out-of-stock' : parseInt(q) < 100 ? 'limited' : 'in-stock' } : med)); }}>
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="role-section-title" style={{ margin: 0 }}>Services Management</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Wait Time: <strong style={{ color: '#7c3aed' }}>{waitingTime} min</strong></span>
                  <button className="btn-role-secondary" style={{ fontSize: '0.78rem' }}
                    onClick={() => { const t = prompt('Update waiting time (minutes):', waitingTime); if(t && !isNaN(t)) setWaitingTime(parseInt(t)); }}>
                    Update
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {CENTRE_DATA.services.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: s.active ? '#f0fdf4' : '#fef2f2', borderRadius: '10px', border: '1px solid ' + (s.active ? '#bbf7d0' : '#fecaca') }}>
                    <span style={{ fontWeight: 600 }}>{s.active ? '✅' : '❌'} {s.name}</span>
                    <button className={'btn-role-' + (s.active ? 'secondary' : 'primary')} style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                      onClick={() => alert('Updating status for ' + s.name + '...')}>
                      {s.active ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <h3 className="role-section-title">Patient Feedback for Centre</h3>
              {CENTRE_DATA.feedback.map((fb, i) => (
                <div key={i} className="feedback-card">
                  <div className="feedback-header">
                    <div className="feedback-avatar" style={{ background: '#ede9fe', color: '#7c3aed' }}>{fb.patient.charAt(0)}</div>
                    <div><div style={{ fontWeight: 700 }}>{fb.patient}</div><div style={{ fontSize: '0.78rem', color: '#64748b' }}>{fb.date}</div></div>
                    <div className="feedback-stars">{'★'.repeat(fb.rating)}</div>
                  </div>
                  <p className="feedback-text">"{fb.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'centre' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <h3 className="role-section-title">Healthcare Centre Profile</h3>
              <div className="profile-header-card">
                <div className="profile-avatar-lg staff-avatar" style={{ fontSize: '1.75rem' }}>🏥</div>
                <div>
                  <h2>{CENTRE_DATA.name}</h2>
                  <p style={{ color: '#7c3aed', fontWeight: 600 }}>{CENTRE_DATA.type} – Government of Maharashtra</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{CENTRE_DATA.location}</p>
                </div>
              </div>
              <div className="profile-details-grid">
                {[
                  ['Staff Coordinator', currentUser.name],
                  ['Staff ID', currentUser.staffId],
                  ['Designation', currentUser.designation],
                  ['Department', currentUser.department],
                  ['Total Beds', CENTRE_DATA.totalBeds],
                  ['Available Beds', CENTRE_DATA.availableBeds],
                  ['Emergency', '108 (Ambulance)'],
                  ['Working Hours', '24x7 Emergency + 9AM-5PM OPD'],
                ].map(([label, value]) => (
                  <div key={label} className="profile-detail-row">
                    <div className="profile-detail-label">{label}</div>
                    <div className="profile-detail-value">{value}</div>
                  </div>
                ))}
              </div>
              <button className="btn-role-primary" style={{ marginTop: '1rem' }} onClick={() => alert('Centre profile update form...')}>Update Centre Info</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================================
   COMPONENT: AdminDashboard
   ========================================================================= */
function AdminDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'centres', icon: '🏥', label: 'Healthcare Centres' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'reports', icon: '📋', label: 'Reports' },
    { id: 'feedback', icon: '⭐', label: 'Feedback' },
  ];

  const gapColors = { Low: '#059669', Medium: '#d97706', High: '#dc2626', Critical: '#7c3aed' };
  const gapBg = { Low: '#d1fae5', Medium: '#fef3c7', High: '#fee2e2', Critical: '#ede9fe' };

  function BarChart({ data, color, maxVal }) {
    const max = maxVal || Math.max(...data);
    const labels = ['J','F','M','A','M','J','J','A','S','O','N','D'];
    return (
      <svg width="100%" height="80" viewBox={'0 0 ' + (data.length * 36) + ' 80'}>
        {data.map((val, i) => {
          const barH = Math.round((val / max) * 60);
          return (
            <g key={i}>
              <rect x={i * 36 + 4} y={70 - barH} width={28} height={barH} rx="4" fill={color} opacity="0.85" />
              <text x={i * 36 + 18} y={78} textAnchor="middle" fontSize="9" fill="#94a3b8">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  const apptTrend = [18200, 21400, 24800, 22100, 28400, 31200, 29800, 34500, 38200, 42800];
  const waitTrend = [34, 32, 30, 31, 28, 27, 26, 25, 25, 24];

  return (
    <div className="role-dashboard-root">
      <aside className="role-sidebar admin-sidebar">
        <div className="role-sidebar-brand">
          <div className="role-sidebar-logo" style={{ background: '#b45309' }}>G</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>SwasthyaSetu</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.7, color: '#fde68a' }}>Admin Portal</div>
          </div>
        </div>
        <div className="role-sidebar-profile">
          <div className="role-sidebar-avatar admin-avatar">{currentUser.name.charAt(0)}</div>
          <div className="role-sidebar-profile-info">
            <div className="role-sidebar-name">{currentUser.name}</div>
            <div className="role-sidebar-sub">{currentUser.designation}</div>
            <div className="role-sidebar-sub" style={{ fontSize: '0.7rem', opacity: 0.7 }}>{currentUser.department}</div>
          </div>
        </div>
        <nav className="role-sidebar-nav">
          {navItems.map(item => (
            <button key={item.id} className={'role-nav-item' + (activeTab === item.id ? ' active' : '')} onClick={() => setActiveTab(item.id)}>
              <span className="role-nav-icon">{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="role-logout-btn" onClick={onLogout}>Logout</button>
      </aside>

      <main className="role-main-content">
        <div className="role-topbar">
          <div>
            <h2 className="role-topbar-title">{(navItems.find(n => n.id === activeTab) || navItems[0]).icon} {(navItems.find(n => n.id === activeTab) || navItems[0]).label}</h2>
            <p className="role-topbar-sub">{currentUser.department} — {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
          </div>
          <div className="admin-clearance-badge">🔐 {currentUser.clearanceLevel}</div>
        </div>

        {activeTab === 'overview' && (
          <div className="role-content-pad">
            <div className="admin-stats-grid">
              {Object.entries(ADMIN_STATS).map(([key, data]) => (
                <div key={key} className="admin-stat-card">
                  <div className="admin-stat-top">
                    <div className="admin-stat-num">{typeof data.total === 'number' && data.total > 1000 ? data.total.toLocaleString('en-IN') : data.total}</div>
                    <div className={'admin-stat-badge ' + ((data.growth !== undefined ? data.growth : data.trend) >= 0 ? 'badge-up' : 'badge-down')}>
                      {(data.growth !== undefined ? data.growth : data.trend) >= 0 ? '▲' : '▼'} {Math.abs(data.growth !== undefined ? data.growth : data.trend)}%
                    </div>
                  </div>
                  <div className="admin-stat-label">{data.label}</div>
                </div>
              ))}
            </div>

            <div className="admin-charts-row">
              <div className="role-section-card" style={{ flex: 1 }}>
                <h3 className="role-section-title">Appointment Trend (Jan–Oct 2026)</h3>
                <BarChart data={apptTrend} color="#0284c7" />
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Monthly appointments</div>
              </div>
              <div className="role-section-card" style={{ flex: 1 }}>
                <h3 className="role-section-title">Avg Wait Time Trend (minutes)</h3>
                <BarChart data={waitTrend} color="#059669" maxVal={50} />
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Target: under 20 mins</div>
              </div>
            </div>

            <div className="role-section-card">
              <h3 className="role-section-title">District Healthcare Gap Analysis – Maharashtra</h3>
              <div className="admin-gap-grid">
                {DISTRICT_DATA.map(d => (
                  <div key={d.name} className="admin-gap-card" style={{ borderLeft: '4px solid ' + gapColors[d.gap], background: gapBg[d.gap] + '55' }}>
                    <div className="admin-gap-name">{d.name}</div>
                    <div className="admin-gap-stats">
                      <span>{d.centres.toLocaleString()} centres</span>
                      <span>{d.doctors.toLocaleString()} doctors</span>
                      <span>{d.satisfaction}/5 ★</span>
                      <span>{d.waitTime} min wait</span>
                    </div>
                    <div className="admin-gap-badge" style={{ background: gapColors[d.gap], color: '#fff' }}>Gap: {d.gap}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="role-quick-grid">
              <button className="role-quick-card" onClick={() => setActiveTab('analytics')}><span>📈</span><span>Analytics</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('centres')}><span>🏥</span><span>Healthcare Centres</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('users')}><span>👥</span><span>User Management</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('reports')}><span>📋</span><span>Reports</span></button>
              <button className="role-quick-card" onClick={() => setActiveTab('feedback')}><span>⭐</span><span>Feedback</span></button>
              <button className="role-quick-card" onClick={() => alert('Exporting executive summary...')}><span>📥</span><span>Export Summary</span></button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="role-content-pad">
            <div className="role-stats-grid">
              <div className="admin-stat-card"><div className="admin-stat-top"><div className="admin-stat-num">+18.6%</div><div className="admin-stat-badge badge-up">YoY</div></div><div className="admin-stat-label">Appointment Growth</div></div>
              <div className="admin-stat-card"><div className="admin-stat-top"><div className="admin-stat-num">+34.2%</div><div className="admin-stat-badge badge-up">YoY</div></div><div className="admin-stat-label">Teleconsult Growth</div></div>
              <div className="admin-stat-card"><div className="admin-stat-top"><div className="admin-stat-num">-29%</div><div className="admin-stat-badge badge-up">Reduced</div></div><div className="admin-stat-label">Wait Time Reduction</div></div>
              <div className="admin-stat-card"><div className="admin-stat-top"><div className="admin-stat-num">4.3 ★</div><div className="admin-stat-badge badge-up">+0.2</div></div><div className="admin-stat-label">Patient Satisfaction</div></div>
            </div>

            <div className="admin-charts-row">
              <div className="role-section-card" style={{ flex: 1 }}>
                <h3 className="role-section-title">Medicine Availability (%)</h3>
                {[['Essential Medicines', 98], ['Antibiotics', 91], ['Vaccines', 95], ['Emergency Drugs', 89], ['Chronic Disease', 84]].map(([name, pct]) => (
                  <div key={name} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span>{name}</span><strong>{pct}%</strong>
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: pct + '%', background: pct > 90 ? '#059669' : pct > 80 ? '#d97706' : '#dc2626', borderRadius: 4 }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="role-section-card" style={{ flex: 1 }}>
                <h3 className="role-section-title">Centre Type Distribution</h3>
                {[['PHC (Primary)', 8420, '#0284c7'],['CHC (Community)', 3840, '#059669'],['District Hospitals', 1280, '#7c3aed'],['Civil Hospitals', 740, '#b45309']].map(([name, count, color]) => (
                  <div key={name} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span>{name}</span><strong style={{ color }}>{count.toLocaleString()}</strong>
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: Math.round(count / 142.8) + '%', background: color, borderRadius: 4 }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="role-section-card">
              <h3 className="role-section-title">Healthcare Gap Analysis</h3>
              <div className="admin-gap-grid">
                {DISTRICT_DATA.map(d => (
                  <div key={d.name} className="admin-gap-card" style={{ borderLeft: '4px solid ' + gapColors[d.gap] }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="admin-gap-name">{d.name}</div>
                      <div className="admin-gap-badge" style={{ background: gapColors[d.gap], color: '#fff' }}>{d.gap}</div>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Doctor : Patient ratio</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: gapColors[d.gap] }}>1:{Math.round(d.patients / d.doctors)} patients per doctor</div>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginTop: '0.4rem' }}>
                      <div style={{ height: '100%', width: Math.min(100, Math.round(d.satisfaction * 20)) + '%', background: gapColors[d.gap] }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'centres' && (
          <div className="role-content-pad">
            <div className="role-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
              {[['PHC', 8420, '#0284c7'],['CHC', 3840, '#059669'],['District', 1280, '#7c3aed'],['Civil', 740, '#b45309']].map(([type, count, color]) => (
                <div key={type} className="admin-stat-card"><div className="admin-stat-num" style={{ color }}>{count.toLocaleString()}</div><div className="admin-stat-label">{type}</div></div>
              ))}
            </div>
            <div className="role-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="role-section-title" style={{ margin: 0 }}>District-wise Centre Overview</h3>
                <button className="btn-role-primary" style={{ fontSize: '0.85rem' }} onClick={() => alert('Exporting...')}>Export</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      {['District','Centres','Doctors','Patients','Satisfaction','Wait','Gap'].map(h => (
                        <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DISTRICT_DATA.map(d => (
                      <tr key={d.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{d.name}</td>
                        <td style={{ padding: '0.75rem' }}>{d.centres.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem' }}>{d.doctors.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem' }}>{d.patients.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem' }}>{'★'.repeat(Math.round(d.satisfaction))} {d.satisfaction}</td>
                        <td style={{ padding: '0.75rem' }}>{d.waitTime} min</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, background: gapBg[d.gap], color: gapColors[d.gap] }}>{d.gap}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="role-content-pad">
            <div className="admin-stats-grid">
              <div className="admin-stat-card"><div className="admin-stat-num">856,420</div><div className="admin-stat-label">Registered Patients</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num">14,820</div><div className="admin-stat-label">Doctors</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num">42,680</div><div className="admin-stat-label">Healthcare Workers</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num">8,420</div><div className="admin-stat-label">Admin Staff</div></div>
            </div>
            <div className="role-section-card">
              <h3 className="role-section-title">User Role Distribution</h3>
              {[
                { role: 'Patient / Citizen', count: 856420, total: 922600, color: '#0284c7', icon: '👤' },
                { role: 'Doctor', count: 14820, total: 922600, color: '#059669', icon: '👨‍⚕️' },
                { role: 'Healthcare Staff', count: 42680, total: 922600, color: '#7c3aed', icon: '🏥' },
                { role: 'Admin', count: 8680, total: 922600, color: '#b45309', icon: '🏛️' },
              ].map(u => (
                <div key={u.role} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{u.icon} {u.role}</span>
                    <span style={{ fontWeight: 700, color: u.color }}>{u.count.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: Math.round(u.count / u.total * 100) + '%', background: u.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="role-content-pad">
            <div className="role-section-card">
              <h3 className="role-section-title">Available Reports</h3>
              <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                {[
                  { title: 'Monthly Health Summary', desc: 'Appointments, doctors, medicines – Maharashtra', icon: '📊' },
                  { title: 'Doctor Availability Report', desc: 'District-wise doctor availability & duty roster', icon: '👨‍⚕️' },
                  { title: 'Medicine Stock Report', desc: 'Stock levels across all PHCs and CHCs', icon: '💊' },
                  { title: 'Patient Satisfaction Report', desc: 'Feedback and ratings from all centres', icon: '⭐' },
                  { title: 'Teleconsultation Analytics', desc: 'Remote consultation trends and coverage gaps', icon: '📱' },
                  { title: 'Healthcare Gap Analysis', desc: 'Underserved areas needing urgent intervention', icon: '🗺️' },
                  { title: 'Waiting Time Trends', desc: 'Monthly average waiting time per centre type', icon: '⏱️' },
                  { title: 'Scheme Utilization Report', desc: 'PM-JAY, JSY and other scheme beneficiaries', icon: '📜' },
                ].map((r, i) => (
                  <div key={i} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                    onClick={() => alert('Generating ' + r.title + '... (Prototype Demo)')}>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{r.icon}</div>
                    <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{r.title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>{r.desc}</div>
                    <button className="btn-role-primary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}>Generate PDF</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="role-content-pad">
            <div className="admin-stats-grid">
              <div className="admin-stat-card"><div className="admin-stat-num">4.3 ★</div><div className="admin-stat-label">Overall Rating</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num">1.24M+</div><div className="admin-stat-label">Total Feedback</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num">91.4%</div><div className="admin-stat-label">Positive</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num">8.6%</div><div className="admin-stat-label">Needs Improvement</div></div>
            </div>
            <div className="role-section-card">
              <h3 className="role-section-title">District-wise Satisfaction Scores</h3>
              {DISTRICT_DATA.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px' }}>
                  <div style={{ fontWeight: 700, minWidth: 100 }}>{d.name}</div>
                  <div style={{ flex: 1, height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: Math.round(d.satisfaction * 20) + '%', background: d.satisfaction >= 4 ? '#059669' : d.satisfaction >= 3.5 ? '#d97706' : '#dc2626' }}></div>
                  </div>
                  <div style={{ fontWeight: 800, minWidth: 40, color: d.satisfaction >= 4 ? '#059669' : d.satisfaction >= 3.5 ? '#d97706' : '#dc2626' }}>{d.satisfaction} ★</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
