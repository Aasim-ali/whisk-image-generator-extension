document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    chrome.storage.local.get(['authToken'], (result) => {
        if (result.authToken) {
            window.location.href = 'dashboard.html';
        }
    });

    const CLIENT_URL = 'https://whisk-image-generator-extension.vercel.app'; // Should match your client URL

    document.getElementById('loginGoogle').addEventListener('click', () => {
        chrome.tabs.create({ url: `${CLIENT_URL}/login?extension=true` });
    });

    document.getElementById('loginEmail').addEventListener('click', () => {
        chrome.tabs.create({ url: `${CLIENT_URL}/login?extension=true` });
    });

    document.getElementById('createAccount').addEventListener('click', () => {
        chrome.tabs.create({ url: `${CLIENT_URL}/register?extension=true` });
    });

    // Listen for storage changes (login success from content script)
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.authToken && changes.authToken.newValue) {
            window.location.href = 'dashboard.html';
        }
    });

});
