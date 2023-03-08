<template>
  <div v-if="thread" class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>

<script setup>
import sourceData from "@/data.json";
import { reactive, computed } from "vue";
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

const props = defineProps({
  id: { type: String, required: true },
});

const threads = reactive(sourceData.threads);
const posts = reactive(sourceData.posts);

const thread = computed(() => threads.find((thread) => thread.id === props.id));
const threadPosts = computed(() =>
  posts.filter((post) => post.threadId === props.id)
);

function addPost(event) {
  const post = {
    ...event.post,
    threadId: props.id,
  };
  posts.push(post);
  thread.value.posts.push(post.id);

  console.log(post);
}
</script>

<style lang="scss" scoped></style>
