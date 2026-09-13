import type { IPost, IPostObject } from '../types';

export const useGroup = (posts: IPost[]) => {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
  const groupPosts = { category: {}, tag: {}, archive: {} };
  const tabs = { category: [], tag: [], archive: [] };
  sortedPosts.forEach((post) => {
    addToData(groupPosts.category, post.category, post);
    post.tags && post.tags.forEach((tag) => addToData(groupPosts.tag, tag, post));
    addToData(groupPosts.archive, new Date(post.datetime).getFullYear(), post);
  });
  tabs.category = Object.keys(groupPosts.category).sort((a, b) => a.localeCompare(b, 'zh-CN'));
  tabs.tag = Object.keys(groupPosts.tag).sort((a, b) => a.localeCompare(b, 'zh-CN'));
  tabs.archive = Object.keys(groupPosts.archive).sort((a, b) => parseInt(b) - parseInt(a));
  return { tabs, posts: groupPosts };
};

const addToData = (obj: IPostObject, key: any, value: IPost) => {
  if (key) {
    if (!obj[key]) obj[key] = [];
    obj[key].push(value);
  }
};
