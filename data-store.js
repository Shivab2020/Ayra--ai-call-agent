/**
 * Ayra Data Store
 * Manages conversation history, restaurant and hospital bookings
 * Uses server API to store data in SQLite database
 */

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Trigger dashboard update notification
 * Used to notify the dashboard that data has changed
 */
function triggerDashboardUpdate() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('dashboardUpdate', new Date().toISOString());
    console.log('Dashboard update triggered');
  }
}

/**
 * Save conversation to history
 * @param {Object} conversation - Conversation object
 */
async function saveConversation(conversation) {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conversation)
    });
    
    // Trigger dashboard update
    triggerDashboardUpdate();
    
    return await response.json();
  } catch (error) {
    console.error('Error saving conversation:', error);
    // Fallback to local storage if API fails
    return saveToLocalStorage('conversations', conversation);
  }
}

/**
 * Get all conversations or filtered by type
 * @param {string} type - Optional filter by type (restaurant, hospital)
 * @returns {Promise<Array>} Array of conversations
 */
async function getConversations(type) {
  try {
    const url = type 
      ? `${API_BASE_URL}/conversations?type=${type}`
      : `${API_BASE_URL}/conversations`;
      
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error getting conversations:', error);
    // Fallback to local storage if API fails
    return getFromLocalStorage('conversations', type);
  }
}

/**
 * RESTAURANT: Create a new reservation
 * @param {Object} reservation - Reservation details
 * @returns {Promise<Object>} Created reservation
 */
async function createReservation(reservation) {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation)
    });
    
    // Trigger dashboard update
    triggerDashboardUpdate();
    
    return await response.json();
  } catch (error) {
    console.error('Error creating reservation:', error);
    // Fallback to local storage if API fails
    return saveToLocalStorage('reservations', reservation);
  }
}

/**
 * RESTAURANT: Get all reservations
 * @returns {Promise<Array>} Array of reservations
 */
async function getReservations() {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/reservations`);
    return await response.json();
  } catch (error) {
    console.error('Error getting reservations:', error);
    // Fallback to local storage if API fails
    return getFromLocalStorage('reservations');
  }
}

/**
 * RESTAURANT: Create a new order
 * @param {Object} order - Order details
 * @returns {Promise<Object>} Created order
 */
async function createOrder(order) {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order)
    });
    
    // Trigger dashboard update
    triggerDashboardUpdate();
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    // Fallback to local storage if API fails
    return saveToLocalStorage('orders', order);
  }
}

/**
 * RESTAURANT: Get all orders
 * @returns {Promise<Array>} Array of orders
 */
async function getOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/orders`);
    return await response.json();
  } catch (error) {
    console.error('Error getting orders:', error);
    // Fallback to local storage if API fails
    return getFromLocalStorage('orders');
  }
}

/**
 * HOSPITAL: Create a new appointment
 * @param {Object} appointment - Appointment details
 * @returns {Promise<Object>} Created appointment
 */
async function createAppointment(appointment) {
  try {
    const response = await fetch(`${API_BASE_URL}/hospital/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment)
    });
    
    // Trigger dashboard update
    triggerDashboardUpdate();
    
    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    // Fallback to local storage if API fails
    return saveToLocalStorage('appointments', appointment);
  }
}

/**
 * HOSPITAL: Get all appointments
 * @returns {Promise<Array>} Array of appointments
 */
async function getAppointments() {
  try {
    const response = await fetch(`${API_BASE_URL}/hospital/appointments`);
    return await response.json();
  } catch (error) {
    console.error('Error getting appointments:', error);
    // Fallback to local storage if API fails
    return getFromLocalStorage('appointments');
  }
}

/**
 * HOSPITAL: Create a new reminder
 * @param {Object} reminder - Reminder details
 * @returns {Promise<Object>} Created reminder
 */
async function createReminder(reminder) {
  try {
    const response = await fetch(`${API_BASE_URL}/hospital/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminder)
    });
    
    // Trigger dashboard update
    triggerDashboardUpdate();
    
    return await response.json();
  } catch (error) {
    console.error('Error creating reminder:', error);
    // Fallback to local storage if API fails
    return saveToLocalStorage('reminders', reminder);
  }
}

/**
 * HOSPITAL: Get all reminders
 * @returns {Promise<Array>} Array of reminders
 */
async function getReminders() {
  try {
    const response = await fetch(`${API_BASE_URL}/hospital/reminders`);
    return await response.json();
  } catch (error) {
    console.error('Error getting reminders:', error);
    // Fallback to local storage if API fails
    return getFromLocalStorage('reminders');
  }
}

/**
 * Get upcoming activities (combined restaurant and hospital)
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Array of upcoming activities
 */
async function getUpcomingActivities(limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/upcoming?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting upcoming activities:', error);
    
    // Fallback to local implementation
    const activities = [];
    
    // Attempt to load activities from localStorage
    const reservations = getFromLocalStorage('reservations') || [];
    const orders = getFromLocalStorage('orders') || [];
    const appointments = getFromLocalStorage('appointments') || [];
    const reminders = getFromLocalStorage('reminders') || [];
    
    // Add proper types and categories
    activities.push(
      ...reservations.map(r => ({...r, type: 'reservation', category: 'restaurant'})),
      ...orders.map(o => ({...o, type: 'order', category: 'restaurant'})),
      ...appointments.map(a => ({...a, type: 'appointment', category: 'hospital'})),
      ...reminders.map(r => ({...r, type: 'reminder', category: 'hospital'}))
    );
    
    // Sort by date and return
    return activities
      .sort((a, b) => new Date(a.timestamp || a.created_at) - new Date(b.timestamp || b.created_at))
      .slice(0, limit);
  }
}

/**
 * Extract data from a conversation and save it to the server
 * @param {Object} conversation - Conversation object
 * @returns {Promise<Object>} Extracted data
 */
async function extractDataFromConversation(conversation) {
  if (!conversation || !conversation.id) {
    console.error('Invalid conversation object');
    return null;
  }
  
  try {
    // Call the extract API
    const response = await fetch(`${API_BASE_URL}/extract-from-conversation/${conversation.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Trigger dashboard update
    triggerDashboardUpdate();
    
    return await response.json();
  } catch (error) {
    console.error('Error extracting data from conversation:', error);
    return null;
  }
}

// Helper functions for localStorage fallback
function generateId(prefix) {
  return prefix + Math.random().toString(36).substr(2, 9);
}

function saveToLocalStorage(collection, item) {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  
  try {
    // Get existing data
    const storedData = localStorage.getItem('ayraData');
    let data = storedData ? JSON.parse(storedData) : { 
      conversations: [],
      reservations: [], 
      orders: [], 
      appointments: [], 
      reminders: [] 
    };
    
    // Add new item with id and timestamp
    const newItem = {
      id: generateId(collection.slice(0, 1)),
      ...item,
      timestamp: new Date().toISOString()
    };
    
    // Update collection
    data[collection] = [...data[collection], newItem];
    
    // Save back to localStorage
    localStorage.setItem('ayraData', JSON.stringify(data));
    
    // Trigger dashboard update
    triggerDashboardUpdate();
    
    return newItem;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return null;
  }
}

function getFromLocalStorage(collection, filter) {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  
  try {
    const storedData = localStorage.getItem('ayraData');
    if (!storedData) return [];
    
    const data = JSON.parse(storedData);
    const items = data[collection] || [];
    
    if (filter && collection === 'conversations') {
      return items.filter(item => item.type === filter);
    }
    
    return items;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return [];
  }
}

// Export API
const DataStore = {
  // Conversation methods
  saveConversation,
  getConversations,
  extractDataFromConversation,
  
  // Restaurant methods
  createReservation,
  getReservations,
  createOrder,
  getOrders,
  
  // Hospital methods
  createAppointment,
  getAppointments,
  createReminder,
  getReminders,
  
  // Utility methods
  getUpcomingActivities
};

// Make DataStore available globally
if (typeof window !== 'undefined') {
  window.AyraDataStore = DataStore;
}

export default DataStore; 