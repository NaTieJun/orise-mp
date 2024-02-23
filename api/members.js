import storage from "@/utils/storage";
import { http, Method } from "@/utils/request.js";

/**
 * 意见反馈
 */
export function feedback(data) {
  return http.request({
    url: "/mp/v1/feedback/feedback",
    method: Method.POST,
    needToken: true,
    data,
  });
}

/**
 * 获取意见反馈列表
 * @param params
 */
export function getFeedbackList(params) {
  return http.request({
    url: "/mp/v1/feedback/feedbackList",
    method: Method.GET,
    params,
  });
}

/**
 * 获取活动基本信息
 * @param id
 */
export function getFeedbackInfo(id) {
  return http.request({
    url: `/mp/v1/feedback/info/${id}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取用户信息
 */
export function fetchUserInfo() {
  return http.request({
    url: `/mp/v1/auth/info`,
    method: Method.GET,
    needToken: true,
  });
}
