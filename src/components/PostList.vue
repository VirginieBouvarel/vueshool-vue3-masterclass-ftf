<script setup>
import sourceData from "@/data.json";
import { reactive } from "vue";

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

const users = reactive(sourceData.users);

function userById(userId) {
  return users.find((user) => user.id === userId);
}
</script>

<template>
  <div class="post-list">
    <div class="post" v-for="post in props.posts" :key="post.id">
      <div class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId).name }}</a>

        <a href="#">
          <img
            class="avatar-large"
            :src="userById(post.userId).avatar"
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
            {{ post.text }}
          </p>
        </div>
      </div>

      <div class="post-date text-faded">
        {{ post.publishedAt }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
