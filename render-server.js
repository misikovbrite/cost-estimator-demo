#!/usr/bin/env node
/**
 * Local render server. Runs on your Mac at localhost:4002.
 * The Creative editor on cppflow.com calls this to render videos instantly.
 *
 * Usage: node render-server.js
 */
const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 4002;
const BASE = '/tmp/app-preview-builder';
const FTP_USER = 'deploy:111345';
const FTP_HOST = '138.68.62.199';
const REMOTE_PATH = 'cost-estimator-demo/hooks/creative-ceiling-leak-final.mp4';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  if (req.method !== 'POST') { res.writeHead(200); res.end(JSON.stringify({status:'ready'})); return; }

  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    try {
      const { segments } = JSON.parse(body);
      const inputs = [];
      const filters = [];
      const concat = [];
      let idx = 0;

      segments.forEach((seg, i) => {
        if (seg.src) {
          const localSrc = seg.src.replace('hooks/', '');
          inputs.push(`-i "${BASE}/public/${localSrc}"`);
          filters.push(`[${idx}:v]trim=0:${seg.duration},setpts=PTS-STARTPTS,scale=886:1920,setsar=1[v${i}]`);
          concat.push(`[v${i}]`);
          idx++;
        } else if (seg.id === 'flash') {
          inputs.push(`-f lavfi -i "color=white:s=886x1920:d=${seg.duration},format=yuv420p"`);
          filters.push(`[${idx}:v]setpts=PTS-STARTPTS[v${i}]`);
          concat.push(`[v${i}]`);
          idx++;
        }
      });

      const n = concat.length;
      const fc = filters.join('; ') + '; ' + concat.join('') + `concat=n=${n}:v=1:a=0[out]`;
      const outPath = `${BASE}/out/creative-final.mp4`;
      const cmd = `ffmpeg -y ${inputs.join(' ')} -filter_complex "${fc}" -map "[out]" -c:v libx264 -preset ultrafast -crf 23 -r 30 "${outPath}"`;

      console.log(`[render] ${n} segments...`);
      const t0 = Date.now();
      execSync(cmd, { stdio: 'pipe' });
      const sec = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[render] done in ${sec}s`);

      // Upload
      console.log('[upload] uploading to cppflow.com...');
      execSync(`curl -T "${outPath}" ftp://${FTP_HOST}/${REMOTE_PATH} --user ${FTP_USER} -s`);
      console.log('[upload] done');

      const size = fs.statSync(outPath).size;
      res.writeHead(200);
      res.end(JSON.stringify({
        ok: true,
        time: sec + 's',
        size,
        url: `https://cppflow.com/cost-estimator-demo/hooks/creative-ceiling-leak-final.mp4?t=${Date.now()}`
      }));
    } catch (e) {
      console.error(e.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🎬 Local render server: http://localhost:${PORT}`);
  console.log('   Waiting for render requests from Creative editor...\n');
});
