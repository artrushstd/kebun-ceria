// LocalStorage with safe fallback for privacy/incognito modes
const Storage = {
    data: {},
    isSupported: true,

    init() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            this.isSupported = true;
        } catch (e) {
            this.isSupported = false;
            console.warn("LocalStorage not available. Using session memory.");
        }
    },

    save(key, value) {
        if (this.isSupported) {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            this.data[key] = value;
        }
    },

    load(key, defaultValue) {
        if (this.isSupported) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } else {
            return this.data.hasOwnProperty(key) ? this.data[key] : defaultValue;
        }
    }
};

Storage.init();
