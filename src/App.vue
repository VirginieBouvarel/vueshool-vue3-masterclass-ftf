<template>
  <the-navbar />
  <div class="container">
    <router-view v-slot="{ Component }" :key="route.path">
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
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style>
@import "assets/style.css";
</style>
