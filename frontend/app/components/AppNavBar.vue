<template>
  <div class="navbar bg-base-200 shadow-sm">
    <div class="flex-1">
      <NuxtLink to="/" class="btn btn-ghost text-xl">Project-x</NuxtLink>
    </div>
    <AppCreatePost />
    <AppThemeToggle />
    <div class="flex gap-2">
      <input
        disabled
        type="text"
        placeholder="Search"
        class="input input-bordered w-24 md:w-auto"
      >
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle p-0">
          <AvatarIcon :username="user?.username ?? ''" size="sm" />
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <NuxtLink to="profile" class="justify-between">
              Profile
              <span class="badge">New</span>
            </NuxtLink>
          </li>
          <!-- <li><a>Settings</a></li> -->
          <li><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth();
const { user } = useUser(); // ← hinzufügen
</script>
