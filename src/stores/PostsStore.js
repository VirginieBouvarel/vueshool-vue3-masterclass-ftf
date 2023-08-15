import { fetchItem, fetchItems, makeAppendChildToParent } from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";

export const usePostsStore = defineStore("PostsStore", {
  state: () => {
    return {
      posts: [],
    };
  },
  getters: {},
  actions: {
    createPost(post) {
      const usersStore = useUsersStore();
      const threadsStore = useThreadsStore();

      post.id = "ggqq" + Math.random();
      post.userId = usersStore.authUser.id;
      post.publishedAt = Math.floor(Date.now() / 1000);
      this.posts.push(post);
      this.appendPostToThread(threadsStore, {
        childId: post.id,
        parentId: post.threadId,
      });
      this.appendContributorToThread(threadsStore, {
        childId: post.userId,
        parentId: post.threadId,
      });
    },
    appendPostToThread: makeAppendChildToParent({
      child: "posts",
      parent: "threads",
    }),
    appendContributorToThread: makeAppendChildToParent({
      child: "contributors",
      parent: "threads",
    }),
    fetchPost({ id }) {
      return fetchItem({
        resources: this.posts,
        collection: "posts",
        emoji: "💬",
        id,
      });
    },
    fetchPosts({ ids }) {
      return fetchItems({
        resources: this.posts,
        collection: "posts",
        emoji: "💬",
        ids,
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
