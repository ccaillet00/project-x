<template>
  <div class="flex min-h-screen flex-col">
    <AppNavBar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
