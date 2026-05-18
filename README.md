# HTTP Security Headers

Check HTTP security headers for multiple hosts at once.

**Live:** https://juguitos.github.io/security-headers

## What it checks

| Short | Header |
|-------|--------|
| HSTS  | Strict-Transport-Security |
| CSP   | Content-Security-Policy |
| XCTO  | X-Content-Type-Options |
| XFO   | X-Frame-Options |
| RP    | Referrer-Policy |
| PP    | Permissions-Policy |
| XXP   | X-XSS-Protection |

## Usage

1. Paste comma-separated domains or one per line
2. Or upload a `.txt` file with one domain per line
3. Hit **Scan**

Results show per-header pass/fail, a score, and a summary strip. Export to CSV or copy lists of vulnerable hosts.

## Note

Browser security (CORS) prevents direct cross-origin requests, so scans are proxied through [corsproxy.io](https://corsproxy.io). No data is stored.
