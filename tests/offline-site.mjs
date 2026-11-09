import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

// No HTTP connection: Chrome receives the unmodified production output from
// disk via Playwright. This is useful when a host disallows loopback traffic.
// It verifies rendering and interactions, not a deployed server or its headers.
export async function serveBuiltSite(page, base) {
  if (process.env.EXPLORER_BUILD_FILES !== '1') return;
  const root = resolve('.');
  await page.route(new URL(base).origin + '/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = decodeURIComponent(url.pathname);
    const rsc = request.headers().rsc === '1' || url.searchParams.has('_rsc');
    let file;
    if (pathname === '/' || pathname === '/architecture') file = '.next/server/app/' + (pathname === '/' ? 'index' : 'architecture') + (rsc ? '.rsc' : '.html');
    else if (pathname.startsWith('/_next/static/')) file = '.next/static/' + pathname.slice(14);
    else if (pathname.startsWith('/scenes/')) file = 'public' + pathname;
    else return route.fulfill({ status: 404, body: '' });
    const absolute = resolve(root, file);
    if (!absolute.startsWith(root + sep)) return route.fulfill({ status: 403, body: '' });
    const type = file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.webp') ? 'image/webp' : file.endsWith('.rsc') ? 'text/x-component' : 'text/html';
    try { await route.fulfill({ body: await readFile(absolute), contentType: type }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
}
