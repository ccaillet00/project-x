<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <h1 class="text-4xl font-bold tracking-tight">Log in</h1>

    <form class="space-y-6" @submit.prevent="submit">
      <div class="fieldset p-0">
        <label class="fieldset-legend font-semibold text-sm mb-1"
          >Username</label
        >
        <input
          v-model="form.username"
          type="text"
          placeholder="Enter your username"
          :disabled="loading"
          class="input input-bordered w-full bg-base-200 border-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      <div class="fieldset p-0">
        <label class="fieldset-legend font-semibold text-sm mb-1"
          >Password</label
        >
        <input
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          :disabled="loading"
          class="input input-bordered w-full bg-base-200 border-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      <div class="flex items-center justify-between mt-2">
        <label class="label cursor-pointer gap-2 p-0">
          <input
            type="checkbox"
            :disabled="loading"
            class="checkbox checkbox-sm rounded border-base-300 disabled:opacity-50"
            :checked="form.remember === 1"
            @change="
              form.remember = ($event.target as HTMLInputElement).checked
                ? 1
                : 0
            "
          />
          <span class="label-text text-sm">Remember for 30 days</span>
        </label>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-neutral w-full normal-case text-base shadow-lg"
      >
        <span v-if="loading" class="loading loading-spinner" />
        <span v-else>Sign in</span>
      </button>

      <button
        disabled
        aria-disabled="true"
        class="btn btn-accent w-full normal-case text-base shadow-lg"
      >
        Sign in with Github <Icon name="tabler:brand-github" size="24" />
      </button>

      <p class="text-center text-sm opacity-70">
        Noch kein Mitglied?
        <button
          type="button"
          class="font-bold text-primary hover:underline ml-1"
          @click="$emit('switch')"
        >
          Jetzt registrieren
        </button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

const { loading } = useAuth();

const emit = defineEmits<{
  submit: [formData: { username: string; password: string; remember: number }];
  switch: [];
}>();
const form = reactive({
  username: "",
  password: "",
  remember: 0,
});

const submit = () => {
  emit("submit", { ...form });
};
</script>
