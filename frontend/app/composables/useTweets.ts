// composables/useTweets.ts
export const useTweets = () => {
  const { baseUrl } = useApi();

  const {
    data: tweets,
    error,
    pending,
    refresh,
  } = useFetch<any[]>(`${baseUrl}/api/posts`);

  let interval: any;
  onMounted(() => {
    // Polling
    interval = setInterval(() => refresh(), 5000);

    // Sofort nach eigenem Post
    window.addEventListener("post-created", () => refresh());
  });

  onUnmounted(() => {
    if (interval) clearInterval(interval);
    window.removeEventListener("post-created", () => refresh());
  });

  return { tweets, error, pending, refresh };
};
