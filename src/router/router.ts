import {createRouter, createWebHistory} from "vue-router";
const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/navpage",
    name: "navpage",
    component: () => import("@/view/NavPage/NavPage.vue"),
    meta: {
      isShowHead: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/view/Login/login.vue"),
    meta: {
      isShowHead: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/view/Register/register.vue"),
    meta: {
      isShowHead: false,
    },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/view/Home/home.vue"),
    meta: {
      isShowHead: true,
    },
  },
  {
    path: "/category",
    name: "Tags",
    component: () => import("@/view/Category/category.vue"),
    meta: {
      isShowHead: true,
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/view/About/about.vue"),
    meta: {
      isShowHead: true,
    },
  },
  // {
  //   path: "/tools",
  //   name: "Tools",
  //   component: () => import("@/view/Tools/tools.vue"),
  //   meta: {
  //     isShowHead: true,
  //   },
  // },
  {
    path: "/article",
    name: "Article",
    component: () => import("@/view/Article/article.vue"),
    meta: {
      isShowHead: true,
    },
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("@/view/Search/search.vue"),
    meta: {
      isShowHead: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export {router};
