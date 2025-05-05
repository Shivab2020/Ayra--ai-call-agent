# Ayra AI Call Agent Dashboard

A modern web dashboard for managing and monitoring AI-powered call agent activities for restaurants and hospitals.

![Ayra Dashboard Screenshot](dashboard-screenshot.png)

## Overview

Ayra is an AI-powered call agent system that handles restaurant reservations, food orders, hospital appointments, and medical follow-ups. This dashboard provides a comprehensive interface for administrators to monitor call activities, track performance metrics, and manage upcoming activities.

## Features

- **Real-time Analytics Dashboard**: View key metrics including total conversations, restaurant orders, hospital appointments, and task success rates.
- **Agent Performance Tracking**: Monitor average ratings, task completion rates, and average call times.
- **City-wise Performance**: Track performance across major Indian cities including Bengaluru, Chennai, Hyderabad, and Kochi.
- **Upcoming Activities Management**: View and manage upcoming restaurant reservations and hospital appointments.
- **Conversation History**: Access detailed call transcripts and extracted data from conversations.
- **Multi-language Support**: Interface available in English and South Indian languages (Tamil, Telugu, Malayalam, Kannada, and Hindi).
- **Indian Localization**: Indian number formatting, currency (₹), and date/time formats.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing in different environments.
- **Notification System**: Real-time notifications and alerts for important activities.

## Technology Stack

- **Frontend**:
  - HTML5, CSS3, JavaScript (ES6+)
  - Bootstrap 5 for responsive layout
  - Font Awesome for icons
  - Custom CSS for theming and components

- **JavaScript Libraries**:
  - Indian Localization utilities
  - Multi-language support system
  - Notification handler

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/ayra-agent.git
   ```

2. Navigate to the project directory:
   ```
   cd ayra-agent/vapi-web-calling
   ```

3. Open the dashboard in a web browser:
   ```
   open dashboard.html
   ```

## Project Structure

- `dashboard.html` - Main dashboard interface
- `dashboard.js` - Core dashboard functionality
- `indian-localization.js` - Indian localization utilities
- `language-handler.js` - Multi-language support
- `notification-handler.js` - Toast notifications and alerts
- `data-store.js` - Data handling and storage

## Usage

1. **Dashboard Navigation**: Use the top navigation to access different sections of the application.
2. **Filtering Data**: Use the date range selector to filter dashboard data.
3. **Language Selection**: Switch between languages using the language dropdown.
4. **Theme Toggle**: Switch between light and dark mode using the theme toggle button.
5. **Notifications**: Access notifications by clicking the bell icon.

## Development and Customization

### Adding New Features

1. Modify the HTML structure in `dashboard.html`
2. Add corresponding functionality in `dashboard.js`
3. Update styles in the `<style>` section or create a separate CSS file

### Adding New Languages

1. Add translation entries to the `translations` object in `language-handler.js`
2. Add corresponding font imports for proper rendering

### Customizing Dashboard Metrics

Modify the dashboard stats section in `dashboard.html` and update the corresponding data handling in `dashboard.js`.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Bootstrap team for the responsive framework
- Font Awesome for the icon set
- Google Fonts for the Noto Sans font family used for Indian languages
