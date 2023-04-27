<template>
  <div v-if="thread" class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import { storeToRefs } from "pinia";

const { threads } = storeToRefs(useThreadsStore());
const { posts } = storeToRefs(usePostsStore());

const props = defineProps({
  id: { type: String, required: true },
});

const thread = computed(() =>
  threads.value.find((thread) => thread.id === props.id)
);
const threadPosts = computed(() =>
  posts.value.filter((post) => post.threadId === props.id)
);

function addPost(event) {
  const post = {
    ...event.post,
    threadId: props.id,
  };
  posts.value.push(post);
  thread.value.posts.push(post.id);

  console.log(post);
}
</script>

<style lang="scss" scoped></style>
