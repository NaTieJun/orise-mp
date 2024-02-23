/**
 * 信任登录相关API
 */

import { http, Method } from "@/utils/request.js";
import api from "../config/api";
const request = http.request;

/**
 * web 第三方登录
 * @param {Object} code
 */
export function webConnect(code) {
  return http.request({
    url: `passport/connect/connect/login/web/${code}`,
    method: Method.GET,
    needToken: true,
    header: {
      clientType: "H5",
    },
  });
}
export function openIdLogin(params, clientType) {
  return http.request({
    url: `passport/connect/connect/app/login`,
    method: Method.GET,
    needToken: true,
    data: params,
    header: {
      clientType: clientType,
    },
  });
}

/**
 * 第三方登录成功 回调接口
 */
export function loginCallback(state) {
  return http.request({
    url: `passport/connect/connect/result?state=${state}`,
    method: Method.GET,
    needToken: false,
  });
}

/**
 * 小程序拿unionId
 * @param params
 */
export function mpLogin(data, appid) {
  return http.request({
    url: `/mp/v1/auth/login/${appid}`,
    method: Method.POST,
    // header: { "content-type": "application/json;charset=utf-8" },
    data,
  });
}

/**
 * 支付宝小程序拿unionId
 * @param params
 */
export function alipayLogin(data, appid) {
  return http.request({
    url: `/mp/v1/auth/ali/login`,
    method: Method.POST,
    // header: { "content-type": "application/json;charset=utf-8" },
    data,
  });
}

/**
 * 小程序绑定手机号
 * @param params
 */
export function mpBindPhone(data, appid) {
  return http.request({
    url: `/mp/v1/auth/phone/${appid}`,
    method: Method.POST,
    data,
  });
}

/**
 * 小程序绑定手机号
 * @param params
 */
export function alipayBindPhone(data, appid) {
  return http.request({
    url: `/mp/v1/auth/ali/phone`,
    method: Method.POST,
    data,
  });
}

/**
 * 更新用户信息
 * @param params
 */
export function mpUpdateUserProfile(data) {
  return http.request({
    url: `/mp/v1/auth/update`,
    method: Method.POST,
    data,
  });
}
