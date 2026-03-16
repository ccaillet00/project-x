<template>
  <div class="flex h-screen w-full m-0 p-0 overflow-hidden bg-base-100">

    <div class="flex w-full lg:w-1/2 flex-col justify-between p-8 xl:p-24 bg-base-100">
      <div class="text-lg font-medium opacity-50">
        Project-x
      </div>

      <div class="mx-auto w-full max-w-sm">
        <p v-if="error" class="alert alert-error m-2"> {{ error }}</p>
        <AuthLogin 
          v-if="authMode === 'login'"
          :loading="loading" 
          @switch="toggleMode" 
          @submit="login" 
        />
        <AuthSignup 
          v-else
          :loading="loading" 
          @switch="toggleMode" 
          @submit="signup" 
        />

      </div>

      <Footer/>
    </div>

    <div class="hidden lg:flex lg:w-1/2 bg-[#1a1c23] relative items-center justify-center overflow-hidden">
      <img src="../assets/images/LoginPreview.png" alt="Authentication Preview" class="w-full h-full object-cover saturate-200"/>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false, // Verhindert, dass ein Standard-Layout Ränder hinzufügt
  //middleware: 'guest'
  path: "/"
})

const { login, signup, error, loading } = useAuth()
const authMode = ref('login')

const toggleMode = () => {
  authMode.value = authMode.value === 'login' ? 'signup' : 'login'
  error.value = null
}
</script>