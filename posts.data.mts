import { createContentLoader } from 'vitepress'
export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw) {
    return raw.map(({ url, frontmatter, excerpt }) => {
      const text = (excerpt || '').replace(/<[^>]+>/g, '')
      return {
        url,
        title: frontmatter.title || '',
        date: (frontmatter.datetime || frontmatter.date || '').slice(0, 10),
        category: frontmatter.category || '',
        tags: frontmatter.tags || [],
        pinned: !!frontmatter.pinned,
        cover: frontmatter.cover || '',
        excerpt: text.slice(0, 120),
        readingTime: Math.max(1, Math.round(text.length / 400))
      }
    }).sort((a, b) => (b.pinned - a.pinned) || b.date.localeCompare(a.date))
  }
})
