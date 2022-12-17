import lzRequest from "../request";
import {IDataType} from "../type";
import {Iuser, IloginType} from "./type";

//获取验证码
export function getCode(email: string) {
  return lzRequest.post<IDataType>({
    url: `/user/code`,
    data: {
      email,
    },
    isLoading: false,
  });
}

//注册
export function register(userInfo: Iuser) {
  return lzRequest.post<IloginType>({
    url: `/user/register`,
    data: {
      name: userInfo.email,
      password: userInfo.password,
      code: userInfo.code,
    },
  });
}

//登录
export function login(userInfo: Iuser) {
  return lzRequest.post<IloginType>({
    url: `/user/login`,
    data: {
      name: userInfo.email,
      password: userInfo.password,
    },
  });
}

//获取公钥
export function getPublickey() {
  return lzRequest.get({
    url: "/pubkey",
  });
}

//获取用户信息
export function getUserInfo() {
  return lzRequest.get({
    url: "/user",
  });
}
