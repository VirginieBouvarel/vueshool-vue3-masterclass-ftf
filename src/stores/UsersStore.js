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
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const useUsersStore = defineStore("UsersStore", {
  state: () => {
    return {
      users: [],
      authId: null,
      // authId: "oppNjkELJiWKrvx6oT6DOcxCE1C3",
      auth: null,
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
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      this.authId = userId;
      return this.fetchUser({ id: userId });
    },
    async listenAuthStateChanges() {
      console.log("%c 👂listenAuthStateChanges", "color: yellow");
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          await this.fetchAuthUser();
        }
      });
    },
    async registerUserWithEmailAndPassword({
      email,
      name,
      username,
      password,
      avatar = null,
    }) {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      this.createUser({ id: user.uid, email, name, username, avatar });
    },
    async signInWithEmailAndPassword({ email, password }) {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signInWithGoogle() {
      console.log("%c signInWithGoogle", "color: yellow");
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      try {
        const { user } = await signInWithPopup(auth, provider);
        console.log("%c user :", "color: yellow", user);

        const userRef = doc(db, "users", user.uid);
        console.log("%c userRef :", "color: yellow", userRef);

        const userDoc = await getDoc(userRef);
        console.log("%c userDoc :", "color: yellow", userDoc);

        if (!userDoc.exists()) {
          this.createUser({
            id: user.uid,
            name: user.displayName,
            email: user.email,
            username: user.email,
            avatar: user.photoURL,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async signOut() {
      const auth = getAuth();
      await signOut(auth);
      this.authId = null;
    },
    async createUser({ id, email, name, username, avatar = null }) {
      console.log("%c createUser :", "color: yellow", {
        id,
        email,
        name,
        username,
        avatar,
      });
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
      console.log("%c user :", "color: yellow", user);

      const userRef = doc(db, "users", id);
      await setDoc(userRef, user);
      const newUser = await getDoc(userRef);
      this.users.push({ ...newUser.data(), id: newUser.id });
      return docToResource(newUser);
    },
    updateUser(user) {
      upsert(this.users, user);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
