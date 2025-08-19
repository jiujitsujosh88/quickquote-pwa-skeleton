// app.js - Clean Skeleton Version

// Simple router to switch tabs
function showTab(tabId) {
  // Hide all sections
  document.querySelectorAll('.tab-content').forEach(section => {
    section.style.display = 'none';
  });

  // Show the selected section
  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.style.display = 'block';
  }

  // Update active button style
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }
}

// Handle "More" dropdown for extra tabs
function toggleMoreMenu() {
  const menu = document.getElementById('more-menu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Auto-init first tab
document.addEventListener('DOMContentLoaded', () => {
  showTab('quotes');
});