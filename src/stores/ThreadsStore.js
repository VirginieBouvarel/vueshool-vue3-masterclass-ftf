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

      return this.threads.find((thread) => thread.id === id);
    },
    updateThread({ text, title, id }) {
      const thread = this.threads.find((thread) => thread.id === id);
      const newThread = { ...thread, title };
      this.setThread({ thread: newThread });

      const postsStore = usePostsStore();
      const post = postsStore.posts.find((post) => post.id === thread.posts[0]);
      const newPost = { ...post, text };
      this.setPost({ post: newPost });

      return newThread;
    },
    appendThreadToForum({ forumId, threadId }) {
      const forumsStore = useForumsStore();
      const forum = forumsStore.forums.find((forum) => forum.id === forumId);
      forum.threads = forum.threads || [];
      forum.threads.push(threadId);
    },
    appendThreadToUser({ userId, threadId }) {
      const usersStore = useUsersStore();
      const user = usersStore.users.find((user) => user.id === userId);
      user.threads = user.threads || [];
      user.threads.push(threadId);
    },
    setThread({ thread }) {
      const index = this.threads.findIndex((item) => item.id === thread.id);
      const isExistingThread = index !== -1;
      if (isExistingThread) {
        this.threads[index] = thread;
        return;
      }
      this.threads.push(thread);
    },
    setPost({ post }) {
      const postsStore = usePostsStore();
      const index = postsStore.posts.findIndex((item) => item.id === post.id);
      const isExistingPost = index !== -1;
      if (isExistingPost) {
        postsStore.posts[index] = post;
        return;
      }
      this.posts.push(post);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
