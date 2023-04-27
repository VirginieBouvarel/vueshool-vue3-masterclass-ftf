<template>
  <h1>{{ category.name }}</h1>
  <ForumList
    :title="category.name"
    :forums="getForumsForCategory(category)"
  ></ForumList>
</template>

<script setup>
import { computed } from "vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { storeToRefs } from "pinia";
const { categories } = storeToRefs(useCategoriesStore());
const { forums } = storeToRefs(useForumsStore());

const props = defineProps({
  id: { type: String, required: true },
});

const category = computed(() =>
  categories.find((category) => category.id === props.id)
);
function getForumsForCategory(category) {
  return forums.filter((forum) => forum.categoryId === category.id);
}
</script>

<style lang="scss" scoped></style>
