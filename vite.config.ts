import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { getLiveGalleries } from './src/server/driveService';

function driveGalleryDevPlugin(): Plugin {
  return {
    name: 'drive-gallery-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/contact' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { name, email, subject, message, source } = body;
              if (!name || !email || !message) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: false,
                    error: 'Campi obbligatori mancanti: nome, email e messaggio sono richiesti.',
                  })
                );
                return;
              }

              const id =
                'MSG-' +
                Date.now().toString(36).toUpperCase() +
                '-' +
                Math.random().toString(36).substring(2, 6).toUpperCase();
              const timestamp = new Date().toISOString();

              const dir = path.join(process.cwd(), 'data');
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              const file = path.join(dir, 'contact_messages.json');
              let list = [];
              if (fs.existsSync(file)) {
                try {
                  list = JSON.parse(fs.readFileSync(file, 'utf-8'));
                } catch {
                  list = [];
                }
              }
              list.unshift({
                id,
                timestamp,
                name: String(name).trim(),
                email: String(email).trim(),
                subject: String(subject || 'Richiesta generale').trim(),
                message: String(message).trim(),
                source: source || 'modulo-contatto',
              });
              fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf-8');

              console.log(
                `[CONTACT DEV] ${timestamp} | ID: ${id} | From: ${name} <${email}> | Subject: ${subject}`
              );

              // Forward to FormSubmit to deliver email to EfremGiannessi@gmail.com
              fetch('https://formsubmit.co/ajax/EfremGiannessi@gmail.com', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  Origin: 'https://ais-dev-4zmcvnov55hkto7mxnrk75-24804182841.europe-west2.run.app',
                  Referer: 'https://ais-dev-4zmcvnov55hkto7mxnrk75-24804182841.europe-west2.run.app/',
                },
                body: JSON.stringify({
                  name: String(name).trim(),
                  email: String(email).trim(),
                  _subject: `[Portfolio BIM] ${subject} - da ${name}`,
                  _replyto: String(email).trim(),
                  _template: 'table',
                  _captcha: 'false',
                  protocollo: id,
                  argomento: subject,
                  messaggio: message,
                  dataOra: timestamp,
                }),
              })
                .then((r) => r.json())
                .then((d) => console.log('[API dev] FormSubmit dispatch:', d))
                .catch((e) => console.warn('[API dev] FormSubmit error:', e));

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  id,
                  timestamp,
                  message: 'Messaggio ricevuto e registrato con successo nel sistema.',
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err?.message }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/drive-galleries')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const force = urlObj.searchParams.get('force') === 'true';
            const data = await getLiveGalleries(force);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'public, max-age=30');
            res.end(JSON.stringify(data));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e?.message }));
          }
          return;
        }
        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok' }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), driveGalleryDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
