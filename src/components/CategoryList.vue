<template>
  <ForumList
    v-for="category in props.categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :category-id="category.id"
  ></ForumList>
</template>

<script setup>
import { useForumsStore } from "@/stores/ForumsStore";
const forumsStore = useForumsStore();

const props = defineProps({
  categories: { type: Array, required: true },
});
function getForumsForCategory(category) {
  return forumsStore.forums.filter((forum) => forum.categoryId === category.id);
}
</script>

<style lang="scss" scoped></style>
