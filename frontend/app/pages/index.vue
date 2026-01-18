<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold underline">Your Feed test</h1>
    <button class="btn btn-primary">
      View Map <Icon name="tabler:map" size="32" />
    </button>
    <div>
      {{ posts.data }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const { baseUrl } = useApi()
  const posts = await useFetch(`${baseUrl}/api/posts`)
</script>
