import { defineStore, acceptHMRUpdate } from "pinia";
import sourceData from "@/data";

export const useThreadsStore = defineStore("ThreadsStore", {
  state: () => {
    return {
      threads: sourceData.threads,
    };
  },
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
