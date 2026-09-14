import { createContentLoader } from 'vitepress'
export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw) {
    return raw.map(({ url, frontmatter }) => ({
      url,
      title: frontmatter.title || '',
      date: (frontmatter.datetime || frontmatter.date || '').slice(0, 10),
      category: frontmatter.category || '',
      tags: frontmatter.tags || [],
      pinned: !!frontmatter.pinned
    })).sort((a, b) => b.date.localeCompare(a.date))
  }
})
