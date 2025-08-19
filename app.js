// app.js — working tabs + status

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const tabBar = document.querySelector('.tab-bar');
  const tabButtons = tabBar ? tabBar.querySelectorAll('button[data-tab]') : [];
  const moreMenu = document.getElementById('moreMenu');
  const moreItems = moreMenu ? moreMenu.querySelectorAll('button[data-tab]') : [];
  const statusEl = document.getElementById('status');

  const hideAll = () => tabs.forEach(s => s.classList.remove('active'));
  const deactivateAll = () => tabButtons.forEach(b => b.classList.remove('active'));
  const closeMore = () => moreMenu && moreMenu.classList.remove('open');

  function switchTab(tabId, sourceBtn = null) {
    if (tabId === 'more') {
      if (!moreMenu) return;
      const open = moreMenu.classList.contains('open');
      moreMenu.classList.toggle('open', !open);
      if (sourceBtn) sourceBtn.classList.add('active');
      return;
    }

    closeMore();
    hideAll();
    deactivateAll();

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    const matchBtn = Array.from(tabButtons).find(b => b.dataset.tab === tabId);
    if (matchBtn) matchBtn.classList.add('active');
  }

  function updateStatus() {
    if (!statusEl) return;
    const online = navigator.onLine;
    statusEl.textContent = online ? 'Online' : 'Offline';
    statusEl.style.color = online ? '#aef7ae' : '#ff7b7b';
  }

  // Wire events
  tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn)));
  moreItems.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
  document.addEventListener('click', (e) => {
    if (!moreMenu) return;
    const clickedMoreBtn = e.target.closest('.tab-bar button[data-tab="more"]');
    const insideMenu = e.target.closest('#moreMenu');
    if (!clickedMoreBtn && !insideMenu) closeMore();
  });

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  document.addEventListener('visibilitychange', updateStatus);

  // Init
  updateStatus();
  switchTab('quotes');
});