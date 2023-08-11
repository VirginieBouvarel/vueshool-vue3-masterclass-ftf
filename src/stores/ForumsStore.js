import { defineStore, acceptHMRUpdate } from "pinia";

export const useForumsStore = defineStore("ForumsStore", {
  state: () => {
    return {
      forums: [],
    };
  },
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useForumsStore, import.meta.hot));
}
