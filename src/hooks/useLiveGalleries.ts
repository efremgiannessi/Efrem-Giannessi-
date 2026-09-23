import { useState, useEffect, useCallback, useRef } from 'react';
import { RENDERING_GALLERY, PHOTO_GALLERY, GalleryMediaItem } from '../data/galleriaAutoShowcase';

export interface LiveGalleriesState {
  rendering: GalleryMediaItem[];
  fotografia: GalleryMediaItem[];
  renderingCount: number;
  photoCount: number;
  isLive: boolean;
  lastSynced: string | null;
  isSyncing: boolean;
  refreshNow: (force?: boolean) => Promise<{ success: boolean; renderingCount: number; photoCount: number }>;
}

export function useLiveGalleries(): LiveGalleriesState {
  const [rendering, setRendering] = useState<GalleryMediaItem[]>(RENDERING_GALLERY);
  const [fotografia, setFotografia] = useState<GalleryMediaItem[]>(PHOTO_GALLERY);
  const [renderingCount, setRenderingCount] = useState<number>(RENDERING_GALLERY.length);
  const [photoCount, setPhotoCount] = useState<number>(PHOTO_GALLERY.length);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const isMountedRef = useRef(true);

  const fetchLiveGalleries = useCallback(async (force = false) => {
    if (!isMountedRef.current) return { success: false, renderingCount, photoCount };
    setIsSyncing(true);

    try {
      const url = force ? `/api/drive-galleries?force=true&_t=${Date.now()}` : '/api/drive-galleries';
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        if (isMountedRef.current && data) {
          const rCount = typeof data.renderingCount === 'number' ? data.renderingCount : (Array.isArray(data.rendering) ? data.rendering.length : rendering.length);
          const pCount = typeof data.photoCount === 'number' ? data.photoCount : (Array.isArray(data.fotografia) ? data.fotografia.length : fotografia.length);

          if (Array.isArray(data.rendering) && data.rendering.length > 0) {
            setRendering(data.rendering);
            setRenderingCount(rCount);
          }
          if (Array.isArray(data.fotografia) && data.fotografia.length > 0) {
            setFotografia(data.fotografia);
            setPhotoCount(pCount);
          }
          setIsLive(true);
          const syncTimestamp = data.lastSynced || new Date().toISOString();
          setLastSynced(syncTimestamp);
          return { success: true, renderingCount: rCount, photoCount: pCount };
        }
      }
      return { success: false, renderingCount, photoCount };
    } catch (err) {
      console.warn('[useLiveGalleries] Could not fetch live galleries, using local snapshot:', err);
      return { success: false, renderingCount, photoCount };
    } finally {
      if (isMountedRef.current) {
        setIsSyncing(false);
      }
    }
  }, [renderingCount, photoCount, rendering.length, fotografia.length]);

  useEffect(() => {
    isMountedRef.current = true;
    // Initial fetch on mount
    fetchLiveGalleries(false);

    // Poll every 60 seconds to detect any new additions or removals from Drive
    const interval = setInterval(() => {
      fetchLiveGalleries(false);
    }, 60 * 1000);

    // Re-check when user switches back to this tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchLiveGalleries(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchLiveGalleries]);

  return {
    rendering,
    fotografia,
    renderingCount,
    photoCount,
    isLive,
    lastSynced,
    isSyncing,
    refreshNow: (force = true) => fetchLiveGalleries(force),
  };
}
