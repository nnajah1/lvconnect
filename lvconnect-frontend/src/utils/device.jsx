

export function getCookie(name) {
    const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export async function initializeDeviceId() {
    let deviceId = getCookie('deviceId') || localStorage.getItem('deviceId'); 
    const deviceName = navigator.userAgent;

    if (!deviceId) {
        try {
            const response = await fetch('/trusted-device/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device_name: deviceName }),
            });

            const data = await response.json();

            if (data.deviceId) {
                deviceId = data.deviceId;
            } else {
                deviceId = crypto.randomUUID();
            }

            setCookie('deviceId', deviceId);
            localStorage.setItem('deviceId', deviceId);

        } catch (error) {
            console.error("Error checking device:", error);
        }
    }

    return deviceId;
}
