// ================================
// App.js - Tab switching + status
// ================================

// Grab references
const tabs = document.querySelectorAll('.tab');
const buttons = document.querySelectorAll('.tab-bar button');
const moreMenu = document.getElementById('moreMenu');
const statusEl = document.getElementById('status');

// Switch tab function
function switchTab(tabId, btn) {
  // Hide all tabs
  tabs.forEach(tab => tab.classList.remove('active'));
  // Deactivate all buttons
  buttons.forEach(b => b.classList.remove('active'));

  // If it's the "more" tab
  if (tabId === 'more') {
    moreMenu.style.display =
      moreMenu.style.display === 'block' ? 'none' : 'block';
    btn.classList.add('active');
  } else {
    moreMenu.style.display = 'none';
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
  }
}

// Online/offline status
function updateStatus() {
  if (navigator.onLine) {
    statusEl.textContent = 'Online';
    statusEl.style.color = '#aef7ae';
  } else {
    statusEl.textContent = 'Offline';
    statusEl.style.color = '#ff7b7b';
  }
}

// Init
updateStatus();
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

// Attach listeners to tab-bar buttons
buttons.for
