<!-- components/TweetCard.vue -->
<script setup lang="ts">
const props = defineProps<{ data: any }>();
const emit = defineEmits<{
  select: [data: any];
  edit: [data: any];
  delete: [id: number];
}>();
const { user } = useUser();
const isOwner = computed(
  () => Number(props.data.userId) === Number(user.value?.id),
);
</script>

<template>
  <div
    class="card bg-base-100 border border-base-300 hover:bg-base-200/50 hover:border-primary/30 transition-all cursor-pointer rounded-2xl"
    @click="emit('select', data)"
  >
    <div class="card-body p-6 gap-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <AvatarIcon
            :username="data.username ?? `user_${data.userId}`"
            size="md"
          />
          <div>
            <p class="font-bold text-sm leading-tight">
              {{ data.username || `User #${data.userId}` }}
            </p>
            <p class="text-xs opacity-40">
              @{{ data.username?.toLowerCase() || `user_${data.userId}` }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs opacity-30">{{ useTimeAgo(data.created) }}</span>

          <!-- Drei Punkte Dropdown (nur für eigene Posts) -->
          <div v-if="isOwner" class="dropdown dropdown-end" @click.stop>
            <button
              tabindex="0"
              class="btn btn-ghost btn-xs btn-circle opacity-50 hover:opacity-100"
            >
              <Icon name="tabler:dots" size="16" />
            </button>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 border border-base-300 rounded-xl shadow-lg z-10 w-40 p-1"
            >
              <li>
                <button class="text-sm gap-2" @click="emit('edit', data)">
                  <Icon name="tabler:pencil" size="15" />
                  Bearbeiten
                </button>
              </li>
              <li>
                <button
                  class="text-sm text-error gap-2"
                  @click="emit('delete', data.id)"
                >
                  <Icon name="tabler:trash" size="15" />
                  Löschen
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tweet Text -->
      <p class="text-sm leading-relaxed">{{ data.tweet }}</p>
      <!-- KI Einschätzung -->
      <div v-if="data.correction" class="flex items-start gap-2 bg-base-200/60 rounded-xl px-3 py-2" @click.stop>
        <Icon name="tabler:robot" size="14" class="opacity-40 mt-0.5 shrink-0" />
        <p class="text-xs opacity-40 italic leading-relaxed">{{ data.correction, data.sentiment }}</p>
      </div>
    </div>
  </div>
</template>
