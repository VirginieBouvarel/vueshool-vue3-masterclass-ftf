import { findById } from "@/helpers";
import { createRouter, createWebHistory } from "vue-router";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";

import PageHome from "@/pages/PageHome.vue";
import PageForum from "@/pages/PageForum.vue";
import PageCategory from "@/pages/PageCategory.vue";
import PageThreadShow from "@/pages/PageThreadShow.vue";
import PageThreadCreate from "@/pages/PageThreadCreate.vue";
import PageThreadEdit from "@/pages/PageThreadEdit.vue";
import PageProfile from "@/pages/PageProfile.vue";
import PageRegister from "@/pages/PageRegister.vue";
import PageSignIn from "@/pages/PageSignIn.vue";
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
      meta: { toTop: true, smoothScroll: true, requiresAuth: true },
    },
    {
      path: "/me/edit",
      name: "ProfileEdit",
      component: PageProfile,
      props: { edit: true },
      meta: { requiresAuth: true },
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
      async beforeEnter(to, _from, next) {
        const threadsStore = useThreadsStore();
        await threadsStore.fetchThread({ id: to.params.id });
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
      meta: { requiresAuth: true },
    },
    {
      path: "/thread/:id/edit",
      name: "ThreadEdit",
      component: PageThreadEdit,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/register",
      name: "Register",
      component: PageRegister,
    },
    {
      path: "/signin",
      name: "SignIn",
      component: PageSignIn,
    },
    {
      path: "/signout",
      name: "SignOut",
      async beforeEnter(_to, _from, next) {
        const usersStore = useUsersStore();
        await usersStore.signOut();
        return next({ name: "Home" });
      },
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

router.beforeEach((to, from) => {
  console.log(`🚦 Navigating from ${from.name} to ${to.name} `);
  const usersStore = useUsersStore();
  if (to.meta.requiresAuth && !usersStore.authId) return { name: "Home" };
});

export default router;
