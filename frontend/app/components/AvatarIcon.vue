<!-- components/AvatarIcon.vue -->
<script setup lang="ts">
import { useAvatar } from "@/composables/useAvatar";
const props = defineProps<{
  username: string | undefined; // ← undefined erlauben
  size?: "sm" | "md" | "lg";
}>();

const { getColor, getInitial } = useAvatar();

const sizeClass = computed(
  () =>
    ({
      sm: "w-8 text-xs",
      md: "w-10 text-sm",
      lg: "w-16 text-2xl",
    })[props.size ?? "md"],
);
</script>

<template>
  <div class="avatar placeholder">
    <div
      class="rounded-full text-white font-bold flex items-center justify-center"
      :class="[sizeClass, getColor(username)]"
    >
      {{ getInitial(username) }}
    </div>
  </div>
</template>
