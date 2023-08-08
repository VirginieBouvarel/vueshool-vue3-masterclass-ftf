import { findById, upsert } from "@/helpers";
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
  getters: {},
  actions: {
    async createThread({ text, title, forumId }) {
      const usersStore = useUsersStore();
      const postsStore = usePostsStore();

      const id = "ggqq" + Math.random();
      const userId = usersStore.authUser.id;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = { forumId, title, publishedAt, userId, id };
      this.setThread({ thread });

      this.appendThreadToUser({ userId, threadId: id });
      this.appendThreadToForum({ forumId, threadId: id });
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
    appendThreadToForum({ forumId, threadId }) {
      const forumsStore = useForumsStore();
      const forum = findById(forumsStore.forums, forumId);
      forum.threads = forum.threads || [];
      forum.threads.push(threadId);
    },
    appendThreadToUser({ userId, threadId }) {
      const usersStore = useUsersStore();
      const user = findById(usersStore.users, userId);
      user.threads = user.threads || [];
      user.threads.push(threadId);
    },
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
