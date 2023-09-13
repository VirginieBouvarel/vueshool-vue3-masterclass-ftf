<template>
  <h1>{{ category.name }}</h1>
  <ForumList
    :title="category.name"
    :forums="getForumsForCategory(category)"
  ></ForumList>
</template>

<script setup>
import { findById } from "@/helpers";
import { computed } from "vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";

const categoriesStores = useCategoriesStore();
const forumsStores = useForumsStore();

const props = defineProps({
  id: { type: String, required: true },
});

const categoryData = await categoriesStores.fetchCategory({ id: props.id });
await forumsStores.fetchForums({ ids: categoryData.forums });

const category = computed(
  () => findById(categoriesStores.categories, props.id) || {}
);

function getForumsForCategory(category) {
  return forumsStores.forums.filter(
    (forum) => forum.categoryId === category.id
  );
}
</script>
