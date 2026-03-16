// composables/useTweetActions.ts
export const useTweetActions = (refresh: () => Promise<void>) => {
  const { baseUrl } = useApi();
  const { user } = useUser();
  const selectedTweet = ref<any | null>(null);

  const deleteTweet = async (id: number) => {
    try {
      await $fetch(`${baseUrl}/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${useCookie("token").value}` },
      });
      selectedTweet.value = null;
      await refresh();
    } catch (e) {
      console.error("Delete Error:", e);
    }
  };

  const editTweet = async (id: number, content: string) => {
    try {
      await $fetch(`${baseUrl}/api/posts/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${useCookie("token").value}` },
        body: { tweet: content },
      });
      await refresh();
    } catch (e) {
      console.error("Edit Error:", e);
    }
  };

  return { selectedTweet, deleteTweet, editTweet, user };
};
