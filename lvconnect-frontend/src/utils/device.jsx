import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const initializeDeviceId = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId; // Unique device ID
};
