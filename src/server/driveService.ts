import { RENDERING_GALLERY, PHOTO_GALLERY, GalleryMediaItem } from '../data/galleriaAutoShowcase';

export const RENDERING_FOLDER_ID = '1lLdKnTmr8lNcqfPqCl-OAfRzU6f5ymDq';
export const PHOTO_FOLDER_ID = '1wKmxFuxG9dmSVQtNZnF4PPs3xOwH0y1C';
export const REVIT_PROJECTS_FOLDER_ID = '1f1NdrmRafMzJSLSwNE4M_3TeBIIiesGo';

export interface RevitProjectMediaItem {
  id: string;
  driveId: string;
  src: string;
  thumbSrc: string;
}

export const INITIAL_REVIT_PROJECTS: RevitProjectMediaItem[] = [
  {
    id: 'revit-1',
    driveId: '1S4lXWOzcG5OyylcqSwYckl8-4ghpxaMl',
    src: 'https://lh3.googleusercontent.com/d/1S4lXWOzcG5OyylcqSwYckl8-4ghpxaMl=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1S4lXWOzcG5OyylcqSwYckl8-4ghpxaMl=w400',
  },
  {
    id: 'revit-2',
    driveId: '1z-nSr0iPxesS8UMedbBYzbwyk9fALkOR',
    src: 'https://lh3.googleusercontent.com/d/1z-nSr0iPxesS8UMedbBYzbwyk9fALkOR=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1z-nSr0iPxesS8UMedbBYzbwyk9fALkOR=w400',
  },
  {
    id: 'revit-3',
    driveId: '1HKuJpoNDlOUw-orJwLNy0JpnJxvUXbaD',
    src: 'https://lh3.googleusercontent.com/d/1HKuJpoNDlOUw-orJwLNy0JpnJxvUXbaD=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1HKuJpoNDlOUw-orJwLNy0JpnJxvUXbaD=w400',
  },
  {
    id: 'revit-4',
    driveId: '1g9TizBqW1ymeFIJWLYmkDVyu2SrFYvW4',
    src: 'https://lh3.googleusercontent.com/d/1g9TizBqW1ymeFIJWLYmkDVyu2SrFYvW4=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1g9TizBqW1ymeFIJWLYmkDVyu2SrFYvW4=w400',
  },
  {
    id: 'revit-5',
    driveId: '17t8BLl0WWCdvACqpPQV4imOVc1HUEoSA',
    src: 'https://lh3.googleusercontent.com/d/17t8BLl0WWCdvACqpPQV4imOVc1HUEoSA=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/17t8BLl0WWCdvACqpPQV4imOVc1HUEoSA=w400',
  },
  {
    id: 'revit-6',
    driveId: '1Oc_erFbjialLaue8K9fS4P0x8p29mkxv',
    src: 'https://lh3.googleusercontent.com/d/1Oc_erFbjialLaue8K9fS4P0x8p29mkxv=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1Oc_erFbjialLaue8K9fS4P0x8p29mkxv=w400',
  },
  {
    id: 'revit-7',
    driveId: '12Dcr7b2KQpGJIkJElTUawVBlGxbA0zME',
    src: 'https://lh3.googleusercontent.com/d/12Dcr7b2KQpGJIkJElTUawVBlGxbA0zME=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/12Dcr7b2KQpGJIkJElTUawVBlGxbA0zME=w400',
  },
  {
    id: 'revit-8',
    driveId: '1S30ihpx3inf2sURtZElga2K01ztoBTg7',
    src: 'https://lh3.googleusercontent.com/d/1S30ihpx3inf2sURtZElga2K01ztoBTg7=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1S30ihpx3inf2sURtZElga2K01ztoBTg7=w400',
  },
  {
    id: 'revit-9',
    driveId: '1Al10D1hZCVTKNmWmgqUw5iMA0P7QCpHX',
    src: 'https://lh3.googleusercontent.com/d/1Al10D1hZCVTKNmWmgqUw5iMA0P7QCpHX=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1Al10D1hZCVTKNmWmgqUw5iMA0P7QCpHX=w400',
  },
  {
    id: 'revit-10',
    driveId: '1wQiCQdoy5nKayEfLmRcXLFbWneX7y4kC',
    src: 'https://lh3.googleusercontent.com/d/1wQiCQdoy5nKayEfLmRcXLFbWneX7y4kC=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1wQiCQdoy5nKayEfLmRcXLFbWneX7y4kC=w400',
  },
  {
    id: 'revit-11',
    driveId: '1sqjoldyfdw4x5WqeR22vkinJqhI4hUq5',
    src: 'https://lh3.googleusercontent.com/d/1sqjoldyfdw4x5WqeR22vkinJqhI4hUq5=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1sqjoldyfdw4x5WqeR22vkinJqhI4hUq5=w400',
  },
  {
    id: 'revit-12',
    driveId: '19fm16Z6ybtnEY1-lsi9Qy2dOLvd6krAP',
    src: 'https://lh3.googleusercontent.com/d/19fm16Z6ybtnEY1-lsi9Qy2dOLvd6krAP=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/19fm16Z6ybtnEY1-lsi9Qy2dOLvd6krAP=w400',
  },
  {
    id: 'revit-13',
    driveId: '1HLVw-9QXfK94rb1TK1znb10WLCWN2Y5n',
    src: 'https://lh3.googleusercontent.com/d/1HLVw-9QXfK94rb1TK1znb10WLCWN2Y5n=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1HLVw-9QXfK94rb1TK1znb10WLCWN2Y5n=w400',
  },
  {
    id: 'revit-14',
    driveId: '1JsOYp2eheazMXOKiI9n9RprbxSW6e9Rt',
    src: 'https://lh3.googleusercontent.com/d/1JsOYp2eheazMXOKiI9n9RprbxSW6e9Rt=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1JsOYp2eheazMXOKiI9n9RprbxSW6e9Rt=w400',
  },
  {
    id: 'revit-15',
    driveId: '1wK6h-3pHV7xDoiEATh5E5SsJB5LiDa1m',
    src: 'https://lh3.googleusercontent.com/d/1wK6h-3pHV7xDoiEATh5E5SsJB5LiDa1m=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1wK6h-3pHV7xDoiEATh5E5SsJB5LiDa1m=w400',
  },
  {
    id: 'revit-16',
    driveId: '1l-lvsEBedocQlUIBtLr3FNZDGS4KcGwk',
    src: 'https://lh3.googleusercontent.com/d/1l-lvsEBedocQlUIBtLr3FNZDGS4KcGwk=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1l-lvsEBedocQlUIBtLr3FNZDGS4KcGwk=w400',
  },
  {
    id: 'revit-17',
    driveId: '1MVvQUctn9fOL4qOHyq3zs-wnVS3Ls7VK',
    src: 'https://lh3.googleusercontent.com/d/1MVvQUctn9fOL4qOHyq3zs-wnVS3Ls7VK=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1MVvQUctn9fOL4qOHyq3zs-wnVS3Ls7VK=w400',
  },
  {
    id: 'revit-18',
    driveId: '1p7QtRXwprikM_SiNC90oZEgrF3VLvcFZ',
    src: 'https://lh3.googleusercontent.com/d/1p7QtRXwprikM_SiNC90oZEgrF3VLvcFZ=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1p7QtRXwprikM_SiNC90oZEgrF3VLvcFZ=w400',
  },
  {
    id: 'revit-19',
    driveId: '1deCf0szT1tJ184YmMfAjPQIb4OFyvMDq',
    src: 'https://lh3.googleusercontent.com/d/1deCf0szT1tJ184YmMfAjPQIb4OFyvMDq=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1deCf0szT1tJ184YmMfAjPQIb4OFyvMDq=w400',
  },
  {
    id: 'revit-20',
    driveId: '1rMl78pAac1k2bCn1FDpOZyemhabkB7NY',
    src: 'https://lh3.googleusercontent.com/d/1rMl78pAac1k2bCn1FDpOZyemhabkB7NY=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1rMl78pAac1k2bCn1FDpOZyemhabkB7NY=w400',
  },
  {
    id: 'revit-21',
    driveId: '1C8Ac-0hoxnmF4b4KSpS89hJLVvgkot1a',
    src: 'https://lh3.googleusercontent.com/d/1C8Ac-0hoxnmF4b4KSpS89hJLVvgkot1a=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1C8Ac-0hoxnmF4b4KSpS89hJLVvgkot1a=w400',
  },
  {
    id: 'revit-22',
    driveId: '1MOG-3fkSnt5VbVuZWFhqh-nmnLZR-sSv',
    src: 'https://lh3.googleusercontent.com/d/1MOG-3fkSnt5VbVuZWFhqh-nmnLZR-sSv=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1MOG-3fkSnt5VbVuZWFhqh-nmnLZR-sSv=w400',
  },
];

let cachedRevitData: RevitProjectMediaItem[] = INITIAL_REVIT_PROJECTS;
let lastRevitFetchTime = Date.now();

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
    `https://drive.google.com/drive/folders/${folderId}?sort=14&direction=d`,
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

  await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
          },
        });

        if (!response.ok) return;

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
    })
  );

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

export async function getLiveRevitProjects(forceRefresh = false): Promise<{
  success: boolean;
  projects: RevitProjectMediaItem[];
  count: number;
  lastSynced: string;
  isLive: boolean;
}> {
  const now = Date.now();
  if (!forceRefresh && now - lastRevitFetchTime < CACHE_TTL_MS && cachedRevitData.length > 0) {
    return {
      success: true,
      projects: cachedRevitData,
      count: cachedRevitData.length,
      lastSynced: new Date(lastRevitFetchTime).toISOString(),
      isLive: true,
    };
  }

  try {
    const rawFiles = await fetchSingleFolder(REVIT_PROJECTS_FOLDER_ID, 'revit');
    if (rawFiles.length > 0) {
      cachedRevitData = rawFiles.map((f, i) => ({
        id: `revit-${i + 1}`,
        driveId: f.driveId,
        src: `https://lh3.googleusercontent.com/d/${f.driveId}=w1600`,
        thumbSrc: `https://lh3.googleusercontent.com/d/${f.driveId}=w400`,
      }));
      lastRevitFetchTime = now;
      return {
        success: true,
        projects: cachedRevitData,
        count: cachedRevitData.length,
        lastSynced: new Date(now).toISOString(),
        isLive: true,
      };
    }
  } catch (e) {
    console.error('[DriveService] Error fetching Revit projects:', e);
  }

  return {
    success: true,
    projects: cachedRevitData,
    count: cachedRevitData.length,
    lastSynced: new Date(lastRevitFetchTime || now).toISOString(),
    isLive: false,
  };
}

