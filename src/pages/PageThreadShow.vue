<template>
  <div v-if="thread" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link :to="{ name: 'ThreadEdit', id: props.id }">
        <button class="btn-green btn-small">Edit Thread</button>
      </router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author.name }}</a> ,
      <AppDate :timestamp="thread.publishedAt" />.
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
      >
        {{ thread.repliesCount }} replies by
        {{ thread.contributorsCount }} contributors
      </span>
    </p>

    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";

const props = defineProps({
  id: { type: String, required: true },
});

const threadsStore = useThreadsStore();
const thread = threadsStore.thread(props.id);

const postsStore = usePostsStore();
const threadPosts = computed(() =>
  postsStore.posts.filter((post) => post.threadId === props.id)
);

function addPost(event) {
  const post = { ...event.post, threadId: props.id };
  postsStore.createPost(post);
}
</script>

<style lang="scss" scoped></style>
