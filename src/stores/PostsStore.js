import {
  upsert,
  docToResource,
  fetchItem,
  fetchItems,
  makeAppendChildToParent,
} from "@/helpers";
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
  getDocs,
  increment,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

export const usePostsStore = defineStore("PostsStore", {
  state: () => {
    return {
      posts: [],
    };
  },
  getters: {},
  actions: {
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
    async fetchAuthUserPosts() {
      const usersStore = useUsersStore();
      const postsRef = collection(db, "posts");
      const postsQuery = query(
        postsRef,
        where("userId", "==", usersStore.authId)
      );
      const postsSnap = await getDocs(postsQuery);
      postsSnap.forEach((doc) => {
        upsert(this.posts, { ...doc.data(), id: doc.id });
      });
    },
    async createPost(post) {
      const usersStore = useUsersStore();
      const threadsStore = useThreadsStore();

      post.userId = usersStore.authUser.id;
      post.publishedAt = Math.floor(Date.now() / 1000);

      const postRef = doc(collection(db, "posts"));
      const threadRef = doc(db, "threads", post.threadId);
      const userRef = doc(db, "users", post.userId);
      const batch = writeBatch(db);
      batch.set(postRef, post);
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(post.userId),
      });
      batch.update(userRef, {
        postsCount: increment(1),
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
    async updatePost({ text, id }) {
      const usersStore = useUsersStore();
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: usersStore.authUser.id,
          moderated: false,
        },
      };
      const postRef = doc(db, "posts", id);
      const batch = writeBatch(db);
      batch.update(postRef, post);
      await batch.commit();

      const updatedPost = await getDoc(postRef);
      upsert(this.posts, docToResource(updatedPost));
    },
    appendPostToThread: makeAppendChildToParent({
      child: "posts",
      parent: "threads",
    }),
    appendContributorToThread: makeAppendChildToParent({
      child: "contributors",
      parent: "threads",
    }),
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
