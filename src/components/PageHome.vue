<script setup>
import sourceData from "@/data.json";
import { reactive } from "vue";

const threads = reactive(sourceData.threads);
const posts = reactive(sourceData.posts);
const users = reactive(sourceData.users);

function postById(postId) {
  return posts.find((post) => post.id === postId);
}
function userById(userId) {
  return users.find((user) => user.id === userId);
}
</script>

<template>
  <div>Hello from Page Home</div>
  <div v-for="thread in threads" :key="thread.id">
    <h2>{{ thread.title }}</h2>
    <div v-for="postId in thread.posts" :key="postId">
      <p>{{ userById(postById(postId).userId).name }}</p>
      <p>{{ postById(postId).text }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
