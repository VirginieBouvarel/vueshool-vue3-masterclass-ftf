<template>
  <div class="container">
    <div class="flex-grid">
      <h1>My Profile</h1>
      <!-- <div class="col-3 push-top">
        <UserProfileCardEditor v-if="edit" :user="authUser" />
        <UserProfileCard v-else :user="authUser" />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">
            {{ authUser.username }}'s recent activity
          </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="authUser.posts" />
      </div> -->
    </div>
  </div>
</template>

<script setup>
// import { useUsersStore } from "@/stores/UsersStore";
// import { storeToRefs } from "pinia";
// const { authUser } = storeToRefs(useUsersStore());

defineProps({
  edit: { type: Boolean, default: false },
});
</script>
