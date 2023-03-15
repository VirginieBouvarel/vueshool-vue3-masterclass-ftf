<template>
  <h1>{{ category.name }}</h1>
  <ForumList
    :title="category.name"
    :forums="getForumsForCategory(category)"
  ></ForumList>
</template>

<script setup>
import { computed } from "vue";
import sourceData from "@/data.json";

const props = defineProps({
  id: { type: String, required: true },
});
const category = computed(() =>
  sourceData.categories.find((category) => category.id === props.id)
);
function getForumsForCategory(category) {
  return sourceData.forums.filter((forum) => forum.categoryId === category.id);
}
</script>

<style lang="scss" scoped></style>
