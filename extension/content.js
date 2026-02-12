// Whisk Content Script
// Handles interaction with Google Labs and captures authentication tokens

// Check for authentication token in URL (Extension Callback)
if (window.location.href.includes('/extension-callback')) {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userStr = urlParams.get('user');

  if (token) {
    console.log('Whisk Extension: Token detected');

    const data = { authToken: token };
    if (userStr) {
      try {
        data.user = JSON.parse(decodeURIComponent(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    chrome.storage.local.set(data, () => {
      console.log('Whisk Extension: Token saved to storage');
      // Notify background script maybe? Or just close tab?
      // chrome.runtime.sendMessage({ action: 'AUTH_SUCCESS' });

      // Optional: Close this tab after a short delay
      setTimeout(() => {
        // We can't always close tabs we didn't open script-wise, but often we can if opened by extension
        // chrome.runtime.sendMessage({ action: 'CLOSE_TAB' });
      }, 2000);
    });
  }
}

// Content Script - Automation Provider Architecture

console.log("🤖 Whisk Bot Content Script Loaded (New Architecture)");

// ----------------------------------------------------------------------------
// UTILITIES (Preserved from original)
// ----------------------------------------------------------------------------

function log(message, type = "info") {
  chrome.runtime
    .sendMessage({
      action: "CONTENT_LOG",
      text: message,
      type: type,
    })
    .catch(() => { });
}

async function sleep(ms) {
  const jitter = Math.random() * 1000; // 0-1 second variation
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
}

function waitForElement(selector, timeout = 10000, parent = null) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const interval = setInterval(() => {

      if (parent) {
        parent.scrollIntoView({ behavior: "smooth" });
      }

      const element = (parent || document).querySelector(selector);

      if (element) {
        clearInterval(interval);
        resolve(element);
      }

      if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error(`Element not found: ${selector}`));
      }
    }, 200);
  });
}


// Normal distribution for more realistic random values
function gaussianRandom(min, max) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) return gaussianRandom(min, max);
  return Math.floor(num * (max - min + 1) + min);
}

const randomSleep = async (min, max) => {
  const ms = gaussianRandom(min, max);
  return new Promise((resolve) => setTimeout(resolve, ms));
};



async function activateMe() {
  await chrome.runtime.sendMessage({ action: "ACTIVATE_ME" });
}

function generateKey() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}


// ----------------------------------------------------------------------------
// PROVIDERS
// ----------------------------------------------------------------------------



class AutomationProvider {
  constructor() {
    this.isProcessing = false;
  }

  async generateImage(data) {
    throw new Error("generateImage() must be implemented by concrete provider");
  }
}

class WhiskProvider extends AutomationProvider {
  constructor() {
    super();
    this.SELECTORS = {
      sidebarButton: 'button.sc-63569c0e-0',
      fileDropArea: 'div.sc-52570d98-8.gHQScI',
      promptTextarea: 'textarea.sc-18deeb1d-8.fEJrAw',
      submitButton: 'button[aria-label="Submit prompt"]',
      imageContainer: 'div.sc-7165b472-0.joaCbM',
      generatedImage: 'img.sc-3c44e5a1-0.hYIeMY',
      downloadButton: 'button.sc-804b7e34-6.cjvZEb',
    };
  }


  // NEW: Batch processing method
  async generateImageBatch(data) {
    if (this.isProcessing) {
      log("Already processing, skipping...", "warning");
      return;
    }
    // this.initialCount = 0;
    this.isProcessing = true;
    this.data = data;

    try {
      log(`🚀 Starting batch generation with ${data.prompts.length} prompt(s)`, "info");

      const container = document.querySelector(this.SELECTORS.imageContainer);

      // STEP 1: Upload image once
      log("📤 Uploading image to Subject slot...", "info");
      await this.uploadImage(data.image, data.sceneImage, data.styleImage);
      log("✓ Image uploaded", "success");

      // Track initial image count
      // this.initialCount = container.querySelectorAll(this.SELECTORS.generatedImage).length ?? 0;
      // log(`Initial image count: ${this.initialCount}`, "info");

      // STEP 2: Loop through all prompts and submit them
      log(`\n🔄 Submitting ${data.prompts.length} prompt(s) sequentially...`, "info");
      for (let i = 0; i < data.prompts.length; i++) {
        const prompt = data.prompts[i];

        log(`\n📝 [${i + 1}/${data.prompts.length}] Typing prompt: "${prompt.substring(0, 50)}..."`, "info");
        await this.typePrompt(prompt);
        log(`✓ Prompt ${i + 1} typed`, "success");

        log(`🔘 Clicking Generate for prompt ${i + 1}...`, "info");
        await this.clickGenerate();
        log(`✓ Generation ${i + 1} started`, "success");

        // Sleep between prompt submissions (2-3 seconds)
        if (i < data.prompts.length - 1) {
          const sleepTime = 5000;
          log(`⏱️ Waiting ${sleepTime}ms before next prompt...`, "info");
          await sleep(sleepTime);
        }
      }

      log(`\n✅ All ${data.prompts.length} prompt(s) submitted!`, "success");

      // STEP 3: Wait for all images to be ready
      const expectedImageCount = data.prompts.length * 2;
      log(`\n⏳ Waiting for ${expectedImageCount} image(s) to be generated...`, "info");

      const images = await this.waitForMultipleNewImages(expectedImageCount);

      log(`✓ All ${images.length} image(s) ready!`, "success");

      // STEP 4: Download all images sequentially
      log(`\n⬇️ Downloading ${images.length} image(s)...`, "info");
      for (let i = 0; i < images.length; i++) {
        log(`📥 Downloading image ${i + 1}/${images.length}...`, "info");
        await this.downloadImageWhisk(
          data.imageName,
          data.imageIndex,
          images[i]
        );
        log(`✓ Image ${i + 1} downloaded`, "success");
      }

      log("✅ All images downloaded successfully!", "success");

      // Notify background script of batch completion
      chrome.runtime.sendMessage({
        action: "TASK_COMPLETE",
        data: {
          imageIndex: data.imageIndex,
          key: data.key,
          totalProcessed: data.prompts.length
        },
      });

    } catch (error) {
      log(`❌ Batch Error: ${error.message}`, "error");
      chrome.runtime.sendMessage({
        action: "TASK_ERROR",
        error: {
          message: error.message || "Unknown error",
          stack: error.stack
        },
        data: {
          imageIndex: data.imageIndex,
          key: data.key
        },
      });
    } finally {
      this.isProcessing = false;
    }
  }

  async uploadImage(subjectImageData, sceneImageData = null, styleImageData = null) {
    // 1. Click sidebar button to open upload area
    const sidebarBtn = document.querySelector(this.SELECTORS.sidebarButton);
    // sidebarBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (!sidebarBtn) {
      throw new Error("Sidebar button not found");
    }

    log("Sidebar button found", "info");
    await activateMe();

    sidebarBtn.addEventListener("click", () => {
      log("Sidebar button clicked", "info");
    });

    const buttonText = sidebarBtn.innerText?.trim();

    log(`Button text: ${buttonText}`, "info");
    if (buttonText?.toLowerCase().includes("add images")) {
      sidebarBtn.click();
      await sleep(1000);
    }
    await sleep(1000); // Wait for sidebar/input to appear

    // 2. Find all drop areas (should be 3: Subject, Scene, Style)
    const dropAreas = Array.from(document.querySelectorAll(this.SELECTORS.fileDropArea));
    log(`Found ${dropAreas.length} drop areas`, "info");

    if (dropAreas.length < 3) {
      throw new Error("Expected 3 drop areas (Subject, Scene, Style), found " + dropAreas.length);
    }

    const areaIndexes = [
      {
        dropArea: dropAreas[0],
        image: subjectImageData,
      },
      {
        dropArea: dropAreas[1],
        image: sceneImageData
      },
      {
        dropArea: dropAreas[2],
        image: styleImageData
      }
    ]

    // Helper function to upload to a specific drop area
    const uploadToDropArea = async (dropArea, imageData) => {

      // Scroll the drop area into view
      dropArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(500);

      // Convert base64 to File
      const response = await fetch(imageData.data);
      const blob = await response.blob();
      const file = new File([blob], imageData.name, { type: blob.type });

      // Use DataTransfer to simulate file drop
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const dragEnter = new DragEvent("dragenter", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });

      const dragOver = new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });

      const drop = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });

      await activateMe();
      dropArea.dispatchEvent(dragEnter);
      dropArea.dispatchEvent(dragOver);
      dropArea.dispatchEvent(drop);

      log("✓ Upload event dispatched", "success");
    };

    // Upload sequence based on available images
    try {
      const uploadPromises = areaIndexes.map(async (areaIndex, index) => {
        if (areaIndex.image) {
          if (!areaIndex.dropArea) {
            throw new Error(`Drop area not found for image index ${index} (0=Subject, 1=Scene, 2=Style). Found ${dropAreas.length} areas.`);
          }
          await uploadToDropArea(areaIndex.dropArea, areaIndex.image);
          log("✓ Image pasted successfully", "success");
        }
      });

      await Promise.all(uploadPromises);
      // sc-3c44e5a1-3 cvCgoJ

      await waitForElement(".sc-7e4f5fb9-0.sc-687b21c2-0.ljxCIZ.cfGIPl", 60000);
      await sleep(5000);
      log("✓ Image uploaded successfully", "success")
    } catch (error) {
      log("Image upload failed: " + error.message, "error");
      throw error;
    }
  }

  async typePrompt(prompt) {
    await activateMe();
    const textarea = document.querySelector(this.SELECTORS.promptTextarea);
    textarea.focus();

    // Select all and delete to clear existing
    textarea.value = "";
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(100);

    // Human-like typing
    for (let i = 0; i < prompt.length; i++) {
      textarea.value += prompt[i];
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      // Very fast typing
      // await randomSleep(5, 20);
    }
    await randomSleep(500, 1000);
  }

  async clickGenerate() {
    const btn = document.querySelector(this.SELECTORS.submitButton);
    btn.click();
  }

  // NEW: Wait for multiple images (batch mode)
  async waitForMultipleNewImages(expectedCount, timeout = 90000) {
    const start = Date.now();
    const container = document.querySelector(this.SELECTORS.imageContainer);
    let images = [];

    while (true) {

      const children = Array.from(container.children);
      images = [];

      for (const child of children) {
        child.scrollIntoView({ behavior: "smooth" });
        await sleep(300);
        const img = child.querySelector(this.SELECTORS.generatedImage);
        if (img) {
          images.push(img);
        }
      }

      log(`Found ${images.length} images`, "info");

      if ((images.length >= expectedCount || images.length >= children.length - 1) || Date.now() - start > timeout) {
        if (Date.now() - start > timeout) {
          log(`Timeout waiting for ${expectedCount} images. Found ${images.length}`, "info");
        } else {
          log(`All ${expectedCount} images detected! Waiting for them to fully load...`, "info");
        }

        // wait for images to load
        const loadStart = Date.now();
        while (true) {
          const allReady = images.every(
            img => img.complete && img.naturalWidth > 0
          );

          if (allReady) break;

          if (Date.now() - loadStart > timeout) {
            log("Timeout waiting for images to fully load", "warn");
            break;
          }

          await sleep(100);
        }

        break;
      }

      await sleep(2000);
    }

    return images;
  }

  async downloadImageWhisk(
    originalImageName,
    imgIndex,
    img) {
    if (!img) throw new Error("Image not found");

    const uniqueKey = generateKey();
    const baseName = originalImageName.replace(/\.[^/.]+$/, "");
    const filename = `${baseName}_whisk_${imgIndex + 1}/${baseName}_whisk_${uniqueKey}.jpg`;

    await chrome.runtime.sendMessage({
      action: "DOWNLOAD_IMAGE",
      filename: filename,
      url: img.src,
    });
  }
}

// ----------------------------------------------------------------------------
// MAIN LISTENER & FACTORY
// ----------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action === "GENERATE_IMAGE_BATCH") {
    let provider = new WhiskProvider();
    provider.generateImageBatch(message.data);
  }

  if (message.action === "CHECK_TAB_READY") {
    sendResponse({
      ready: document.readyState === "complete",
      loading: !document.querySelector(
        ".loader, .loading, [data-loading='true']",
      ),
    });
  }
});
