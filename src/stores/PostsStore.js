import { defineStore, acceptHMRUpdate } from "pinia";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";
import sourceData from "@/data";

const usersStore = useUsersStore();
const threadsStore = useThreadsStore();

export const usePostsStore = defineStore("PostsStore", {
  state: () => {
    return {
      posts: sourceData.posts,
    };
  },
  getters: {},

  actions: {
    createPosts(post) {
      post.id = "ggqq" + Math.random();
      post.userId = usersStore.authUser.id;
      post.publishedAt = Math.floor(Date.now() / 1000);
      this.posts.push(post);
      const thread = threadsStore.threads.find(
        (thread) => thread.id === post.threadId
      );
      thread.posts.push(post.id);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
