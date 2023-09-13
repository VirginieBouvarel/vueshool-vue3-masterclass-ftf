<template>
  <div v-if="ready" class="container col-full">
    <h1>{{ category.name }}</h1>
    <ForumList
      :title="category.name"
      :forums="getForumsForCategory(category)"
    ></ForumList>
  </div>
</template>

<script setup>
import { findById } from "@/helpers";
import { computed } from "vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { useAsyncDataStatus } from "@/composables/asyncDataStatus";

const categoriesStores = useCategoriesStore();
const forumsStores = useForumsStore();

const { ready, setReadyStatus } = useAsyncDataStatus();

const props = defineProps({
  id: { type: String, required: true },
});

const categoryData = await categoriesStores.fetchCategory({ id: props.id });
await forumsStores.fetchForums({ ids: categoryData.forums });
setReadyStatus();

const category = computed(
  () => findById(categoriesStores.categories, props.id) || {}
);

function getForumsForCategory(category) {
  return forumsStores.forums.filter(
    (forum) => forum.categoryId === category.id
  );
}
</script>
