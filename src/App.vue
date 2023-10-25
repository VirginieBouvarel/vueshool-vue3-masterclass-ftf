<template>
  <the-navbar />
  <div class="container">
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component"></component>
          <template #fallback>
            <AppSpinner />
          </template>
        </Suspense>
      </template>
    </router-view>
  </div>
</template>

<script setup>
import { useUsersStore } from "@/stores/UsersStore";
const usersStore = useUsersStore();

(async () => await usersStore.listenAuthStateChanges())();
</script>

<style>
@import "assets/style.css";
</style>
