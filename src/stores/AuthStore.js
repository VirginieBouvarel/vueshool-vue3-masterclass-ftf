import { upsert } from "@/helpers";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useUsersStore } from "@/stores/UsersStore";
import { usePostsStore } from "@/stores/PostsStore";
import db from "@/config/firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const useAuthStore = defineStore("AuthStore", {
  state: () => {
    return {
      authId: null,
      authObserverUnsubscribe: null,
    };
  },
  getters: {
    authUser() {
      const usersStore = useUsersStore();
      return usersStore.user(this.authId);
    },
  },
  actions: {
    async fetchAuthUser() {
      const usersStore = useUsersStore();
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      this.authId = userId;
      return await usersStore.fetchUser({ id: userId });
    },
    async fetchAuthUserPosts() {
      const postsStore = usePostsStore();
      const postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, where("userId", "==", this.authId));
      const postsSnap = await getDocs(postsQuery);
      postsSnap.forEach((doc) => {
        upsert(postsStore.posts, { ...doc.data(), id: doc.id });
      });
    },
    async initAuthentication() {
      if (this.authObserverUnsubscribe) this.authObserverUnsubscribe();
      const auth = getAuth();
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log("👣 the auth state has changed");
          if (user) {
            await this.fetchAuthUser();
            resolve(user);
          } else {
            resolve(null);
          }
        });
        this.authObserverUnsubscribe = unsubscribe;
      });
    },
    async registerUserWithEmailAndPassword({
      email,
      name,
      username,
      password,
      avatar = null,
    }) {
      const usersStore = useUsersStore();
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      usersStore.createUser({ id: user.uid, email, name, username, avatar });
    },
    async signInWithEmailAndPassword({ email, password }) {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signInWithGoogle() {
      const usersStore = useUsersStore();
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      try {
        const { user } = await signInWithPopup(auth, provider);
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          usersStore.createUser({
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
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
