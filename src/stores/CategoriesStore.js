import { defineStore, acceptHMRUpdate } from "pinia";

export const useCategoriesStore = defineStore("CategoriesStore", {
  state: () => {
    return {
      categories: [],
    };
  },
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot));
}
