const SECURITY_HEADERS = [
  'strict-transport-security',
  'content-security-policy',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
  'x-xss-protection',
  'access-control-allow-origin',
];

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      });
    }

    const target = new URL(request.url).searchParams.get('url');
    if (!target) return reply({ error: 'missing url param' }, 400);

    try {
      const res = await fetch(target, {
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SecurityHeadersChecker/1.0)' },
      });

      const headers = {};
      for (const key of SECURITY_HEADERS) {
        const val = res.headers.get(key);
        if (val !== null) headers[key] = val;
      }

      return reply({ status: res.status, headers });
    } catch (e) {
      return reply({ error: e.message }, 502);
    }
  },
};

function reply(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
