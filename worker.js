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

const CORS_HEADERS = [
  'access-control-allow-origin',
  'access-control-allow-credentials',
  'access-control-allow-methods',
  'access-control-allow-headers',
  'access-control-expose-headers',
  'vary',
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

    const params = new URL(request.url).searchParams;
    const target = params.get('url');
    if (!target) return reply({ error: 'missing url param' }, 400);

    // CORS-specific check: send Origin header, return CORS response headers
    if (params.get('cors') === '1') {
      const origin = params.get('origin') || 'https://evil.com';
      try {
        const res = await fetch(target, {
          redirect: 'follow',
          headers: {
            'Origin': origin,
            'User-Agent': 'Mozilla/5.0 (compatible; SecurityHeadersChecker/1.0)',
          },
        });
        const headers = {};
        for (const key of CORS_HEADERS) {
          const val = res.headers.get(key);
          if (val !== null) headers[key] = val;
        }
        return reply({ status: res.status, origin_sent: origin, headers });
      } catch (e) {
        return reply({ error: e.message }, 502);
      }
    }

    // Default: security headers check
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
