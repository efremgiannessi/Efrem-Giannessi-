import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const rawTs = fs.readFileSync('src/data/virtualStagingShowcase.ts', 'utf8');
const startIndex = rawTs.indexOf('[\n  {');
const endIndex = rawTs.lastIndexOf('];');
const jsonStr = rawTs.substring(startIndex, endIndex + 1);
const data = JSON.parse(jsonStr);

async function refine() {
  const targets = [9, 12, 13, 14, 15];
  for (const num of targets) {
    const item = data.find(d => d.folderNumber === num);
    if (!item) continue;
    try {
      const bufPrima = fs.readFileSync('public' + item.beforeImage);
      const bufDopo = fs.readFileSync('public' + item.afterImage);
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Look at Image 1 (Prima, empty/raw) and Image 2 (Dopo, staged/furnished). Identify the exact room/environment in Italian (e.g. Soggiorno Living, Open Space con Mansarda, Camera da Letto Matrimoniale, Studio & Smart Working, Sala da Pranzo) and provide 1 sentence describing the virtual staging (furniture, lighting, textures). Format ONLY as JSON: {"title": "...", "category": "living" or "notte" or "cucina" or "bagno" or "studio" or "terrazzo", "description": "..."}' },
              { inlineData: { mimeType: 'image/jpeg', data: bufPrima.toString('base64') } },
              { inlineData: { mimeType: 'image/jpeg', data: bufDopo.toString('base64') } }
            ]
          }
        ]
      });
      const clean = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);
      item.title = parsed.title;
      item.category = parsed.category || 'living';
      item.description = parsed.description;
      console.log('Refined folder', num, '->', parsed.title);
    } catch (e) {
      console.error('Error folder', num, e.message);
    }
  }

  const output = `export interface VirtualStagingItem {
  id: string;
  folderName: string;
  folderNumber: number;
  title: string;
  category: 'living' | 'notte' | 'cucina' | 'bagno' | 'studio' | 'terrazzo' | string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeDriveId: string;
  afterDriveId: string;
  highResBefore: string;
  highResAfter: string;
}

export const VIRTUAL_STAGING_ITEMS: VirtualStagingItem[] = ${JSON.stringify(data, null, 2)};
`;

  fs.writeFileSync('src/data/virtualStagingShowcase.ts', output, 'utf8');
  console.log('Updated src/data/virtualStagingShowcase.ts successfully!');
}

refine();
