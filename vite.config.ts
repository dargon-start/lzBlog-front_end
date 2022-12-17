import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import IconsResolver from "unplugin-icons/resolver"; // icon相关
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": "/src/",
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    open: true, //启动项目自动弹出浏览器
    port: 4000, //启动端口
    proxy: {
      "/api": {
        target: "http://localhost:8000", //实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  css: {},
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "Icon",
        }),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"], // 重点，记住这里配了个ep，参数别改，就用ep，改了后就不好使了
        }),
      ],
    }),
    Icons({
      /* options */
      autoInstall: true,
    }),
  ],
  build: {
    sourcemap: false,
    minify: "terser",
    chunkSizeWarningLimit: 1500,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // // 处理分包
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes("node_modules")) {
    //         return id
    //           .toString()
    //           .split("node_modules/")[1]
    //           .split("/")[0]
    //           .toString();
    //       }
    //     },
    //     chunkFileNames: (chunkInfo) => {
    //       const facadeModuleId = chunkInfo.facadeModuleId
    //         ? chunkInfo.facadeModuleId.split("/")
    //         : [];
    //       const fileName =
    //         facadeModuleId[facadeModuleId.length - 2] || "[name]";
    //       return `js/${fileName}/[name].[hash].js`;
    //     },
    //   },
    // },
  },
});
