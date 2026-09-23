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
  const urls = [
    `https://drive.google.com/drive/folders/${folderId}`,
    `https://drive.google.com/drive/folders/${folderId}?sort=7&direction=d`,
    `https://drive.google.com/drive/folders/${folderId}?sort=7&direction=a`,
    `https://drive.google.com/drive/folders/${folderId}?sort=13&direction=d`,
  ];

  const files: GalleryMediaItem[] = [];
  const seen = new Set<string>();
  const validExts = ['.jpg', '.jpeg', '.png', '.webp'];

  const tryAdd = (rawId: string, rawName: string) => {
    if (!rawId || !rawName) return;
    const cleanId = rawId.replace(/-0-\d+$/, '').trim();
    const cleanName = rawName.replace(/\.[^/.]+$/, '').trim();
    const lower = rawName.toLowerCase();

    const isValidExt = validExts.some((ext) => lower.endsWith(ext));
    if (!isValidExt) return;
    if (cleanId.length < 25) return;
    if (
      cleanName.includes('favicon') ||
      cleanName.includes('al-icon') ||
      cleanName.includes('broken_image') ||
      cleanName.includes('logo_drive')
    ) {
      return;
    }

    if (!seen.has(cleanId)) {
      seen.add(cleanId);
      files.push({
        id: `${prefix}-${files.length + 1}`,
        driveId: cleanId,
        name: cleanName,
        src: `https://lh3.googleusercontent.com/d/${cleanId}=w1200`,
        thumbSrc: `https://lh3.googleusercontent.com/d/${cleanId}=w400`,
      });
    }
  };

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      });

      if (!response.ok) continue;

      const html = await response.text();
      const unhex = html
        .replace(/\\x22/g, '"')
        .replace(/\\x5b/g, '[')
        .replace(/\\x5d/g, ']')
        .replace(/\\x2f/g, '/');

      // Pattern 1: aria-label + ssk
      const regex1 =
        /aria-label="([^"]+\.(?:jpg|jpeg|png|webp))[^"]*"[^>]*?ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]{25,})/gi;
      let match: RegExpExecArray | null;
      while ((match = regex1.exec(unhex)) !== null) {
        tryAdd(match[2], match[1]);
      }

      // Pattern 2: ssk + aria-label
      const regex2 =
        /ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]{25,})[^']*'[^>]*?aria-label="([^"]+\.(?:jpg|jpeg|png|webp))/gi;
      while ((match = regex2.exec(unhex)) !== null) {
        tryAdd(match[1], match[2]);
      }

      // Pattern 3: JSON array format ["FILE_ID",["FOLDER_ID"],"FILENAME"
      const regex3 = new RegExp(
        `\\["([a-zA-Z0-9_-]{25,})",\\["${folderId}"\\],"([^"]+)"`,
        'g'
      );
      while ((match = regex3.exec(unhex)) !== null) {
        tryAdd(match[1], match[2]);
      }

      // Pattern 4: ["FILE_ID","FILENAME.ext"
      const regex4 =
        /\["([a-zA-Z0-9_-]{25,})","([^"]+\.(?:jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP))"/g;
      while ((match = regex4.exec(unhex)) !== null) {
        tryAdd(match[1], match[2]);
      }

      // Pattern 5: ["FILENAME.ext","FILE_ID"
      const regex5 =
        /\["([^"]+\.(?:jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP))","([a-zA-Z0-9_-]{25,})"/g;
      while ((match = regex5.exec(unhex)) !== null) {
        tryAdd(match[2], match[1]);
      }
    } catch (e) {
      console.warn(`[DriveService] Error fetching ${url}:`, e);
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
