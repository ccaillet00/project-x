<!-- pages/hero.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "app-default",
  middleware: "auth",
  path: "/dashboard",
});
const { tweets, error, pending, refresh } = useTweets();
const { selectedTweet, deleteTweet, editTweet } = useTweetActions(refresh);

const selectTweet = (tweet: any) => {
  selectedTweet.value = tweets.value?.find(t => t.id === tweet.id) ?? tweet
}
</script>

<template>
  <div
    class="hero bg-base-300 container mx-auto mt-4 transition-all"
    :class="{ 'blur-sm grayscale opacity-50': selectedTweet }"
  >
    <div class="hero-content text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Hello there</h1>
        <div class="mt-4 p-4">
          <p>Willkommen auf unserer Micro Blogging Page!</p>
        </div>
      </div>
    </div>
  </div>

  <div
    class="container mx-auto mt-8 max-w-2xl transition-all"
    :class="{ 'blur-sm pointer-events-none': selectedTweet }"
  >
    <div v-if="pending && !tweets" class="flex flex-col items-center py-10">
      <span class="loading loading-spinner loading-lg" />
      <p class="mt-2 text-sm opacity-50">Lade Tweets...</p>
    </div>

    <div v-else-if="error">
      <div
        role="alert"
        class="alert alert-error flex items-center w-full shadow-lg"
      >
        <Icon name="tabler:xbox-x" size="24" />
        <span>{{ error.message }}</span>
      </div>
    </div>

    <div v-else class="flex flex-col gap-3">
    <AppTweetCard
      v-for="item in tweets"
      :key="item.id"
      :data="item"
      @select="selectTweet"
      @edit="selectTweet"
      @delete="deleteTweet"
    />
    </div>
  </div>

  <AppTweetModal
    :tweet="selectedTweet"
    @close="selectedTweet = null"
    @delete="deleteTweet"
    @edit="editTweet"
  />
</template>
