import {getStorage, removeStorage} from "@/utils";
import LzRequest from "./request/index";
import {useStore} from "@/store";
import {useRouter} from "vue-router";
const Router = useRouter();

let lzRequest = new LzRequest({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 5000,
  interceptors: {
    requestInterceptor: (config) => {
      console.log("实例");

      //携带token
      const userInfo = getStorage("userInfo");
      if (userInfo) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }

      return config;
    },
    responseInterceptor: (res) => {
      console.log(res);
      if (res.request.status === 200) return res;
      
      return Promise.reject("未知错误");
    },
    responseInterceptorCatch: (err) => {
      console.log("实例err");

      //判断token是否过期
      const Store = useStore();

      if (err.response && err.response.status === 401) {
        removeStorage("userInfo");
        setTimeout(() => {
          Router.push("/login");
        }, 1000);
      }
      return Promise.reject(err);
    },
  },
});

export default lzRequest;
