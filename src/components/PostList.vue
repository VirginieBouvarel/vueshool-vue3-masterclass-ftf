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
        <div class="col-full">
          <PostEditor
            v-if="editing === post.id"
            :post="post"
            @save="handleUpdate"
          />
          <p v-else>
            {{ post.text }}
          </p>
        </div>
      </div>

      <a
        v-if="post.userId === authStore.authUser?.id"
        @click.prevent="toggleEditMode(post.id)"
        href="#"
        style="margin-left: auto; padding-left: 10px"
        class="link-unstyled"
        title="Make a change"
      >
        <font-awesome-icon icon="pencil-alt" />
      </a>

      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <AppDate :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUsersStore } from "@/stores/UsersStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
const usersStore = useUsersStore();

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

const editing = ref(null);

function userById(userId) {
  return usersStore.user(userId);
}

function toggleEditMode(id) {
  editing.value = id === editing.value ? null : id;
}

function handleUpdate(event) {
  const postsStore = usePostsStore();
  postsStore.updatePost(event.post);
  editing.value = null;
}
</script>
