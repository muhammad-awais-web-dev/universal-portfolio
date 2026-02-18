<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Sitemap</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fafafa;color:#0a0a0a;min-height:100vh}
          header{background:#0a0a0a;color:#fafafa;padding:32px 40px}
          header h1{font-size:22px;font-weight:600;letter-spacing:-0.3px}
          header p{margin-top:6px;font-size:13px;color:#a3a3a3}
          main{max-width:900px;margin:40px auto;padding:0 24px 60px}
          .stat{display:inline-block;background:#f5f5f5;border:1px solid #e5e5e5;border-radius:4px;padding:4px 12px;font-size:12px;font-weight:600;color:#737373;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:24px}
          table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden}
          thead tr{background:#f5f5f5;border-bottom:1px solid #e5e5e5}
          th{text-align:left;padding:12px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#737373}
          td{padding:12px 16px;font-size:14px;border-bottom:1px solid #f5f5f5}
          tr:last-child td{border-bottom:none}
          tr:hover td{background:#fafafa}
          a{color:#0a0a0a;text-decoration:underline;text-underline-offset:3px}
          a:hover{color:#525252}
          .high{color:#16a34a;font-weight:600}
          .med{color:#ca8a04;font-weight:600}
          .low{color:#737373;font-weight:600}
          footer{text-align:center;padding:24px;font-size:12px;color:#a3a3a3;border-top:1px solid #e5e5e5}
        </style>
      </head>
      <body>
        <header>
          <h1>Sitemap</h1>
          <p>All publicly indexed pages on this portfolio.</p>
        </header>
        <main>
          <span class="stat"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</span>
          <table>
            <thead><tr><th>URL</th><th>Last Modified</th><th>Frequency</th><th>Priority</th></tr></thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td><xsl:value-of select="substring(sitemap:lastmod,0,11)"/></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td>
                    <xsl:variable name="p" select="sitemap:priority"/>
                    <xsl:choose>
                      <xsl:when test="$p &gt;= 0.9"><span class="high"><xsl:value-of select="$p"/></span></xsl:when>
                      <xsl:when test="$p &gt;= 0.7"><span class="med"><xsl:value-of select="$p"/></span></xsl:when>
                      <xsl:otherwise><span class="low"><xsl:value-of select="$p"/></span></xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
        <footer>Portfolio Sitemap · Auto-generated</footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
