/**
 * Indian Localization Utilities for Ayra Dashboard
 * Provides functions to format currency, dates, and other India-specific localization
 */

// Format currency values with Indian notation (e.g., ₹1,00,000)
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

// Convert numbers to Indian format with words (lakh, crore)
function formatIndianNumber(num) {
  if (isNaN(num)) return "0";
  
  if (num >= 10000000) { // 1 crore
    return (num / 10000000).toFixed(1) + ' Cr';
  } else if (num >= 100000) { // 1 lakh
    return (num / 100000).toFixed(1) + ' L';
  } else if (num >= 1000) { // 1 thousand
    return (num / 1000).toFixed(1) + ' K';
  }
  
  return num.toString();
}

// Format date and time in Indian style
function formatIndianDate(date) {
  if (!date) date = new Date();
  if (typeof date === 'string') date = new Date(date);
  
  // DD/MM/YYYY format
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

// Format time in 12-hour format with AM/PM
function formatIndianTime(date) {
  if (!date) date = new Date();
  if (typeof date === 'string') date = new Date(date);
  
  // 12-hour clock format with AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return `${hours}:${minutes} ${ampm}`;
}

// Format date and time together
function formatIndianDateTime(date) {
  return `${formatIndianDate(date)}, ${formatIndianTime(date)}`;
}

// Get relative time in Indian English (e.g., "2 hours ago", "just now")
function getIndianRelativeTime(date) {
  if (!date) return "just now";
  if (typeof date === 'string') date = new Date(date);
  
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else {
    return formatIndianDate(date);
  }
}

// Convert numerical values to words in Indian English
function convertToIndianWords(num) {
  // Handle small cases directly
  if (num === 0) return "zero";
  if (num === 1) return "one";
  
  // Define number words
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 
                'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 
                'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  // Indian number system words
  const scales = ['', 'thousand', 'lakh', 'crore'];
  
  // Function to handle chunks of numbers
  const handleChunk = (n) => {
    let result = '';
    
    // Handle hundreds
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' hundred';
      n %= 100;
      if (n > 0) result += ' and ';
    }
    
    // Handle tens and ones
    if (n > 0) {
      if (n < 20) {
        result += ones[n];
      } else {
        result += tens[Math.floor(n / 10)];
        if (n % 10 > 0) result += '-' + ones[n % 10];
      }
    }
    
    return result;
  };
  
  // For negative numbers
  if (num < 0) return 'negative ' + convertToIndianWords(-num);
  
  // Working with positive numbers
  let result = '';
  
  // Handle crores (10 million = 1 crore)
  if (num >= 10000000) {
    result += handleChunk(Math.floor(num / 10000000)) + ' crore ';
    num %= 10000000;
  }
  
  // Handle lakhs (100,000 = 1 lakh)
  if (num >= 100000) {
    result += handleChunk(Math.floor(num / 100000)) + ' lakh ';
    num %= 100000;
  }
  
  // Handle thousands
  if (num >= 1000) {
    result += handleChunk(Math.floor(num / 1000)) + ' thousand ';
    num %= 1000;
  }
  
  // Handle the rest
  if (num > 0) {
    if (result !== '') result += ' ';
    result += handleChunk(num);
  }
  
  return result.trim();
}

// Get random Indian name (South Indian focus)
function getRandomIndianName() {
  const firstNames = [
    'Arjun', 'Karthik', 'Ravi', 'Vijay', 'Suresh', 'Ramesh', 'Rajesh', 'Venkat', 
    'Aditya', 'Krishna', 'Anand', 'Prakash', 'Sunil', 'Arun', 'Murali', 'Ganesh',
    'Lakshmi', 'Priya', 'Divya', 'Kavitha', 'Ananya', 'Meena', 'Sarika', 'Deepa',
    'Sunita', 'Radha', 'Anjali', 'Pooja', 'Shalini', 'Anu', 'Vidya', 'Shanti'
  ];
  
  const lastNames = [
    'Reddy', 'Nair', 'Iyer', 'Pillai', 'Menon', 'Krishnan', 'Sharma', 'Patel',
    'Subramaniam', 'Venkatesh', 'Naidu', 'Rao', 'Desai', 'Rajan', 'Sundaram',
    'Kumar', 'Murugan', 'Acharya', 'Hegde', 'Gowda', 'Varma', 'Chetty', 'Setty'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

// Get random Indian city (South Indian focus)
function getRandomIndianCity() {
  const cities = [
    'Chennai', 'Bengaluru', 'Hyderabad', 'Kochi', 'Mysore', 'Coimbatore', 
    'Visakhapatnam', 'Mangalore', 'Trivandrum', 'Madurai', 'Tirupati', 'Puducherry',
    'Vijayawada', 'Kozhikode', 'Tirunelveli', 'Thanjavur', 'Vellore', 'Kottayam'
  ];
  
  return cities[Math.floor(Math.random() * cities.length)];
}

// Get random Indian phone number
function getRandomIndianPhoneNumber() {
  // Mobile numbers in India start with digits 6, 7, 8, or 9
  const prefixes = ['6', '7', '8', '9'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  // Generate the rest of the 9 digits
  let number = '';
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10);
  }
  
  return `+91 ${prefix}${number}`;
}

// Get random South Indian food items
function getRandomSouthIndianFood() {
  const foods = [
    'Masala Dosa', 'Idli Sambar', 'Vada', 'Appam', 'Pongal', 'Biryani', 
    'Parotta', 'Chettinad Chicken', 'Fish Curry', 'Rasam', 'Bisi Bele Bath',
    'Puttu', 'Kadala Curry', 'Upma', 'Pesarattu', 'Gongura Pachadi',
    'Medu Vada', 'Mysore Pak', 'Hyderabadi Biryani', 'Malabar Parotta'
  ];
  
  return foods[Math.floor(Math.random() * foods.length)];
}

// Apply Indian localization to all elements in the page
function applyIndianLocalization() {
  // Update all currency values
  document.querySelectorAll('[data-indian-currency]').forEach(element => {
    const value = element.getAttribute('data-indian-currency');
    if (value) {
      element.textContent = formatIndianCurrency(value);
    }
  });
  
  // Update all dates
  document.querySelectorAll('[data-indian-date]').forEach(element => {
    const date = element.getAttribute('data-indian-date');
    if (date) {
      element.textContent = formatIndianDate(new Date(date));
    }
  });
  
  // Update all times
  document.querySelectorAll('[data-indian-time]').forEach(element => {
    const time = element.getAttribute('data-indian-time');
    if (time) {
      element.textContent = formatIndianTime(new Date(time));
    }
  });
  
  // Update all datetime values
  document.querySelectorAll('[data-indian-datetime]').forEach(element => {
    const datetime = element.getAttribute('data-indian-datetime');
    if (datetime) {
      element.textContent = formatIndianDateTime(new Date(datetime));
    }
  });
  
  // Update all relative times
  document.querySelectorAll('[data-indian-relative-time]').forEach(element => {
    const time = element.getAttribute('data-indian-relative-time');
    if (time) {
      element.textContent = getIndianRelativeTime(new Date(time));
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Apply localization to the page
  applyIndianLocalization();
}); 