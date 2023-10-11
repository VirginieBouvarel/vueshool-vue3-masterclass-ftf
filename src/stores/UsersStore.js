import {
  findById,
  upsert,
  fetchItem,
  fetchItems,
  docToResource,
} from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { usePostsStore } from "@/stores/PostsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import db from "@/config/firebase";
import {
  addDoc,
  getDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

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
          ...user,
          get posts() {
            return postsStore.posts.filter((post) => post.userId === user.id);
          },
          get postsCount() {
            return user.postsCount || 0;
          },
          get threads() {
            return threadsStore.threads.filter(
              (thread) => thread.userId === user.id
            );
          },
          get threadsCount() {
            return user.threads?.length || 0;
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
      upsert(this.users, user);
    },
    fetchUser({ id }) {
      return fetchItem({
        resources: this.users,
        collection: "users",
        emoji: "🙋",
        id,
      });
    },
    fetchUsers({ ids }) {
      return fetchItems({
        resources: this.users,
        collection: "users",
        emoji: "🙋",
        ids,
      });
    },
    fetchAuthUser() {
      return this.fetchUser({ id: this.authId });
    },
    async createUser({ avatar = null, email, name, username }) {
      const registeredAt = serverTimestamp();
      const usernameLower = username.toLowerCase();
      const emailLower = email.toLowerCase();
      const user = {
        avatar,
        email: emailLower,
        name,
        username,
        usernameLower,
        registeredAt,
      };
      const userRef = await addDoc(collection(db, "users"), user);
      const newUser = await getDoc(userRef);
      this.users.push({ ...newUser.data(), id: newUser.id });
      return docToResource(newUser);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
