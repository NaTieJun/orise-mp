/**
 * 公共API
 */
import { http, Method } from "@/utils/request.js";
import api from "@/config/api.js";
import config from "@/config/config";

/**
 * 逆地址解析
 * @param location
 */
export function wxGeocoder(location) {
  return http.request({
    url: `https://apis.map.qq.com/ws/geocoder/v1/?key=${config.wxMapSubKey}&location=${location}`,
    method: Method.GET,
    message: false,
  });
}

/**
 * 获取地区数据
 * @param id
 */
export function getRegionsById(id = 0) {
  return http.request({
    url: `${api.common}/common/region/item/${id}`,
    method: Method.GET,
    message: false,
  });
}

// 获取IM接口前缀
export function getIMDetail() {
  return http.request({
    url: `${api.common}/IM`,
    method: Method.GET,
    message: false,
  });
}

/**
 * url encode
 * @param {String} url
 * @param {Object} params
 */
export function encodeURL(url, params) {
  const arr = [];
  Object.entries(params).forEach((param) => {
    if (param[1]) {
      arr.push(`${param[0]}=${encodeURIComponent(param[1])}`);
    }
  });
  const result = url + "?" + arr.join("&");
  return result;
}

/**
 * 文件上传地址
 * @type {string}
 */
export const upload = api.common + "/mp/v1/file/upload";
