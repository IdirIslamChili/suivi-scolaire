// Runs after "ng build".
// Ionic loads a few small files only when they are first needed (page
// transitions, gestures, keyboard helpers). This script asks the browser to
// fetch them together with the first page, so that once the app is open,
// nothing more has to come from the network and it keeps working offline.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const outDir = new URL('../www/', import.meta.url);
const indexFile = new URL('index.html', outDir);
const marker = '<!-- preload-chunks -->';

let html = readFileSync(indexFile, 'utf8');
if (!html.includes(marker)) {
  const links = readdirSync(outDir)
    .filter((file) => /^chunk-.*\.js$/.test(file) && !html.includes(file))
    .map((file) => `<link rel="modulepreload" href="${file}">`)
    .join('');
  html = html.replace('</head>', `${marker}${links}</head>`);
  writeFileSync(indexFile, html);
  console.log('preload-chunks: index.html updated');
}
