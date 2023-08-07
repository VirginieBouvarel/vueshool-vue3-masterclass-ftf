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
    createThread({ text, title, forumId }) {
      console.log("%c createThread", "color: yellow");
      const usersStore = useUsersStore();
      const postsStore = usePostsStore();

      const id = "ggqq" + Math.random();
      const userId = usersStore.authUser.id;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = { forumId, title, publishedAt, userId, id };
      this.threads.push(thread);

      this.appendThreadToUser({ userId, threadId: id });
      this.appendThreadToForum({ forumId, threadId: id });
      postsStore.createPost({ text, threadId: id });
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
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
