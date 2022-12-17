import axios from "axios";
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {LzAxiosInterceptor, LzAxiosConfig} from "./type";
import {ElLoading} from "element-plus";
const ISLOADING = true;
class LzRequest {
  instance: AxiosInstance;
  interceptors?: LzAxiosInterceptor;
  loading: any;
  isLoading: boolean;
  constructor(config: LzAxiosConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;
    //默认赋值为true

    this.isLoading = config.isLoading ?? ISLOADING;
    //实例拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );
    //公共拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
        if (this.isLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: "拼命加载中，请稍等....",
            background: "rgba(255, 255, 255)",
          });
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        console.log();
        
        console.log("全局");
        this.loading?.close();
        return res.data;
      },

      (err) => {
        console.log("全局err");
        if (this.isLoading) {
          this.loading?.close();
        }
        return Promise.reject(err);
      }
    );
  }
  //重写request方法
  request<T = any>(config: LzAxiosConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      //如果有请求拦截器，执行请求拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors?.requestInterceptor(config);
      }
      this.isLoading = config.isLoading ?? ISLOADING;
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors?.responseInterceptor(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get<T = any>(config: LzAxiosConfig<T>) {
    return this.request<T>({
      ...config,
      method: "GET",
    });
  }
  post<T = any>(config: LzAxiosConfig<T>) {
    return this.request<T>({
      ...config,
      method: "POST",
    });
  }
  patch<T = any>(config: LzAxiosConfig<T>) {
    return this.request<T>({
      ...config,
      method: "PATCH",
    });
  }
  delete<T = any>(config: LzAxiosConfig<T>) {
    return this.request<T>({
      ...config,
      method: "DELETE",
    });
  }
}

export default LzRequest;
