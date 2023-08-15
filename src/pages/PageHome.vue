<template>
  <h1>Welcome to the Forum</h1>
  <CategoryList v-if="categories" :categories="categories" />
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

console.log("%c categories :", "color: yellow", categories.value);
await categoriesStore.fetchAllCategories();
console.log("%c categories :", "color: yellow", categories.value);

const forumsIds = categories.value.map((category) => category.forums).flat();
forumsStore.fetchForums({ ids: forumsIds });
console.log("%c forums :", "color: yellow", forumsStore.forums);
</script>

<style lang="scss" scoped></style>
