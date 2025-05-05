import Vapi from "@vapi-ai/web";
import { startAssistant, hospitalAssistantConfig, restaurantAssistantConfig } from "./vapi-config";

// Initialize UI elements
const statusDisplay = document.getElementById("status");
const speakerDisplay = document.getElementById("speaker");
const volumeDisplay = document.getElementById("volume");
const chatWindow = document.getElementById("chat");

// Create Vapi instance with your API key
const vapi = new Vapi("56c04bdd-d4df-4c52-b51f-f02f5773d499");

// State variables
let connected = false;
let assistantIsSpeaking = false;
let volumeLevel = 0;
let callActive = false;
const maxSpread = 30; // Maximum spread of the shadow in pixels
let selectedAgent = "restaurant"; // Default to restaurant agent

// Get elements from demo.html if they exist
const conversation = document.getElementById("conversation");
const callStatus = document.getElementById("callStatus");
const callInstructions = document.getElementById("callInstructions");
const typingIndicator = document.getElementById("typingIndicator");
const muteButton = document.getElementById("muteButton");
const endCallButton = document.getElementById("endCallButton");
const callButton = document.getElementById("callButton");
const restaurantOption = document.getElementById("restaurantOption");
const hospitalOption = document.getElementById("hospitalOption");

// Setup agent selection if elements exist
if (restaurantOption && hospitalOption) {
  restaurantOption.addEventListener("click", () => selectAgent("restaurant"));
  hospitalOption.addEventListener("click", () => selectAgent("hospital"));
}

// Track last conversation data
let lastConversationData = null;

// Vapi Event Listeners
vapi.on("call-start", function () {
  connected = true;
  updateUI();
  
  if (callStatus) {
    callStatus.textContent = "Connected";
    callInstructions.textContent = "Speak naturally to interact with the assistant";
  }
});

vapi.on("call-end", function () {
  connected = false;
  updateUI();

  if (callButton) {
    callButton.style.boxShadow = `0 0 0px 0px rgba(58,25,250,0.7)`;
  }
  
  if (callStatus) {
    callStatus.textContent = "Call ended";
    callInstructions.textContent = "Thank you for testing our AI assistant";
  }
  
  // Save conversation if we have data
  if (lastConversationData && window.AyraDataStore) {
    // Extract information from conversation
    const messages = lastConversationData.conversation || [];
    
    // Try to detect if this was a reservation, order, appointment, etc.
    let conversationType = 'general';
    let summary = selectedAgent === "hospital" ? "Hospital Conversation" : "Restaurant Conversation";
    let extractedData = {};
    
    // Check for restaurant bookings/orders
    if (selectedAgent === "restaurant") {
      const reservationMatch = findReservationDetails(messages);
      const orderMatch = findOrderDetails(messages);
      
      if (reservationMatch) {
        conversationType = 'reservation';
        summary = "Restaurant Reservation";
        extractedData = reservationMatch;
        
        // Save reservation to database
        saveReservationToDatabase(reservationMatch);
      } else if (orderMatch) {
        conversationType = 'order';
        summary = "Restaurant Order";
        extractedData = orderMatch;
        
        // Save order to database
        saveOrderToDatabase(orderMatch);
      }
    }
    
    // Check for hospital appointments
    if (selectedAgent === "hospital") {
      const appointmentMatch = findAppointmentDetails(messages);
      
      if (appointmentMatch) {
        conversationType = 'appointment';
        summary = "Hospital Appointment";
        extractedData = appointmentMatch;
        
        // Save appointment to database
        saveAppointmentToDatabase(appointmentMatch);
      }
    }
    
    const conversationToSave = {
      type: selectedAgent,
      agent_type: selectedAgent === "hospital" ? "Hospital Assistant" : "Restaurant Assistant",
      user_name: "Demo User",
      summary: summary,
      status: "completed",
      data: {
        ...lastConversationData,
        extractedData
      }
    };
    
    window.AyraDataStore.saveConversation(conversationToSave)
      .then(() => {
        console.log('Conversation saved to database');
        // Force dashboard to refresh if it's open in another tab
        localStorage.setItem('dashboardUpdate', Date.now().toString());
      })
      .catch(err => console.error('Error saving conversation:', err));
  }
  
  // Reset call state
  callActive = false;
  lastConversationData = null;
});

vapi.on("speech-start", function () {
  assistantIsSpeaking = true;
  updateUI();
  
  if (typingIndicator) {
    typingIndicator.style.display = "block";
  }
});

vapi.on("speech-end", function () {
  assistantIsSpeaking = false;
  updateUI();
  
  if (typingIndicator) {
    typingIndicator.style.display = "none";
  }
});

vapi.on("message", (message) => {
  // Function call handling
  if (message.type === "function-call") {
    // Handle ChangeColor function
    if (message.functionCall && message.functionCall.name === "ChangeColor") {
      if (callButton) {
        callButton.style.backgroundColor = message.functionCall.parameters.ColorCode;
      }
    }

    // Handle WriteText function
    if (message.functionCall && message.functionCall.name === "WriteText") {
      const textElement = document.getElementById("vapiTyping");
      if (textElement) {
        textElement.textContent = message.functionCall.parameters.Text;
      }
    }
  }

  // Handle conversation updates
  if (message.type === "conversation-update") {
    updateChat(message);
  }
});

vapi.on("volume-level", function (level) {
  volumeLevel = level; // Level is from 0.0 to 1.0

  // Calculate the spread directly based on the volume level
  const spread = volumeLevel * maxSpread;

  if (volumeDisplay) {
    volumeDisplay.textContent = `Volume: ${volumeLevel.toFixed(3)}`;
  }

  // Update the box shadow
  if (callButton) {
    callButton.style.boxShadow = `0 0 ${spread}px ${spread / 2}px rgba(58,25,250,0.7)`;
  }
});

vapi.on("error", function (error) {
  connected = false;

  if (error.error.message) {
    const statusMessage = document.getElementById("vapiStatusMessage");
    if (statusMessage) {
      statusMessage.textContent = error.error.message;
    }
    
    if (callStatus) {
      callStatus.textContent = "Error: " + error.error.message;
      callInstructions.textContent = "Please try again";
    }
  }

  updateUI();
});

// Add click event listeners if elements exist
if (callButton) {
  callButton.addEventListener("click", function() {
    startCall();
  });
}

if (endCallButton) {
  endCallButton.addEventListener("click", function() {
    endCall();
  });
}

// Mute functionality
if (muteButton) {
  muteButton.addEventListener("click", function() {
    toggleMute();
  });
}

// Helper functions
function selectAgent(agent) {
  selectedAgent = agent;
  
  // Update UI if elements exist
  if (restaurantOption && hospitalOption) {
    if (agent === "restaurant") {
      restaurantOption.classList.add("active");
      hospitalOption.classList.remove("active");
      if (document.getElementById("agentType")) {
        document.getElementById("agentType").textContent = "Restaurant Assistant";
      }
    } else {
      hospitalOption.classList.add("active");
      restaurantOption.classList.remove("active");
      if (document.getElementById("agentType")) {
        document.getElementById("agentType").textContent = "Hospital Assistant";
      }
    }
    
    // Show call interface
    setTimeout(() => {
      document.getElementById("agentSelection").style.display = "none";
      document.getElementById("callInterface").style.display = "block";
    }, 500);
  }
}

function startCall() {
  if (!callActive) {
    callActive = true;
    
    // Update UI
    if (callButton && endCallButton) {
      callButton.style.display = "none";
      endCallButton.style.display = "flex";
    }
    
    if (callStatus) {
      callStatus.textContent = "Connecting...";
      callInstructions.textContent = "Please wait while we connect you";
    }
    
    // Use the VAPI configuration utility to start the call
    startAssistant(vapi, selectedAgent, (errorMessage) => {
      // Error callback
      if (callStatus) {
        callStatus.textContent = "Error: " + errorMessage;
        callInstructions.textContent = "Please try again";
      }
      console.error("Error starting assistant:", errorMessage);
      
      // Reset UI
      if (callButton && endCallButton) {
        callButton.style.display = "flex";
        endCallButton.style.display = "none";
      }
      callActive = false;
    });
  }
}

function endCall() {
  if (callActive) {
    vapi.stop();
    
    // Additional UI updates for the demo page
    if (endCallButton) {
      endCallButton.style.display = "none";
    }
    
    // Show feedback section if it exists
    const feedbackSection = document.getElementById("feedbackSection");
    if (feedbackSection) {
      setTimeout(() => {
        feedbackSection.style.display = "block";
      }, 1000);
    }
  }
}

function toggleMute() {
  const isMuted = vapi.toggleMute();
  
  // Update UI
  if (muteButton) {
    if (isMuted) {
      muteButton.classList.add("active");
      muteButton.querySelector("i").className = "fas fa-microphone-slash";
    } else {
      muteButton.classList.remove("active");
      muteButton.querySelector("i").className = "fas fa-microphone";
    }
  }
}

function updateChat(conversationUpdate) {
  // Store conversation data for saving later
  lastConversationData = conversationUpdate;
  
  // Update chat in original UI if it exists
  if (chatWindow) {
    chatWindow.innerHTML = ""; // Clear the chat window before adding new messages

    conversationUpdate.conversation.forEach((message) => {
      var messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      // Add specific class based on the role
      switch (message.role) {
        case "assistant":
          messageDiv.classList.add("assistant");
          break;
        case "user":
          messageDiv.classList.add("user");
          break;
        case "tool": // You might want a different style for tool responses
          messageDiv.classList.add("tool");
          break;
      }

      // Set text content and handle tool calls if they exist
      if (message.content) {
        messageDiv.textContent = message.content;
      } else if (message.tool_calls && message.tool_calls.length > 0) {
        // Example: Append a generic message or handle differently
        messageDiv.textContent = "Processing request...";
      }

      chatWindow.appendChild(messageDiv);
    });

    // Scroll to the bottom of the chat window
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
  
  // Update chat in demo UI if it exists
  if (conversation) {
    conversation.innerHTML = "";
    
    conversationUpdate.conversation.forEach((message) => {
      if (message.content) {
        addMessage(message.role, message.content);
      }
    });
  }
}

// Add a message to the conversation
function addMessage(sender, text) {
  if (!conversation) return;
  
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;
  
  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  
  const messageText = document.createElement("p");
  messageText.textContent = text;
  
  const timeDiv = document.createElement("div");
  timeDiv.className = "message-time";
  
  // Get current time
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  timeDiv.textContent = `${hours}:${minutes}`;
  
  contentDiv.appendChild(messageText);
  contentDiv.appendChild(timeDiv);
  messageDiv.appendChild(contentDiv);
  conversation.appendChild(messageDiv);
  
  // Scroll to bottom
  conversation.scrollTop = conversation.scrollHeight;
}

function updateUI() {
  // Update the status if element exists
  if (statusDisplay) {
    statusDisplay.textContent = `Status: ${connected ? "Connected" : "Disconnected"}`;
  }

  // Update the speaker if element exists
  if (speakerDisplay) {
    speakerDisplay.textContent = `Speaker: ${assistantIsSpeaking ? "Assistant" : "User"}`;
  }
}

// Restaurant assistant configuration
const restaurantAssistantOptions = {
  name: "ayra 1",
  voice: {
    voiceId: "Neha",
    provider: "vapi"
  },
  model: {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "[Identity]  \nYou are a professional and friendly AI assistant skilled in managing a wide range of customer interactions for restaurants. Your role is to provide exceptional customer service by attending to calls, scheduling reservations, taking orders, and resolving typical customer inquiries.  \n\n[Style]  \n- Maintain a warm, approachable, and amiable tone.  \n- Use clear and simple language to ensure understanding.  \n- Be engaging and attentive, adapting speech to be both polite and friendly.\n\n[Response Guidelines]  \n- Address customer inquiries promptly and accurately.  \n- Offer helpful suggestions and alternatives when needed.  \n- Confirm understanding by summarizing key points before concluding each interaction.  \n- Use natural conversational pauses to reflect realistic speech patterns.\n\n[Task & Goals]  \n1. Greet the customer cheerfully and express readiness to assist.  \n2. Identify the purpose of the call by asking open-ended questions.  \n3. For restaurant-related queries:  \n    - Handle reservations by confirming details and preferences.  \n    - Offer information about menus, dietary options, or special events.  \n    - Accept orders for takeout or delivery confidently and efficiently.  \n4. Execute customer requests such as recording feedback or answering frequently asked questions.  \n5. Engage the customer by suggesting additional services or promotions to enhance their experience.  \n6. Offer to assist with any other needs before ending the call, ensuring the customer feels acknowledged and supported.  \n7. Close the call with gratitude, inviting customers to reach out anytime for further assistance.\n\n[Error Handling / Fallback]  \n- If a request is ambiguous, ask clarifying questions to pinpoint needs accurately.  \n- For out-of-business or context-specific queries, politely state the limitation and offer a relevant alternative response if possible.  \n- Apologize for any inconvenience caused by system errors and provide instructions for follow-up actions or alternative contact methods."
      }
    ],
    provider: "openai",
    temperature: 0.5
  },
  firstMessage: "Hello, thank you for calling Ayra Restaurant. How can I help you today?",
  voicemailMessage: "Please call back when you're available.",
  endCallMessage: "Thank you for calling Ayra Restaurant. Have a wonderful day!",
  transcriber: {
    model: "nova-3",
    language: "en",
    numerals: false,
    provider: "deepgram",
    endpointing: 300,
    confidenceThreshold: 0.4
  },
  clientMessages: [
    "transcript",
    "hang",
    "function-call",
    "speech-update",
    "metadata",
    "transfer-update",
    "conversation-update",
    "workflow.node.started"
  ],
  serverMessages: [
    "end-of-call-report",
    "status-update",
    "hang",
    "function-call"
  ],
  hipaaEnabled: false,
  backchannelingEnabled: false,
  backgroundDenoisingEnabled: false,
  startSpeakingPlan: {
    waitSeconds: 0.6,
    smartEndpointingEnabled: "livekit"
  }
};

// Helper functions to extract information from conversation

/**
 * Extract reservation details from conversation
 */
function findReservationDetails(messages) {
  // Look for patterns like "table for X people", "reservation for X", dates, times, etc.
  let name = '';
  let phone = '';
  let date = '';
  let time = '';
  let guests = 0;
  let specialRequests = '';
  
  for (const message of messages) {
    const content = message.content || '';
    
    // Extract name
    const nameMatch = content.match(/name is ([A-Za-z\s]+)/i) || content.match(/for ([A-Za-z\s]+)/i);
    if (nameMatch && !name) name = nameMatch[1].trim();
    
    // Extract phone
    const phoneMatch = content.match(/phone (?:number|is) ([0-9\-\+\s]+)/i);
    if (phoneMatch && !phone) phone = phoneMatch[1].trim();
    
    // Extract date
    const dateMatch = content.match(/(?:on|for) ([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?)/i) || 
                     content.match(/(?:on|for) (\d{1,2}(?:st|nd|rd|th)? of [A-Za-z]+)/i) ||
                     content.match(/(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/);
    if (dateMatch && !date) {
      date = dateMatch[1].trim();
      
      // Try to convert to YYYY-MM-DD format
      try {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString().split('T')[0];
        }
      } catch (e) {
        // Use as is if parsing fails
      }
    }
    
    // Extract time
    const timeMatch = content.match(/at (\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
    if (timeMatch && !time) {
      time = timeMatch[1].trim();
      
      // Try to convert to 24-hour format
      try {
        const [hourMin, period] = time.split(/\s+/);
        let [hour, min = '00'] = hourMin.split(':');
        hour = parseInt(hour);
        
        if (period.toLowerCase() === 'pm' && hour < 12) hour += 12;
        if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
        
        time = `${hour.toString().padStart(2, '0')}:${min}`;
      } catch (e) {
        // Use as is if parsing fails
      }
    }
    
    // Extract guests
    const guestsMatch = content.match(/table for (\d+)/i) || content.match(/(\d+) people/i) || content.match(/party of (\d+)/i);
    if (guestsMatch && !guests) guests = parseInt(guestsMatch[1]);
    
    // Extract special requests
    const requestsMatch = content.match(/(?:special requests?|notes?|preferences?)(?:\s*:)?\s*(.+?)(?:\.|$)/i);
    if (requestsMatch && !specialRequests) specialRequests = requestsMatch[1].trim();
  }
  
  // Only return if we have at least name and date/time
  if (name && (date || time)) {
    return { name, phone, date, time, guests, specialRequests };
  }
  
  return null;
}

/**
 * Extract order details from conversation
 */
function findOrderDetails(messages) {
  let name = '';
  let phone = '';
  let address = '';
  let items = [];
  let total = 0;
  let type = 'pickup'; // default to pickup
  
  for (const message of messages) {
    const content = message.content || '';
    
    // Extract name
    const nameMatch = content.match(/name is ([A-Za-z\s]+)/i) || content.match(/for ([A-Za-z\s]+)/i);
    if (nameMatch && !name) name = nameMatch[1].trim();
    
    // Extract phone
    const phoneMatch = content.match(/phone (?:number|is) ([0-9\-\+\s]+)/i);
    if (phoneMatch && !phone) phone = phoneMatch[1].trim();
    
    // Extract address for delivery
    const addressMatch = content.match(/(?:address|deliver to) (?:is|at) (.+?)(?:\.|$)/i);
    if (addressMatch && !address) {
      address = addressMatch[1].trim();
      type = 'delivery';
    }
    
    // Check if delivery is mentioned
    if (content.match(/delivery|deliver to me|bring it to/i)) {
      type = 'delivery';
    }
    
    // Extract items
    const itemMatch = content.match(/(?:order|like|want)(?:\s+to\s+order)?(?:\s+a|\s+an|\s+the|\s+some|\s+)?\s+(.+?)(?:\.|$)/i);
    if (itemMatch) {
      const itemText = itemMatch[1].trim();
      // Try to parse items like "2 pizzas and a salad"
      const itemList = itemText.split(/(?:,|\s+and\s+)/);
      
      itemList.forEach(item => {
        const quantityMatch = item.match(/(\d+)\s+(.+)/);
        if (quantityMatch) {
          items.push({
            name: quantityMatch[2].trim(),
            quantity: parseInt(quantityMatch[1]),
            price: 0
          });
        } else {
          items.push({
            name: item.trim(),
            quantity: 1,
            price: 0
          });
        }
      });
    }
  }
  
  // Only return if we have at least name and some items
  if (name && items.length > 0) {
    // Generate a simple total based on items
    total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    return { name, phone, address, items, total, type };
  }
  
  return null;
}

/**
 * Extract appointment details from conversation
 */
function findAppointmentDetails(messages) {
  let patientName = '';
  let patientId = '';
  let phone = '';
  let doctor = '';
  let department = '';
  let date = '';
  let time = '';
  let reason = '';
  
  for (const message of messages) {
    const content = message.content || '';
    
    // Extract patient name
    const nameMatch = content.match(/name is ([A-Za-z\s]+)/i) || content.match(/for ([A-Za-z\s]+)/i);
    if (nameMatch && !patientName) patientName = nameMatch[1].trim();
    
    // Extract patient ID
    const idMatch = content.match(/(?:patient|ID|identification) (?:number|id|is) ([a-zA-Z0-9\-]+)/i);
    if (idMatch && !patientId) patientId = idMatch[1].trim();
    
    // Extract phone
    const phoneMatch = content.match(/phone (?:number|is) ([0-9\-\+\s]+)/i);
    if (phoneMatch && !phone) phone = phoneMatch[1].trim();
    
    // Extract doctor
    const doctorMatch = content.match(/(?:Dr\.|Doctor) ([A-Za-z\s]+)/i);
    if (doctorMatch && !doctor) doctor = doctorMatch[1].trim();
    
    // Extract department
    const deptMatch = content.match(/(?:department|clinic|speciality) (?:of|is) ([A-Za-z\s]+)/i);
    if (deptMatch && !department) department = deptMatch[1].trim();
    
    // Extract date
    const dateMatch = content.match(/(?:on|for) ([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?)/i) || 
                     content.match(/(?:on|for) (\d{1,2}(?:st|nd|rd|th)? of [A-Za-z]+)/i) ||
                     content.match(/(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/);
    if (dateMatch && !date) {
      date = dateMatch[1].trim();
      
      // Try to convert to YYYY-MM-DD format
      try {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString().split('T')[0];
        }
      } catch (e) {
        // Use as is if parsing fails
      }
    }
    
    // Extract time
    const timeMatch = content.match(/at (\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
    if (timeMatch && !time) {
      time = timeMatch[1].trim();
      
      // Try to convert to 24-hour format
      try {
        const [hourMin, period] = time.split(/\s+/);
        let [hour, min = '00'] = hourMin.split(':');
        hour = parseInt(hour);
        
        if (period.toLowerCase() === 'pm' && hour < 12) hour += 12;
        if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
        
        time = `${hour.toString().padStart(2, '0')}:${min}`;
      } catch (e) {
        // Use as is if parsing fails
      }
    }
    
    // Extract reason
    const reasonMatch = content.match(/(?:appointment|visit|reason|consult) (?:for|is|about) ([^.]+)/i);
    if (reasonMatch && !reason) reason = reasonMatch[1].trim();
  }
  
  // Only return if we have at least name and date/time
  if (patientName && (date || time)) {
    return { 
      patient_name: patientName, 
      patient_id: patientId, 
      phone, 
      doctor, 
      department, 
      date, 
      time, 
      reason 
    };
  }
  
  return null;
}

/**
 * Save reservation to database
 */
async function saveReservationToDatabase(reservation) {
  try {
    await window.AyraDataStore.createReservation(reservation);
    console.log('Reservation saved to database:', reservation);
  } catch (error) {
    console.error('Error saving reservation:', error);
  }
}

/**
 * Save order to database
 */
async function saveOrderToDatabase(order) {
  try {
    await window.AyraDataStore.createOrder(order);
    console.log('Order saved to database:', order);
  } catch (error) {
    console.error('Error saving order:', error);
  }
}

/**
 * Save appointment to database
 */
async function saveAppointmentToDatabase(appointment) {
  try {
    await window.AyraDataStore.createAppointment(appointment);
    console.log('Appointment saved to database:', appointment);
  } catch (error) {
    console.error('Error saving appointment:', error);
  }
}

// Initialize UI based on current page
window.onload = function() {
  // Handle original call page
  const callWithVapi = document.getElementById("callWithVapi");
  if (callWithVapi) {
    callWithVapi.addEventListener("click", function () {
      if (!callActive) {
        callActive = true;
        callWithVapi.style.backgroundColor = "#007aff";
        vapi.start("c0d1a35c-8098-461c-a247-3338b8b4c647", restaurantAssistantOptions);
      } else {
        callActive = false;
        callWithVapi.style.backgroundColor = "#858585";
        vapi.stop();
      }
    });
    
    // Initialize background with the correct color
    callWithVapi.style.backgroundColor = "#858585";
  }
};
