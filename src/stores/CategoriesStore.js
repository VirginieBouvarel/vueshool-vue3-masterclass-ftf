import { defineStore, acceptHMRUpdate } from "pinia";
import sourceData from "@/data";

export const useCategoriesStore = defineStore("CategoriesStore", {
  state: () => {
    return {
      categories: sourceData.categories,
    };
  },
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot));
}
