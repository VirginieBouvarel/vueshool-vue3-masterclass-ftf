import { defineStore, acceptHMRUpdate } from "pinia";
import db from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { upsert } from "@/helpers";

export const useCategoriesStore = defineStore("CategoriesStore", {
  state: () => {
    return {
      categories: [],
    };
  },
  getters: {},
  actions: {
    async fetchAllCategories() {
      console.log("🔥", "🏷", "all");
      const collectionRef = collection(db, "categories");
      const collectionSnap = await getDocs(collectionRef);
      return collectionSnap.docs.map((doc) => {
        const item = { id: doc.id, ...doc.data() };
        upsert(this.categories, item);
        return item;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot));
}
