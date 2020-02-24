import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      { path: "", name: "home", component: () => import("../views/Home.vue") },
      {
        path: "analytics",
        name: "analytics",
        component: () => import("../views/Analytics.vue")
      },
      {
        path: "/auth",
        name: "auth",
        component: () => import("../views/Auth.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
