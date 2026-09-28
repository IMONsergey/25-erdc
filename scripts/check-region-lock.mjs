import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const hash = value => createHash('sha256').update(value).digest('hex');
// September 28 user instruction redesigns the directory and regional gateways for V3.
// Preserve V1/V2 baselines and the independent city/agglomeration integrity checks.
const target = 'docs/horizon-v3-regions.json';
const files = ['src/v3/HorizonPages.jsx','src/v3/horizon.css','src/pages/RegionGateway.jsx','src/editorial/region.css','src/editorial/EditorialPages.jsx','src/editorial/editorial.css','src/content/territory-model.js','src/layout.css','src/portal/portal.css'];
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
 console.log('Horizon v3 baseline: region gateways and directory verified.');
} finally {await server.close();}
