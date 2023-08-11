<template>
  <div v-if="thread" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link :to="{ name: 'ThreadEdit', id: props.id }">
        <button class="btn-green btn-small">Edit Thread</button>
      </router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a> ,
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
import { onMounted, computed, ref } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useUsersStore } from "@/stores/UsersStore";

const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const usersStore = useUsersStore();

const props = defineProps({
  id: { type: String, required: true },
});

const thread = ref(null);
threadsStore.fetchThread({ id: props.id }).then(async (t) => {
  thread.value = t;
  await usersStore.fetchUser({ id: thread.value.userId });

  thread.value.posts.forEach(async (postId) => {
    const post = await postsStore.fetchPost({ id: postId });

    usersStore.fetchUser({ id: post.userId });
  });
});

const threadPosts = computed(() =>
  postsStore.posts.filter((post) => post.threadId === props.id)
);

function addPost(event) {
  const post = { ...event.post, threadId: props.id };
  postsStore.createPost(post);
}
</script>

<style lang="scss" scoped></style>
