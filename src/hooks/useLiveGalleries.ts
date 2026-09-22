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
  refreshNow: (force?: boolean) => Promise<void>;
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
    if (!isMountedRef.current) return;
    setIsSyncing(true);

    try {
      const url = force ? '/api/drive-galleries?force=true' : '/api/drive-galleries';
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        if (isMountedRef.current && data) {
          if (Array.isArray(data.rendering) && data.rendering.length > 0) {
            setRendering(data.rendering);
            setRenderingCount(data.renderingCount ?? data.rendering.length);
          }
          if (Array.isArray(data.fotografia) && data.fotografia.length > 0) {
            setFotografia(data.fotografia);
            setPhotoCount(data.photoCount ?? data.fotografia.length);
          }
          setIsLive(true);
          setLastSynced(data.lastSynced || new Date().toISOString());
        }
      }
    } catch (err) {
      console.warn('[useLiveGalleries] Could not fetch live galleries, using local snapshot:', err);
    } finally {
      if (isMountedRef.current) {
        setIsSyncing(false);
      }
    }
  }, []);

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
