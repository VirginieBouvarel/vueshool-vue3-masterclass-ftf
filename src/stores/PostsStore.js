import { upsert, makeAppendChildToParent } from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";
import db from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

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
    setPost({ post }) {
      upsert(this.posts, post);
    },
    async fetchPost({ id }) {
      console.log("🔥💬", id);
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const post = { ...docSnap.data(), id: docRef.id };
        this.setPost({ post });
        return post;
      } else {
        console.log("No such post document!");
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
