import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/auth/Home.vue";
import Login from "./views/auth/Login.vue";
import Register from "./views/auth/Register.vue";
import Profile from "./views/auth/Profile.vue";
import Recovery from "./views/auth/Recovery.vue";
import AdminDashboard from "./views/admin/Dashboard.vue";
import AdminLogin from "./views/admin/Login.vue";
import NotFound from "./views/NotFound.vue";

const routes = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true },
  },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  { path: "/recovery", component: Recovery },
  // Admin routes
  {
    path: "/admin/login",
    component: AdminLogin,
  },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");

    if (!accessToken) {
      // Return redirect path
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      };
    }
    // Return nothing to allow navigation
    return true;
  }

  // For non-protected routes, allow navigation
  return true;
});

export default router;
