import { defineStore, acceptHMRUpdate } from "pinia";
import { fetchItem, fetchItems } from "@/helpers";

export const useForumsStore = defineStore("ForumsStore", {
  state: () => {
    return {
      forums: [],
    };
  },
  getters: {},
  actions: {
    fetchForum({ id }) {
      return fetchItem({
        resources: this.forums,
        collection: "forums",
        emoji: "🏁",
        id,
      });
    },
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
