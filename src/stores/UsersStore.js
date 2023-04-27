import { defineStore, acceptHMRUpdate } from "pinia";
import sourceData from "@/data";

export const useUsersStore = defineStore("UsersStore", {
  state: () => {
    return {
      users: sourceData.users,
    };
  },
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
