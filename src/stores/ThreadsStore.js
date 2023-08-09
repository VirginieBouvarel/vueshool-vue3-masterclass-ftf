import { findById, upsert, makeAppendChildToParent } from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useUsersStore } from "@/stores/UsersStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { usePostsStore } from "@/stores/PostsStore";
import sourceData from "@/data";

export const useThreadsStore = defineStore("ThreadsStore", {
  state: () => {
    return {
      threads: sourceData.threads,
    };
  },
  getters: {
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id);
        const usersStore = useUsersStore();
        return {
          ...thread,
          get author() {
            return findById(usersStore.users, thread.userId);
          },
          get repliesCount() {
            return thread.posts.length - 1;
          },
          get contributorsCount() {
            return thread.contributors.length;
          },
        };
      };
    },
  },
  actions: {
    async createThread({ text, title, forumId }) {
      const usersStore = useUsersStore();
      const forumsStore = useForumsStore();
      const postsStore = usePostsStore();

      const id = "ggqq" + Math.random();
      const userId = usersStore.authUser.id;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = { forumId, title, publishedAt, userId, id };
      this.setThread({ thread });

      this.appendThreadToForum(forumsStore, { childId: id, parentId: forumId });
      this.appendThreadToUser(usersStore, { childId: id, parentId: userId });

      postsStore.createPost({ text, threadId: id });

      return findById(this.threads, id);
    },
    updateThread({ text, title, id }) {
      const thread = findById(this.threads, id);
      const newThread = { ...thread, title };
      this.setThread({ thread: newThread });

      const postsStore = usePostsStore();
      const post = findById(postsStore.posts, thread.posts[0]);
      const newPost = { ...post, text };
      this.setPost({ post: newPost });

      return newThread;
    },
    appendThreadToForum: makeAppendChildToParent({
      child: "threads",
      parent: "forums",
    }),
    appendThreadToUser: makeAppendChildToParent({
      child: "threads",
      parent: "users",
    }),
    setThread({ thread }) {
      upsert(this.threads, thread);
    },
    setPost({ post }) {
      const postsStore = usePostsStore();
      upsert(postsStore.posts, post);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
