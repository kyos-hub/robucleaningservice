<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>XML Sitemap — Robu Cleaning Services</title>
        <style>
          :root { --green:#1E7D32; --dark:#145A32; --ink:#1F2937; --line:#E5E7EB; --muted:#6B7280; }
          * { box-sizing:border-box; }
          body { margin:0; background:#F8F9FA; color:var(--ink);
                 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
          header { background:linear-gradient(135deg,var(--dark),var(--green)); color:#fff; padding:40px 20px; }
          .wrap { max-width:1000px; margin:0 auto; padding:0 20px; }
          header .wrap { padding:0; }
          h1 { margin:0; font-size:26px; letter-spacing:-0.02em; }
          header p { margin:8px 0 0; opacity:.85; font-size:14px; }
          main { padding:28px 0 60px; }
          .card { background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden;
                  box-shadow:0 4px 20px -8px rgba(20,90,50,.12); }
          .meta { display:flex; flex-wrap:wrap; gap:10px; padding:16px 20px; border-bottom:1px solid var(--line);
                  font-size:13px; color:var(--muted); }
          .pill { background:rgba(30,125,50,.1); color:var(--dark); border-radius:999px; padding:4px 12px; font-weight:600; }
          table { width:100%; border-collapse:collapse; font-size:14px; }
          th { text-align:left; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted);
               padding:12px 20px; border-bottom:1px solid var(--line); background:#FBFCFB; }
          td { padding:12px 20px; border-bottom:1px solid var(--line); vertical-align:middle; }
          tr:last-child td { border-bottom:none; }
          tr:hover td { background:#F8FBF8; }
          a { color:var(--green); text-decoration:none; word-break:break-all; }
          a:hover { text-decoration:underline; }
          .num { color:var(--muted); width:52px; }
          footer { color:var(--muted); font-size:12px; text-align:center; padding:0 20px 40px; }
          @media (max-width:640px) { .hide-sm { display:none; } h1 { font-size:21px; } }
        </style>
      </head>
      <body>
        <header>
          <div class="wrap">
            <h1>Robu Cleaning Services — XML Sitemap</h1>
            <p>Cleaning • Sanitation • Pest Control — Eldoret &amp; Nairobi, Kenya. This file helps search engines discover every public page.</p>
          </div>
        </header>
        <main class="wrap">
          <div class="card">
            <div class="meta">
              <span class="pill"><xsl:value-of select="count(s:urlset/s:url)"/> URLs</span>
              <span>Generated automatically from the live site.</span>
            </div>
            <table>
              <tr>
                <th class="num">#</th>
                <th>URL</th>
                <th class="hide-sm">Change frequency</th>
                <th class="hide-sm">Priority</th>
              </tr>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="num"><xsl:value-of select="position()"/></td>
                  <td>
                    <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                  </td>
                  <td class="hide-sm"><xsl:value-of select="s:changefreq"/></td>
                  <td class="hide-sm"><xsl:value-of select="s:priority"/></td>
                </tr>
              </xsl:for-each>
            </table>
          </div>
        </main>
        <footer>Robu Cleaning Services Ltd — Eldoret (HQ) &amp; Nairobi, Kenya</footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
