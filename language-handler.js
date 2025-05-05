/**
 * Language Handler for Ayra Dashboard
 * Provides multi-language support for South Indian languages
 */

// Multi-language translation support
const translations = {
  en: {
    dashboard: "Dashboard",
    overview: "Overview of AI call agent activities and conversation history",
    analytics: "Analytics Dashboard",
    totalConversations: "Total Conversations",
    restaurantOrders: "Restaurant Orders",
    hospitalAppointments: "Hospital Appointments",
    taskSuccessRate: "Task Success Rate",
    agentPerformance: "Agent Performance",
    avgRating: "Average Rating",
    taskCompletion: "Task Completion",
    avgCallTime: "Avg Call Time",
    cityPerformance: "City-wise Performance",
    viewReport: "View Report",
    topAgents: "Top Performing Agents",
    viewAll: "View All",
    quickActions: "Quick Actions",
    downloadReport: "Download Report",
    addAgent: "Add Agent",
    settings: "Settings",
    alerts: "Alerts",
    analytics: "Analytics",
    upcomingActivities: "Upcoming Activities",
    restaurant: "Restaurant",
    hospital: "Hospital",
    searchActivities: "Search activities...",
    lastUpdated: "Last updated:",
    justNow: "Just now",
    testimonials: "Customer Testimonials",
    new: "New",
    viewAllTestimonials: "View All Testimonials",
    recentConversations: "Recent Conversations",
    search: "Search...",
    all: "All",
    loading: "Loading..."
  },
  ta: {
    dashboard: "டாஷ்போர்டு",
    overview: "AI அழைப்பு முகவர் செயல்பாடுகள் மற்றும் உரையாடல் வரலாறு பற்றிய கண்ணோட்டம்",
    analytics: "பகுப்பாய்வு டாஷ்போர்டு",
    totalConversations: "மொத்த உரையாடல்கள்",
    restaurantOrders: "உணவக ஆர்டர்கள்",
    hospitalAppointments: "மருத்துவமனை அப்பாய்ண்ட்மெண்ட்கள்",
    taskSuccessRate: "பணி வெற்றி விகிதம்",
    agentPerformance: "முகவர் செயல்திறன்",
    avgRating: "சராசரி மதிப்பீடு",
    taskCompletion: "பணி நிறைவு",
    avgCallTime: "சராசரி அழைப்பு நேரம்",
    cityPerformance: "நகரம் வாரியான செயல்திறன்",
    viewReport: "அறிக்கையைக் காண்க",
    topAgents: "சிறந்த செயல்திறன் கொண்ட முகவர்கள்",
    viewAll: "அனைத்தையும் பார்க்க",
    quickActions: "விரைவு செயல்கள்",
    downloadReport: "அறிக்கையைப் பதிவிறக்கு",
    addAgent: "முகவரை சேர்க்க",
    settings: "அமைப்புகள்",
    alerts: "எச்சரிக்கைகள்",
    analytics: "பகுப்பாய்வு",
    upcomingActivities: "வரவிருக்கும் செயல்பாடுகள்",
    restaurant: "உணவகம்",
    hospital: "மருத்துவமனை",
    searchActivities: "செயல்பாடுகளைத் தேடுங்கள்...",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது:",
    justNow: "இப்போது தான்",
    testimonials: "வாடிக்கையாளர் சான்றுகள்",
    new: "புதியது",
    viewAllTestimonials: "அனைத்து சான்றுகளையும் பார்க்க",
    recentConversations: "சமீபத்திய உரையாடல்கள்",
    search: "தேடல்...",
    all: "அனைத்தும்",
    loading: "ஏற்றுகிறது..."
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    overview: "AI కాల్ ఏజెంట్ కార్యకలాపాలు మరియు సంభాషణ చరిత్ర యొక్క అవలోకనం",
    analytics: "విశ్లేషణ డాష్‌బోర్డ్",
    totalConversations: "మొత్తం సంభాషణలు",
    restaurantOrders: "రెస్టారెంట్ ఆర్డర్లు",
    hospitalAppointments: "ఆసుపత్రి అపాయింట్‌మెంట్లు",
    taskSuccessRate: "టాస్క్ విజయ రేటు",
    agentPerformance: "ఏజెంట్ పనితీరు",
    avgRating: "సగటు రేటింగ్",
    taskCompletion: "టాస్క్ పూర్తి",
    avgCallTime: "సగటు కాల్ సమయం",
    cityPerformance: "నగరం వారీగా పనితీరు",
    viewReport: "నివేదికను చూడండి",
    topAgents: "అత్యుత్తమ పనితీరు గల ఏజెంట్లు",
    viewAll: "అన్నీ చూడండి",
    quickActions: "త్వరిత చర్యలు",
    downloadReport: "నివేదికను డౌన్‌లోడ్ చేయండి",
    addAgent: "ఏజెంట్‌ని జోడించండి",
    settings: "సెట్టింగ్‌లు",
    alerts: "హెచ్చరికలు",
    analytics: "విశ్లేషణలు",
    upcomingActivities: "రాబోయే కార్యకలాపాలు",
    restaurant: "రెస్టారెంట్",
    hospital: "ఆసుపత్రి",
    searchActivities: "కార్యకలాపాలను శోధించండి...",
    lastUpdated: "చివరిగా నవీకరించబడింది:",
    justNow: "ఇప్పుడే",
    testimonials: "వినియోగదారుల టెస్టిమోనియల్స్",
    new: "కొత్త",
    viewAllTestimonials: "అన్ని టెస్టిమోనియల్స్ చూడండి",
    recentConversations: "ఇటీవలి సంభాషణలు",
    search: "శోధన...",
    all: "అన్నీ",
    loading: "లోడ్ అవుతోంది..."
  },
  ml: {
    dashboard: "ഡാഷ്ബോർഡ്",
    overview: "AI കോൾ ഏജന്റ് പ്രവർത്തനങ്ങളുടെയും സംഭാഷണ ചരിത്രത്തിന്റെയും അവലോകനം",
    analytics: "അനലിറ്റിക്സ് ഡാഷ്ബോർഡ്",
    totalConversations: "ആകെ സംഭാഷണങ്ങൾ",
    restaurantOrders: "റെസ്റ്റോറന്റ് ഓർഡറുകൾ",
    hospitalAppointments: "ആശുപത്രി അപ്പോയിന്റ്മെന്റുകൾ",
    taskSuccessRate: "ടാസ്ക് വിജയ നിരക്ക്",
    agentPerformance: "ഏജന്റ് പ്രകടനം",
    avgRating: "ശരാശരി റേറ്റിംഗ്",
    taskCompletion: "ടാസ്ക് പൂർത്തീകരണം",
    avgCallTime: "ശരാശരി കോൾ സമയം",
    cityPerformance: "നഗരം അടിസ്ഥാനമാക്കിയുള്ള പ്രകടനം",
    viewReport: "റിപ്പോർട്ട് കാണുക",
    topAgents: "മികച്ച പ്രകടനം കാഴ്ചവയ്ക്കുന്ന ഏജന്റുമാർ",
    viewAll: "എല്ലാം കാണുക",
    quickActions: "ക്വിക്ക് ആക്ഷനുകൾ",
    downloadReport: "റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക",
    addAgent: "ഏജന്റിനെ ചേർക്കുക",
    settings: "ക്രമീകരണങ്ങൾ",
    alerts: "അലേർട്ടുകൾ",
    analytics: "അനലിറ്റിക്സ്",
    upcomingActivities: "വരാനിരിക്കുന്ന പ്രവർത്തനങ്ങൾ",
    restaurant: "റെസ്റ്റോറന്റ്",
    hospital: "ആശുപത്രി",
    searchActivities: "പ്രവർത്തനങ്ങൾ തിരയുക...",
    lastUpdated: "അവസാനം അപ്ഡേറ്റ് ചെയ്തത്:",
    justNow: "ഇപ്പോൾ തന്നെ",
    testimonials: "ഉപഭോക്താക്കളുടെ സാക്ഷ്യപത്രങ്ങൾ",
    new: "പുതിയത്",
    viewAllTestimonials: "എല്ലാ സാക്ഷ്യപത്രങ്ങളും കാണുക",
    recentConversations: "സമീപകാല സംഭാഷണങ്ങൾ",
    search: "തിരയുക...",
    all: "എല്ലാം",
    loading: "ലോഡിംഗ്..."
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
    overview: "AI ಕರೆ ಏಜೆಂಟ್ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಸಂಭಾಷಣೆ ಇತಿಹಾಸದ ಅವಲೋಕನ",
    analytics: "ವಿಶ್ಲೇಷಣಾ ಡ್ಯಾಶ್ಬೋರ್ಡ್",
    totalConversations: "ಒಟ್ಟು ಸಂಭಾಷಣೆಗಳು",
    restaurantOrders: "ರೆಸ್ಟೋರೆಂಟ್ ಆದೇಶಗಳು",
    hospitalAppointments: "ಆಸ್ಪತ್ರೆ ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳು",
    taskSuccessRate: "ಕಾರ್ಯ ಯಶಸ್ಸಿನ ದರ",
    agentPerformance: "ಏಜೆಂಟ್ ಕಾರ್ಯಕ್ಷಮತೆ",
    avgRating: "ಸರಾಸರಿ ರೇಟಿಂಗ್",
    taskCompletion: "ಕಾರ್ಯ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ",
    avgCallTime: "ಸರಾಸರಿ ಕರೆ ಸಮಯ",
    cityPerformance: "ನಗರ-ವಾರು ಕಾರ್ಯಕ್ಷಮತೆ",
    viewReport: "ವರದಿ ನೋಡಿ",
    topAgents: "ಅತ್ಯುತ್ತಮ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಏಜೆಂಟರು",
    viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    downloadReport: "ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    addAgent: "ಏಜೆಂಟನ್ನು ಸೇರಿಸಿ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    alerts: "ಎಚ್ಚರಿಕೆಗಳು",
    analytics: "ವಿಶ್ಲೇಷಣೆಗಳು",
    upcomingActivities: "ಮುಂಬರುವ ಚಟುವಟಿಕೆಗಳು",
    restaurant: "ರೆಸ್ಟೋರೆಂಟ್",
    hospital: "ಆಸ್ಪತ್ರೆ",
    searchActivities: "ಚಟುವಟಿಕೆಗಳನ್ನು ಹುಡುಕಿ...",
    lastUpdated: "ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ:",
    justNow: "ಈಗಷ್ಟೇ",
    testimonials: "ಗ್ರಾಹಕರ ಪ್ರಶಸ್ತಿಪತ್ರಗಳು",
    new: "ಹೊಸದು",
    viewAllTestimonials: "ಎಲ್ಲಾ ಪ್ರಶಸ್ತಿಪತ್ರಗಳನ್ನು ನೋಡಿ",
    recentConversations: "ಇತ್ತೀಚಿನ ಸಂಭಾಷಣೆಗಳು",
    search: "ಹುಡುಕಿ...",
    all: "ಎಲ್ಲಾ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
  },
  hi: {
    dashboard: "डैशबोर्ड",
    overview: "AI कॉल एजेंट गतिविधियों और बातचीत इतिहास का अवलोकन",
    analytics: "एनालिटिक्स डैशबोर्ड",
    totalConversations: "कुल वार्तालाप",
    restaurantOrders: "रेस्तरां ऑर्डर",
    hospitalAppointments: "अस्पताल अपॉइंटमेंट",
    taskSuccessRate: "कार्य सफलता दर",
    agentPerformance: "एजेंट प्रदर्शन",
    avgRating: "औसत रेटिंग",
    taskCompletion: "कार्य पूर्णता",
    avgCallTime: "औसत कॉल समय",
    cityPerformance: "शहर-वार प्रदर्शन",
    viewReport: "रिपोर्ट देखें",
    topAgents: "शीर्ष प्रदर्शन करने वाले एजेंट",
    viewAll: "सभी देखें",
    quickActions: "त्वरित कार्य",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    addAgent: "एजेंट जोड़ें",
    settings: "सेटिंग्स",
    alerts: "अलर्ट",
    analytics: "एनालिटिक्स",
    upcomingActivities: "आगामी गतिविधियां",
    restaurant: "रेस्तरां",
    hospital: "अस्पताल",
    searchActivities: "गतिविधियां खोजें...",
    lastUpdated: "आखरी अपडेट:",
    justNow: "अभी अभी",
    testimonials: "ग्राहक प्रशंसापत्र",
    new: "नया",
    viewAllTestimonials: "सभी प्रशंसापत्र देखें",
    recentConversations: "हाल की बातचीत",
    search: "खोज...",
    all: "सभी",
    loading: "लोड हो रहा है..."
  }
};

// Function to translate the UI based on selected language
function translateUI(language) {
  if (!translations[language]) {
    console.error(`Translation not available for language: ${language}`);
    return;
  }
  
  const translation = translations[language];
  
  // Translate static text elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translation[key]) {
      element.textContent = translation[key];
    }
  });
  
  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translation[key]) {
      element.setAttribute('placeholder', translation[key]);
    }
  });
  
  // Store language preference
  localStorage.setItem('preferredLanguage', language);
  
  // Update font for specific languages if needed
  updateFontForLanguage(language);
  
  // Show notification
  showNotification('Language Changed', `Interface language changed to ${document.getElementById('language-select').options[document.getElementById('language-select').selectedIndex].text}`, 'info');
}

// Update font based on language for better readability
function updateFontForLanguage(language) {
  const body = document.body;
  
  // Remove all language-specific font classes
  body.classList.remove('font-tamil', 'font-telugu', 'font-malayalam', 'font-kannada', 'font-hindi');
  
  // Add language-specific font class
  switch(language) {
    case 'ta':
      body.classList.add('font-tamil');
      break;
    case 'te':
      body.classList.add('font-telugu');
      break;
    case 'ml':
      body.classList.add('font-malayalam');
      break;
    case 'kn':
      body.classList.add('font-kannada');
      break;
    case 'hi':
      body.classList.add('font-hindi');
      break;
  }
}

// Add data-i18n attributes to elements that need translation
function initializeI18nAttributes() {
  // Header elements
  document.querySelector('h1').setAttribute('data-i18n', 'dashboard');
  document.querySelector('.text-muted').setAttribute('data-i18n', 'overview');
  
  // Analytics section
  document.querySelector('.dashboard-stats h5').setAttribute('data-i18n', 'analytics');
  document.querySelectorAll('.stat-card p')[0].setAttribute('data-i18n', 'totalConversations');
  document.querySelectorAll('.stat-card p')[1].setAttribute('data-i18n', 'restaurantOrders');
  document.querySelectorAll('.stat-card p')[2].setAttribute('data-i18n', 'hospitalAppointments');
  document.querySelectorAll('.stat-card p')[3].setAttribute('data-i18n', 'taskSuccessRate');
  
  // Agent performance
  document.querySelector('h6').setAttribute('data-i18n', 'agentPerformance');
  document.querySelectorAll('.text-muted')[1].setAttribute('data-i18n', 'avgRating');
  document.querySelectorAll('.text-muted')[2].setAttribute('data-i18n', 'taskCompletion');
  document.querySelectorAll('.text-muted')[3].setAttribute('data-i18n', 'avgCallTime');
  
  // City performance
  document.querySelector('.widget-title span').setAttribute('data-i18n', 'cityPerformance');
  document.querySelector('.widget-title a').setAttribute('data-i18n', 'viewReport');
  
  // Top agents
  document.querySelectorAll('.widget-title span')[1].setAttribute('data-i18n', 'topAgents');
  document.querySelectorAll('.widget-title a')[1].setAttribute('data-i18n', 'viewAll');
  
  // Quick actions
  document.querySelectorAll('.widget-title span')[2].setAttribute('data-i18n', 'quickActions');
  document.querySelector('.quick-action-btn:nth-child(1)').innerHTML = '<i class="fas fa-download me-1"></i> <span data-i18n="downloadReport">Download Report</span>';
  document.querySelector('.quick-action-btn:nth-child(2)').innerHTML = '<i class="fas fa-user-plus me-1"></i> <span data-i18n="addAgent">Add Agent</span>';
  document.querySelector('.quick-action-btn:nth-child(3)').innerHTML = '<i class="fas fa-cog me-1"></i> <span data-i18n="settings">Settings</span>';
  document.querySelector('.quick-action-btn:nth-child(4)').innerHTML = '<i class="fas fa-bell me-1"></i> <span data-i18n="alerts">Alerts</span>';
  document.querySelector('.quick-action-btn:nth-child(5)').innerHTML = '<i class="fas fa-chart-line me-1"></i> <span data-i18n="analytics">Analytics</span>';
  
  // Upcoming activities
  document.querySelector('.card-header h5').setAttribute('data-i18n', 'upcomingActivities');
  document.querySelector('#restaurant-activities-tab').setAttribute('data-i18n', 'restaurant');
  document.querySelector('#hospital-activities-tab').setAttribute('data-i18n', 'hospital');
  document.querySelector('#activity-search').setAttribute('data-i18n-placeholder', 'searchActivities');
  document.querySelector('.text-muted small').innerHTML = '<span data-i18n="lastUpdated">Last updated:</span> <span id="last-updated-time" data-i18n="justNow">Just now</span>';
  
  // Customer testimonials
  document.querySelectorAll('.card-header h5')[1].setAttribute('data-i18n', 'testimonials');
  document.querySelector('.badge.bg-success').setAttribute('data-i18n', 'new');
  document.querySelectorAll('.btn.btn-sm.btn-outline-primary')[0].innerHTML = '<span data-i18n="viewAllTestimonials">View All Testimonials</span> <i class="fas fa-chevron-right ms-1"></i>';
  
  // Recent conversations
  document.querySelectorAll('.card-header h5')[2].setAttribute('data-i18n', 'recentConversations');
  document.querySelector('#conversation-search').setAttribute('data-i18n-placeholder', 'search');
  document.querySelector('#all-tab').setAttribute('data-i18n', 'all');
  document.querySelector('#restaurant-tab').setAttribute('data-i18n', 'restaurant');
  document.querySelector('#hospital-tab').setAttribute('data-i18n', 'hospital');
  document.querySelector('.loading-indicator p').setAttribute('data-i18n', 'loading');
  document.querySelectorAll('.btn.btn-sm.btn-outline-primary')[1].innerHTML = '<span data-i18n="viewAll">View All</span> <i class="fas fa-chevron-right ms-1"></i>';
}

// Format currency values with Indian notation (e.g., 1,00,000)
function formatIndianCurrency(amount) {
  const num = parseInt(amount);
  if (isNaN(num)) return "₹0";
  
  const rupeeSymbol = "₹";
  let result = num.toString();
  
  // Add commas for thousands, lakhs, crores
  const lastThree = result.substring(result.length - 3);
  const otherNums = result.substring(0, result.length - 3);
  if (otherNums !== '') {
    result = otherNums.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }
  
  return rupeeSymbol + result;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Get saved language preference or default to English
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  
  // Setup language selector
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.value = savedLanguage;
    
    // Apply translation on page load
    initializeI18nAttributes();
    translateUI(savedLanguage);
    
    // Set up change handler
    languageSelect.addEventListener('change', function() {
      const selectedLanguage = this.value;
      translateUI(selectedLanguage);
    });
  }
  
  // Notification bell handler
  const notificationBell = document.querySelector('.notification-bell');
  if (notificationBell) {
    notificationBell.addEventListener('click', function() {
      showNotification('Notifications', 'You have 3 new notifications to review', 'info');
    });
  }
}); 