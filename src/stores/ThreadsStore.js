import {
  findById,
  upsert,
  docToResource,
  fetchItem,
  fetchItems,
  makeAppendChildToParent,
} from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useUsersStore } from "@/stores/UsersStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useAuthStore } from "@/stores/AuthStore";
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
    async createThread({ text, title, forumId }) {
      const usersStore = useUsersStore();
      const authStore = useAuthStore();
      const forumsStore = useForumsStore();
      const postsStore = usePostsStore();

      const userId = authStore.authUser.id;
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
    async updateThread({ text, title, id }) {
      const postsStore = usePostsStore();

      const thread = findById(this.threads, id);
      const post = findById(postsStore.posts, thread.posts[0]);

      let newThread = { ...thread, title };
      let newPost = { ...post, text };

      const threadRef = doc(db, "threads", id);
      const postRef = doc(db, "posts", post.id);

      const batch = writeBatch(db);
      batch.update(threadRef, newThread);
      batch.update(postRef, newPost);
      await batch.commit();

      newThread = await getDoc(threadRef);
      newPost = await getDoc(postRef);

      upsert(this.threads, docToResource(newThread));
      upsert(postsStore.posts, docToResource(newPost));

      return docToResource(newThread);
    },
    appendThreadToForum: makeAppendChildToParent({
      child: "threads",
      parent: "forums",
    }),
    appendThreadToUser: makeAppendChildToParent({
      child: "threads",
      parent: "users",
    }),
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
