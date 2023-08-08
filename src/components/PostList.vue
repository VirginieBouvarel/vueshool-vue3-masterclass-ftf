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
        <AppDate :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { findById } from "@/helpers";
import { useUsersStore } from "@/stores/UsersStore";
import { storeToRefs } from "pinia";
const { users } = storeToRefs(useUsersStore());

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

function userById(userId) {
  return findById(users.value, userId);
}
</script>

<style lang="scss" scoped></style>
