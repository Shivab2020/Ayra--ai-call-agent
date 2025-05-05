/**
 * Notification Handler for Ayra Dashboard
 * Provides toast notifications and alert functionality
 */

// Show notification toast
function showNotification(title, message, type = 'success', duration = 5000) {
  // Create toast container if not exists
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-container', 'position-fixed', 'bottom-0', 'end-0', 'p-3');
    document.body.appendChild(toastContainer);
  }
  
  // Generate a unique ID for this toast
  const toastId = 'toast-' + Date.now();
  
  // Set icon based on notification type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle text-success me-2"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle text-warning me-2"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-times-circle text-danger me-2"></i>';
      break;
    case 'info':
    default:
      icon = '<i class="fas fa-info-circle text-info me-2"></i>';
      break;
  }
  
  // Create toast HTML
  const toastHtml = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        ${icon}
        <strong class="me-auto">${title}</strong>
        <small>${formatIndianTime(new Date())}</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>
  `;
  
  // Add toast to container
  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  
  // Initialize and show the toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: duration
  });
  toast.show();
  
  // Add to notification list if applicable
  if (type !== 'success' && title !== 'Language Changed') {
    addToNotificationList(title, message, type);
  }
  
  // Remove the toast after it's hidden
  toastElement.addEventListener('hidden.bs.toast', function() {
    toastElement.remove();
  });
}

// Add notification to the notification list
function addToNotificationList(title, message, type) {
  // Get or create notifications array in local storage
  let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  // Add new notification
  notifications.unshift({
    title,
    message,
    type,
    timestamp: new Date().toISOString()
  });
  
  // Limit to most recent 10 notifications
  if (notifications.length > 10) {
    notifications.pop();
  }
  
  // Save back to storage
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // Update notification badge
  updateNotificationBadge();
}

// Update notification badge count
function updateNotificationBadge() {
  const badge = document.querySelector('.notification-badge');
  if (!badge) return;
  
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const unreadCount = notifications.length;
  
  // Update badge
  badge.textContent = unreadCount;
  badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

// Show notification list popup
function showNotificationList() {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  // Create notification list container
  let notificationHTML = '';
  
  if (notifications.length === 0) {
    notificationHTML = '<div class="p-3 text-center text-muted">No notifications</div>';
  } else {
    notifications.forEach((notification, index) => {
      // Choose icon based on type
      let icon = '';
      switch (notification.type) {
        case 'success':
          icon = '<i class="fas fa-check-circle text-success"></i>';
          break;
        case 'warning':
          icon = '<i class="fas fa-exclamation-triangle text-warning"></i>';
          break;
        case 'error':
          icon = '<i class="fas fa-times-circle text-danger"></i>';
          break;
        case 'info':
        default:
          icon = '<i class="fas fa-info-circle text-info"></i>';
          break;
      }
      
      // Format relative time
      const relativeTime = getIndianRelativeTime(new Date(notification.timestamp));
      
      notificationHTML += `
        <div class="notification-item" data-index="${index}">
          <div class="notification-icon">${icon}</div>
          <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${relativeTime}</div>
          </div>
          <div class="notification-close">
            <button type="button" class="btn-close btn-sm" onclick="removeNotification(${index})"></button>
          </div>
        </div>
      `;
    });
    
    // Add clear all button
    notificationHTML += `
      <div class="notification-footer">
        <button type="button" class="btn btn-sm btn-outline-primary" onclick="clearAllNotifications()">
          Clear All
        </button>
      </div>
    `;
  }
  
  // Create modal for notifications
  const modalHTML = `
    <div class="modal fade" id="notificationsModal" tabindex="-1" aria-labelledby="notificationsModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="notificationsModalLabel">Notifications</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body notification-list">
            ${notificationHTML}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('notificationsModal'));
  modal.show();
  
  // Remove modal from DOM when hidden
  document.getElementById('notificationsModal').addEventListener('hidden.bs.modal', function() {
    document.getElementById('notificationsModal').remove();
  });
}

// Remove a specific notification
function removeNotification(index) {
  let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  // Remove the notification at the specified index
  notifications.splice(index, 1);
  
  // Save back to storage
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // Update notification badge
  updateNotificationBadge();
  
  // Refresh notification list if open
  const modal = document.getElementById('notificationsModal');
  if (modal) {
    // Close the current modal
    bootstrap.Modal.getInstance(modal).hide();
    
    // Show updated notification list
    setTimeout(() => {
      showNotificationList();
    }, 500);
  }
}

// Clear all notifications
function clearAllNotifications() {
  // Clear notifications from storage
  localStorage.setItem('notifications', '[]');
  
  // Update notification badge
  updateNotificationBadge();
  
  // Close the modal
  const modal = document.getElementById('notificationsModal');
  if (modal) {
    bootstrap.Modal.getInstance(modal).hide();
  }
}

// Show confirmation dialog
function showConfirmation(title, message, onConfirm, onCancel) {
  // Create modal for confirmation
  const modalHTML = `
    <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmationModalLabel">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${message}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancelBtn" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="confirmBtn">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Get modal element
  const modalElement = document.getElementById('confirmationModal');
  
  // Add event listeners for buttons
  document.getElementById('confirmBtn').addEventListener('click', function() {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
    bootstrap.Modal.getInstance(modalElement).hide();
  });
  
  document.getElementById('cancelBtn').addEventListener('click', function() {
    if (typeof onCancel === 'function') {
      onCancel();
    }
  });
  
  // Show the modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
  
  // Remove modal from DOM when hidden
  modalElement.addEventListener('hidden.bs.modal', function() {
    modalElement.remove();
  });
}

// Custom alert dialog
function showAlert(title, message) {
  // Create modal for alert
  const modalHTML = `
    <div class="modal fade" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="alertModalLabel">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${message}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show the modal
  const modalElement = document.getElementById('alertModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
  
  // Remove modal from DOM when hidden
  modalElement.addEventListener('hidden.bs.modal', function() {
    modalElement.remove();
  });
}

// Initialize notification system
document.addEventListener('DOMContentLoaded', function() {
  // Update notification badge on load
  updateNotificationBadge();
  
  // Set up notification bell click handler
  const notificationBell = document.querySelector('.notification-bell');
  if (notificationBell) {
    notificationBell.addEventListener('click', function(e) {
      e.preventDefault();
      showNotificationList();
    });
  }
  
  // Add notification styles
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .notification-list {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .notification-item {
      display: flex;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .notification-icon {
      margin-right: 10px;
      font-size: 1.5rem;
      width: 30px;
      text-align: center;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-title {
      font-weight: 600;
    }
    
    .notification-message {
      font-size: 0.85rem;
      color: #666;
    }
    
    .notification-time {
      font-size: 0.75rem;
      color: #999;
      margin-top: 3px;
    }
    
    .notification-close {
      align-self: flex-start;
    }
    
    .notification-footer {
      padding: 10px;
      text-align: center;
    }
  `;
  document.head.appendChild(styleElement);
}); 