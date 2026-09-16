<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="rss/channel/title"/> - 订阅</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
            background: #f5f7fb;
            color: #333;
            line-height: 1.6;
            padding: 16px;
          }
          .header {
            background: linear-gradient(135deg, #425aef, #6b7dff);
            border-radius: 16px;
            padding: 24px 20px;
            color: #fff;
            margin-bottom: 16px;
          }
          .header h1 { font-size: 22px; margin-bottom: 4px; }
          .header .desc { font-size: 13px; opacity: 0.85; }
          .header .meta { font-size: 12px; opacity: 0.7; margin-top: 8px; }
          .header a { color: #fff; text-decoration: underline; opacity: 0.9; }
          .post {
            background: #fff;
            border-radius: 14px;
            padding: 18px 16px;
            margin-bottom: 12px;
            box-shadow: 0 2px 8px rgba(66, 90, 239, 0.06);
          }
          .post h2 { font-size: 17px; margin-bottom: 6px; }
          .post h2 a { color: #222; text-decoration: none; }
          .post h2 a:hover { color: #425aef; }
          .post .time { font-size: 12px; color: #999; margin-bottom: 8px; }
          .post .desc {
            font-size: 14px;
            color: #555;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .post .desc a { color: #425aef; }
          .post .desc img { display: none; }
          .footer { text-align: center; font-size: 12px; color: #999; padding: 12px 0 4px; }
          .footer a { color: #425aef; text-decoration: none; }
        </style>
      </head>
      <body>
        <xsl:apply-templates select="rss/channel"/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="rss/channel">
    <div class="header">
      <h1><xsl:value-of select="title"/></h1>
      <div class="desc"><xsl:value-of select="description"/></div>
      <div class="meta">
        <xsl:value-of select="lastBuildDate"/>
        ·
        <a href="{link}">访问网站</a>
        ·
        <a href="https://validator.w3.org/feed/docs/rss2.html" target="_blank">RSS 2.0</a>
      </div>
    </div>

    <xsl:for-each select="item">
      <div class="post">
        <h2>
          <a href="{link}">
            <xsl:value-of select="title"/>
          </a>
        </h2>
        <div class="time"><xsl:value-of select="pubDate"/></div>
        <div class="desc">
          <xsl:value-of select="description" disable-output-escaping="yes"/>
        </div>
      </div>
    </xsl:for-each>

    <div class="footer">
      <xsl:value-of select="copyright"/>
      ·
      <a href="{atom:link/@href}">复制订阅链接</a>
    </div>
  </xsl:template>
</xsl:stylesheet>
