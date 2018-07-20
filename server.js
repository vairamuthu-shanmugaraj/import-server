const bytes = require('bytes');
const {parse} = require('url');
const LRU = require('lru-cache');
const fetch = require('node-fetch');
const toBuffer = require('raw-body');
const {IMPORT_ORG = 'importpw', IMPORT_REPO = 'import'} = process.env;

const toURL = ({repo, org, ref, file}) => (
  `https://raw.githubusercontent.com/${org}/${repo}/${ref}/${file}`
);

const cache = LRU({
  max: bytes('10mb'),
  length(n, key) {
    return n.body.length;
  },
  dispose(key, n) {
    console.log('dispose', { n, key });
  }
});

function redirect (res, url) {
  res.statusCode = 302;
  res.setHeader('Location', url);
  return `Redirecting to ${url}\n`;
}

module.exports = async (req, res) => {
  let ref = 'master';
  let org = IMPORT_ORG;
  let repo = IMPORT_REPO;
  let {pathname, query: {file}} = parse(req.url, true);

  if (pathname === '/favicon.ico') {
    // Redirect to the user/org's GitHub avatar for the favicon
    // See: https://stackoverflow.com/a/36380674/376773
    const favicon = `https://github.com/${org}.png`;
    return redirect(res, favicon);
  }

  const at = pathname.lastIndexOf('@');
  if (at !== -1) {
    ref = pathname.substring(at + 1);
    pathname = pathname.substring(0, at);
  }
  const parts = pathname.substring(1).split('/');
  const numParts = parts.length;

  if (numParts === 1) {
    if (parts[0]) repo = parts[0];
  } else if (numParts === 2) {
    if (parts[0]) org = parts[0];
    if (parts[1]) repo = parts[1];
  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    return `Expected up to 2 slashes in the URL, but got ${numParts}\n`;
  }
  if (!file) file = `${repo}.sh`;
  const params = {repo, org, ref, file};
  const id = JSON.stringify(params);
  let cached = cache.get(id);

  if (!cached) {
    const url = toURL(params);
    const res2 = await fetch(url);
    if (!res2.ok) {
      // If the asset was 404, then it's possibly a private repo.
      // Redirect to the URL that 404'd and let `curl --netrc` give it a go.
      return redirect(res, res2.url);
    }
    const body = await toBuffer(res2.body, {
      limit: '1mb'
    });
    cached = {
      body,
      status: res2.status,
      headers: {
        'Content-Type': res2.headers.get('Content-Type'),
        'ETag': res2.headers.get('ETag'),
        'Content-Location': res2.url
      }
    };
    const maxAge = new Date(res2.headers.get('Expires')) - Date.now();
    cache.set(id, cached, maxAge);
  }

  res.statusCode = cached.status;
  for (const name of Object.keys(cached.headers)) {
    res.setHeader(name, cached.headers[name]);
  }
  return cached.body;
};
