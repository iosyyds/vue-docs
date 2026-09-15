<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          <xsl:value-of select="rss/channel/title" />
        </title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
              "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            background: #f4f5f7;
            color: #1f2329;
            line-height: 1.7;
            -webkit-text-size-adjust: 100%;
          }
          .wrap { max-width: 720px; margin: 0 auto; padding: 24px 16px 48px; }
          header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 16px;
            padding: 32px 28px;
            color: #fff;
            margin-bottom: 24px;
          }
          header h1 { font-size: 26px; margin-bottom: 8px; }
          header .desc { opacity: 0.9; font-size: 14px; margin-bottom: 16px; }
          header .btn {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
            text-decoration: none;
            padding: 8px 18px;
            border-radius: 999px;
            font-size: 14px;
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          header .btn:hover { background: rgba(255, 255, 255, 0.3); }
          .list { list-style: none; }
          .card {
            background: #fff;
            border-radius: 14px;
            padding: 20px 22px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          }
          .card .title {
            display: block;
            font-size: 18px;
            font-weight: 600;
            color: #1f2329;
            text-decoration: none;
            margin-bottom: 6px;
          }
          .card .title:hover { color: #6366f1; }
          .card .meta { font-size: 12px; color: #8a919f; margin-bottom: 10px; }
          .card .summary { font-size: 14px; color: #4e5561; margin-bottom: 12px; }
          .card .read {
            font-size: 13px;
            color: #6366f1;
            text-decoration: none;
            font-weight: 500;
          }
          footer {
            text-align: center;
            font-size: 12px;
            color: #8a919f;
            margin-top: 32px;
          }
          @media (max-width: 480px) {
            header { padding: 24px 20px; }
            header h1 { font-size: 22px; }
            .card { padding: 16px 18px; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <h1>
              <xsl:value-of select="rss/channel/title" />
            </h1>
            <p class="desc">
              <xsl:value-of select="rss/channel/description" />
            </p>
            <a class="btn" href="{rss/channel/link}">访问博客首页 →</a>
          </header>
          <ul class="list">
            <xsl:for-each select="rss/channel/item">
              <li class="card">
                <a class="title" href="{link}">
                  <xsl:value-of select="title" />
                </a>
                <p class="meta">
                  <xsl:value-of select="pubDate" />
                </p>
                <p class="summary">
                  <xsl:value-of select="description" />
                </p>
                <a class="read" href="{link}">阅读全文 →</a>
              </li>
            </xsl:for-each>
          </ul>
          <footer>
            <xsl:value-of select="rss/channel/copyright" />
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
