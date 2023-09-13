<template>
  <the-navbar />
  <div class="container">
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component"></component>
          <template #fallback> Loading... </template>
        </Suspense>
      </template>
    </router-view>
  </div>
</template>

<script setup>
import { useUsersStore } from "@/stores/UsersStore";
const usersStore = useUsersStore();

(async () => await usersStore.fetchAuthUser())();
</script>

<style>
@import "assets/style.css";
</style>
