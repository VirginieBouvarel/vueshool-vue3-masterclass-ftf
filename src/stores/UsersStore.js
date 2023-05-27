import { defineStore, acceptHMRUpdate } from "pinia";
import { usePostsStore } from "@/stores/PostsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import sourceData from "@/data";

export const useUsersStore = defineStore("UsersStore", {
  state: () => {
    return {
      users: sourceData.users,
      authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
    };
  },
  getters: {
    authUser: (state) => {
      const user = state.users.find((user) => user.id === state.authId);
      if (!user) return null;

      const postsStore = usePostsStore();
      const threadsStore = useThreadsStore();

      return {
        ...user,
        // authuser.posts
        get posts() {
          return postsStore.posts.filter((post) => post.userId === user.id);
        },
        // authuser.postsCount
        get postsCount() {
          return this.posts.length;
        },
        // authuser.posts
        get threads() {
          return threadsStore.threads.filter(
            (thread) => thread.userId === user.id
          );
        },
        // authuser.posts
        get threadsCount() {
          return this.threads.length;
        },
      };
    },
  },
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
