<!-- components/TweetModal.vue -->
<script setup lang="ts">
const props = defineProps<{ tweet: any | null }>();
const emit = defineEmits<{
  close: [];
  like: [id: number];
  comment: [id: number];
  delete: [id: number];
  edit: [id: number, content: string];
}>();

const { user } = useUser();
const isOwner = computed(
  () => Number(props.tweet?.userId) === Number(user.value?.id),
);

const isEditing = ref(false);
const editContent = ref("");

const startEdit = () => {
  editContent.value = props.tweet?.tweet;
  isEditing.value = true;
};

const confirmEdit = () => {
  emit("edit", props.tweet.id, editContent.value);
  isEditing.value = false;
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': tweet }">
    <div class="modal-box max-w-lg bg-base-100 p-0 overflow-hidden rounded-2xl">
      <div v-if="tweet">
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-base-200"
        >
          <div class="flex items-center gap-3">
            <AvatarIcon
              :username="tweet.user?.username ?? `user_${tweet.userId}`"
              size="md"
            />
            <div>
              <p class="font-bold text-sm">
                {{ tweet.user?.username || `User #${tweet.userId}` }}
              </p>
              <p class="text-xs opacity-40">
                @{{
                  tweet.user?.username?.toLowerCase() || `user_${tweet.userId}`
                }}
              </p>
            </div>
          </div>
          <button
            class="btn btn-sm btn-circle btn-ghost"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <div class="px-6 py-5 space-y-5">
          <!-- Tweet Text oder Edit Mode -->
          <div v-if="isEditing">
            <textarea
              v-model="editContent"
              class="textarea textarea-bordered w-full text-base resize-none"
              rows="3"
            />
            <div class="flex gap-2 mt-2">
              <button class="btn btn-sm btn-success" @click="confirmEdit">
                Speichern
              </button>
              <button class="btn btn-sm btn-ghost" @click="isEditing = false">
                Abbrechen
              </button>
            </div>
          </div>
          <p v-else class="text-base leading-relaxed">{{ tweet.tweet }}</p>

          <!-- Actions -->
          <div class="flex items-center gap-3 text-sm">
            <template v-if="isOwner">
              <button
                class="flex items-center gap-1.5 opacity-50 hover:opacity-100 hover:text-warning transition-all"
                @click="startEdit"
              >
                <Icon name="tabler:pencil" size="18" />
                Bearbeiten
              </button>
              <button
                class="flex items-center gap-1.5 opacity-50 hover:opacity-100 hover:text-error transition-all"
                @click="emit('delete', tweet.id)"
              >
                <Icon name="tabler:trash" size="18" />
                Löschen
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop bg-black/50 backdrop-blur-sm">
      <button @click="emit('close')">close</button>
    </form>
  </dialog>
</template>

<style scoped>
.max-h-52::-webkit-scrollbar {
  width: 4px;
}
.max-h-52::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.2);
  border-radius: 10px;
}
</style>
