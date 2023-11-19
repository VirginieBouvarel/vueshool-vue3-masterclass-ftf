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
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
export const useUsersStore = defineStore("UsersStore", {
  state: () => {
    return {
      users: [],
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
  },
  actions: {
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
    async createUser({ id, email, name, username, avatar = null }) {
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
      const userRef = doc(db, "users", id);
      await setDoc(userRef, user);
      const newUser = await getDoc(userRef);
      this.users.push({ ...newUser.data(), id: newUser.id });
      return docToResource(newUser);
    },
    async updateUser(user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null,
      };
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, updates);
      const newUser = await getDoc(userRef);
      upsert(this.users, { ...newUser.data(), id: newUser.id });
      return docToResource(newUser);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
