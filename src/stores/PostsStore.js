import { fetchItem, fetchItems, makeAppendChildToParent } from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";
import db from "@/config/firebase";
import {
  doc,
  collection,
  writeBatch,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

export const usePostsStore = defineStore("PostsStore", {
  state: () => {
    return {
      posts: [],
    };
  },
  getters: {},
  actions: {
    async createPost(post) {
      const usersStore = useUsersStore();
      const threadsStore = useThreadsStore();

      post.userId = usersStore.authUser.id;
      post.publishedAt = Math.floor(Date.now() / 1000);

      const postRef = doc(collection(db, "posts"));
      const threadRef = doc(db, "threads", post.threadId);

      const batch = writeBatch(db);
      batch.set(postRef, post);
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(post.userId),
      });
      await batch.commit();

      const newPost = await getDoc(postRef);
      this.posts.push({ ...newPost.data(), id: newPost.id });
      this.appendPostToThread(threadsStore, {
        childId: newPost.id,
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
