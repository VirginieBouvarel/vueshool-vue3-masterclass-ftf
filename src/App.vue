<script setup></script>

<template>
  <the-navbar />
  <div class="container">
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component"></component>
        <template #fallback> Loading... </template>
      </Suspense>
    </router-view>
  </div>
</template>

<style>
@import "assets/style.css";
</style>
