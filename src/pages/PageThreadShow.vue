<script setup>
import sourceData from "@/data.json";
import { reactive, computed } from "vue";
import PostList from "@/components/PostList.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const threads = reactive(sourceData.threads);
const posts = reactive(sourceData.posts);

const thread = computed(() => threads.find((thread) => thread.id === props.id));
const threadPosts = computed(() =>
  posts.filter((post) => post.threadId === props.id)
);
</script>

<template>
  <div v-if="thread" class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <post-list :posts="threadPosts" />
  </div>
</template>

<style lang="scss" scoped></style>
