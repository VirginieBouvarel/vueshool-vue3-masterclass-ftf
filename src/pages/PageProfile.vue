<template>
  <div class="container" style="width: 100%">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCardEditor v-if="edit" :user="authStore.authUser" />
        <UserProfileCard v-else :user="authStore.authUser" />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">
            {{ authStore.authUser.username }}'s recent activity
          </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="authStore.authUser.posts" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/AuthStore";
const authStore = useAuthStore();

defineProps({
  edit: { type: Boolean, default: false },
});

await authStore.fetchAuthUserPosts();
</script>
