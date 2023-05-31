import { createRouter, createWebHistory } from "vue-router";
import { useThreadsStore } from "@/stores/ThreadsStore";

import PageHome from "@/pages/PageHome.vue";
import PageForum from "@/pages/PageForum.vue";
import PageCategory from "@/pages/PageCategory.vue";
import PageThreadShow from "@/pages/PageThreadShow.vue";
import PageProfile from "@/pages/PageProfile.vue";
import PageNotFound from "@/pages/PageNotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: PageHome,
    },
    {
      path: "/category/:id",
      name: "Category",
      component: PageCategory,
      props: true,
    },
    {
      path: "/forum/:id",
      name: "Forum",
      component: PageForum,
      props: true,
    },
    {
      path: "/thread/:id",
      name: "ThreadShow",
      component: PageThreadShow,
      props: true,
      beforeEnter(to, from, next) {
        const threadsStore = useThreadsStore();
        const threadExists = threadsStore.threads.find(
          (thread) => thread.id === to.params.id
        );
        if (threadExists) {
          return next();
        } else {
          return next({
            name: "NotFound",
            params: { pathMatch: to.path.substring(1).split("/") },
            query: to.query,
            hash: to.hash,
          });
        }
      },
    },
    {
      path: "/me",
      name: "Profile",
      component: PageProfile,
      meta: { toTop: true, smoothScroll: true },
    },
    {
      path: "/me/edit",
      name: "ProfileEdit",
      component: PageProfile,
      props: { edit: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: PageNotFound,
    },
  ],
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";
    return scroll;
  },
});

export default router;
