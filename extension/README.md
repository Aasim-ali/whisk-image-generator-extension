# Whisk Image Generator Bot - Chrome Extension

## 📦 Installation Instructions

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

2. **Load Extension**
   - Click "Load unpacked"
   - Select the extension folder

3. **Pin Extension**
   - Click the puzzle icon in Chrome toolbar
   - Pin "Whisk Image Generator Bot"

## 🚀 How to Use

### Step 1: Select Images
- Click **"Choose Folder"** to select a folder containing product images
- OR click **"Choose Images"** to select individual image files
- You'll see a count of selected images

### Step 2: Enter Prompts
Fill in the prompt fields with your variation descriptions. Whisk blends your reference image with these prompts.

### Step 3: Start Generation
- Click **"Start Generation"**
- The bot will:
  - Open a Whisk tab
  - Upload the product image to the "Subject" slot
  - Process each prompt variation
  - Generate and download the results

### Step 4: Monitor Progress
- Watch the **Progress Console** for live updates
- Downloads will be saved to your default Chrome downloads folder
- Filenames: `{original_name}_whisk_{prompt_index}_{image_index}.jpg`

## ⚙️ Features

✅ Batch process multiple images  
✅ Custom prompts per image  
✅ Auto-detects image generation completion  
✅ Auto-downloads with organized naming  
✅ Real-time progress logging  

## 📁 Project Files

- `manifest.json` - Extension configuration
- `popup.html/css/js` - User interface
- `background.js` - Tab management & coordination
- `content.js` - Whisk page automation
- `README.md` - This file

## 🔧 Troubleshooting

**Issue: Images not uploading**
- Make sure you're using image files (JPG, PNG, etc.)
- Check Whisk page for manual upload capability

**Issue: Generation not detected**
- Whisk page structure may have changed
- Check browser console for errors

---

**Enjoy automated image generation with Whisk! 🎨**
