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
import sourceData from "@/data.json";

const props = defineProps({
  categories: { type: Array, required: true },
});
function getForumsForCategory(category) {
  return sourceData.forums.filter((forum) => forum.categoryId === category.id);
}
</script>

<style lang="scss" scoped></style>
