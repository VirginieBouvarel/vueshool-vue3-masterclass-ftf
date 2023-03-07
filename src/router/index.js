import { createRouter, createWebHistory } from "vue-router";
import PageHome from "@/components/PageHome.vue";
import PageThreadShow from "@/components/PageThreadShow.vue";
import PageNotFound from "@/components/PageNotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: PageHome,
    },
    {
      path: "/thread/:id",
      name: "ThreadShow",
      component: PageThreadShow,
      props: true,
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
