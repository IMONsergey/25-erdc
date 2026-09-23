import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const hash = value => createHash('sha256').update(value).digest('hex');
const target = 'docs/regions-approved-20260923.json';
const files = ['src/pages/RegionalAtlas.jsx','src/pages/RegionalMap.jsx','src/pages/regional-atlas.css','src/pages/territories.css','src/content/illustrated-atlases.js','src/layout.css','src/portal/portal.css'];
globalThis.location = new URL('http://localhost/');
globalThis.document = { baseURI: location.href, querySelector: () => ({content:'./'}) };
globalThis.window = { scrollY: 0 };
const catalog = JSON.parse(await readFile('src/content/catalog.json','utf8'));
const server = await createServer({server:{middlewareMode:true},appType:'custom'});
try {
 const {PortalRoute} = await server.ssrLoadModule('/src/portal/PortalApp.jsx');
 const current = {files:{},pages:{}};
 for (const file of files) current.files[file] = hash(await readFile(file));
 for (const requestedPath of ['regions',...catalog.regions.map(r=>r.id==='primkrai'?'primorye':r.id)]) current.pages[requestedPath] = hash(renderToString(createElement(PortalRoute,{requestedPath})));
 if (process.argv.includes('--record')) await writeFile(target, JSON.stringify(current,null,2)+'\n');
 else assert.deepEqual(current,JSON.parse(await readFile(target,'utf8')), 'Approved region pages changed');
 console.log('Region lock: all 11 region pages, the directory and shared design files match their approved version.');
} finally {await server.close();}
