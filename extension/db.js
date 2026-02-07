// WhiskDB - Simple IndexedDB Wrapper for handling large images
const DB_NAME = "WhiskDB";
const STORE_NAME = "media";
const DB_VERSION = 1;

class WhiskDB {
    constructor() {
        this.db = null;
        this.ready = this.init();
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME); // Key is the image type/id string
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async get(key) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async set(key, value) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(value, key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async delete(key) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clear() {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // --- Specific Helpers ---

    async saveImages(images) {
        return this.set("images", images);
    }

    async getImages() {
        return (await this.get("images")) || [];
    }

    async saveSceneImage(image) {
        return this.set("sceneImage", image);
    }

    async getSceneImage() {
        return await this.get("sceneImage");
    }

    async saveStyleImage(image) {
        return this.set("styleImage", image);
    }

    async getStyleImage() {
        return await this.get("styleImage");
    }

    async clearAllImages() {
        await this.delete("images");
        await this.delete("sceneImage");
        await this.delete("styleImage");
    }
}

// Export singleton instance
const db = new WhiskDB();
