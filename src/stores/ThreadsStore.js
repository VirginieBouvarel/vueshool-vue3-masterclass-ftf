import { findById, upsert, makeAppendChildToParent } from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useUsersStore } from "@/stores/UsersStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { usePostsStore } from "@/stores/PostsStore";
import db from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useThreadsStore = defineStore("ThreadsStore", {
  state: () => {
    return {
      threads: [],
    };
  },
  getters: {
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id);
        if (!thread) return null;
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
      postsStore.setPost({ post: newPost });

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
    async fetchThread({ id }) {
      console.log("🔥📄", id);
      const docRef = doc(db, "threads", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const thread = { ...docSnap.data(), id: docRef.id };
        this.setThread({ thread });
        return thread;
      } else {
        console.log("No such thread document!");
        return null;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
