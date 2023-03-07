<script setup>
import sourceData from "@/data.json";
import { reactive, computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const threads = reactive(sourceData.threads);
const posts = reactive(sourceData.posts);
const users = reactive(sourceData.users);

const thread = computed(() => threads.find((thread) => thread.id === props.id));

function postById(postId) {
  return posts.find((post) => post.id === postId);
}
function userById(userId) {
  return users.find((user) => user.id === userId);
}
</script>

<template>
  <div v-if="thread" class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <div class="post-list">
      <div class="post" v-for="postId in thread.posts" :key="postId">
        <div class="user-info">
          <a href="#" class="user-name">{{
            userById(postById(postId).userId).name
          }}</a>

          <a href="#">
            <img
              class="avatar-large"
              :src="userById(postById(postId).userId).avatar"
              alt=""
              width="95"
              height="95"
            />
          </a>

          <p class="desktop-only text-small">107 posts</p>
        </div>

        <div class="post-content">
          <div>
            <p>
              {{ postById(postId).text }}
            </p>
          </div>
        </div>

        <div class="post-date text-faded">
          {{ postById(postId).publishedAt }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
