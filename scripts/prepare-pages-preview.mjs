import {readdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const production = new URL('https://imonsergey.github.io/25-erdc/');
const preview = new URL(process.env.PREVIEW_URL || new URL('v2/', production));
assert.equal(preview.origin, production.origin);
assert.ok(preview.pathname.startsWith(production.pathname) && preview.pathname !== production.pathname && preview.pathname.endsWith('/'));
const commit = process.env.PREVIEW_COMMIT;
assert.match(commit || '', /^[a-f0-9]{40}$/, 'PREVIEW_COMMIT must identify the published source');
async function rewrite(dir) {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await rewrite(file);
    else if (entry.name.endsWith('.html') || ['sitemap.xml','robots.txt'].includes(entry.name)) {
      let text = await readFile(file, 'utf8');
      text = text.replaceAll(production.href, preview.href)
        .replaceAll('"' + production.pathname, '"' + preview.pathname)
        .replaceAll("'" + production.pathname, "'" + preview.pathname);
      await writeFile(file, text);
    }
  }
}
await rewrite('dist');
await writeFile('dist/version.json', JSON.stringify({version:'editorial-atlas-v2',branch:'design/editorial-atlas-v2',commit,url:preview.href})+'\n');
assert.ok((await readFile('dist/vladivostok/index.html','utf8')).includes(preview.href+'vladivostok/'));
assert.ok((await readFile('dist/projects/733657179/index.html','utf8')).includes('url='+preview.href+'projects/'));
assert.ok((await readFile('dist/404.html','utf8')).includes('name="app-base" content="'+preview.pathname+'"'));
console.log('Preview links, redirects and metadata prepared for '+preview.href);
