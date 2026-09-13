import { onMounted, ref, watch } from 'vue';
import { useData, inBrowser } from 'vitepress';

export const usePassword = () => {
  const { frontmatter } = useData();
  const verified = ref(true);
  function checkPassword() {
    const pwd = String(frontmatter.value?.password ?? '');
    if (!pwd) { verified.value = true; return; }
    if (!inBrowser) { verified.value = false; return; }
    const id = frontmatter.value?.id || '';
    const stored = JSON.parse(localStorage.getItem('post_passwords') || '{}');
    verified.value = stored[id] === pwd;
  }
  watch(() => frontmatter.value?.id, () => checkPassword());
  onMounted(() => checkPassword());
  return { verified };
};
