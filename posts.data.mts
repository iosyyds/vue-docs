import { createContentLoader } from 'vitepress'
export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw) {
    return raw.map(({ url, frontmatter, excerpt }) => ({
      url,
      title: frontmatter.title || '',
      date: (frontmatter.datetime || frontmatter.date || '').slice(0, 10),
      category: frontmatter.category || '',
      tags: frontmatter.tags || [],
      pinned: !!frontmatter.pinned,
      excerpt: (excerpt || '').replace(/<[^>]+>/g, '').slice(0, 120)
    })).sort((a, b) => (b.pinned - a.pinned) || b.date.localeCompare(a.date))
  }
})
