import { defineStore, acceptHMRUpdate } from "pinia";
import { fetchItems } from "@/helpers";

export const useForumsStore = defineStore("ForumsStore", {
  state: () => {
    return {
      forums: [],
    };
  },
  getters: {},
  actions: {
    fetchForums({ ids }) {
      return fetchItems({
        resources: this.forums,
        collection: "forums",
        emoji: "🏁",
        ids,
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useForumsStore, import.meta.hot));
}
