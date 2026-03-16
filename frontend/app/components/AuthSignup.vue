<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <h1 class="text-4xl font-bold tracking-tight">Sign Up</h1>

    <form @submit.prevent="submit" class="space-y-5">
      <div class="fieldset p-0">
        <label class="fieldset-legend font-semibold text-sm mb-1">Username</label>
        <input
          v-model="form.username"
          type="text" 
          placeholder="Username" 
          class="input input-bordered w-full bg-base-200 border-none focus:ring-2 focus:ring-primary/50" 
        />
      </div>

      <div class="fieldset p-0">
        <label class="fieldset-legend font-semibold text-sm mb-1">Email</label>
        <input
          v-model="form.email" 
          type="email" 
          placeholder="name@bakery.com" 
          class="input input-bordered w-full bg-base-200 border-none focus:ring-2 focus:ring-primary/50" 
        />
      </div>

      <div class="fieldset p-0">
        <label class="fieldset-legend font-semibold text-sm mb-1">Password</label>
        <input 
          v-model="form.password"
          type="password" 
          placeholder="••••••••" 
          class="input input-bordered w-full bg-base-200 border-none focus:ring-2 focus:ring-primary/50" 
        />
      </div>

      <button type="submit" class="btn btn-primary w-full normal-case text-base shadow-lg text-white">
        Account erstellen
      </button>

      <p class="text-center text-sm opacity-70">
        Bereits dabei? 
        <button type="button" @click="$emit('switch')" class="font-bold text-neutral hover:underline ml-1">
          Zum Login
        </button>
      </p>
    </form>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  submit: [formData: {username: string; email: string; password: string}]
  switch: []
}>()
const form =reactive({
  username: "",
  email: "",
  password: ""
})

const submit = () => {
  emit('submit', {...form})
}
</script>