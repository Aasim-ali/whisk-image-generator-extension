importScripts('db.js');
importScripts('libs/socket.io.min.js');

// Background Service Worker - Tab Management & Coordination

let whiskTab;
let isRunning = false;
let currentImageIndex = 0;
let totalImages = 0;
let promptCounts = 0;
const imageDownloadSet = new Set();
// ... existing listeners ...

let socket = null;
let dailyLimitReached = false;

// Initialize Socket from background
async function initSocket() {
  const result = await chrome.storage.local.get(["authToken", "deviceId"]);
  if (result.authToken && result.deviceId) {
    connectBgSocket(result.authToken, result.deviceId);
  }
}

function connectBgSocket(token, deviceId) {
  if (socket && socket.connected) return;

  const API_URL = "https://whisk-api.duckdns.org";

  socket = io(API_URL, {
    auth: { token, deviceId },
    transports: ['websocket', 'polling']
  });

  socket.on("connect", () => {
    console.log("Background: Connected to Socket.io");
    sendMessageToPopup({ action: "SOCKET_CONNECTED" });
  });

  socket.on("disconnect", () => {
    console.log("Background: Disconnected from Socket.io");
    sendMessageToPopup({ action: "SOCKET_DISCONNECTED" });
  });

  socket.on("init_state", (data) => {
    console.log("Background: Init State", data);
    chrome.storage.local.set({
      dailyUsage: data.dailyUsage,
      dailyLimit: data.dailyLimit,
      planName: data.planName
    });
    // Optional: Notify popup
    sendMessageToPopup({ action: "LIMITS_UPDATED", data });
  });

  socket.on("limit_reached", (data) => {
    dailyLimitReached = true;
    console.log("Background: Limit Reached");
    sendLogToPopup("⚠️ Daily limit reached. Stopping...", "error");
    stopGeneration();
    chrome.storage.local.set({ dailyLimitReached: true });
  });

  socket.on("update_usage", (data) => {
    console.log("Background: Usage Update", data);
    chrome.storage.local.set({
      dailyUsage: data.dailyUsage,
      dailyLimit: data.dailyLimit
    });
    sendMessageToPopup({ action: "LIMITS_UPDATED", data });
  });
}

// Watch for token changes (login)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && (changes.authToken || changes.deviceId)) {
    initSocket();
  }
});

// Fallback: Capture token directly in background if content script fails
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('/extension-callback')) {
    try {
      const url = new URL(tab.url);
      const token = url.searchParams.get('token');
      const userStr = url.searchParams.get('user');

      if (token) {
        const data = { authToken: token };
        if (userStr && userStr !== "undefined" && userStr !== "null") {
          try {
            data.user = JSON.parse(decodeURIComponent(userStr));
          } catch (e) {
            console.log("Error parsing user in background:", e);
          }
        }

        chrome.storage.local.set(data, () => {
          console.log("Background: Token captured from URL and saved.");
          // Visual feedback
          // chrome.action.setBadgeText({ text: "ON" });
          // chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });

          // Optional: Close the tab after a delay to improve UX
          setTimeout(() => {
            chrome.tabs.remove(tabId).catch(() => { });
          }, 3000);
        });
      }
    } catch (e) {
      console.error("Error processing callback URL in background:", e);
    }
  }
});

// Init on load
initSocket();

// ... (keep existing listeners and helper functions like startGeneration, waitForTabsReady, openWhiskTab, closeTabs, generateKey) ...

async function getStorageDataSafely(index, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // parallel fetch from IDB and local storage
    const [images, promptsData, sceneImage, styleImage] = await Promise.all([
      db.getImages(),
      chrome.storage.local.get(["prompts"]),
      db.getSceneImage(),
      db.getStyleImage()
    ]);

    const prompts = promptsData?.prompts;

    if (Array.isArray(images) && images[index]) {
      return { images, prompts, sceneImage, styleImage };
    }

    sendLogToPopup(
      `⚠️ Image ${index + 1} not ready (retry ${attempt}/${maxRetries})`,
      "warning",
    );

    await sleep(500 * attempt); // backoff
  }

  throw new Error(`Image ${index + 1} not available after retries`);
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_GENERATION") {
    if (dailyLimitReached) {
      sendLogToPopup("❌ Daily limit reached. Cannot start.", "error");
      return;
    }
    // ⛔ Block if socket not connected
    if (!socket || !socket.connected) {
      sendLogToPopup("❌ Not connected to server. Please wait or re-login.", "error");
      sendMessageToPopup({ action: "SOCKET_DISCONNECTED" });
      return;
    }
    startGeneration(message.data, message.resume === true);
  }

  if (message.action === "STOP_GENERATION") {
    stopGeneration();
  }

  // Let dashboard query the live socket state
  if (message.action === "GET_SOCKET_STATUS") {
    sendResponse({ connected: !!(socket && socket.connected) });
    return true;
  }

  if (message.action === "CONTENT_LOG") {
    sendLogToPopup(message.text, message.type);
  }

  if (message.action === "TASK_COMPLETE") {
    handleTaskComplete(message.data);
  }

  if (message.action === "TASK_ERROR") {
    handleTaskError(message.data, message.error);
  }

  if (message.action === "DOWNLOAD_IMAGE") {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false,
    });
  }

  if (message.action === "ACTIVATE_ME") {
    chrome.tabs.update(sender.tab.id, { active: true });
  }

  if (message.action === "GET_TAB_ID") {
    sendResponse(sender.tab?.id);
  }

  if (message.action === "WAIT_FOR_DOWNLOAD") {
    const customFilename = message.filename;
    const timeout = 60000; // Increased timeout for Whisk

    let responded = false;

    const timer = setTimeout(() => {
      if (responded) return;
      responded = true;
      chrome.downloads.onCreated.removeListener(listener);
      sendResponse({ success: false });
    }, timeout);

    async function listener(downloadItem) {
      if (responded || !downloadItem) return;

      if (imageDownloadSet.has(downloadItem.url)) return;

      imageDownloadSet.add(downloadItem.url);
      responded = true;
      clearTimeout(timer);
      chrome.downloads.onCreated.removeListener(listener);

      chrome.downloads.cancel(downloadItem.id, () => {
        chrome.downloads.download(
          {
            url: downloadItem.url,
            filename: customFilename,
            saveAs: false,
          },
          (newDownloadId) => {
            if (chrome.runtime.lastError) {
              sendResponse({
                success: false,
                error: chrome.runtime.lastError.message,
              });
            } else {
              sendResponse({ success: true, downloadId: newDownloadId });
            }
          },
        );
      });
    }

    chrome?.downloads?.onCreated?.addListener(listener);
    return true;
  }
});

// Start Generation Process
async function startGeneration(data, resume = false) {
  if (isRunning) return;
  if (dailyLimitReached) {
    sendLogToPopup("❌ Daily limit reached.", "error");
    return;
  }

  const saved = resume ? await loadProgress() : null;

  isRunning = true;
  totalImages = data.imageCount;
  currentImageIndex = saved ? saved.currentImageIndex : 0;
  promptCounts = data.prompts.length;

  if (!resume && data.mode) {
    await chrome.storage.local.set({
      mode: data.mode,
    });
  }

  sendLogToPopup(
    resume
      ? `▶️ Resuming from image ${currentImageIndex + 1}/${totalImages}`
      : "🚀 Starting fresh generation",
    "success",
  );

  try {
    await saveProgress();
    await processNextImage();
  } catch (error) {
    sendLogToPopup(`❌ Error: ${error.message}`, "error");
    sendErrorToPopup(error.message);
    stopGeneration();
  }
}

function waitForTabsReady(
  tabId,
  { timeout = 30000, pollInterval = 1000 } = {},
) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    async function checkTabs() {
      try {
        const tab = await chrome.tabs.get(tabId);
        if (!tab || tab.status !== "complete") return retry();
        resolve(true);
      } catch (err) {
        return retry();
      }
    }

    function retry() {
      if (Date.now() - start > timeout) {
        reject(new Error("Timeout: Tab did not become ready"));
        return;
      }
      setTimeout(checkTabs, pollInterval);
    }

    checkTabs();
  });
}

async function openWhiskTab() {
  whiskTab = null;
  sendLogToPopup("🔧 Opening Whisk tab...", "info");
  const tab = await chrome.tabs.create({
    url: "https://labs.google/fx/tools/whisk/project",
    active: false,
  });
  whiskTab = tab.id;
  await waitForTabsReady(whiskTab);

  // Verify we're on the correct page and not redirected to login
  const tabInfo = await chrome.tabs.get(whiskTab);
  if (tabInfo.url.includes('accounts.google.com') || tabInfo.url.includes('/signin')) {
    sendLogToPopup("⚠️ Whisk requires Google login. Please log in to Google in your browser first.", "error");
    throw new Error("LOGIN_REQUIRED: Please log into Google and try again");
  }

  // Verify content script is ready
  await verifyContentScriptReady(whiskTab);
}

async function closeTabs() {
  if (whiskTab) {
    chrome.tabs.remove(whiskTab).catch(() => { });
    whiskTab = null;
  }
}

function generateKey() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function verifyContentScriptReady(tabId, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await chrome.tabs.sendMessage(tabId, {
        action: "CHECK_TAB_READY"
      });

      if (response && response.ready) {
        sendLogToPopup("✓ Content script ready", "info");
        return true;
      }
    } catch (error) {
      // Content script not ready yet
    }

    await sleep(500);
  }

  throw new Error("Content script failed to load");
}



async function processNextImage() {
  const MAX_RETRIES_PER_IMAGE = 3;
  const failedImages = [];

  while (true) {
    // ✅ Stop condition (single exit point)
    if (!isRunning || currentImageIndex >= totalImages) {
      await clearProgress();

      // Log summary of failed images at the end
      if (failedImages.length > 0) {
        sendLogToPopup(
          `\n⚠️ Summary: ${failedImages.length} image(s) failed:\n${failedImages.map(f => `  • Image ${f.index + 1}: ${f.error}`).join('\n')}`,
          "warning",
        );
      }

      sendLogToPopup("🎉 All images processed!", "success");
      sendMessageToPopup({ action: "COMPLETE" });
      stopGeneration(true);
      return;
    }

    if (dailyLimitReached) {
      sendLogToPopup("🛑 Stopping due to daily limit.", "error");
      stopGeneration();
      return;
    }

    const imageNumber = currentImageIndex + 1;
    let imageSuccess = false;
    let lastError = null;

    sendLogToPopup(`\n${"=".repeat(50)}`, "info");
    sendLogToPopup(
      `🖼️  PROCESSING IMAGE ${imageNumber}/${totalImages}`,
      "success",
    );
    sendLogToPopup(`${"=".repeat(50)}`, "info");
    sendStatusToPopup(`Processing image ${imageNumber}/${totalImages}...`);

    // RETRY LOOP for each image
    for (let retry = 0; retry < MAX_RETRIES_PER_IMAGE; retry++) {
      try {
        if (retry > 0) {
          sendLogToPopup(`🔄 Retry ${retry}/${MAX_RETRIES_PER_IMAGE - 1} for image ${imageNumber}`, "warning");
          await closeTabs();
        }

        if (!whiskTab) {
          await closeTabs();
          await openWhiskTab();
        }

        // 🔐 Safe storage read with retry
        const { images, prompts, sceneImage, styleImage } =
          await getStorageDataSafely(currentImageIndex);

        const currentImage = images[currentImageIndex];
        const tabId = whiskTab;

        const key = generateKey();
        const taskKey = `task_${key}`;

        sendLogToPopup(
          `\n🧪 Processing batch of ${promptCounts} prompt(s)...`,
          "info",
        );

        await chrome.storage.session.set({
          [taskKey]: {
            tabId,
            imageIndex: currentImageIndex,
            totalPrompts: promptCounts,
            status: "pending",
            createdAt: Date.now(),
          },
        });

        chrome.tabs.sendMessage(tabId, {
          action: "GENERATE_IMAGE_BATCH",
          data: {
            image: currentImage,
            sceneImage: sceneImage || null,
            styleImage: styleImage || null,
            prompts,
            imageIndex: currentImageIndex,
            imageName: currentImage.name,
            key,
          },
        });

        const result = await waitForTask(key);

        if (!result.success) {
          throw new Error(result.error || "Batch processing failed");
        } else {
          sendLogToPopup(
            `✅ Batch complete! (${promptCounts} variations)`,
            "success",
          );
          // ✨ REPORT USAGE ✨
          if (socket && socket.connected) {
            socket.emit("task_complete", { count: 1 });
            // Wait slightly for limit check?
            await sleep(500);
          }
        }

        await clearSessionTasks();
        imageSuccess = true;
        break; // Success, exit retry loop

      } catch (error) {
        lastError = error;
        sendLogToPopup(`⚠️ Attempt ${retry + 1} failed: ${error.message}`, "warning");

        // Check if error is fatal (e.g., login required)
        if (error.message.includes("LOGIN_REQUIRED")) {
          sendLogToPopup("❌ Fatal error: Login required. Please log in and restart.", "error");
          sendErrorToPopup("Please log into Google and restart generation");
          stopGeneration();
          return;
        }

        if (retry < MAX_RETRIES_PER_IMAGE - 1) {
          const backoffTime = 2000 * (retry + 1); // Exponential backoff
          sendLogToPopup(`⏳ Waiting ${backoffTime}ms before retry...`, "info");
          await sleep(backoffTime);
        }
      }
    }

    // After all retries
    if (!imageSuccess) {
      failedImages.push({
        index: currentImageIndex,
        error: lastError?.message || "Unknown error"
      });
      sendLogToPopup(
        `❌ Image ${imageNumber} failed after ${MAX_RETRIES_PER_IMAGE} attempts. Continuing to next image...`,
        "error",
      );
    }

    // ✅ Move to next image regardless of success/failure
    currentImageIndex++;
    await saveProgress();
    imageDownloadSet.clear();

    if (currentImageIndex < totalImages) {
      sendLogToPopup("⏳ Preparing for next image...", "info");
      await sleep(3000);
    }

    // 🔁 loop continues naturally
  }
}

function waitForTask(key) {
  return new Promise((resolve) => {
    const taskKey = `task_${key}`;
    const interval = setInterval(async () => {
      const result = await chrome.storage.session.get(taskKey);
      const task = result[taskKey];
      if (task?.status === "done") {
        clearInterval(interval);
        resolve({ success: true });
      }
      if (task?.status === "error") {
        clearInterval(interval);
        resolve({ success: false, error: task.error });
      }
    }, 1000);
  });
}

async function stopGeneration(skipSave = false) {
  if (!skipSave) {
    await saveProgress();
  }
  await closeTabs();
  await clearSessionTasks();
  sendLogToPopup("⏹️  Bot stopped", "warning");
  isRunning = false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendLogToPopup(text, type = "info") {
  chrome.runtime
    .sendMessage({ action: "LOG", text: text, type: type })
    .catch(() => { });
}

function sendStatusToPopup(text) {
  chrome.runtime.sendMessage({ action: "STATUS", text: text }).catch(() => { });
}

function sendErrorToPopup(text) {
  chrome.runtime.sendMessage({ action: "ERROR", text: text }).catch(() => { });
}

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage(message).catch(() => { });
}

async function handleTaskComplete(data) {
  const taskKey = `task_${data.key}`;
  await chrome.storage.session.set({
    [taskKey]: { status: "done", completedAt: Date.now() },
  });
}

async function handleTaskError(data, error) {
  const taskKey = `task_${data.key}`;
  await chrome.storage.session.set({
    [taskKey]: {
      status: "error",
      error: error.message,
      completedAt: Date.now(),
    },
  });
}

async function clearSessionTasks() {
  const all = await chrome.storage.session.get(null);
  const taskKeys = Object.keys(all).filter((k) => k.startsWith("task_"));
  await chrome.storage.session.remove(taskKeys);
}

async function saveProgress() {
  await chrome.storage.local.set({
    progress: {
      currentImageIndex,
      totalImages,
      promptCounts,
      status: isRunning ? "running" : "stopped",
    },
  });
}

async function loadProgress() {
  const { progress } = await chrome.storage.local.get("progress");
  return progress || null;
}

async function clearProgress() {
  await chrome.storage.local.remove("progress");
}
