<template>
  <div v-if="thread" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadShow', params: { id: '-KsjWehQ--apjDBwSBCY' } }"
      >
        <button class="btn-green btn-small">Random Thread</button>
      </router-link>
      <router-link
        v-if="thread.userId === authStore.authUser?.id"
        :to="{ name: 'ThreadEdit', params: { id: props.id } }"
      >
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
    <post-editor v-if="authStore.authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: route.path } }">
        Sign In
      </router-link>
      or
      <router-link
        :to="{ name: 'Register', query: { redirectTo: route.path } }"
      >
        Register
      </router-link>
      to reply.
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useUsersStore } from "@/stores/UsersStore";
import { useAuthStore } from "@/stores/AuthStore";
import { useRoute } from "vue-router";

const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const route = useRoute();

const props = defineProps({
  id: { type: String, required: true },
});

const threadData = await threadsStore.fetchThread({ id: props.id });
const posts = await postsStore.fetchPosts({ ids: threadData.posts });
const usersIds = posts.map((post) => post.userId).concat(threadData.userId);
await usersStore.fetchUsers({ ids: usersIds });

const thread = computed(() => {
  return threadsStore.thread(props.id);
});
const threadPosts = computed(() =>
  postsStore.posts.filter((post) => post.threadId === props.id)
);

async function addPost(event) {
  const post = { ...event.post, threadId: props.id };
  await postsStore.createPost(post);
  // Pour que user.postsCount soit mis à jour sans avoir à recharger la page
  await usersStore.fetchUser({ id: post.userId });
}
</script>
