import {
  findById,
  upsert,
  fetchItem,
  fetchItems,
  makeAppendChildToParent,
} from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useUsersStore } from "@/stores/UsersStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { usePostsStore } from "@/stores/PostsStore";
import db from "@/config/firebase";
import {
  doc,
  collection,
  writeBatch,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

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
        if (!thread) return {};
        const usersStore = useUsersStore();
        return {
          ...thread,
          get author() {
            return findById(usersStore.users, thread.userId);
          },
          get repliesCount() {
            return thread.posts?.length - 1 || 0;
          },
          get contributorsCount() {
            return thread.contributors?.length - 1 || 0;
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

      const userId = usersStore.authUser.id;
      const publishedAt = Math.floor(Date.now() / 1000);

      const threadRef = doc(collection(db, "threads"));
      const userRef = doc(db, "users", userId);
      const forumRef = doc(db, "forums", forumId);

      const thread = { forumId, title, publishedAt, userId, id: threadRef.id };

      const batch = writeBatch(db);
      batch.set(threadRef, thread);
      batch.update(userRef, {
        threads: arrayUnion(threadRef.id),
      });
      batch.update(forumRef, {
        threads: arrayUnion(threadRef.id),
      });
      await batch.commit();

      const newThread = await getDoc(threadRef);

      upsert(this.threads, { ...newThread.data(), id: newThread.id });
      this.appendThreadToForum(forumsStore, {
        childId: newThread.id,
        parentId: forumId,
      });
      this.appendThreadToUser(usersStore, {
        childId: newThread.id,
        parentId: userId,
      });
      postsStore.createPost({ text, threadId: newThread.id });
      return findById(this.threads, newThread.id);
    },
    updateThread({ text, title, id }) {
      const thread = findById(this.threads, id);
      const newThread = { ...thread, title };
      upsert(this.threads, newThread);

      const postsStore = usePostsStore();
      const post = findById(postsStore.posts, thread.posts[0]);
      const newPost = { ...post, text };
      upsert(postsStore.posts, newPost);

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
    fetchThread({ id }) {
      return fetchItem({
        resources: this.threads,
        collection: "threads",
        emoji: "📄",
        id,
      });
    },
    fetchThreads({ ids }) {
      return fetchItems({
        resources: this.threads,
        collection: "threads",
        emoji: "📄",
        ids,
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
