import {createApp} from "vue";
import App from "./App.vue";
import {createPinia} from "pinia";
import {router} from "./router/router";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import "@/assets/css/base.less";
import "element-plus/dist/index.css";
import "animate.css";

createApp(App).use(createPinia()).use(router).mount("#app");
