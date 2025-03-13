const utils = {
    cookieManager: {
        set: (name, value, days = 1) => {
            if (typeof document !== "undefined") {
                const expires = new Date();
                expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
                document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
            }
        },
        get: (name) => {
            if (typeof document !== "undefined") {
                const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
                    const [key, value] = cookie.split("=");
                    acc[key] = decodeURIComponent(value);
                    return acc;
                }, {});

                return cookies[name] || null;
            }
            return null;
        },
        delete: (name) => {
            if (typeof document !== "undefined") {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            }
        }
    },
    getCurrentDate: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başladığı için 1 ekliyoruz
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
};

export default utils;