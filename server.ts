import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { getLiveGalleries } from './src/server/driveService';

interface ContactMessage {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: string;
}

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contact_messages.json');

function saveContactMessage(msg: ContactMessage) {
  try {
    const dir = path.dirname(CONTACTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let list: ContactMessage[] = [];
    if (fs.existsSync(CONTACTS_FILE)) {
      const raw = fs.readFileSync(CONTACTS_FILE, 'utf-8');
      list = JSON.parse(raw);
    }
    list.unshift(msg);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.error('[API] Failed to save contact message to disk:', e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Contact submission endpoint
  app.post('/api/contact', (req, res) => {
    try {
      const { name, email, subject, message, source } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: 'Campi obbligatori mancanti: nome, email e messaggio sono richiesti.',
        });
      }

      const id =
        'MSG-' +
        Date.now().toString(36).toUpperCase() +
        '-' +
        Math.random().toString(36).substring(2, 6).toUpperCase();
      const timestamp = new Date().toISOString();

      const newMsg: ContactMessage = {
        id,
        timestamp,
        name: String(name).trim(),
        email: String(email).trim(),
        subject: String(subject || 'Richiesta generale').trim(),
        message: String(message).trim(),
        source: source || 'modulo-contatto-diretto',
      };

      console.log(
        `[CONTACT SUBMISSION] ${timestamp} | ID: ${id} | From: ${newMsg.name} <${newMsg.email}> | Subject: ${newMsg.subject}`
      );
      saveContactMessage(newMsg);

      return res.status(200).json({
        success: true,
        id,
        timestamp,
        message: 'Messaggio ricevuto e registrato con successo nel sistema.',
      });
    } catch (err: any) {
      console.error('[API] /api/contact error:', err);
      return res.status(500).json({ success: false, error: 'Errore interno del server.' });
    }
  });

  // Real-time Drive Galleries sync endpoint
  app.get('/api/drive-galleries', async (req, res) => {
    try {
      const force = req.query.force === 'true';
      const data = await getLiveGalleries(force);
      res.setHeader('Cache-Control', 'public, max-age=30');
      res.json(data);
    } catch (err: any) {
      console.error('[API] /api/drive-galleries error:', err);
      res.status(500).json({ error: 'Failed to fetch galleries', message: err?.message });
    }
  });

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
