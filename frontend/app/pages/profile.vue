<!-- pages/profile.vue -->
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
 
const { user } = useUser()
const { baseUrl } = useApi()
 
const { data: allPosts, refresh, pending } = useFetch<any[]>(`${baseUrl}/api/posts`)
 
// Reaktiv filtern
const posts = computed(() =>
  allPosts.value?.filter((post: any) => post.userId === user.value?.id) ?? []
)
 
const { selectedTweet, newComment, likeTweet, addComment, deleteTweet, editTweet } = useTweetActions(refresh)
</script>
<template>
  <div class="container mx-auto mt-8 max-w-2xl px-4">
 
    <!-- Profil Header -->
    <div class="card bg-base-100 border border-base-300 rounded-2xl p-6 mb-6 flex flex-row items-center gap-5">
      <AvatarIcon :username="user?.username ?? ''" size="lg" />
      <div>
        <h1 class="text-2xl font-bold">{{ user?.username }}</h1>
        <p class="opacity-40 text-sm">@{{ user?.username?.toLowerCase() }} · {{ posts?.length || 0 }} Posts</p>
      </div>
    </div>
 
    <!-- Posts -->
    <h2 class="text-sm uppercase tracking-widest opacity-40 mb-3 px-1">Meine Posts</h2>
 
    <div v-if="pending" class="flex flex-col items-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
      <p class="mt-2 text-sm opacity-50">Lade Posts...</p>
    </div>
 
    <div v-else-if="!posts?.length" class="text-center opacity-30 py-10 italic">
      Noch keine Posts vorhanden...
    </div>
 
    <!-- Gleicher Style wie hero.vue -->
    <div v-else class="flex flex-col gap-3">
      <TweetCard
        v-for="post in posts"
        :key="post.id"
        :data="post"
        @select="selectedTweet = $event"
        @like="likeTweet"
        @edit="selectedTweet = $event"
        @delete="deleteTweet"
      />
    </div>
 
  </div>
 
  <!-- Modal damit man auch auf Profil Posts bearbeiten/löschen kann -->
  <TweetModal
    :tweet="selectedTweet"
    v-model:newComment="newComment"
    @close="selectedTweet = null"
    @like="likeTweet"
    @comment="addComment"
    @delete="deleteTweet"
    @edit="editTweet"
/>
</template>