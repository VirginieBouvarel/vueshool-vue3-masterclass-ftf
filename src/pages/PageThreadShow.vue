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
import { onMounted, computed } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useUsersStore } from "@/stores/UsersStore";

const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const usersStore = useUsersStore();

const props = defineProps({
  id: { type: String, required: true },
});

onMounted(async () => {
  console.log("%c onMounted", "color: yellow");
  const thread = await threadsStore.fetchThread({ id: props.id });
  console.log("%c thread :", "color: yellow", thread);
  await usersStore.fetchUser({ id: thread.userId });

  thread.posts.forEach(async (postId) => {
    await postsStore.fetchPost({ id: postId });
    usersStore.fetchUser({ id: thread.userId });
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
