import https from 'https';

export interface YouTubePlaylistVideo {
  id: string;
  title: string;
  description: string;
  published: string;
}

const PLAYLIST_ID = 'PLkHo5YliNpBhQ6hpYCMb-WmB4UczHgB8Y';

// In-memory cache
let cachedVideos: YouTubePlaylistVideo[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache for fast updates when new videos are uploaded

// Default fallback list in case of network interruption
export const DEFAULT_FALLBACK_VIDEOS: YouTubePlaylistVideo[] = [
  {
    id: "nbkA4LiKfJQ",
    title: "Revit Precast Manager, Strutture - Travi di banchina",
    description: "Generazione e posizionamento automatico parametrico delle travi di banchina prefabbricate con aggancio ai pilastri.",
    published: "2026-06-17T11:22:02+00:00"
  },
  {
    id: "OxbZzOyYG7Y",
    title: "Revit Precast Manager, Strutture - Travi di copertura",
    description: "Modellazione rapida di travi di copertura a doppia pendenza, boomerang e ad Y con calcolo vincoli.",
    published: "2026-06-17T11:20:55+00:00"
  },
  {
    id: "f0ja3Kqyp-o",
    title: "Revit Precast Manager, Strutture - Pendenze automatiche",
    description: "Algoritmo per il calcolo e l'inclinazione automatica dei sistemi di copertura prefabbricata e compluvi.",
    published: "2026-06-17T11:19:15+00:00"
  },
  {
    id: "fM3wGufzRe8",
    title: "Revit Precast Manager, Strutture griglie e pilastri",
    description: "Impostazione istantanea della maglia strutturale, inserimento coordinato dei pilastri con mensole carroponte.",
    published: "2026-06-17T11:17:30+00:00"
  },
  {
    id: "V_i9UAMFuCI",
    title: "Revit Precast Manager, Livelli e Setup",
    description: "Impostazione iniziale dei livelli di quota, piani d'estradosso fondazione e parametri globali.",
    published: "2026-06-17T11:15:00+00:00"
  },
  {
    id: "_ox37qWtfvI",
    title: "Revit Precast Manager, automazione edificio civile abitazione",
    description: "Adattamento degli strumenti parametrici di Revit Precast Manager per la prefabbricazione civile.",
    published: "2026-06-17T11:12:00+00:00"
  },
  {
    id: "xYiChWBT2WE",
    title: "Revit Precast Manager, creazione automatica logo in una famiglia",
    description: "Script pyRevit / Revit API per l'estrusione vettoriale automatica di marchi aziendali personalizzati.",
    published: "2026-06-17T11:08:00+00:00"
  },
  {
    id: "ptaiRrj85pY",
    title: "Revit Precast Manager, creazione automatica di edifici prefabbricati in c.a.p. da preset predefiniti",
    description: "Generazione completa e istantanea di un intero capannone industriale in c.a.p. da preset.",
    published: "2026-06-17T11:05:00+00:00"
  },
  {
    id: "1BgJSIjncc8",
    title: "Revit Precast Manager, modellare in automatico strutture prefabbricate",
    description: "Dimostrazione dell'intero flusso di lavoro: dal layout di progetto fino alla posa virtuale.",
    published: "2026-06-17T11:00:00+00:00"
  }
];

export async function fetchLiveYouTubePlaylist(forceRefresh = false): Promise<{
  success: boolean;
  videos: YouTubePlaylistVideo[];
  source: 'live' | 'cache' | 'fallback';
  lastUpdated: string;
}> {
  const now = Date.now();

  if (!forceRefresh && cachedVideos && (now - lastFetchTime < CACHE_TTL_MS)) {
    return {
      success: true,
      videos: cachedVideos,
      source: 'cache',
      lastUpdated: new Date(lastFetchTime).toISOString()
    };
  }

  return new Promise((resolve) => {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;

    const req = https.get(feedUrl, { timeout: 8000 }, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`[YouTube RSS] Feed returned status code ${res.statusCode}`);
        return resolve({
          success: true,
          videos: cachedVideos || DEFAULT_FALLBACK_VIDEOS,
          source: 'fallback',
          lastUpdated: new Date().toISOString()
        });
      }

      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const entries = data.split('<entry>').slice(1);
          const parsedVideos: YouTubePlaylistVideo[] = entries.map(entry => {
            const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || '';
            const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || '';
            const desc = entry.match(/<media:description>(.*?)<\/media:description>/s)?.[1] || '';
            const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || '';

            return {
              id: videoId.trim(),
              title: title
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .trim(),
              description: desc.slice(0, 200).trim(),
              published: published.trim()
            };
          }).filter(v => Boolean(v.id && v.title));

          if (parsedVideos.length > 0) {
            cachedVideos = parsedVideos;
            lastFetchTime = now;
            console.log(`[YouTube RSS] Successfully refreshed playlist with ${parsedVideos.length} videos`);
            return resolve({
              success: true,
              videos: parsedVideos,
              source: 'live',
              lastUpdated: new Date(now).toISOString()
            });
          }

          resolve({
            success: true,
            videos: cachedVideos || DEFAULT_FALLBACK_VIDEOS,
            source: 'fallback',
            lastUpdated: new Date().toISOString()
          });
        } catch (parseError) {
          console.error('[YouTube RSS] Error parsing XML feed:', parseError);
          resolve({
            success: true,
            videos: cachedVideos || DEFAULT_FALLBACK_VIDEOS,
            source: 'fallback',
            lastUpdated: new Date().toISOString()
          });
        }
      });
    });

    req.on('error', (err) => {
      console.warn('[YouTube RSS] Request error:', err.message);
      resolve({
        success: true,
        videos: cachedVideos || DEFAULT_FALLBACK_VIDEOS,
        source: 'fallback',
        lastUpdated: new Date().toISOString()
      });
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn('[YouTube RSS] Request timed out');
      resolve({
        success: true,
        videos: cachedVideos || DEFAULT_FALLBACK_VIDEOS,
        source: 'fallback',
        lastUpdated: new Date().toISOString()
      });
    });
  });
}
