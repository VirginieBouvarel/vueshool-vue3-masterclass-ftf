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

const categories = computed(() => {
  return categoriesStore.categories;
});

await categoriesStore.fetchAllCategories();

const forumsIds = categories.value.map((category) => category.forums).flat();
forumsStore.fetchForums({ ids: forumsIds });
</script>
