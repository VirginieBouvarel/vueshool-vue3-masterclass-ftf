import { findById } from "@/helpers";
import { createRouter, createWebHistory } from "vue-router";
import { useThreadsStore } from "@/stores/ThreadsStore";

import PageHome from "@/pages/PageHome.vue";
import PageForum from "@/pages/PageForum.vue";
import PageCategory from "@/pages/PageCategory.vue";
import PageThreadShow from "@/pages/PageThreadShow.vue";
import PageThreadCreate from "@/pages/PageThreadCreate.vue";
import PageThreadEdit from "@/pages/PageThreadEdit.vue";
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
        const threadExists = findById(threadsStore.threads, to.params.id);
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
      path: "/forum/:forumId/thread/create",
      name: "ThreadCreate",
      component: PageThreadCreate,
      props: true,
    },
    {
      path: "/thread/:id/edit",
      name: "ThreadEdit",
      component: PageThreadEdit,
      props: true,
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
