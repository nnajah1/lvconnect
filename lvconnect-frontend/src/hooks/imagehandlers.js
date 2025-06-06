import { getSignedUrl } from '@/services/axios';
import { useEffect, useState } from 'react';

export const useSignedImages = (raw) => {
  const [signedImages, setSignedImages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadSignedUrls = async () => {
      if (!raw) {
        if (isMounted) setSignedImages([]);
        return;
      }

      let paths = [];
      try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        paths = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        paths = [raw]; // fallback if JSON.parse fails
      }

      const filteredPaths = paths.filter(Boolean);

       const signed = await Promise.all(
        filteredPaths.map(async (path) => {
          try {
            const url = await getSignedUrl(path);
            return url ? { url, path } : null;
          } catch (error) {
            console.error('Error getting signed URL for path:', path, error);
            return null;
          }
        })
      );

      if (isMounted) {
        setSignedImages(signed.filter(Boolean));
      }
    };

    loadSignedUrls();

    return () => {
      isMounted = false;
    };
  }, [raw]);

  return signedImages;
};
