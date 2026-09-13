import fg from 'fast-glob';
import matter from 'gray-matter';
import removeMd from 'remove-markdown';
import path from 'path';
import type { IPost, IPostsConfig } from '../types';
import { generatePages } from '../utils/generatePages';
import { generateString } from '../utils/generateString';

export const usePosts = async (config: IPostsConfig = {}) => {
  const {
    pageSize = 10,
    homepage = true,
    srcDir = 'posts',
    outDir = '.',
    lang = 'zh',
    excerpt = 150,
  } = config;

  const isProd = process.env.NODE_ENV === 'production';
  const files = await fg(`${srcDir}/**/*.md`);
  const posts: IPost[] = [];
  const hiddenPosts = new Set<string>();
  const excludePosts: string[] = [];
  const descriptionMap = new Map<string, string>();

  for (const filePath of files) {
    const { data, content } = matter.read(filePath);
    const skip = isProd && (data.draft || data.hidden);
    if (skip) {
      excludePosts.push(filePath);
      continue;
    }

    const slug = filePath.replace(/^\.\//, '').replace(/\.md$/, '');
    const urlPath = '/' + slug;

    const post: IPost = {
      id: data.id || generateString(),
      title: data.title || path.basename(filePath, '.md'),
      datetime: data.datetime || '',
      permalink: urlPath,
      order: data.order,
      pinned: data.pinned,
      password: data.password ? String(data.password) : undefined,
      hidden: data.hidden || false,
      draft: data.draft || false,
      description: data.description,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };

    if (post.password) {
      // will be hashed in transformPageData
    }

    if (post.hidden) {
      hiddenPosts.add(urlPath);
    }

    // Generate excerpt
    const text = removeMd(content).replace(/\s+/g, ' ').trim();
    post.excerpt = text.slice(0, excerpt);

    if (post.description) {
      descriptionMap.set(post.id, post.description);
    }

    posts.push(post);
  }

  // Sort: pinned first, then by datetime descending
  posts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
  });

  const postCount = posts.length;

  await generatePages({
    outDir,
    lang,
    pageSize,
    homepage,
    postCount,
  });

  return {
    posts,
    hiddenPosts,
    excludePosts,
    descriptionMap,
    rewrites: {},
  };
};
