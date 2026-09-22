import { RENDERING_GALLERY, PHOTO_GALLERY, GalleryMediaItem } from '../data/galleriaAutoShowcase';

export const RENDERING_FOLDER_ID = '1lLdKnTmr8lNcqfPqCl-OAfRzU6f5ymDq';
export const PHOTO_FOLDER_ID = '1wKmxFuxG9dmSVQtNZnF4PPs3xOwH0y1C';

export interface DriveGalleriesResponse {
  rendering: GalleryMediaItem[];
  fotografia: GalleryMediaItem[];
  renderingCount: number;
  photoCount: number;
  lastSynced: string;
  isLive: boolean;
}

let cachedData: DriveGalleriesResponse = {
  rendering: RENDERING_GALLERY,
  fotografia: PHOTO_GALLERY,
  renderingCount: RENDERING_GALLERY.length,
  photoCount: PHOTO_GALLERY.length,
  lastSynced: new Date().toISOString(),
  isLive: false,
};

let lastFetchTime = 0;
const CACHE_TTL_MS = 45 * 1000; // 45 seconds cache to balance responsiveness and avoid Google rate limits

export async function fetchSingleFolder(folderId: string, prefix: string): Promise<GalleryMediaItem[]> {
  const url = `https://drive.google.com/drive/folders/${folderId}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });

  if (!response.ok) {
    throw new Error(`Google Drive returned HTTP ${response.status}`);
  }

  const html = await response.text();

  // Decode standard hex escapes used in Google Drive initial payload (\x22 -> ", \x5b -> [, \x5d -> ])
  const unhex = html
    .replace(/\\x22/g, '"')
    .replace(/\\x5b/g, '[')
    .replace(/\\x5d/g, ']')
    .replace(/\\x2f/g, '/');

  const files: GalleryMediaItem[] = [];
  const seen = new Set<string>();

  // Pattern: ["FILE_ID",["FOLDER_ID"],"FILENAME"
  const regex = new RegExp(`\\["([a-zA-Z0-9_-]{25,})",\\["${folderId}"\\],"([^"]+)"`, 'g');
  let match: RegExpExecArray | null;

  const validExts = ['.jpg', '.jpeg', '.png', '.webp'];

  while ((match = regex.exec(unhex)) !== null) {
    const driveId = match[1];
    const rawName = match[2];
    const lower = rawName.toLowerCase();

    if (validExts.some(ext => lower.endsWith(ext))) {
      if (!seen.has(driveId)) {
        seen.add(driveId);
        const cleanName = rawName.replace(/\.[^/.]+$/, '');
        files.push({
          id: `${prefix}-${files.length + 1}`,
          driveId,
          name: cleanName,
          src: `https://lh3.googleusercontent.com/d/${driveId}=w1200`,
          thumbSrc: `https://lh3.googleusercontent.com/d/${driveId}=w400`,
        });
      }
    }
  }

  return files;
}

export async function getLiveGalleries(forceRefresh = false): Promise<DriveGalleriesResponse> {
  const now = Date.now();

  // If cache is fresh and not forced, return cached data
  if (!forceRefresh && now - lastFetchTime < CACHE_TTL_MS && cachedData.isLive) {
    return cachedData;
  }

  try {
    const [renderingFiles, photoFiles] = await Promise.all([
      fetchSingleFolder(RENDERING_FOLDER_ID, 'rnd'),
      fetchSingleFolder(PHOTO_FOLDER_ID, 'pht'),
    ]);

    if (renderingFiles.length > 0 || photoFiles.length > 0) {
      cachedData = {
        rendering: renderingFiles.length > 0 ? renderingFiles : cachedData.rendering,
        fotografia: photoFiles.length > 0 ? photoFiles : cachedData.fotografia,
        renderingCount: renderingFiles.length > 0 ? renderingFiles.length : cachedData.renderingCount,
        photoCount: photoFiles.length > 0 ? photoFiles.length : cachedData.photoCount,
        lastSynced: new Date().toISOString(),
        isLive: true,
      };
      lastFetchTime = now;
    }
  } catch (err) {
    console.error('[DriveService] Error updating live galleries:', err);
    // Keep cached data, do not break client
  }

  return cachedData;
}
