import { createRouter, createWebHistory } from "vue-router";
import PageHome from "@/pages/PageHome.vue";
import PageForum from "@/pages/PageForum.vue";
import PageCategory from "@/pages/PageCategory.vue";
import PageThreadShow from "@/pages/PageThreadShow.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
import sourceData from "@/data.json";

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
        const threadExists = sourceData.threads.find(
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
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: PageNotFound,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
