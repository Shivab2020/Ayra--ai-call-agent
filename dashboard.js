/**
 * Dashboard.js
 * Handles loading and updating dashboard data from the database
 */

// Add a custom event for database operations
const dbEvents = new EventTarget();

// Mock database functions (since we don't have actual backend connection)
const AyraDataStore = {
  // Store for data
  _store: {
    conversations: [],
    reservations: [],
    orders: [],
    appointments: [],
    upcomingActivities: [],
    userProfile: {
      name: 'Arjun Reddy',
      email: 'arjun.r@example.com',
      phone: '+91 9876543210',
      role: 'admin'
    }
  },
  
  // Initialize with sample data
  init() {
    // Load from localStorage if available
    const storedData = localStorage.getItem('ayraData');
    if (storedData) {
      try {
        this._store = JSON.parse(storedData);
        console.log('Data loaded from localStorage');
      } catch (e) {
        console.error('Error loading data:', e);
        this._generateSampleData();
      }
    } else {
      this._generateSampleData();
    }
    
    // Save initial data
    this._saveData();
    
    console.log('AyraDataStore initialized with data');
    return this;
  },
  
  // Save data to localStorage
  _saveData() {
    try {
      localStorage.setItem('ayraData', JSON.stringify(this._store));
      localStorage.setItem('dashboardUpdate', new Date().toISOString());
      
      // Dispatch event for data update
      const event = new CustomEvent('data-updated');
      dbEvents.dispatchEvent(event);
      
      return true;
    } catch (e) {
      console.error('Error saving data:', e);
      return false;
    }
  },
  
  // Generate sample data
  _generateSampleData() {
    // Sample conversations
    this._store.conversations = [
      {
        id: 'conv1',
        summary: 'Masala Dosa Order',
        type: 'restaurant',
        agent_type: 'Restaurant',
        status: 'completed',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user_name: 'Rajesh Nair',
        data: JSON.stringify({
          conversation: [
            {role: 'assistant', content: 'Hello, welcome to South Indian Delights! How can I help you today?', timestamp: new Date(Date.now() - 3900000).toISOString()},
            {role: 'user', content: 'I would like to order some masala dosa.', timestamp: new Date(Date.now() - 3800000).toISOString()},
            {role: 'assistant', content: 'Great choice! How many masala dosas would you like to order?', timestamp: new Date(Date.now() - 3700000).toISOString()},
            {role: 'user', content: 'Two please, and also one sambar vada.', timestamp: new Date(Date.now() - 3600000).toISOString()}
          ],
          extractedData: {
            orderType: 'delivery',
            items: [
              {name: 'Masala Dosa', quantity: 2, price: 120},
              {name: 'Sambar Vada', quantity: 1, price: 60}
            ],
            customerName: 'Rajesh Nair',
            customerPhone: '+91 9876543210',
            deliveryAddress: '123 MG Road, Bengaluru'
          }
        })
      },
      {
        id: 'conv2',
        summary: 'Cardiology Appointment',
        type: 'hospital',
        agent_type: 'Hospital',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        user_name: 'Meena Krishnamurthy',
        data: JSON.stringify({
          conversation: [
            {role: 'assistant', content: 'Hello, thank you for calling City Hospital. How may I assist you today?', timestamp: new Date(Date.now() - 86700000).toISOString()},
            {role: 'user', content: 'I need to schedule an appointment with a cardiologist.', timestamp: new Date(Date.now() - 86600000).toISOString()},
            {role: 'assistant', content: 'I can help you with that. May I know your name please?', timestamp: new Date(Date.now() - 86500000).toISOString()},
            {role: 'user', content: 'My name is Meena Krishnamurthy.', timestamp: new Date(Date.now() - 86400000).toISOString()}
          ],
          extractedData: {
            appointmentType: 'cardiology',
            patientName: 'Meena Krishnamurthy',
            patientPhone: '+91 9876543211',
            preferredDate: '2023-06-15',
            preferredTime: '10:00 AM',
            symptoms: 'Chest pain and fatigue'
          }
        })
      },
      {
        id: 'conv3',
        summary: 'Dinner Reservation',
        type: 'restaurant',
        agent_type: 'Restaurant',
        status: 'completed',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        user_name: 'Aditya Pillai',
        data: JSON.stringify({
          conversation: [
            {role: 'assistant', content: 'Good evening, thank you for calling Spice Garden. How can I assist you?', timestamp: new Date(Date.now() - 173100000).toISOString()},
            {role: 'user', content: 'I would like to make a reservation for dinner tomorrow.', timestamp: new Date(Date.now() - 173000000).toISOString()},
            {role: 'assistant', content: 'I would be happy to help with that. For how many people would you like to reserve a table?', timestamp: new Date(Date.now() - 172900000).toISOString()},
            {role: 'user', content: 'For 4 people.', timestamp: new Date(Date.now() - 172800000).toISOString()}
          ],
          extractedData: {
            reservationType: 'dinner',
            customerName: 'Aditya Pillai',
            customerPhone: '+91 9876543212',
            reservationDate: '2023-06-14',
            reservationTime: '8:00 PM',
            partySize: 4,
            specialRequests: 'Window seating preferred'
          }
        })
      }
    ];
    
    // Sort conversations by timestamp, most recent first
    this._store.conversations.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Sample upcoming activities
    this._store.upcomingActivities = [
      {
        id: 'act1',
        type: 'reservation',
        category: 'restaurant',
        name: 'Arjun Reddy',
        phone: '+91 9876543213',
        date: new Date(Date.now() + 3600000).toISOString(),
        time: '7:30 PM',
        guests: 4,
        status: 'confirmed',
        special_requests: 'Birthday celebration'
      },
      {
        id: 'act2',
        type: 'order',
        category: 'restaurant',
        name: 'Kavitha Suresh',
        phone: '+91 9876543214',
        delivery_time: new Date(Date.now() + 1800000).toISOString(),
        address: '456 Hosur Road, Bengaluru',
        total: 750,
        items: JSON.stringify([
          {name: 'Biryani', quantity: 2, price: 300},
          {name: 'Butter Naan', quantity: 3, price: 50},
          {name: 'Paneer Tikka', quantity: 1, price: 200}
        ]),
        status: 'preparing'
      },
      {
        id: 'act3',
        type: 'appointment',
        category: 'hospital',
        patient_name: 'Ananya Krishnan',
        phone: '+91 9876543215',
        date: new Date(Date.now() + 7200000).toISOString(),
        time: '3:30 PM',
        doctor: 'Rajan',
        department: 'Orthopedics',
        status: 'scheduled',
        reason: 'Knee pain follow-up'
      },
      {
        id: 'act4',
        type: 'reminder',
        category: 'hospital',
        patient_name: 'Ravi Menon',
        phone: '+91 9876543216',
        date: new Date(Date.now() + 86400000).toISOString(),
        time: '10:00 AM',
        reminder_type: 'follow-up',
        department: 'Cardiology',
        status: 'pending',
        message: 'Reminder for your follow-up appointment tomorrow at 10:00 AM with Dr. Sharma'
      },
      {
        id: 'act5',
        type: 'reservation',
        category: 'restaurant',
        name: 'Vijay Anand',
        phone: '+91 9876543217',
        date: new Date(Date.now() + 129600000).toISOString(),
        time: '11:00 AM',
        guests: 6,
        status: 'confirmed',
        special_requests: 'South Indian brunch'
      }
    ];
    
    // Sort upcoming activities by date
    this._store.upcomingActivities.sort((a, b) => {
      const dateA = new Date(a.date || a.datetime || a.delivery_time);
      const dateB = new Date(b.date || b.datetime || b.delivery_time);
      return dateA - dateB;
    });
    
    // Sample reservations and orders
    this._store.reservations = this._store.upcomingActivities.filter(a => a.type === 'reservation');
    this._store.orders = this._store.upcomingActivities.filter(a => a.type === 'order');
    this._store.appointments = this._store.upcomingActivities.filter(a => a.type === 'appointment');
  },
  
  // CRUD operations for conversations
  getConversations(type) {
    let conversations;
    
    if (type) {
      conversations = this._store.conversations.filter(c => c.type === type);
    } else {
      conversations = [...this._store.conversations];
    }
    
    // Sort conversations by timestamp, most recent first
    return conversations.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  },
  
  addConversation(conversation) {
    if (!conversation.id) conversation.id = 'conv' + Date.now();
    if (!conversation.timestamp) conversation.timestamp = new Date().toISOString();
    
    this._store.conversations.unshift(conversation); // Add to beginning of array
    this._saveData();
    return conversation;
  },
  
  // CRUD operations for upcoming activities
  getUpcomingActivities(limit) {
    const activities = this._store.upcomingActivities;
    return limit ? activities.slice(0, limit) : activities;
  },
  
  addActivity(activity) {
    if (!activity.id) activity.id = 'act' + Date.now();
    
    this._store.upcomingActivities.push(activity);
    
    // Also add to appropriate category
    if (activity.type === 'reservation') this._store.reservations.push(activity);
    if (activity.type === 'order') this._store.orders.push(activity);
    if (activity.type === 'appointment') this._store.appointments.push(activity);
    
    this._saveData();
    return activity;
  },
  
  // Get reservations, orders and appointments
  getReservations() {
    return this._store.reservations;
  },
  
  getOrders() {
    return this._store.orders;
  },
  
  getAppointments() {
    return this._store.appointments;
  },
  
  // User profile operations
  getUserProfile() {
    return this._store.userProfile;
  },
  
  updateUserProfile(profile) {
    this._store.userProfile = {...this._store.userProfile, ...profile};
    this._saveData();
    // Return a copy to avoid direct mutation
    return {...this._store.userProfile};
  }
};

// Initialize data store
if (typeof window !== 'undefined') {
  window.AyraDataStore = AyraDataStore.init();
}

document.addEventListener('DOMContentLoaded', function() {
  // Load data when page loads
  loadDashboardData();
  
  // Set up tab listeners
  const tabs = document.querySelectorAll('#conversationTabs button');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Clear current data
      clearConversations();
      
      // Load data based on tab
      const tabTarget = this.getAttribute('data-bs-target').replace('#', '');
      if (tabTarget === 'all') {
        loadConversations();
      } else {
        loadConversations(tabTarget);
      }
    });
  });
  
  // Set up filter button
  const filterButton = document.querySelector('button.btn-primary');
  if (filterButton) {
    filterButton.addEventListener('click', function() {
      loadDashboardData();
    });
  }

  // Set up real-time update checking
  setupRealtimeUpdates();

  // Set up error handling
  setupErrorHandling();

  // Add the new call completion handler
  setupCallCompletionHandler();
  
  // Quick action buttons functionality
  setupQuickActionButtons();
  
  // Profile and settings dropdown functionality
  setupUserMenuFunctionality();
});

/**
 * Set up real-time updates
 */
function setupRealtimeUpdates() {
  // Store last update timestamp
  let lastProcessedUpdate = localStorage.getItem('lastProcessedUpdate') || '';
  
  // Use a more efficient polling mechanism with shorter interval for better real-time feel
  const checkForUpdates = () => {
    try {
      const currentUpdate = localStorage.getItem('dashboardUpdate');
      
      if (currentUpdate && currentUpdate !== lastProcessedUpdate) {
        console.log('Dashboard update detected at:', new Date().toLocaleTimeString());
        
        // Always do a full refresh for better consistency
        loadDashboardData();
        
        // Update the last processed timestamp
        lastProcessedUpdate = currentUpdate;
        localStorage.setItem('lastProcessedUpdate', lastProcessedUpdate);
      }
    } catch (e) {
      console.error('Error checking for dashboard updates:', e);
    }
    
    // Schedule next check with shorter interval (1 second instead of 2)
    setTimeout(checkForUpdates, 1000);
  };
  
  // Start checking for updates
  checkForUpdates();
  
  // Also refresh data periodically regardless of update notifications
  // This ensures data consistency even if update events are missed
  setInterval(() => {
    console.log('Performing scheduled dashboard refresh');
    loadDashboardData();
  }, 30000); // Full refresh every 30 seconds (reduced from 60)
  
  // Add event listener for page visibility to refresh when user returns to tab
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      console.log('Tab is now visible, refreshing data');
      loadDashboardData();
    }
  });
}

/**
 * Load all dashboard data
 */
async function loadDashboardData() {
  try {
    // Load conversations
    await loadConversations();
    
    // Load upcoming activities
    await loadUpcomingActivities();
    
    // Update stats
    await updateStats();
    
    // Clear any remaining loading indicators
    clearAllLoadingIndicators();
    
    console.log('Dashboard data refreshed at', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

/**
 * Load conversations based on type filter
 * @param {string} type - Optional filter by type (restaurant, hospital)
 */
async function loadConversations(type) {
  try {
    let conversations = await AyraDataStore.getConversations(type);
    
    // Sort conversations by timestamp, most recent first
    conversations.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    displayConversations(conversations, type || 'all');
    
    // Cache the conversations for fallback
    if (type === undefined || type === 'all') {
      localStorage.setItem('cachedConversations', JSON.stringify(conversations));
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
    fallbackToLocalData();
  }
}

/**
 * Load upcoming activities
 */
async function loadUpcomingActivities() {
  try {
    // Show loading indicators
    if (document.getElementById('restaurant-activities-loading')) {
      document.getElementById('restaurant-activities-loading').style.display = 'block';
    }
    if (document.getElementById('hospital-activities-loading')) {
      document.getElementById('hospital-activities-loading').style.display = 'block';
    }
    if (document.getElementById('restaurant-activities-full')) {
      document.getElementById('restaurant-activities-full').style.display = 'none';
    }
    if (document.getElementById('hospital-activities-full')) {
      document.getElementById('hospital-activities-full').style.display = 'none';
    }
    
    const activities = await AyraDataStore.getUpcomingActivities(8);
    displayUpcomingActivities(activities);
    
    // Cache activities for fallback
    localStorage.setItem('cachedActivities', JSON.stringify(activities));
    
    // Hide loading indicators and show content
    if (document.getElementById('restaurant-activities-loading')) {
      document.getElementById('restaurant-activities-loading').style.display = 'none';
    }
    if (document.getElementById('hospital-activities-loading')) {
      document.getElementById('hospital-activities-loading').style.display = 'none';
    }
    if (document.getElementById('restaurant-activities-full')) {
      document.getElementById('restaurant-activities-full').style.display = 'block';
    }
    if (document.getElementById('hospital-activities-full')) {
      document.getElementById('hospital-activities-full').style.display = 'block';
    }
    
    // Update last updated timestamp
    document.getElementById('last-updated-time').textContent = 'Just now';
  } catch (error) {
    console.error('Error loading activities:', error);
    clearAllLoadingIndicators(); // Ensure loading indicators are cleared even on error
    fallbackToLocalData();
  }
}

/**
 * Update dashboard statistics
 */
async function updateStats() {
  try {
    // Function to get view mode (day, week, month)
    const getViewMode = () => {
      const activeButton = document.querySelector('.btn-group .btn-outline-primary.active');
      if (!activeButton) return 'day'; // default
      const text = activeButton.textContent.trim().toLowerCase();
      return text;
    };
    
    // Get counts from API
    Promise.all([
      AyraDataStore.getConversations(),
      AyraDataStore.getReservations(),
      AyraDataStore.getOrders(),
      AyraDataStore.getAppointments()
    ]).then(([conversations, reservations, orders, appointments]) => {
      // Get current view mode
      const viewMode = getViewMode();
      
      // Apply multipliers based on view mode
      let multiplier = 1;
      if (viewMode === 'week') {
        multiplier = 7;
      } else if (viewMode === 'month') {
        multiplier = 30;
      }
      
      // Update stats in UI with appropriate multipliers
      const totalConversationsEl = document.querySelector('.stat-card:nth-child(1) h3');
      const restaurantOrdersEl = document.querySelector('.stat-card:nth-child(2) h3');
      const hospitalAppointmentsEl = document.querySelector('.stat-card:nth-child(3) h3');
      const successRateEl = document.querySelector('.stat-card:nth-child(4) h3');
      
      if (totalConversationsEl) {
        const count = Math.round(conversations.length * multiplier);
        totalConversationsEl.textContent = count;
      }
      
      if (restaurantOrdersEl) {
        const count = Math.round((reservations.length + orders.length) * multiplier);
        // Format as money if it's larger than 100000 (1 lakh)
        if (count > 100000) {
          restaurantOrdersEl.textContent = '₹' + (count / 100000).toFixed(1) + 'L';
        } else {
          restaurantOrdersEl.textContent = '₹' + (count/1000).toFixed(1) + 'K';
        }
      }
      
      if (hospitalAppointmentsEl) {
        const count = Math.round(appointments.length * multiplier);
        hospitalAppointmentsEl.textContent = count;
      }
      
      // Calculate success rate based on completed conversations
      if (successRateEl && conversations.length > 0) {
        const completedCount = conversations.filter(c => c.status === 'completed').length;
        const successRate = Math.round((completedCount / conversations.length) * 100);
        successRateEl.textContent = successRate + '%';
      }
    });
    
    // Setup click handlers for view buttons if not already set
    const viewButtons = document.querySelectorAll('.btn-group .btn-outline-primary');
    viewButtons.forEach(button => {
      if (!button.hasClickHandler) {
        button.hasClickHandler = true;
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          viewButtons.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          // Update stats
          updateStats();
        });
      }
    });
    
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

/**
 * Display conversations in the UI
 * @param {Array} conversations - Array of conversation objects
 * @param {string} tabId - Tab ID to display in
 */
function displayConversations(conversations, tabId) {
  const tabContent = document.getElementById(tabId);
  if (!tabContent) return;
  
  // Clear existing content
  tabContent.innerHTML = '';
  
  // If no conversations, show a message
  if (!conversations || conversations.length === 0) {
    tabContent.innerHTML = '<div class="alert alert-info">No conversation history found.</div>';
    return;
  }
  
  // Add each conversation
  conversations.forEach(convo => {
    // Create card element
    const card = document.createElement('div');
    card.className = 'conversation-card';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'conversation-header';
    
    // Get conversation data - handle data better to ensure successful parsing
    let data;
    try {
      data = typeof convo.data === 'string' ? JSON.parse(convo.data) : convo.data;
    } catch (e) {
      console.warn('Error parsing conversation data:', e);
      data = {}; // Set to empty object if parsing fails
    }
    
    const summary = convo.summary || 'Conversation';
    const type = convo.type || 'general';
    const agentType = convo.agent_type || '';
    const status = convo.status || 'completed';
    const timestamp = new Date(convo.timestamp).toLocaleString();
    const userName = convo.user_name || 'User';
    
    // Calculate call duration if possible - improved algorithm
    let duration = '';
    if (data && data.conversation && data.conversation.length > 0) {
      // Try to calculate call duration from timestamps in messages
      try {
        // Filter messages that have valid timestamps
        const messagesWithTime = data.conversation.filter(m => {
          const timeStr = m.time || m.timestamp;
          if (!timeStr) return false;
          
          try {
            const time = new Date(timeStr);
            return !isNaN(time.getTime());
          } catch (e) {
            return false;
          }
        });
        
        if (messagesWithTime.length >= 2) {
          const firstMsg = messagesWithTime[0];
          const lastMsg = messagesWithTime[messagesWithTime.length - 1];
          
          const firstTime = new Date(firstMsg.time || firstMsg.timestamp);
          const lastTime = new Date(lastMsg.time || lastMsg.timestamp);
          
          const durationMs = lastTime - firstTime;
          if (durationMs > 0) {
            const minutes = Math.floor(durationMs / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          }
        }
      } catch (e) {
        console.warn('Error calculating call duration:', e);
      }
    }
    
    // Set header content
    header.innerHTML = `
      <h5>
        ${summary}
        <span class="conversation-tag tag-${type}">${agentType}</span>
        ${type === 'restaurant' ? '<span class="conversation-tag tag-reservation">Reservation</span>' : ''}
        ${type === 'hospital' ? '<span class="conversation-tag tag-appointment">Appointment</span>' : ''}
      </h5>
      <div class="conversation-meta">
        <span><i class="far fa-clock me-1"></i> ${timestamp}</span>
        <span><i class="far fa-user me-1"></i> ${userName}</span>
        ${duration ? `<span><i class="fas fa-hourglass-half me-1"></i> ${duration}</span>` : ''}
      </div>
    `;
    
    // Create content div
    const content = document.createElement('div');
    content.className = 'conversation-content';
    
    // Show a compact preview initially
    if (data && data.conversation && Array.isArray(data.conversation)) {
      // Show abbreviated transcript (just first and last message)
      const messages = data.conversation.filter(msg => msg && msg.content);
      
      if (messages.length > 0) {
        // Show only the first message from assistant
        const firstAssistantMsg = messages.find(msg => msg.role === 'assistant');
        if (firstAssistantMsg) {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'message assistant-message preview-message';
          
          const contentDiv = document.createElement('div');
          contentDiv.className = 'message-content';
          
          const messageText = document.createElement('p');
          
          // Truncate content for preview
          let previewContent = '';
          if (typeof firstAssistantMsg.content === 'string') {
            previewContent = firstAssistantMsg.content.trim();
          } else if (firstAssistantMsg.content && typeof firstAssistantMsg.content === 'object' && firstAssistantMsg.content.text) {
            previewContent = firstAssistantMsg.content.text.trim();
          } else {
            previewContent = JSON.stringify(firstAssistantMsg.content);
          }
          
          // Limit preview to 150 characters
          if (previewContent.length > 150) {
            previewContent = previewContent.substring(0, 150) + '...';
          }
          
          messageText.textContent = previewContent;
          contentDiv.appendChild(messageText);
          messageDiv.appendChild(contentDiv);
          content.appendChild(messageDiv);
        }
        
        // Add message count
        const messageCountDiv = document.createElement('div');
        messageCountDiv.className = 'message-count text-center mt-2';
        messageCountDiv.innerHTML = `
          <span class="badge bg-light text-dark">
            <i class="fas fa-comment-dots me-1"></i> ${messages.length} messages in total
          </span>
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary view-conversation-btn" data-id="${convo.id}">
              <i class="fas fa-eye me-1"></i> View Full Transcript
            </button>
          </div>
        `;
        content.appendChild(messageCountDiv);
      } else {
        content.innerHTML = '<p class="text-muted">No message content available</p>';
      }
    } else if (data && data.extractedData) {
      // Show extracted data summary
      const extractedDiv = document.createElement('div');
      extractedDiv.className = 'extracted-data-preview';
      
      let extractedHTML = '<h6>Extracted Information:</h6>';
      const dataPoints = Object.keys(data.extractedData).length;
      
      if (dataPoints > 0) {
        const keyHighlights = Object.keys(data.extractedData).slice(0, 3);
        extractedHTML += '<ul class="mb-0">';
        keyHighlights.forEach(key => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase());
            
          extractedHTML += `<li><strong>${formattedKey}</strong></li>`;
        });
        
        if (dataPoints > 3) {
          extractedHTML += `<li class="text-muted">+ ${dataPoints - 3} more details...</li>`;
        }
        
        extractedHTML += '</ul>';
      } else {
        extractedHTML += '<p class="text-muted mb-0">No data extracted</p>';
      }
      
      extractedDiv.innerHTML = extractedHTML;
      content.appendChild(extractedDiv);
      
      // Add view button
      const viewButtonDiv = document.createElement('div');
      viewButtonDiv.className = 'text-center mt-2';
      viewButtonDiv.innerHTML = `
        <button class="btn btn-sm btn-outline-primary view-conversation-btn" data-id="${convo.id}">
          <i class="fas fa-eye me-1"></i> View Details
        </button>
      `;
      content.appendChild(viewButtonDiv);
    } else {
      // Fallback if no messages
      content.innerHTML = '<p class="text-muted">No message content available</p>';
    }
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'conversation-footer';
    footer.innerHTML = `
      <span class="badge bg-${status === 'completed' ? 'success' : 'warning'}">${status}</span>
      <div class="action-buttons">
        <a href="#" data-id="${convo.id}" class="download-transcript" title="Download Transcript"><i class="fas fa-download"></i></a>
      </div>
    `;
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(footer);
    
    // Add to tab content
    tabContent.appendChild(card);
  });
  
  // Add event listeners for view buttons
  const viewButtons = tabContent.querySelectorAll('.view-conversation-btn');
  viewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const conversationId = this.getAttribute('data-id');
      const conversation = conversations.find(c => c.id === conversationId);
      showFullConversation(conversation);
    });
  });
  
  // Add event listeners for download transcript buttons
  const downloadButtons = tabContent.querySelectorAll('.download-transcript');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const conversationId = this.getAttribute('data-id');
      const conversation = conversations.find(c => c.id === conversationId);
      downloadTranscript(conversation);
    });
  });
}

/**
 * Display upcoming activities in the UI
 * @param {Array} activities - Array of activity objects
 */
function displayUpcomingActivities(activities) {
  const container = document.querySelector('.sidebar');
  const upcomingSection = container.querySelector('h5');
  
  // Clear existing activities
  const existingActivities = container.querySelectorAll('.upcoming-activities-container');
  existingActivities.forEach(el => el.remove());
  
  // Create activities container
  const activitiesContainer = document.createElement('div');
  activitiesContainer.className = 'upcoming-activities-container';
  
  // Separate activities by category
  const restaurantActivities = activities.filter(a => a.category === 'restaurant' || a.type === 'reservation' || a.type === 'order');
  const hospitalActivities = activities.filter(a => a.category === 'hospital' || a.type === 'appointment' || a.type === 'reminder');
  
  // Sort activities by date (most recent first)
  const sortByDate = (a, b) => {
    const dateA = new Date(a.date || a.datetime || a.delivery_time || a.created_at || Date.now());
    const dateB = new Date(b.date || b.datetime || b.delivery_time || b.created_at || Date.now());
    return dateA - dateB; // Ascending order (upcoming events first)
  };
  
  restaurantActivities.sort(sortByDate);
  hospitalActivities.sort(sortByDate);
  
  // Create two-column layout
  activitiesContainer.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <div class="category-heading">
          <i class="fas fa-utensils me-2"></i>Restaurant
        </div>
        <div id="restaurant-activities"></div>
      </div>
      <div class="col-md-6">
        <div class="category-heading">
          <i class="fas fa-hospital me-2"></i>Hospital
        </div>
        <div id="hospital-activities"></div>
      </div>
    </div>
  `;
  
  // Insert the container after the heading
  if (upcomingSection.nextSibling) {
    container.insertBefore(activitiesContainer, upcomingSection.nextSibling);
  } else {
    container.appendChild(activitiesContainer);
  }
  
  // Get the category containers
  const restaurantContainer = document.getElementById('restaurant-activities');
  const hospitalContainer = document.getElementById('hospital-activities');
  
  // Display restaurant activities
  if (restaurantActivities.length === 0) {
    restaurantContainer.innerHTML = '<div class="alert alert-info">No upcoming restaurant activities</div>';
  } else {
    restaurantActivities.forEach(activity => {
      const activityEl = createActivityElement(activity);
      restaurantContainer.appendChild(activityEl);
      
      // Make activity clickable
      activityEl.style.cursor = 'pointer';
      activityEl.classList.add('activity-item-clickable');
      activityEl.addEventListener('click', () => {
        showActivityDetails(activity);
      });
    });
  }
  
  // Display hospital activities
  if (hospitalActivities.length === 0) {
    hospitalContainer.innerHTML = '<div class="alert alert-info">No upcoming hospital activities</div>';
  } else {
    hospitalActivities.forEach(activity => {
      const activityEl = createActivityElement(activity);
      hospitalContainer.appendChild(activityEl);
      
      // Make activity clickable
      activityEl.style.cursor = 'pointer';
      activityEl.classList.add('activity-item-clickable');
      activityEl.addEventListener('click', () => {
        showActivityDetails(activity);
      });
    });
  }
  
  // Add hover effect styles
  const style = document.createElement('style');
  style.textContent = `
    .activity-item-clickable:hover {
      transform: translateY(-5px) !important;
      box-shadow: 0 10px 15px rgba(0,0,0,0.1) !important;
      transition: all 0.3s ease !important;
    }
    .activity-item-clickable {
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Create an activity element
 * @param {Object} activity - Activity data
 * @returns {HTMLElement} Activity element
 */
function createActivityElement(activity) {
  // Ensure the activity is valid
  if (!activity) return document.createElement('div');
  
  const activityDiv = document.createElement('div');
  activityDiv.className = 'upcoming-item';
  
  // Determine icon based on type and category
  let iconClass = 'fa-calendar-check';
  if (activity.type === 'order') iconClass = 'fa-shopping-bag';
  if (activity.type === 'reservation') iconClass = 'fa-chair';
  if (activity.type === 'appointment') iconClass = 'fa-stethoscope';
  if (activity.type === 'reminder') iconClass = 'fa-bell';
  
  // Format date - handle different date formats better
  let dateStr = 'TBD';
  try {
    // Try different date properties in order of preference
    if (activity.date && activity.time) {
      const dateObj = new Date(`${activity.date}T${activity.time}`);
      if (!isNaN(dateObj.getTime())) {
        dateStr = dateObj.toLocaleString([], {
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        dateStr = `${activity.date} ${activity.time}`;
      }
    } else if (activity.datetime) {
      // datetime could be a Date object or an ISO string
      const dateObj = new Date(activity.datetime);
      if (!isNaN(dateObj.getTime())) {
        dateStr = dateObj.toLocaleString([], {
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        dateStr = String(activity.datetime);
      }
    } else if (activity.delivery_time) {
      const dateObj = new Date(activity.delivery_time);
      if (!isNaN(dateObj.getTime())) {
        dateStr = dateObj.toLocaleString([], {
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        dateStr = activity.delivery_time;
      }
    } else if (activity.pickup_time) {
      const dateObj = new Date(activity.pickup_time);
      if (!isNaN(dateObj.getTime())) {
        dateStr = dateObj.toLocaleString([], {
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        dateStr = activity.pickup_time;
      }
    } else if (activity.order_time) {
      const dateObj = new Date(activity.order_time);
      if (!isNaN(dateObj.getTime())) {
        dateStr = dateObj.toLocaleString([], {
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        dateStr = activity.order_time;
      }
    } else if (activity.created_at) {
      const dateObj = new Date(activity.created_at);
      if (!isNaN(dateObj.getTime())) {
        dateStr = dateObj.toLocaleString([], {
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        dateStr = activity.created_at;
      }
    }
  } catch (e) {
    console.warn('Error formatting date for activity:', e, activity);
    // Fallback to a reasonable default using whatever date-like fields are available
    dateStr = activity.date || activity.time || activity.datetime || activity.delivery_time || 
             activity.pickup_time || activity.order_time || activity.created_at || 'TBD';
  }
  
  // Get additional details based on activity type
  let detailsText = '';
  let titleText = '';
  
  if (activity.type === 'reservation') {
    titleText = 'Table Reservation';
    detailsText = `${activity.name || 'Customer'} - Table for ${activity.guests || 'N/A'}`;
    if (activity.phone) {
      detailsText += `<br><small class="text-muted">Phone: ${activity.phone}</small>`;
    }
    if (activity.special_requests) {
      detailsText += `<br><small class="text-muted">Note: ${activity.special_requests}</small>`;
    }
    if (activity.status) {
      detailsText += `<br><span class="badge bg-${activity.status === 'confirmed' ? 'success' : 'info'}">${activity.status}</span>`;
    }
  } else if (activity.type === 'order') {
    const orderType = activity.delivery_time ? 'Delivery' : 'Pickup';
    titleText = `Food ${orderType}`;
    detailsText = `${activity.name || 'Customer'} - Order #${activity.id ? activity.id.substring(0, 8) : 'New'}`;
    
    if (activity.phone) {
      detailsText += `<br><small class="text-muted">Phone: ${activity.phone}</small>`;
    }
    
    // Ensure address is displayed for delivery orders
    if (activity.address) {
      detailsText += `<br><small class="text-muted">To: ${activity.address}</small>`;
    }
    
    // Handle items array or string
    let itemsInfo = '';
    if (activity.items) {
      if (typeof activity.items === 'string') {
        try {
          const items = JSON.parse(activity.items);
          itemsInfo = Array.isArray(items) ? items.length + ' item(s)' : '1 item';
        } catch (e) {
          itemsInfo = activity.items;
        }
      } else if (Array.isArray(activity.items)) {
        itemsInfo = activity.items.length + ' item(s)';
      } else {
        itemsInfo = '1 item';
      }
      
      detailsText += `<br><small class="text-muted">${itemsInfo}, $${activity.total || '0.00'}</small>`;
    }
    
    // Always show status if available
    if (activity.status) {
      const statusClass = activity.status === 'delivered' || activity.status === 'picked' ? 'success' : 
                         (activity.status === 'pending' ? 'warning' : 'info');
      detailsText += `<br><span class="badge bg-${statusClass}">${activity.status}</span>`;
    }
  } else if (activity.type === 'appointment') {
    titleText = 'Medical Appointment';
    detailsText = `${activity.patient_name || 'Patient'} - Dr. ${activity.doctor || 'TBD'}`;
    
    if (activity.phone) {
      detailsText += `<br><small class="text-muted">Phone: ${activity.phone}</small>`;
    }
    if (activity.patient_id) {
      detailsText += `<br><small class="text-muted">Patient ID: ${activity.patient_id}</small>`;
    }
    if (activity.department) {
      detailsText += `<br><small class="text-muted">Dept: ${activity.department}</small>`;
    }
    if (activity.reason) {
      detailsText += `<br><small class="text-muted">Reason: ${activity.reason}</small>`;
    }
    if (activity.status) {
      detailsText += `<br><span class="badge bg-${activity.status === 'scheduled' ? 'success' : 'warning'}">${activity.status}</span>`;
    }
  } else if (activity.type === 'reminder') {
    titleText = activity.type === 'medication' ? 'Medication Reminder' : 'Appointment Reminder';
    detailsText = `${activity.patient_name || 'Patient'}`;
    
    if (activity.phone) {
      detailsText += `<br><small class="text-muted">Phone: ${activity.phone}</small>`;
    }
    if (activity.doctor) {
      detailsText += `<br><small class="text-muted">Dr. ${activity.doctor}</small>`;
    }
    if (activity.message) {
      detailsText += `<br><small class="text-muted">${activity.message}</small>`;
    }
    if (activity.status) {
      detailsText += `<br><span class="badge bg-${activity.status === 'scheduled' ? 'primary' : 'secondary'}">${activity.status}</span>`;
    }
  }
  
  // Create content
  activityDiv.innerHTML = `
    <div class="upcoming-icon ${activity.category || (activity.type === 'appointment' || activity.type === 'reminder' ? 'hospital' : 'restaurant')}">
      <i class="fas ${iconClass}"></i>
    </div>
    <div class="upcoming-details">
      <h6>${titleText}</h6>
      <p>${detailsText}</p>
    </div>
    <div class="upcoming-date">
      ${dateStr}
    </div>
  `;
  
  return activityDiv;
}

/**
 * Show full conversation in a modal
 * @param {Object} conversation - Conversation object
 */
function showFullConversation(conversation) {
  if (!conversation) return;
  
  // Get or create modal
  let modal = document.getElementById('fullConversationModal');
  if (!modal) {
    // Create modal if it doesn't exist
    modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'fullConversationModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'conversationModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="conversationModalLabel">Full Conversation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div id="fullConversationContent" class="conversation-content" style="max-height: 500px; overflow-y: auto;"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="downloadModalTranscript">Download Transcript</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener for download button
    const downloadBtn = modal.querySelector('#downloadModalTranscript');
    downloadBtn.addEventListener('click', function() {
      downloadTranscript(conversation);
    });
  }
  
  // Set modal title
  const modalTitle = modal.querySelector('.modal-title');
  modalTitle.textContent = conversation.summary || 'Full Conversation';
  
  // Get content container
  const content = modal.querySelector('#fullConversationContent');
  content.innerHTML = '';
  
  // Parse data if needed
  let data;
  try {
    data = typeof conversation.data === 'string' ? JSON.parse(conversation.data) : conversation.data;
  } catch (e) {
    console.warn('Error parsing conversation data:', e);
    data = {}; // Set to empty object if parsing fails
  }
  
  // Add conversation metadata at the top
  const metadataDiv = document.createElement('div');
  metadataDiv.className = 'conversation-metadata';
  metadataDiv.innerHTML = `
    <p><strong>Date:</strong> ${new Date(conversation.timestamp).toLocaleString()}</p>
    <p><strong>Type:</strong> ${conversation.type || 'General'} / <strong>Agent:</strong> ${conversation.agent_type || 'Assistant'}</p>
    <p><strong>Status:</strong> <span class="badge bg-${conversation.status === 'completed' ? 'success' : 'warning'}">${conversation.status || 'Unknown'}</span></p>
    <hr>
  `;
  content.appendChild(metadataDiv);
  
  // Add messages to content
  if (data && data.conversation && Array.isArray(data.conversation)) {
    data.conversation.forEach(msg => {
      if (!msg || !msg.content) return; // Skip if no message or content
      
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.role}-message`;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      
      const messageText = document.createElement('p');
      
      // Ensure content is properly displayed
      if (typeof msg.content === 'string') {
        // Create text node instead of setting textContent to avoid HTML escaping issues
        messageText.textContent = msg.content.trim();
      } else if (msg.content && typeof msg.content === 'object' && msg.content.text) {
        // Some APIs might return content as {text: "message"}
        messageText.textContent = msg.content.text.trim();
      } else {
        // Fallback
        messageText.textContent = JSON.stringify(msg.content);
      }
      
      const timeDiv = document.createElement('div');
      timeDiv.className = 'message-time';
      
      // Format time nicely if available
      let formattedTime = '';
      if (msg.timestamp) {
        try {
          const msgTime = new Date(msg.timestamp);
          formattedTime = msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) {
          formattedTime = msg.timestamp;
        }
      } else if (msg.time) {
        formattedTime = msg.time;
      }
      
      timeDiv.textContent = formattedTime;
      
      contentDiv.appendChild(messageText);
      contentDiv.appendChild(timeDiv);
      messageDiv.appendChild(contentDiv);
      content.appendChild(messageDiv);
    });
  }
  
  // Always display extracted data if available
  if (data && data.extractedData) {
    const extractedDiv = document.createElement('div');
    extractedDiv.className = 'extracted-data mt-4';
    
    let extractedHTML = '<h6 class="border-top pt-3">Extracted Information:</h6><ul class="list-group">';
    
    Object.entries(data.extractedData).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase());
      
      let formattedValue = '';
      if (Array.isArray(value)) {
        try {
          formattedValue = JSON.stringify(value, null, 2);
        } catch (e) {
          formattedValue = `${value.length} items`;
        }
      } else if (typeof value === 'object' && value !== null) {
        try {
          formattedValue = JSON.stringify(value, null, 2);
        } catch (e) {
          formattedValue = 'Complex object';
        }
      } else {
        formattedValue = value !== null && value !== undefined ? value : '';
      }
      
      extractedHTML += `<li class="list-group-item"><strong>${formattedKey}:</strong> <pre class="mb-0">${formattedValue}</pre></li>`;
    });
    
    extractedHTML += '</ul>';
    extractedDiv.innerHTML = extractedHTML;
    content.appendChild(extractedDiv);
  }
  
  // Show message if no content
  if ((!data || !data.conversation || !Array.isArray(data.conversation) || data.conversation.length === 0) && 
      (!data || !data.extractedData)) {
    content.innerHTML += '<p class="text-muted">No message content available</p>';
  }
  
  // Show the modal
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
}

/**
 * Download conversation transcript
 * @param {Object} conversation - Conversation object
 */
function downloadTranscript(conversation) {
  if (!conversation) return;
  
  // Parse data if needed
  const data = typeof conversation.data === 'string' ? JSON.parse(conversation.data) : conversation.data;
  
  // Generate transcript text
  let transcript = `Ayra AI Assistant - Conversation Transcript\n`;
  transcript += `Timestamp: ${new Date(conversation.timestamp).toLocaleString()}\n`;
  transcript += `Type: ${conversation.type}\n`;
  transcript += `Agent: ${conversation.agent_type}\n`;
  transcript += `User: ${conversation.user_name}\n\n`;
  
  // Add conversation messages
  if (data && data.conversation && Array.isArray(data.conversation)) {
    data.conversation.forEach(msg => {
      if (!msg.content) return; // Skip if no content
      
      let speaker = msg.role === 'assistant' ? 'AI Assistant' : 'User';
      let time = '';
      
      if (msg.timestamp) {
        try {
          time = new Date(msg.timestamp).toLocaleTimeString();
        } catch (e) {
          time = msg.timestamp;
        }
      } else if (msg.time) {
        time = msg.time;
      }
      
      transcript += `[${time}] ${speaker}: ${msg.content}\n`;
    });
  }
  
  // Add extracted data if available
  if (data && data.extractedData) {
    transcript += `\nExtracted Information:\n`;
    
    Object.entries(data.extractedData).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase());
      
      let formattedValue = '';
      if (Array.isArray(value)) {
        formattedValue = JSON.stringify(value);
      } else if (typeof value === 'object' && value !== null) {
        formattedValue = JSON.stringify(value);
      } else {
        formattedValue = value;
      }
      
      transcript += `${formattedKey}: ${formattedValue}\n`;
    });
  }
  
  // Create and trigger download
  const blob = new Blob([transcript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `conversation-${conversation.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Clear all conversations from UI
 */
function clearConversations() {
  const tabContents = document.querySelectorAll('.tab-pane');
  tabContents.forEach(tab => {
    tab.innerHTML = '';
  });
}

/**
 * Set up error handling for API calls
 * This ensures the dashboard remains functional even if backend calls fail
 */
function setupErrorHandling() {
  // Global error handler for fetch operations
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.name === 'TypeError' && 
        event.reason.message.includes('Failed to fetch')) {
      console.error('Network connection error:', event.reason);
      showNotification(
        'Connection Error', 
        'Unable to connect to the server. Some data may not be updated.', 
        'error'
      );
      
      // Try to use cache or local storage data
      fallbackToLocalData();
    }
  });
}

/**
 * Use local data as fallback when API calls fail
 */
function fallbackToLocalData() {
  console.log('Using local data fallback');
  
  // Check if we have cached data
  const cachedConversations = localStorage.getItem('cachedConversations');
  const cachedActivities = localStorage.getItem('cachedActivities');
  
  // Use cached conversations if available
  if (cachedConversations) {
    try {
      const conversations = JSON.parse(cachedConversations);
      displayConversations(conversations, 'all');
      // Hide loading indicators
      document.getElementById('conversations-loading').style.display = 'none';
    } catch (e) {
      console.error('Error parsing cached conversations:', e);
    }
  }
  
  // Use cached activities if available
  if (cachedActivities) {
    try {
      const activities = JSON.parse(cachedActivities);
      displayUpcomingActivities(activities);
      // Hide loading indicators
      document.getElementById('restaurant-activities-loading').style.display = 'none';
      document.getElementById('hospital-activities-loading').style.display = 'none';
      document.getElementById('restaurant-activities-full').style.display = 'block';
      document.getElementById('hospital-activities-full').style.display = 'block';
    } catch (e) {
      console.error('Error parsing cached activities:', e);
    }
  }
}

// Add a new function to explicitly clear all loading indicators
function clearAllLoadingIndicators() {
  // Hide all loading indicators
  const loadingIndicators = document.querySelectorAll('.loading-indicator');
  loadingIndicators.forEach(indicator => {
    indicator.style.display = 'none';
  });
  
  // Show content containers
  if (document.getElementById('restaurant-activities-full')) {
    document.getElementById('restaurant-activities-full').style.display = 'block';
  }
  if (document.getElementById('hospital-activities-full')) {
    document.getElementById('hospital-activities-full').style.display = 'block';
  }
  if (document.getElementById('all-conversations')) {
    document.getElementById('all-conversations').style.display = 'block';
  }
}

// Add a handler for real-time data events (like call completion)
function setupCallCompletionHandler() {
  // Check if we can use the BroadcastChannel API
  if (typeof BroadcastChannel !== 'undefined') {
    const callChannel = new BroadcastChannel('ayra_call_events');
    callChannel.onmessage = function(event) {
      if (event.data && event.data.type === 'call_completed') {
        console.log('Call completion detected:', event.data);
        loadDashboardData();
        showNotification('Call Completed', 'A call has been completed. Dashboard has been updated.', 'success');
      }
    };
  }
  
  // Fallback for browsers without BroadcastChannel
  window.addEventListener('storage', function(event) {
    if (event.key === 'ayra_last_call') {
      console.log('Call data changed in storage');
      loadDashboardData();
    }
  });
}

// Add functionality for quick action buttons
function setupQuickActionButtons() {
  const quickActionButtons = document.querySelectorAll('.quick-action-btn');
  
  quickActionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const actionText = this.textContent.trim();
      
      // Handle different quick actions
      if (actionText.includes('Download Report')) {
        showNotification('Report Download', 'Your analytics report is being generated and will download shortly.', 'info');
        setTimeout(() => {
          downloadAnalyticsReport();
        }, 1500);
      } 
      else if (actionText.includes('Add Agent')) {
        showAgentForm();
      }
      else if (actionText.includes('Settings')) {
        showSettings();
      }
      else if (actionText.includes('Alerts')) {
        showAlertsConfig();
      }
      else if (actionText.includes('Analytics')) {
        showAdvancedAnalytics();
      }
    });
  });
}

// Helper functions for each quick action
function downloadAnalyticsReport() {
  // Create a simple CSV with some data
  const reportData = `Date,Conversations,Orders,Appointments,Success Rate
${new Date().toLocaleDateString()},258,154,87,95%
${new Date(Date.now() - 86400000).toLocaleDateString()},245,142,81,94%
${new Date(Date.now() - 172800000).toLocaleDateString()},238,136,79,93%
`;

  // Create and trigger download
  const blob = new Blob([reportData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ayra_analytics_report_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showNotification('Report Downloaded', 'Your analytics report has been downloaded successfully.', 'success');
}

function showAgentForm() {
  // Show modal with agent form
  const modalHTML = `
    <div class="modal fade" id="addAgentModal" tabindex="-1" aria-labelledby="addAgentModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addAgentModalLabel">Add New Agent</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="addAgentForm">
              <div class="mb-3">
                <label for="agentName" class="form-label">Agent Name</label>
                <input type="text" class="form-control" id="agentName" required>
              </div>
              <div class="mb-3">
                <label for="agentType" class="form-label">Agent Type</label>
                <select class="form-select" id="agentType" required>
                  <option value="">Select Type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="hospital">Hospital</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="agentLanguages" class="form-label">Languages</label>
                <select class="form-select" id="agentLanguages" multiple>
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="ml">Malayalam</option>
                  <option value="kn">Kannada</option>
                  <option value="hi">Hindi</option>
                </select>
                <div class="form-text">Hold Ctrl/Cmd to select multiple languages</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="saveAgentBtn">Add Agent</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('addAgentModal'));
  modal.show();
  
  // Handle form submission
  document.getElementById('saveAgentBtn').addEventListener('click', function() {
    const name = document.getElementById('agentName').value;
    const type = document.getElementById('agentType').value;
    
    if (name && type) {
      modal.hide();
      document.getElementById('addAgentModal').addEventListener('hidden.bs.modal', function() {
        showNotification('Agent Added', `New agent "${name}" has been added successfully.`, 'success');
        document.getElementById('addAgentModal').remove();
      });
    } else {
      showNotification('Validation Error', 'Please fill in all required fields.', 'error');
    }
  });
}

function showSettings() {
  // Show settings modal
  const modalHTML = `
    <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="settingsModalLabel">Dashboard Settings</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs" id="settingsTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="general-tab" data-bs-toggle="tab" data-bs-target="#general" type="button" role="tab">General</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="notifications-tab" data-bs-toggle="tab" data-bs-target="#notifications" type="button" role="tab">Notifications</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="appearance-tab" data-bs-toggle="tab" data-bs-target="#appearance" type="button" role="tab">Appearance</button>
              </li>
            </ul>
            <div class="tab-content p-3" id="settingsTabsContent">
              <div class="tab-pane fade show active" id="general" role="tabpanel">
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="autoRefresh" checked>
                  <label class="form-check-label" for="autoRefresh">Auto-refresh dashboard data</label>
                </div>
                <div class="mb-3">
                  <label for="refreshInterval" class="form-label">Refresh interval (seconds)</label>
                  <input type="number" class="form-control" id="refreshInterval" value="30" min="10" max="300">
                </div>
                <div class="mb-3">
                  <label for="defaultDateRange" class="form-label">Default date range</label>
                  <select class="form-select" id="defaultDateRange">
                    <option value="today">Today</option>
                    <option value="7days">Last 7 days</option>
                    <option value="30days" selected>Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                  </select>
                </div>
              </div>
              <div class="tab-pane fade" id="notifications" role="tabpanel">
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="enableNotifications" checked>
                  <label class="form-check-label" for="enableNotifications">Enable notifications</label>
                </div>
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="soundAlerts" checked>
                  <label class="form-check-label" for="soundAlerts">Play sound for important alerts</label>
                </div>
                <div class="mb-3">
                  <label for="notificationDuration" class="form-label">Notification duration (seconds)</label>
                  <input type="number" class="form-control" id="notificationDuration" value="5" min="1" max="20">
                </div>
              </div>
              <div class="tab-pane fade" id="appearance" role="tabpanel">
                <div class="mb-3">
                  <label for="themeColor" class="form-label">Primary color</label>
                  <input type="color" class="form-control form-control-color" id="themeColor" value="#2d46c2">
                </div>
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="darkModeDefault">
                  <label class="form-check-label" for="darkModeDefault">Use dark mode by default</label>
                </div>
                <div class="mb-3">
                  <label for="fontSize" class="form-label">Font size</label>
                  <select class="form-select" id="fontSize">
                    <option value="small">Small</option>
                    <option value="medium" selected>Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="saveSettingsBtn">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
  modal.show();
  
  // Handle form submission
  document.getElementById('saveSettingsBtn').addEventListener('click', function() {
    modal.hide();
    document.getElementById('settingsModal').addEventListener('hidden.bs.modal', function() {
      showNotification('Settings Saved', 'Your dashboard settings have been updated successfully.', 'success');
      document.getElementById('settingsModal').remove();
    });
  });
}

function showAlertsConfig() {
  // Show alerts configuration modal
  const modalHTML = `
    <div class="modal fade" id="alertsModal" tabindex="-1" aria-labelledby="alertsModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="alertsModalLabel">Alert Settings</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Enable alerts for:</label>
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="newConversations" checked>
                <label class="form-check-label" for="newConversations">New conversations</label>
              </div>
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="newReservations" checked>
                <label class="form-check-label" for="newReservations">New restaurant reservations</label>
              </div>
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="newAppointments" checked>
                <label class="form-check-label" for="newAppointments">New hospital appointments</label>
              </div>
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="lowSuccessRate">
                <label class="form-check-label" for="lowSuccessRate">Low success rate warnings</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="alertMethods" class="form-label">Alert methods</label>
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="dashboardAlerts" checked>
                <label class="form-check-label" for="dashboardAlerts">Dashboard notifications</label>
              </div>
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="emailAlerts">
                <label class="form-check-label" for="emailAlerts">Email notifications</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="emailForAlerts" class="form-label">Email for alerts</label>
              <input type="email" class="form-control" id="emailForAlerts" placeholder="Enter email address">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="saveAlertsBtn">Save Alerts</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('alertsModal'));
  modal.show();
  
  // Handle form submission
  document.getElementById('saveAlertsBtn').addEventListener('click', function() {
    modal.hide();
    document.getElementById('alertsModal').addEventListener('hidden.bs.modal', function() {
      showNotification('Alerts Configured', 'Your alert preferences have been saved successfully.', 'success');
      document.getElementById('alertsModal').remove();
    });
  });
}

function showAdvancedAnalytics() {
  // Show advanced analytics modal
  const modalHTML = `
    <div class="modal fade" id="analyticsModal" tabindex="-1" aria-labelledby="analyticsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="analyticsModalLabel">Advanced Analytics</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex justify-content-between mb-3">
              <div>
                <label for="analyticsDateRange" class="form-label">Date Range</label>
                <select class="form-select" id="analyticsDateRange">
                  <option value="7days">Last 7 days</option>
                  <option value="30days" selected>Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div>
                <label for="analyticsCategory" class="form-label">Category</label>
                <select class="form-select" id="analyticsCategory">
                  <option value="all" selected>All</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="hospital">Hospital</option>
                </select>
              </div>
              <div class="align-self-end">
                <button type="button" class="btn btn-outline-primary" id="updateAnalyticsBtn">Update</button>
              </div>
            </div>
            
            <div class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading advanced analytics data...</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="downloadAnalyticsBtn">Download Report</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('analyticsModal'));
  modal.show();
  
  // Handle download button
  document.getElementById('downloadAnalyticsBtn').addEventListener('click', function() {
    downloadAnalyticsReport();
  });
  
  // Handle update button
  document.getElementById('updateAnalyticsBtn').addEventListener('click', function() {
    const spinnerHTML = document.querySelector('#analyticsModal .spinner-border').parentElement;
    spinnerHTML.innerHTML = '<div class="alert alert-info">Analytics data updated.</div>';
  });
}

// Setup user menu functionality (profile, settings, logout)
function setupUserMenuFunctionality() {
  // Profile dropdown menu
  const profileDropdown = document.getElementById('userDropdown');
  if (profileDropdown) {
    profileDropdown.addEventListener('click', function(e) {
      e.preventDefault();
      
      // This is just for the dropdown toggle functionality which Bootstrap handles
    });
  }
  
  // Profile menu items
  document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const itemText = this.textContent.trim();
      
      if (itemText.includes('Profile')) {
        showUserProfile();
      } else if (itemText.includes('Settings')) {
        showSettings();
      } else if (itemText.includes('Logout')) {
        handleLogout();
      }
    });
  });
}

// Enhanced showUserProfile to update the UI in real-time after saving
function showUserProfile() {
  // Get current user profile data
  const currentProfile = AyraDataStore.getUserProfile();
  
  // Show user profile modal
  const modalHTML = `
    <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="profileModalLabel">User Profile</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="avatar-circle mx-auto mb-3">
                <span class="avatar-initials">${getInitials(currentProfile.name)}</span>
              </div>
              <h5 class="mb-0">${currentProfile.name}</h5>
              <p class="text-muted">${currentProfile.role || 'Administrator'}</p>
            </div>
            
            <div class="mb-3">
              <label for="profileName" class="form-label">Full Name</label>
              <input type="text" class="form-control" id="profileName" value="${currentProfile.name}">
            </div>
            <div class="mb-3">
              <label for="profileEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="profileEmail" value="${currentProfile.email}">
            </div>
            <div class="mb-3">
              <label for="profilePhone" class="form-label">Phone</label>
              <input type="tel" class="form-control" id="profilePhone" value="${currentProfile.phone}">
            </div>
            <div class="mb-3">
              <label for="profileRole" class="form-label">Role</label>
              <select class="form-select" id="profileRole">
                <option value="admin" ${currentProfile.role === 'admin' ? 'selected' : ''}>Administrator</option>
                <option value="manager" ${currentProfile.role === 'manager' ? 'selected' : ''}>Manager</option>
                <option value="viewer" ${currentProfile.role === 'viewer' ? 'selected' : ''}>Viewer</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="saveProfileBtn">Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add some styles for the avatar
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .avatar-circle {
      width: 80px;
      height: 80px;
      background-color: #2d46c2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-initials {
      color: white;
      font-size: 32px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('profileModal'));
  modal.show();
  
  // Handle form submission
  document.getElementById('saveProfileBtn').addEventListener('click', function() {
    // Get updated profile data
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const role = document.getElementById('profileRole').value;
    
    // Update profile in database
    const updatedProfile = AyraDataStore.updateUserProfile({
      name,
      email,
      phone,
      role
    });
    
    // Update UI with new profile data
    updateUserProfileInUI(updatedProfile.name);
    
    // Hide modal
    modal.hide();
    
    document.getElementById('profileModal').addEventListener('hidden.bs.modal', function() {
      showNotification('Profile Updated', 'Your profile has been updated successfully.', 'success');
      document.getElementById('profileModal').remove();
    });
  });
}

// Function to get initials from a name
function getInitials(name) {
  if (!name) return 'U';
  
  const nameParts = name.split(' ');
  let initials = nameParts[0].charAt(0);
  
  if (nameParts.length > 1) {
    initials += nameParts[1].charAt(0);
  }
  
  return initials.toUpperCase();
}

// Enhanced function to update user profile in UI
function updateUserProfileInUI(name) {
  // Update all user name instances throughout the UI
  const userDropdown = document.getElementById('userDropdown');
  const navbarUserName = document.querySelector('.navbar .dropdown-toggle');
  const userNameSpans = document.querySelectorAll('.user-name');
  const userGreeting = document.querySelector('.user-greeting');
  
  if (userDropdown) {
    // Extract first name and first letter of last name
    const nameParts = name.split(' ');
    let displayName = nameParts[0];
    
    if (nameParts.length > 1) {
      displayName += ' ' + nameParts[1].charAt(0);
      if (nameParts[1].length > 1) displayName += '.';
    }
    
    // Update dropdown button text
    userDropdown.innerHTML = `<i class="fas fa-user-circle me-1"></i> ${displayName}`;
  }
  
  // Update all elements with user-name class
  if (userNameSpans && userNameSpans.length > 0) {
    userNameSpans.forEach(span => {
      span.textContent = name;
    });
  }
  
  // Update greeting if present
  if (userGreeting) {
    const nameParts = name.split(' ');
    userGreeting.textContent = `Hello, ${nameParts[0]}!`;
  }
  
  // Also update avatar initials if visible
  const avatarInitials = document.querySelectorAll('.avatar-initials');
  if (avatarInitials && avatarInitials.length > 0) {
    avatarInitials.forEach(initial => {
      initial.textContent = getInitials(name);
    });
  }
  
  // Store in localStorage for persistence across page refreshes
  localStorage.setItem('currentUserName', name);
  
  // Update profile page if it's open
  const profileNameInput = document.getElementById('profileName');
  if (profileNameInput) {
    profileNameInput.value = name;
  }
  
  // Trigger a data update event
  const event = new CustomEvent('profile-updated', { detail: { name } });
  dbEvents.dispatchEvent(event);
  
  // Show notification for feedback
  showNotification('Profile Updated', 'Your profile has been updated successfully', 'success', 3000);
}

// Ensure profile is loaded and displayed when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize profile display from database
  const userProfile = AyraDataStore.getUserProfile();
  if (userProfile && userProfile.name) {
    updateUserProfileInUI(userProfile.name);
  }
  
  // Register event listeners for database updates
  dbEvents.addEventListener('profile-updated', function(event) {
    console.log('Profile updated event received:', event.detail);
    updateUserProfileInUI(event.detail.name);
  });
  
  // Load conversations and sort by most recent
  loadConversations();
});

// Make recent conversations appear first
function displayConversations(conversations, tabId) {
  const tabContent = document.getElementById(tabId);
  if (!tabContent) return;
  
  // Clear existing content
  tabContent.innerHTML = '';
  
  // If no conversations, show a message
  if (!conversations || conversations.length === 0) {
    tabContent.innerHTML = '<div class="alert alert-info">No conversation history found.</div>';
    return;
  }
  
  // Sort conversations by timestamp, most recent first
  conversations.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  // Add each conversation
  conversations.forEach(convo => {
    // Create card element
    const card = document.createElement('div');
    card.className = 'conversation-card';
    
    // Rest of the function remains the same...
    // ... existing code for creating conversation cards ...
    
    // Create header
    const header = document.createElement('div');
    header.className = 'conversation-header';
    
    // Get conversation data - handle data better to ensure successful parsing
    let data;
    try {
      data = typeof convo.data === 'string' ? JSON.parse(convo.data) : convo.data;
    } catch (e) {
      console.warn('Error parsing conversation data:', e);
      data = {}; // Set to empty object if parsing fails
    }
    
    const summary = convo.summary || 'Conversation';
    const type = convo.type || 'general';
    const agentType = convo.agent_type || '';
    const status = convo.status || 'completed';
    const timestamp = new Date(convo.timestamp).toLocaleString();
    const userName = convo.user_name || 'User';
    
    // Calculate call duration if possible - improved algorithm
    let duration = '';
    if (data && data.conversation && data.conversation.length > 0) {
      // Try to calculate call duration from timestamps in messages
      try {
        // Filter messages that have valid timestamps
        const messagesWithTime = data.conversation.filter(m => {
          const timeStr = m.time || m.timestamp;
          if (!timeStr) return false;
          
          try {
            const time = new Date(timeStr);
            return !isNaN(time.getTime());
          } catch (e) {
            return false;
          }
        });
        
        if (messagesWithTime.length >= 2) {
          const firstMsg = messagesWithTime[0];
          const lastMsg = messagesWithTime[messagesWithTime.length - 1];
          
          const firstTime = new Date(firstMsg.time || firstMsg.timestamp);
          const lastTime = new Date(lastMsg.time || lastMsg.timestamp);
          
          const durationMs = lastTime - firstTime;
          if (durationMs > 0) {
            const minutes = Math.floor(durationMs / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          }
        }
      } catch (e) {
        console.warn('Error calculating call duration:', e);
      }
    }
    
    // Set header content
    header.innerHTML = `
      <h5>
        ${summary}
        <span class="conversation-tag tag-${type}">${agentType}</span>
        ${type === 'restaurant' ? '<span class="conversation-tag tag-reservation">Reservation</span>' : ''}
        ${type === 'hospital' ? '<span class="conversation-tag tag-appointment">Appointment</span>' : ''}
      </h5>
      <div class="conversation-meta">
        <span><i class="far fa-clock me-1"></i> ${timestamp}</span>
        <span><i class="far fa-user me-1"></i> ${userName}</span>
        ${duration ? `<span><i class="fas fa-hourglass-half me-1"></i> ${duration}</span>` : ''}
      </div>
    `;
    
    // Create content div
    const content = document.createElement('div');
    content.className = 'conversation-content';
    
    // Show a compact preview initially
    if (data && data.conversation && Array.isArray(data.conversation)) {
      // Show abbreviated transcript (just first and last message)
      const messages = data.conversation.filter(msg => msg && msg.content);
      
      if (messages.length > 0) {
        // Show only the first message from assistant
        const firstAssistantMsg = messages.find(msg => msg.role === 'assistant');
        if (firstAssistantMsg) {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'message assistant-message preview-message';
          
          const contentDiv = document.createElement('div');
          contentDiv.className = 'message-content';
          
          const messageText = document.createElement('p');
          
          // Truncate content for preview
          let previewContent = '';
          if (typeof firstAssistantMsg.content === 'string') {
            previewContent = firstAssistantMsg.content.trim();
          } else if (firstAssistantMsg.content && typeof firstAssistantMsg.content === 'object' && firstAssistantMsg.content.text) {
            previewContent = firstAssistantMsg.content.text.trim();
          } else {
            previewContent = JSON.stringify(firstAssistantMsg.content);
          }
          
          // Limit preview to 150 characters
          if (previewContent.length > 150) {
            previewContent = previewContent.substring(0, 150) + '...';
          }
          
          messageText.textContent = previewContent;
          contentDiv.appendChild(messageText);
          messageDiv.appendChild(contentDiv);
          content.appendChild(messageDiv);
        }
        
        // Add message count
        const messageCountDiv = document.createElement('div');
        messageCountDiv.className = 'message-count text-center mt-2';
        messageCountDiv.innerHTML = `
          <span class="badge bg-light text-dark">
            <i class="fas fa-comment-dots me-1"></i> ${messages.length} messages in total
          </span>
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary view-conversation-btn" data-id="${convo.id}">
              <i class="fas fa-eye me-1"></i> View Full Transcript
            </button>
          </div>
        `;
        content.appendChild(messageCountDiv);
      } else {
        content.innerHTML = '<p class="text-muted">No message content available</p>';
      }
    } else if (data && data.extractedData) {
      // Show extracted data summary
      const extractedDiv = document.createElement('div');
      extractedDiv.className = 'extracted-data-preview';
      
      let extractedHTML = '<h6>Extracted Information:</h6>';
      const dataPoints = Object.keys(data.extractedData).length;
      
      if (dataPoints > 0) {
        const keyHighlights = Object.keys(data.extractedData).slice(0, 3);
        extractedHTML += '<ul class="mb-0">';
        keyHighlights.forEach(key => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase());
            
          extractedHTML += `<li><strong>${formattedKey}</strong></li>`;
        });
        
        if (dataPoints > 3) {
          extractedHTML += `<li class="text-muted">+ ${dataPoints - 3} more details...</li>`;
        }
        
        extractedHTML += '</ul>';
      } else {
        extractedHTML += '<p class="text-muted mb-0">No data extracted</p>';
      }
      
      extractedDiv.innerHTML = extractedHTML;
      content.appendChild(extractedDiv);
      
      // Add view button
      const viewButtonDiv = document.createElement('div');
      viewButtonDiv.className = 'text-center mt-2';
      viewButtonDiv.innerHTML = `
        <button class="btn btn-sm btn-outline-primary view-conversation-btn" data-id="${convo.id}">
          <i class="fas fa-eye me-1"></i> View Details
        </button>
      `;
      content.appendChild(viewButtonDiv);
    } else {
      // Fallback if no messages
      content.innerHTML = '<p class="text-muted">No message content available</p>';
    }
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'conversation-footer';
    footer.innerHTML = `
      <span class="badge bg-${status === 'completed' ? 'success' : 'warning'}">${status}</span>
      <div class="action-buttons">
        <a href="#" data-id="${convo.id}" class="download-transcript" title="Download Transcript"><i class="fas fa-download"></i></a>
      </div>
    `;
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(footer);
    
    // Add to tab content
    tabContent.appendChild(card);
  });
  
  // Add event listeners for view buttons
  const viewButtons = tabContent.querySelectorAll('.view-conversation-btn');
  viewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const conversationId = this.getAttribute('data-id');
      const conversation = conversations.find(c => c.id === conversationId);
      showFullConversation(conversation);
    });
  });
  
  // Add event listeners for download transcript buttons
  const downloadButtons = tabContent.querySelectorAll('.download-transcript');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const conversationId = this.getAttribute('data-id');
      const conversation = conversations.find(c => c.id === conversationId);
      downloadTranscript(conversation);
    });
  });
}

// ... existing code ...

// Initialize event handlers for analytics view buttons
document.addEventListener('DOMContentLoaded', function() {
  // Set up analytics view buttons (Day, Week, Month)
  const analyticsButtons = document.querySelectorAll('.dashboard-stats .btn-group .btn');
  if (analyticsButtons) {
    analyticsButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        analyticsButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Update stats
        updateStats();
      });
    });
  }
}); 