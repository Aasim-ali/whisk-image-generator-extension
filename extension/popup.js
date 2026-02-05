// Simple popup that opens dashboard
document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'dashboard.html' });
});
