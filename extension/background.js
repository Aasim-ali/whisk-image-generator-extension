// Background Service Worker - Tab Management & Coordination

let whiskTab;
let isRunning = false;
let currentImageIndex = 0;
let totalImages = 0;
let promptCounts = 0;
const imageDownloadSet = new Set();

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_GENERATION") {
    startGeneration(message.data, message.resume === true);
  }

  if (message.action === "STOP_GENERATION") {
    stopGeneration();
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
}

async function closeTabs() {
  if (whiskTab) {
    chrome.tabs.remove(whiskTab).catch(() => {});
    whiskTab = null;
  }
}

function generateKey() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function getStorageDataSafely(index, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await chrome.storage.local.get([
      "images",
      "prompts",
      "sceneImage",
      "styleImage",
    ]);

    const images = result?.images;

    if (Array.isArray(images) && images[index]) {
      return result;
    }

    sendLogToPopup(
      `⚠️ Image ${index + 1} not ready (retry ${attempt}/${maxRetries})`,
      "warning",
    );

    await sleep(500 * attempt); // backoff
  }

  throw new Error(`Image ${index + 1} not available after retries`);
}

// async function processNextImage() {
//   if (!isRunning || currentImageIndex >= totalImages) {
//     // Clear progress BEFORE stopping to prevent UI from showing wrong state
//     await clearProgress();
//     sendLogToPopup("🎉 All images processed!", "success");
//     sendMessageToPopup({ action: "COMPLETE" });
//     stopGeneration(true); // skipSave = true, don't save progress when complete
//     return;
//   }

//   await closeTabs();
//   await openWhiskTab();

//   const imageNumber = currentImageIndex + 1;
//   sendLogToPopup(`\n${"=".repeat(50)}`, "info");
//   sendLogToPopup(`🖼️  PROCESSING IMAGE ${imageNumber}/${totalImages}`, "success");
//   sendLogToPopup(`${"=".repeat(50)}`, "info");
//   sendStatusToPopup(`Processing image ${imageNumber}/${totalImages}...`);

//   try {
//     const { images, prompts, sceneImage, styleImage } = await getStorageDataSafely(currentImageIndex);

//     const currentImage = images[currentImageIndex];
//     const tabId = whiskTab;

//     // Generate unique key for this batch task
//     const key = generateKey();
//     const taskKey = `task_${key}`;

//     sendLogToPopup(`\n� Processing batch of ${promptCounts} prompt(s)...`, "info");

//     // Set up task tracking for batch
//     await chrome.storage.session.set({
//       [taskKey]: {
//         tabId,
//         imageIndex: currentImageIndex,
//         totalPrompts: promptCounts,
//         status: "pending",
//         createdAt: Date.now()
//       }
//     });

//     // Send all prompts at once to content script for batch processing
//     chrome.tabs.sendMessage(tabId, {
//       action: "GENERATE_IMAGE_BATCH",
//       data: {
//         image: currentImage,
//         sceneImage: sceneImage || null,  // Optional scene image
//         styleImage: styleImage || null,  // Optional style image
//         prompts: prompts,  // Send entire prompts array
//         imageIndex: currentImageIndex,
//         imageName: currentImage.name,
//         key: key
//       },
//     });

//     // Wait for batch completion
//     const result = await waitForTask(key);

//     if (!result.success) {
//       sendLogToPopup(`❌ Batch processing failed: ${result.error}`, "error");
//     } else {
//       sendLogToPopup(`✅ Batch complete! Processed ${promptCounts} variation(s)`, "success");
//     }

//     await clearSessionTasks();

//     currentImageIndex++;
//     await saveProgress();
//     imageDownloadSet.clear();

//     if (currentImageIndex < totalImages -1) {
//       sendLogToPopup(`⏳ Preparing for next image...`, "info");
//       await sleep(3000);
//       await processNextImage();
//     } else {
//       await processNextImage(); // Trigger completion check
//     }

//   } catch (error) {
//     sendLogToPopup(`❌ Error processing image ${imageNumber}: ${error.message}`, "error");
//     sendErrorToPopup(error.message);
//     stopGeneration();
//   }
// }

async function processNextImage() {
  while (true) {
    // ✅ Stop condition (single exit point)
    if (!isRunning || currentImageIndex >= totalImages) {
      await clearProgress();
      sendLogToPopup("🎉 All images processed!", "success");
      sendMessageToPopup({ action: "COMPLETE" });
      stopGeneration(true);
      return;
    }

    await closeTabs();
    await openWhiskTab();

    const imageNumber = currentImageIndex + 1;

    sendLogToPopup(`\n${"=".repeat(50)}`, "info");
    sendLogToPopup(
      `🖼️  PROCESSING IMAGE ${imageNumber}/${totalImages}`,
      "success",
    );
    sendLogToPopup(`${"=".repeat(50)}`, "info");
    sendStatusToPopup(`Processing image ${imageNumber}/${totalImages}...`);

    try {
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
        sendLogToPopup(
          `⚠️ Batch failed for image ${imageNumber}. Moving to next image.`,
          "warning",
        );
      } else {
        sendLogToPopup(
          `✅ Batch complete! (${promptCounts} variations)`,
          "success",
        );
      }

      await clearSessionTasks();

      // ✅ Move to next image
      currentImageIndex++;
      await saveProgress();
      imageDownloadSet.clear();

      if (currentImageIndex < totalImages) {
        sendLogToPopup("⏳ Preparing for next image...", "info");
        await sleep(3000);
      }

      // 🔁 loop continues naturally
    } catch (error) {
      sendLogToPopup(
        `❌ Error processing image ${imageNumber}: ${error.message}`,
        "error",
      );
      sendErrorToPopup(error.message);
      stopGeneration();
      return;
    }
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
    .catch(() => {});
}

function sendStatusToPopup(text) {
  chrome.runtime.sendMessage({ action: "STATUS", text: text }).catch(() => {});
}

function sendErrorToPopup(text) {
  chrome.runtime.sendMessage({ action: "ERROR", text: text }).catch(() => {});
}

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage(message).catch(() => {});
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
