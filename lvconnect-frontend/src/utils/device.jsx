import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getDeviceId = async () => {
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId; // Unique device ID
    } catch (error) {
        return null;
    }
};
