import { findById, upsert } from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { usePostsStore } from "@/stores/PostsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import db from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useUsersStore = defineStore("UsersStore", {
  state: () => {
    return {
      users: [],
      authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
    };
  },
  getters: {
    user: (state) => {
      return (id) => {
        const user = findById(state.users, id);
        if (!user) return null;

        const postsStore = usePostsStore();
        const threadsStore = useThreadsStore();

        return {
          // authUser
          ...user,
          // authUser.posts
          get posts() {
            return postsStore.posts.filter((post) => post.userId === user.id);
          },
          // authUser.postsCount
          get postsCount() {
            return this.posts.length;
          },
          // authUser.posts
          get threads() {
            return threadsStore.threads.filter(
              (thread) => thread.userId === user.id
            );
          },
          // authUser.posts
          get threadsCount() {
            return this.threads.length;
          },
        };
      };
    },
    authUser: (state) => {
      return state.user(state.authId);
    },
  },
  actions: {
    updateUser(user) {
      const userIndex = this.users.findIndex((item) => item.id === user.id);
      this.users[userIndex] = user;
    },
    setUser({ user }) {
      upsert(this.users, user);
    },
    async fetchUser({ id }) {
      console.log("🔥🙋", id);
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const user = { ...docSnap.data(), id: docRef.id };
        this.setUser({ user });
        return user;
      } else {
        console.log("No such user document!");
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
