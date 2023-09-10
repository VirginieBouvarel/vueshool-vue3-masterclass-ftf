<template>
  <div class="post-list">
    <div class="post" v-for="post in props.posts" :key="post.id">
      <div v-if="userById(post.userId)" class="user-info">
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

        <p class="desktop-only text-small">
          {{ userById(post.userId).postsCount }} posts
        </p>
        <p class="desktop-only text-small">
          {{ userById(post.userId).threadsCount }} threads
        </p>
      </div>

      <div class="post-content">
        <div>
          <p>
            {{ post.text }}
          </p>
        </div>
      </div>

      <a
        href="#"
        style="margin-left: auto; padding-left: 10px"
        class="link-unstyled"
        title="Make a change"
      >
        <font-awesome-icon icon="pencil-alt" />
      </a>

      <div class="post-date text-faded">
        <AppDate :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from "@/stores/UsersStore";

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

function userById(userId) {
  const usersStore = useUsersStore();
  return usersStore.user(userId);
}
</script>

<style lang="scss" scoped></style>
