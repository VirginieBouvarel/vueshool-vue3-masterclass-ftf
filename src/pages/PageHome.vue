<template>
  <h1>Welcome to the Forum</h1>
  <CategoryList :categories="categories" />
</template>

<script setup>
import { computed } from "vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";

const categoriesStore = useCategoriesStore();
const forumsStore = useForumsStore();

const categoriesData = await categoriesStore.fetchAllCategories();
const forumsIds = categoriesData.map((category) => category.forums).flat();
await forumsStore.fetchForums({ ids: forumsIds });

const categories = computed(() => {
  return categoriesStore.categories;
});
</script>
