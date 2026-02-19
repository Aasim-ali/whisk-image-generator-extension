// Check Auth first
chrome.storage.local.get(['authToken'], (result) => {
  if (!result.authToken) {
    if (window.location.href.indexOf('login.html') === -1) {
      window.location.href = 'login.html';
    }
  }
});

// UI Elements
const selectFolderBtn = document.getElementById("selectFolderBtn");
const selectImagesBtn = document.getElementById("selectImagesBtn");
const folderInput = document.getElementById("folderInput");
const filesInput = document.getElementById("filesInput");
const imageCount = document.getElementById("imageCount");

// Scene and Style Image Elements
const selectSceneBtn = document.getElementById("selectSceneBtn");
const sceneInput = document.getElementById("sceneInput");
const sceneImageStatus = document.getElementById("sceneImageStatus");
const clearSceneBtn = document.getElementById("clearSceneBtn");

const selectStyleBtn = document.getElementById("selectStyleBtn");
const styleInput = document.getElementById("styleInput");
const styleImageStatus = document.getElementById("styleImageStatus");
const clearStyleBtn = document.getElementById("clearStyleBtn");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");
const consoleDiv = document.getElementById("console");
const statusDiv = document.getElementById("status");
const promptsContainer = document.getElementById("promptsContainer");
const addPromptBtn = document.getElementById("addPromptBtn");
const toastContainer = document.getElementById("toastContainer");

// Toast Notification System
function showToast(type, title, message) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ"
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <button class="toast-close" aria-label="Close">×</button>
  `;

  toastContainer.appendChild(toast);

  // Close button
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => removeToast(toast));

  // Auto remove after 5 seconds
  setTimeout(() => removeToast(toast), 5000);
}

function removeToast(toast) {
  if (!toast || !toast.parentElement) return;

  toast.classList.add("removing");
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, 300);
}

// State
let selectedImages = [];
let sceneImage = null;
let styleImage = null;
let isRunning = false;
let socketConnected = false;

const socketStatusEl = document.getElementById('socketStatus');

function updateSocketStatus(connected) {
  socketConnected = connected;
  if (socketStatusEl) {
    if (connected) {
      socketStatusEl.textContent = '🟢 Connected';
      socketStatusEl.style.background = 'rgba(34,197,94,0.15)';
      socketStatusEl.style.color = '#22c55e';
      socketStatusEl.style.borderColor = 'rgba(34,197,94,0.35)';
    } else {
      socketStatusEl.textContent = '🔴 Disconnected';
      socketStatusEl.style.background = 'rgba(239,68,68,0.15)';
      socketStatusEl.style.color = '#ef4444';
      socketStatusEl.style.borderColor = 'rgba(239,68,68,0.35)';
    }
  }
  validateInputs();
}

let promptInputs = [];

function syncPromptInputs() {
  promptInputs = Array.from(document.querySelectorAll(".prompt-input"));
}

async function checkResumeState() {
  const { progress } = await chrome.storage.local.get("progress");

  if (progress && progress.status !== "completed") {
    resumeBtn.style.display = "block";
    restartBtn.style.display = "block";
    startBtn.style.display = "none";

    statusDiv.textContent = `⏸ Paused at image ${progress.currentImageIndex + 1}/${progress.totalImages}`;
  } else {
    // ─── Fresh start recovery ───
    resumeBtn.style.display = "none";
    restartBtn.style.display = "none";
    startBtn.style.display = "block";

    // Clear progress completely (safety)
    await chrome.storage.local.remove("progress");

    // Don't wipe images automatically on fresh start if they exist in DB
    // Check if we have images in DB
    try {
      const storedImages = await db.getImages();
      if (storedImages && storedImages.length > 0) {
        // Let's just update the UI to show they are loaded
        imageCount.textContent = `✓ ${storedImages.length} image(s) loaded from storage`;
        imageCount.style.background = "#d4edda";
        imageCount.style.color = "#155724";
        selectedImages = storedImages; // These are base64 objects now, not File objects.

        logToConsole(`Restored ${storedImages.length} images from storage`, "info");
      } else {
        selectedImages = [];
        await updateSelectedImageUI();
        statusDiv.textContent = " No images selected";
      }
    } catch (e) {
      console.error("Error checking DB:", e);
      selectedImages = [];
      statusDiv.textContent = " No images selected";
    }

    validateInputs();
  }
}

resumeBtn.addEventListener("click", async () => {
  resumeBtn.style.display = "none";
  restartBtn.style.display = "none";
  stopBtn.style.display = "block";
  statusDiv.textContent = "▶ Starting generation...";
  statusDiv.classList.add("active");

  const { prompts } = await chrome.storage.local.get("prompts");
  const images = await db.getImages();

  chrome.runtime.sendMessage({
    action: "START_GENERATION",
    resume: true,
    data: {
      imageCount: images.length,
      prompts,
    },
  });
});

restartBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove("progress");
  await checkResumeState();
});

// ---------- helpers ----------
function getAllPromptGroups() {
  return Array.from(promptsContainer.querySelectorAll(".prompt-group"));
}

function validateMinOnePrompt() {
  const count = getAllPromptGroups().length;
  if (count < 1) {
    alert("At least one prompt is required");
    return false;
  }
  return true;
}

// ---------- create remove button ----------
function createRemoveButton(wrapper) {
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✗ Remove";
  removeBtn.className = "btn btn-danger";
  removeBtn.style.marginTop = "6px";

  removeBtn.addEventListener("click", () => {
    if (getAllPromptGroups().length <= 1) {
      alert("At least one prompt is required");
      return;
    }
    wrapper.remove();
    validateInputs();
  });

  return removeBtn;
}

// ---------- initialize existing prompts ----------
function initExistingPrompts() {
  const groups = getAllPromptGroups();

  groups.forEach((wrapper) => {
    // Prevent double-add
    if (wrapper.querySelector(".btn-danger")) return;

    const removeBtn = createRemoveButton(wrapper);
    wrapper.appendChild(removeBtn);

    const textarea = wrapper.querySelector("textarea");
    textarea.addEventListener("input", validateInputs);
  });
}

// ---------- add new prompt ----------
function addPrompt(initialValue = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "prompt-group";

  wrapper.innerHTML = `
    <label>Prompt :</label>
    <textarea
      class="prompt-input"
      placeholder="Enter prompt..."
    ></textarea>
  `;

  const textarea = wrapper.querySelector("textarea");
  textarea.value = initialValue; // Safer than innerHTML
  textarea.addEventListener("input", validateInputs);

  const removeBtn = createRemoveButton(wrapper);
  wrapper.appendChild(removeBtn);

  promptsContainer.appendChild(wrapper);
  validateInputs();
}

function useTemplate(template) {
  // Clear main prompts
  promptsContainer.innerHTML = "";

  // Add prompts from template
  template.prompts.forEach(p => {
    addPrompt(p);
  });

  // Close modal
  closeManageModalFunc();

  // Sync inputs
  syncPromptInputs();

  // Validate
  validateInputs();

  logToConsole(`✓ Applied template: ${template.name}`, "success");
  showToast("success", "Template Applied", `Successfully loaded "${template.name}" template`);
}

// ---------- events ----------
addPromptBtn.addEventListener("click", () => addPrompt(""));

// ---------- init ----------
initExistingPrompts();

// Event Listeners
selectFolderBtn.addEventListener("click", () => folderInput.click());
selectImagesBtn.addEventListener("click", () => filesInput.click());

// Scene and Style Image Event Listeners
selectSceneBtn.addEventListener("click", () => sceneInput.click());
selectStyleBtn.addEventListener("click", () => styleInput.click());
clearSceneBtn.addEventListener("click", clearSceneImage);
clearStyleBtn.addEventListener("click", clearStyleImage);

folderInput.addEventListener("change", handleImageSelection);
filesInput.addEventListener("change", handleImageSelection);
sceneInput.addEventListener("change", handleSceneImageSelection);
styleInput.addEventListener("change", handleStyleImageSelection);

startBtn.addEventListener("click", startGeneration);
stopBtn.addEventListener("click", stopGeneration);

// Check validation on prompt input
syncPromptInputs();
promptInputs.forEach((input) => {
  input.addEventListener("input", validateInputs);
});

// Handle Image Selection
async function handleImageSelection(event) {
  // Check Limits
  const storage = await chrome.storage.local.get(['dailyLimit', 'dailyUsage', 'planName']);
  const dailyLimit = storage.dailyLimit || 5; // Default free tier
  const dailyUsage = storage.dailyUsage || 0;
  const remaining = dailyLimit - dailyUsage;

  if (remaining <= 0) {
    showToast("error", "Limit Reached", "You have reached your daily generation limit.");
    event.target.value = ""; // Reset input
    return;
  }

  const files = Array.from(event.target.files);

  // Filter for image files only
  const newFiles = files.filter((file) => file.type.startsWith("image/"));

  if (newFiles.length === 0) return;

  // Enforce Limit
  let finalFiles = newFiles;
  if (newFiles.length > remaining) {
    alert(`Plan Limit: You can only select ${remaining} more image(s) today.`);
    finalFiles = newFiles.slice(0, remaining);
  }

  selectedImages = finalFiles; // temporarily hold files

  await updateSelectedImageUI(true);

  validateInputs();
}

async function updateSelectedImageUI(error = false) {
  if (selectedImages.length > 0) {
    imageCount.textContent = `✓ ${selectedImages.length} image(s) selected`;
    imageCount.style.background = "#d4edda";
    imageCount.style.color = "#155724";

    // Convert files to base64 for storage
    // If selectedImages contains File objects, convert. If already base64 (from restore), skip.
    let imagesData = selectedImages;

    if (selectedImages[0] instanceof File) {
      imagesData = await Promise.all(
        selectedImages.map((file) => fileToBase64(file)),
      );
    }

    // Store in IndexedDB
    try {
      await db.saveImages(imagesData);
      // Update selectedImages to be the data objects so we are consistent
      selectedImages = imagesData;

      logToConsole(`Loaded ${selectedImages.length} images`, "success");
      showToast("success", "Images Loaded", `Successfully loaded ${selectedImages.length} image(s)`);
    } catch (e) {
      logToConsole("Error saving images: " + e.message, "error");
      showToast("error", "Storage Error", "Failed to save images. " + e.message);
    }
  } else {
    imageCount.textContent = error ? "✗ No valid images found" : "📷 No images selected";
    imageCount.style.background = "";
    imageCount.style.color = "";

    if (error) {
      showToast("error", "No Images", "No valid images found in the selected folder");
    }
  }
}

// Handle Scene Image Selection
async function handleSceneImageSelection(event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith("image/")) {
    sceneImage = file;
    const sceneData = await fileToBase64(file);

    // Store in IndexedDB
    try {
      await db.saveSceneImage(sceneData);
    } catch (error) {
      logToConsole("Error storing scene image: " + error.message, "error");
      showToast("error", "Scene Image Error", "Error storing scene image");
      return;
    }

    sceneImageStatus.textContent = `✓ ${file.name}`;
    sceneImageStatus.style.background = "#d4edda";
    sceneImageStatus.style.color = "#155724";
    clearSceneBtn.style.display = "block";

    logToConsole(`Scene image loaded: ${file.name}`, "success");
    showToast("success", "Scene Image Loaded", `${file.name}`);
  } else {
    showToast("error", "Invalid File", "Please select a valid image file");
  }
}

// Handle Style Image Selection
async function handleStyleImageSelection(event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith("image/")) {
    styleImage = file;
    const styleData = await fileToBase64(file);

    // Store in IndexedDB
    try {
      await db.saveStyleImage(styleData);
    } catch (error) {
      logToConsole("Error storing style image: " + error.message, "error");
      showToast("error", "Style Image Error", "Error storing style image");
      return;
    }

    styleImageStatus.textContent = `✓ ${file.name}`;
    styleImageStatus.style.background = "#d4edda";
    styleImageStatus.style.color = "#155724";
    clearStyleBtn.style.display = "block";

    logToConsole(`Style image loaded: ${file.name}`, "success");
    showToast("success", "Style Image Loaded", `${file.name}`);
  } else {
    showToast("error", "Invalid File", "Please select a valid image file");
  }
}

// Clear Scene Image
async function clearSceneImage() {
  sceneImage = null;
  sceneInput.value = "";
  await db.saveSceneImage(null); // Or add a delete method, but setting to null is fine if logic handles it

  sceneImageStatus.textContent = "No scene image selected";
  sceneImageStatus.style.background = "";
  sceneImageStatus.style.color = "";
  clearSceneBtn.style.display = "none";

  logToConsole("Scene image cleared", "info");
  showToast("info", "Scene Image Cleared", "");
}

// Clear Style Image
async function clearStyleImage() {
  styleImage = null;
  styleInput.value = "";
  await db.saveStyleImage(null);

  styleImageStatus.textContent = "No style image selected";
  styleImageStatus.style.background = "";
  styleImageStatus.style.color = "";
  clearStyleBtn.style.display = "none";

  logToConsole("Style image cleared", "info");
  showToast("info", "Style Image Cleared", "");
}

// Convert File to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        name: file.name,
        data: reader.result,
        type: file.type,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Validate Inputs
function validateInputs() {
  const hasImages = selectedImages && selectedImages.length > 0;
  syncPromptInputs();
  const hasPrompts =
    promptInputs.every((input) => input.value.trim() !== "") &&
    promptInputs.length > 0;

  startBtn.disabled = !(hasImages && hasPrompts);
}

// Handle Mode UI Toggling
const geminiModeOptions = document.getElementById("geminiModeOptions");


// Start Generation
async function startGeneration() {
  if (isRunning) return;

  if (!sceneImage) {
    // Check if we need to clear (already handled by clearSceneImage if clicked)
  }

  isRunning = true;
  startBtn.style.display = "none";
  stopBtn.style.display = "block";
  statusDiv.textContent = "▶ Starting generation...";
  statusDiv.classList.add("active");

  logToConsole("=".repeat(50), "info");
  logToConsole("▶ STARTING WHISK IMAGE GENERATION BOT", "success");
  logToConsole("=".repeat(50), "info");

  showToast("info", "Generation Started", "Processing your images with AI...");

  // Get prompts
  const prompts = promptInputs.map((input) => input.value.trim());

  // Store prompts in chrome.storage (prompts are small, local storage is fine)
  await chrome.storage.local.set({ prompts });

  logToConsole(`📝 Loaded ${prompts.length} prompts`, "info");
  logToConsole(` Processing ${selectedImages.length} images`, "info");

  // Send message to background script to start
  chrome.runtime.sendMessage({
    action: "START_GENERATION",
    data: {
      imageCount: selectedImages.length,
      prompts: prompts
    },
  });
}

// Stop Generation
async function stopGeneration() {
  isRunning = false;
  startBtn.style.display = "block";
  stopBtn.style.display = "none";
  statusDiv.textContent = "";
  statusDiv.classList.remove("active");

  logToConsole("■ Generation stopped by user", "warning");
  showToast("warning", "Generation Stopped", "Process paused. You can resume later.");
  chrome.runtime.sendMessage({ action: "STOP_GENERATION" });

  await sleep(300); // allow background to persist progress
  await checkResumeState();
}

// Log to Console
function logToConsole(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement("div");
  logEntry.className = `log-${type}`;
  logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> ${message}`;
  consoleDiv.appendChild(logEntry);

  // Smooth scroll to bottom
  consoleDiv.scrollTo({
    top: consoleDiv.scrollHeight,
    behavior: 'smooth'
  });
}

// Helper: Sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "LOG") {
    logToConsole(message.text, message.type || "info");
  }

  if (message.action === "STATUS") {
    statusDiv.textContent = message.text;
  }

  if (message.action === "COMPLETE") {
    isRunning = false;
    startBtn.style.display = "block";
    stopBtn.style.display = "none";
    statusDiv.textContent = "✓ Generation complete!";
    checkResumeState();
    logToConsole("=".repeat(50), "info");
    logToConsole("✓ ALL IMAGES GENERATED SUCCESSFULLY!", "success");
    logToConsole("=".repeat(50), "info");
    showToast("success", "Complete!", "All images generated successfully!");
  }

  if (message.action === "ERROR") {
    isRunning = false;
    startBtn.style.display = "block";
    stopBtn.style.display = "none";
    statusDiv.textContent = "✗ Error occurred";
    statusDiv.style.background = "#f8d7da";
    logToConsole(`✗ ERROR: ${message.text}`, "error");
    showToast("error", "Error Occurred", message.text);
  }

  // 🔌 Socket status events from background
  if (message.action === "SOCKET_CONNECTED") {
    updateSocketStatus(true);
    logToConsole("✓ Server connection established", "success");
  }

  if (message.action === "SOCKET_DISCONNECTED") {
    updateSocketStatus(false);
    logToConsole("⚠️ Disconnected from server. Generation is paused until reconnected.", "warning");
  }
});

// Query background for current socket state on load
chrome.runtime.sendMessage({ action: "GET_SOCKET_STATUS" }, (response) => {
  if (chrome.runtime.lastError) {
    updateSocketStatus(false);
    return;
  }
  updateSocketStatus(response?.connected ?? false);
});

// Initialize
logToConsole("✨ Whisk Image Generator Bot Ready", "success");
logToConsole("📌 Step 1: Select images (folder or files)", "info");
logToConsole("📌 Step 2: Enter all prompts for different variations", "info");
logToConsole("📌 Step 3: Click Start Generation", "info");


// ----------------------------------------------------------------------------
// PROMPT TEMPLATE MANAGEMENT SYSTEM
// ----------------------------------------------------------------------------

const managePromptsBtn = document.getElementById("managePromptsBtn");
const manageModal = document.getElementById("manageModal");
const closeManageModal = document.getElementById("closeManageModal");
const templateList = document.getElementById("templateList");
const openAddTemplateBtn = document.getElementById("openAddTemplateBtn");

const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const editModalTitle = document.getElementById("editModalTitle");
const templateNameInput = document.getElementById("templateName");
const templatePromptsContainer = document.getElementById("templatePromptsContainer");
const addTemplatePromptBtn = document.getElementById("addTemplatePromptBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const saveTemplateBtn = document.getElementById("saveTemplateBtn");

let currentEditingTemplateId = null;

// --- Modal Controls ---
function openManageModalFunc() {
  manageModal.style.display = "block";
  loadTemplates();
}

function closeManageModalFunc() {
  manageModal.style.display = "none";
}

function openEditModalFunc(template = null) {
  editModal.style.display = "block";
  manageModal.style.display = "none"; // Hide manage modal temporarily

  templatePromptsContainer.innerHTML = "";
  if (template) {
    currentEditingTemplateId = template.id;
    editModalTitle.innerHTML = '<span class="icon">📝</span> Edit Template';
    templateNameInput.value = template.name;
    template.prompts.forEach(p => addTemplatePromptInput(p));
  } else {
    currentEditingTemplateId = null;
    editModalTitle.innerHTML = '<span class="icon">📝</span> New Template';
    templateNameInput.value = "";
    addTemplatePromptInput(""); // Start with one empty
  }
}

function closeEditModalFunc() {
  editModal.style.display = "none";
  manageModal.style.display = "block"; // Show manage modal again
}

// --- Template Inputs ---
function addTemplatePromptInput(value = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "prompt-group";
  wrapper.innerHTML = `
    <textarea class="template-prompt-input-unique" placeholder="Enter prompt...">${value}</textarea>
    <button class="btn btn-danger btn-sm remove-template-prompt" style="margin-top: 5px;">✗</button>
  `;

  wrapper.querySelector(".remove-template-prompt").addEventListener("click", () => {
    if (templatePromptsContainer.querySelectorAll(".prompt-group").length > 1) {
      wrapper.remove();
    } else {
      alert("At least one prompt is required.");
    }
  });

  templatePromptsContainer.appendChild(wrapper);
}

// --- CRUD Operations ---
async function loadTemplates() {
  const result = await chrome.storage.local.get("promptTemplates");
  const templates = result.promptTemplates || [];

  templateList.innerHTML = "";

  if (templates.length === 0) {
    templateList.innerHTML = '<p class="empty-text">No saved templates yet.</p>';
    return;
  }

  templates.forEach(t => {
    const item = document.createElement("div");
    item.className = "template-item";
    item.innerHTML = `
      <div class="template-info">
        <h3>${t.name}</h3>
        <p>${t.prompts.length} prompt(s)</p>
      </div>
      <div class="template-actions">
        <button class="btn btn-primary btn-sm use-template-btn">Use</button>
        <button class="btn btn-secondary btn-sm edit-template-btn">Edit</button>
        <button class="btn btn-danger btn-sm delete-template-btn">Delete</button>
      </div>
    `;

    item.querySelector(".use-template-btn").addEventListener("click", () => useTemplate(t));
    item.querySelector(".edit-template-btn").addEventListener("click", () => openEditModalFunc(t));
    item.querySelector(".delete-template-btn").addEventListener("click", () => deleteTemplate(t.id));

    templateList.appendChild(item);
  });
}

async function saveTemplate() {
  const name = templateNameInput.value.trim();
  const promptInputs = Array.from(templatePromptsContainer.querySelectorAll(".template-prompt-input-unique"));
  const prompts = promptInputs.map(input => input.value.trim()).filter(p => p !== "");

  // Validation
  if (!name) {
    alert("Please enter a template name.");
    return;
  }
  if (prompts.length === 0) {
    alert("Please add at least one prompt.");
    return;
  }

  const result = await chrome.storage.local.get("promptTemplates");
  let templates = result.promptTemplates || [];

  // Check unique name (exclude current if editing)
  const duplicate = templates.find(t => t.name.toLowerCase() === name.toLowerCase() && t.id !== currentEditingTemplateId);
  if (duplicate) {
    alert("A template with this name already exists.");
    return;
  }

  if (currentEditingTemplateId) {
    // Update
    const index = templates.findIndex(t => t.id === currentEditingTemplateId);
    if (index !== -1) {
      templates[index] = { id: currentEditingTemplateId, name, prompts };
    }
  } else {
    // Create
    const newTemplate = {
      id: Date.now().toString(),
      name,
      prompts
    };
    templates.push(newTemplate);
  }

  await chrome.storage.local.set({ promptTemplates: templates });
  closeEditModalFunc();
  loadTemplates();

  showToast("success", "Template Saved", `"${name}" has been saved successfully`);
}

async function deleteTemplate(id) {
  if (!confirm("Are you sure you want to delete this template?")) return;

  const result = await chrome.storage.local.get("promptTemplates");
  let templates = result.promptTemplates || [];
  const deletedTemplate = templates.find(t => t.id === id);
  templates = templates.filter(t => t.id !== id);

  await chrome.storage.local.set({ promptTemplates: templates });
  loadTemplates();

  if (deletedTemplate) {
    showToast("info", "Template Deleted", `"${deletedTemplate.name}" has been removed`);
  }
}

// --- Event Listeners ---
managePromptsBtn.addEventListener("click", openManageModalFunc);
closeManageModal.addEventListener("click", closeManageModalFunc);
window.addEventListener("click", (e) => {
  if (e.target == manageModal) closeManageModalFunc();
  if (e.target == editModal) editModal.style.display = "none"; // Note: this might be tricky if we want to force cancel
});

openAddTemplateBtn.addEventListener("click", () => openEditModalFunc());
closeEditModal.addEventListener("click", closeEditModalFunc);
cancelEditBtn.addEventListener("click", closeEditModalFunc);
// ----------------------------------------------------------------------------
// AUTHENTICATION & SOCKET.IO
// ----------------------------------------------------------------------------

const loginModal = document.getElementById("loginModal");
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const usageDisplay = document.getElementById("usageDisplay");
const usageCountSpan = document.getElementById("usageCount");

const signupLink = document.getElementById("signupLink");
const limitModal = document.getElementById("limitModal");
const upgradeBtn = document.getElementById("upgradeBtn");

// Redirect URL
const WEBSITE_URL = "https://whisk-image-generator-extension.vercel.app/";

if (signupLink) {
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: WEBSITE_URL });
  });
}

if (upgradeBtn) {
  upgradeBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: WEBSITE_URL });
    limitModal.style.display = "none";
  });
}

let socket = null;
let authToken = null;
let dailyLimitMax = 5;
let dailyUsageCurrent = 0;

async function initAuth() {
  const result = await chrome.storage.local.get(["authToken", "userEmail"]);
  if (result.authToken) {
    authToken = result.authToken;
    connectSocket();
  } else {
    showLoginModal();
  }
}

function showLoginModal() {
  loginModal.style.display = "flex";
}

function hideLoginModal() {
  loginModal.style.display = "none";
}

async function handleLogin() {
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value.trim();

  if (!email || !password) {
    loginError.textContent = "Please enter email and password";
    loginError.style.display = "block";
    return;
  }

  try {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    // Replace with your actual server URL
    const API_URL = "https://whisk-api.duckdns.org";

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Success
    authToken = data.token;
    await chrome.storage.local.set({ authToken, userEmail: data.user.email });

    hideLoginModal();
    logToConsole(`✓ Logged in as ${data.user.email}`, "success");
    showToast("success", "Login Successful", `Welcome back, ${data.user.name}`);

    connectSocket();

  } catch (error) {
    loginError.textContent = error.message;
    loginError.style.display = "block";
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
}

loginBtn.addEventListener("click", handleLogin);

// Socket.io Connection
async function connectSocket() {
  if (socket && socket.connected) return;

  const API_URL = "https://whisk-api.duckdns.org";

  // Get Device ID
  let { deviceId } = await chrome.storage.local.get("deviceId");
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await chrome.storage.local.set({ deviceId });
  }

  socket = io(API_URL, {
    auth: {
      token: authToken,
      deviceId: deviceId
    },
    transports: ['websocket', 'polling'] // force websocket first if possible
  });

  socket.on("connect", () => {
    logToConsole("✓ Connected to server via Socket.io", "success");
    usageDisplay.style.display = "block";
  });

  socket.on("connect_error", (err) => {
    logToConsole(`✗ Connection Error: ${err.message}`, "error");
    if (err.message.includes("Authentication")) {
      // Token invalid?
      chrome.storage.local.remove(["authToken"]);
      socket.disconnect();
      showLoginModal();
    } else if (err.message.includes("Device limit")) {
      showToast("error", "Device Limit", err.message);
      alert(err.message);
    }
  });

  socket.on("init_state", (data) => {
    updateUsageUI(data.dailyUsage, data.dailyLimit);
    logToConsole(`Plan: ${data.planName} (Daily Limit: ${data.dailyLimit})`, "info");
  });

  socket.on("update_usage", (data) => {
    updateUsageUI(data.dailyUsage, data.dailyLimit);
  });

  socket.on("limit_reached", (data) => {
    // showToast("error", "Limit Reached", data.message);
    if (limitModal) {
      limitModal.style.display = "flex";
    }
    logToConsole(`✗ ${data.message}`, "error");
    startBtn.disabled = true;
    startBtn.title = "Daily limit reached";
  });

  // Forward socket to background? 
  // Actually dashboard.js is the main controller here. 
  // Background.js runs the loop.
  // We need to pass the socket instance or handle events here to notify background.
  // OR background.js should also connect?
  // Ideally, Sidebar (Dashboard) maintains the socket.
}

function updateUsageUI(usage, limit) {
  dailyUsageCurrent = usage;
  dailyLimitMax = limit;
  usageCountSpan.textContent = `${usage} / ${limit}`;

  if (usage >= limit) {
    usageCountSpan.style.color = "red";
    startBtn.disabled = true;
  } else {
    usageCountSpan.style.color = "lightgreen";
    // Only enable if other validation passes
    validateInputs();
  }
}

// Override validateInputs to check limit AND socket connection
const originalValidateInputs = validateInputs;
validateInputs = function () {
  originalValidateInputs();
  if (dailyUsageCurrent >= dailyLimitMax) {
    startBtn.disabled = true;
    startBtn.title = "Daily limit reached";
  } else if (!socketConnected) {
    startBtn.disabled = true;
    startBtn.title = "Not connected to server. Please wait...";
  } else {
    startBtn.title = "";
  }
}

// Call init
initAuth();
