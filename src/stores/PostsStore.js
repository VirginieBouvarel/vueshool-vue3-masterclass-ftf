import { defineStore, acceptHMRUpdate } from "pinia";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";
import sourceData from "@/data";

export const usePostsStore = defineStore("PostsStore", {
  state: () => {
    return {
      posts: sourceData.posts,
    };
  },
  getters: {},

  actions: {
    createPost(post) {
      const usersStore = useUsersStore();
      post.id = "ggqq" + Math.random();
      post.userId = usersStore.authUser.id;
      post.publishedAt = Math.floor(Date.now() / 1000);
      this.posts.push(post);
      this.appendPostToThread({ postId: post.id, threadId: post.threadId });
    },
    appendPostToThread({ postId, threadId }) {
      const threadsStore = useThreadsStore();
      const thread = threadsStore.threads.find(
        (thread) => thread.id === threadId
      );
      thread.posts = thread.posts || [];
      thread.posts.push(postId);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
