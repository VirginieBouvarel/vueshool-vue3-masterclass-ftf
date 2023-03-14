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

      <div
        class="post-date text-faded"
        :title="humanFriendlyDate(post.publishedAt)"
      >
        {{ diffForHumans(post.publishedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import sourceData from "@/data.json";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedDate from "dayjs/plugin/localizedFormat";
dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

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
function diffForHumans(timestamp) {
  return dayjs.unix(timestamp).fromNow();
}
function humanFriendlyDate(timestamp) {
  return dayjs.unix(timestamp).format("llll");
}
</script>

<style lang="scss" scoped></style>
