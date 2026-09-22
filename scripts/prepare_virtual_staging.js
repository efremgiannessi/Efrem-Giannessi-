import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import https from 'https';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const foldersData = JSON.parse(fs.readFileSync('src/data/drive_virtual_staging.json', 'utf8'));

fs.mkdirSync('public/virtual-staging/previews', { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Processing ${foldersData.length} folders...`);
  const results = [];

  for (let i = 0; i < foldersData.length; i++) {
    const folder = foldersData[i];
    const folderNum = i + 1;
    console.log(`Processing ${folder.folderName} (${folderNum}/${foldersData.length})...`);

    const fileA = folder.files[0];
    const fileB = folder.files[1];

    const tempA = `public/virtual-staging/previews/temp_${folderNum}_A.jpg`;
    const tempB = `public/virtual-staging/previews/temp_${folderNum}_B.jpg`;

    const urlA = `https://lh3.googleusercontent.com/d/${fileA.id}=w900`;
    const urlB = `https://lh3.googleusercontent.com/d/${fileB.id}=w900`;

    await downloadFile(urlA, tempA);
    await downloadFile(urlB, tempB);

    const bufA = fs.readFileSync(tempA);
    const bufB = fs.readFileSync(tempB);

    let classification = { prima: 1, dopo: 2, roomType: 'Ambiente Residenziale', category: 'living', description: 'Allestimento d\'interni fotorealistico' };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Analyze these 2 images of an architectural virtual staging project. Image 1 is file A, Image 2 is file B. Determine which is PRIMA (empty/unfurnished/raw before staging) and which is DOPO (furnished/virtually staged). Output ONLY a valid JSON: {"prima": 1 or 2, "dopo": 1 or 2, "roomType": "Short room title in Italian (e.g. Soggiorno Open Space, Master Bedroom, Cucina con Isola, Area Living, Sala da Pranzo)", "category": "living | notte | cucina | bagno | studio | terrazzo", "description": "1 sentence description in Italian of the staging intervention highlighting materials, furniture, lighting and colors"}' },
              { inlineData: { mimeType: 'image/jpeg', data: bufA.toString('base64') } },
              { inlineData: { mimeType: 'image/jpeg', data: bufB.toString('base64') } }
            ]
          }
        ]
      });

      const text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      classification = JSON.parse(text);
      console.log(`Folder ${folderNum} classified:`, classification.roomType, `Prima: ${classification.prima}`);
    } catch (err) {
      console.error(`Folder ${folderNum} classification error:`, err.message);
    }

    const isA_Prima = classification.prima === 1;
    const primaFile = isA_Prima ? fileA : fileB;
    const dopoFile = isA_Prima ? fileB : fileA;

    const finalPrimaPath = `public/virtual-staging/previews/folder_${folderNum}_prima.jpg`;
    const finalDopoPath = `public/virtual-staging/previews/folder_${folderNum}_dopo.jpg`;

    if (isA_Prima) {
      fs.renameSync(tempA, finalPrimaPath);
      fs.renameSync(tempB, finalDopoPath);
    } else {
      fs.renameSync(tempB, finalPrimaPath);
      fs.renameSync(tempA, finalDopoPath);
    }

    results.push({
      id: `vs-project-${folderNum}`,
      folderName: folder.folderName,
      folderNumber: folderNum,
      title: classification.roomType || `Ambiente ${folderNum}`,
      category: classification.category || 'living',
      description: classification.description || 'Intervento di virtual staging fotorealistico per la valorizzazione commerciale dell\'immobile.',
      beforeImage: `/virtual-staging/previews/folder_${folderNum}_prima.jpg`,
      afterImage: `/virtual-staging/previews/folder_${folderNum}_dopo.jpg`,
      beforeDriveId: primaFile.id,
      afterDriveId: dopoFile.id,
      highResBefore: `https://lh3.googleusercontent.com/d/${primaFile.id}=w2048`,
      highResAfter: `https://lh3.googleusercontent.com/d/${dopoFile.id}=w2048`,
    });
  }

  const fileContent = `export interface VirtualStagingItem {
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

export const VIRTUAL_STAGING_ITEMS: VirtualStagingItem[] = ${JSON.stringify(results, null, 2)};
`;

  fs.writeFileSync('src/data/virtualStagingShowcase.ts', fileContent, 'utf8');
  console.log('Successfully written src/data/virtualStagingShowcase.ts!');
}

run().catch(console.error);
