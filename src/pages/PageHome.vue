<template>
  <div v-if="ready" class="container">
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { useAsyncDataStatus } from "@/composables/asyncDataStatus";

const categoriesStore = useCategoriesStore();
const forumsStore = useForumsStore();

const { ready, setReadyStatus } = useAsyncDataStatus();

const categoriesData = await categoriesStore.fetchAllCategories();
const forumsIds = categoriesData.map((category) => category.forums).flat();
await forumsStore.fetchForums({ ids: forumsIds });
setReadyStatus();

const categories = computed(() => {
  return categoriesStore.categories;
});
</script>
