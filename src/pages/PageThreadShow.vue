<template>
  <div v-if="thread" class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <post-list :posts="threadPosts" />

    <div class="col-full">
      <form @submit.prevent="addPost">
        <div class="form-group">
          <textarea
            id=""
            class="form-input"
            name="content"
            rows="10"
            cols="30"
            v-model="newPostText"
          ></textarea>
        </div>

        <div class="form-actions">
          <button class="btn-blue">Submit post</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import sourceData from "@/data.json";
import { ref, reactive, computed } from "vue";
import PostList from "@/components/PostList.vue";

const props = defineProps({
  id: { type: String, required: true },
});

const newPostText = ref("");
const threads = reactive(sourceData.threads);
const posts = reactive(sourceData.posts);

const thread = computed(() => threads.find((thread) => thread.id === props.id));
const threadPosts = computed(() =>
  posts.filter((post) => post.threadId === props.id)
);

function addPost() {
  const postId = "gggg" + Math.round();
  const post = {
    id: postId,
    text: newPostText.value,
    publishedAt: Math.floor(Date.now() / 1000),
    threadId: props.id,
    userId: "rpbB8C6ifrYmNDufMERWfQUoa202",
  };
  posts.push(post);
  thread.value.posts.push(postId);
  newPostText.value = "";
}
</script>

<style lang="scss" scoped></style>
