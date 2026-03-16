<!-- components/CreatePost.vue -->
<script setup lang="ts">
const { baseUrl } = useApi()
const { user } = useUser()
const isOpen = ref(false)
const content = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const submit = async () => {
  if (!content.value.trim()) return
  loading.value = true
  error.value = null

  try {
    await $fetch(${baseUrl}/api/posts, {
      method: 'POST',
      headers: { Authorization: Bearer ${useCookie('token').value} },
      body: {
        tweet: content.value,
        userId: user.value?.id
      }
    })
    content.value = ''
    isOpen.value = false
  } catch (err: any) {
    error.value = err.data?.message || 'Post konnte nicht erstellt werden'
  } finally {
    loading.value = false
  }
  window.dispatchEvent(new Event('post-created'))
    isOpen.value = false
}
</script>

<template>
  <!-- Button -->
  <button class="btn btn-primary" @click="isOpen = true">
    Post erstellen
    <Icon name="tabler:pencil-plus" size="24" />
  </button>

  <!-- Modal -->
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-lg bg-base-100 rounded-2xl p-0 overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-base-200">
        <div class="flex items-center gap-3">
          <AvatarIcon :username="user?.username" size="md" />
          <div>
            <p class="font-bold text-sm">{{ user?.username }}</p>
            <p class="text-xs opacity-40">@{{ user?.username?.toLowerCase() }}</p>
          </div>
        </div>
        <button @click="isOpen = false" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <!-- Form -->
      <div class="px-6 py-5 space-y-4">
        <textarea
          v-model="content"
          placeholder="Was denkst du gerade?"
          class="textarea w-full text-base resize-none border-none bg-transparent focus:outline-none"
          rows="4"
          maxlength="255"
        />

        <!-- Zeichenanzahl -->
        <div class="flex items-center justify-between">
          <span class="text-xs opacity-30">{{ content.length }} / 255</span>
          <p v-if="error" class="text-xs text-error">{{ error }}</p>
        </div>

        <div class="flex justify-end gap-2 border-t border-base-200 pt-4">
          <button @click="isOpen = false" class="btn btn-ghost btn-sm">Abbrechen</button>
          <button
            @click="submit"
            :disabled="!content.trim() || loading"
            class="btn btn-primary btn-sm px-6"
          >
            <span v-if="loading" class="loading loading-spinner loading-xs"></span>
            <span v-else>Posten</span>
          </button>
        </div>
      </div>

    </div>

    <form method="dialog" class="modal-backdrop bg-black/50 backdrop-blur-sm">
      <button @click="isOpen = false">close</button>
    </form>
  </dialog>
</template>