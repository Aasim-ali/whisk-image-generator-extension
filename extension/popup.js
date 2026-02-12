// Smart popup that directs to dashboard or login
document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.storage.local.get(['authToken'], (result) => {
    if (result.authToken) {
      chrome.tabs.create({ url: 'dashboard.html' });
    } else {
      chrome.tabs.create({ url: 'login.html' });
    }
  });
});
