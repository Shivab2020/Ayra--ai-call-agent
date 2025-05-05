/**
 * VAPI Configuration Utility
 * Handles proper initialization and configuration for VAPI assistants
 */

// Hospital assistant configuration
const hospitalAssistantConfig = {
  id: "3c12b787-9779-4fbb-becc-cd9942d191ae",
  options: {
    name: "ayra hospital agent",
    voice: {
      voiceId: "Neha",
      provider: "vapi"
    },
    model: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Hospital Knowledge Base – Bengaluru \nAssistant Personality & Behaviour \n Greeting when receiving call: \"Namaste! Thank you for calling Bengaluru HealthConnect. \nHow may I assist you today?\" \n Personality: Friendly, informative, empathetic, patient, and always respectful. \n Communication Style: Clear, concise, polite, and calm. Should handle elderly and \ndistressed callers with extra care. \n Able to handle multiple types of queries (general, emergency, booking, feedback, etc.) with \nease. \n Able to confirm caller identity when needed, maintain confidentiality. \n Transition conversations smoothly between topics. \n Use positive language and proactive assistance. \n Ending the call: \"Thank you for choosing Bengaluru HealthConnect. Take care and have a \nhealthy day ahead!\""
        }
      ],
      provider: "openai",
      temperature: 0.5
    },
    firstMessage: "Namaste! Thank you for calling Bengaluru HealthConnect. How may I assist you today?",
    voicemailMessage: "Please call back when you're available.",
    endCallMessage: "Thank you for choosing Bengaluru HealthConnect. Take care and have a healthy day ahead!",
    transcriber: {
      model: "nova-3",
      language: "en",
      provider: "deepgram",
      endpointing: 300
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
  }
};

// Restaurant assistant configuration
const restaurantAssistantConfig = {
  id: "c0d1a35c-8098-461c-a247-3338b8b4c647",
  options: {
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
  }
};

/**
 * Start a VAPI assistant with appropriate error handling
 * @param {object} vapi - VAPI instance
 * @param {string} type - Assistant type ('hospital' or 'restaurant')
 * @param {function} onError - Error callback function
 */
function startAssistant(vapi, type, onError) {
  try {
    if (!vapi) {
      console.error('VAPI instance not initialized');
      if (onError) onError('VAPI instance not initialized');
      return;
    }

    // Select configuration based on type
    const config = type === 'hospital' ? hospitalAssistantConfig : restaurantAssistantConfig;
    
    // Try different initialization methods based on VAPI requirements
    try {
      // First attempt - use SDK's preferred format
      console.log(`Attempting to start ${type} assistant with ID: ${config.id}`);
      vapi.start(config.id, config.options);
    } catch (error) {
      console.warn(`First attempt failed: ${error.message}`);
      
      try {
        // Second attempt - combined config
        console.log(`Trying alternate approach for ${type} assistant`);
        const combinedConfig = { 
          assistantId: config.id,
          ...config.options
        };
        vapi.start(combinedConfig);
      } catch (secondError) {
        console.warn(`Second attempt failed: ${secondError.message}`);
        
        // Third attempt - minimal config
        console.log(`Trying minimal config for ${type} assistant`);
        vapi.start({ assistantId: config.id });
      }
    }
  } catch (error) {
    console.error(`Error starting ${type} assistant:`, error);
    if (onError) onError(error.message || 'Failed to start assistant');
  }
}

// Export the configurations and utility function
export {
  hospitalAssistantConfig,
  restaurantAssistantConfig,
  startAssistant
}; 