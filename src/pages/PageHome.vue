<template>
  <div v-if="ready" class="container">
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";
const categoriesStore = useCategoriesStore();
const forumsStore = useForumsStore();

const ready = ref(false);

const categories = computed(() => {
  return categoriesStore.categories;
});

(async () => {
  await categoriesStore.fetchAllCategories();
  const forumsIds = categories.value.map((category) => category.forums).flat();
  await forumsStore.fetchForums({ ids: forumsIds });
  ready.value = true;
})();
</script>
