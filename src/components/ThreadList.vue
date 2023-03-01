<script setup>
import sourceData from "@/data.json";
import { reactive } from "vue";

const props = defineProps({
  threads: { type: Array, required: true },
});

// const posts = reactive(sourceData.posts);
const users = reactive(sourceData.users);

// function postById(postId) {
//   return posts.find((post) => post.id === postId);
// }
function userById(userId) {
  return users.find((user) => user.id === userId);
}
</script>

<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-for="thread in props.threads" :key="thread.id" class="thread">
        <div>
          <p>
            <a href="#">{{ thread.title }}</a>
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, {{ thread.publishedAt }}.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ thread.posts.length }} replies</p>

          <img
            class="avatar-medium"
            :src="userById(thread.userId).avatar"
            alt="user avatar"
            width="35"
            height="35"
          />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">{{ thread.publishedAt }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
