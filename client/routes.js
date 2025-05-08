import { createRouter, createWebHistory } from "vue-router";
import { decodeJwt } from "jose";
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
      requiredScope: "admin",
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
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");

    // No token found
    if (!accessToken) {
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      };
    }

    // Parse and validate JWT
    let tokenPayload;
    try {
      tokenPayload = decodeJwt(accessToken);
    } catch (e) {
      localStorage.removeItem("ACCESS_TOKEN");
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      };
    }

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (!tokenPayload.exp || tokenPayload.exp < currentTime) {
      localStorage.removeItem("ACCESS_TOKEN");
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      };
    }

    // Check scope requirement
    const requiredScope = to.meta.requiredScope;
    if (requiredScope && tokenPayload.scope !== requiredScope) {
      localStorage.removeItem("ACCESS_TOKEN");
      return {
        path: requiredScope === "admin" ? "/admin/login" : "/login",
        query: { redirect: to.fullPath },
      };
    }

    return true;
  }

  return true;
});

export default router;
