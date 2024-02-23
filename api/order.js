/**
 * 订单相关API
 */

import { http, Method } from "@/utils/request.js";

/**
 * 获取订单列表
 * @param params
 */
export function getOrderList(params) {
  return http.request({
    url: "/mp/v1/charge/getChargeOrderList",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取订单详情
 * @param orderSn 订单编号
 */
export function getOrderDetail(orderSn) {
  return http.request({
    url: `/mp/v1/charge/getChargeOrderInfo`,
    method: Method.GET,
    needToken: true,
    params: { startChargeSeq: orderSn },
  });
}

/**
 * 启动充电
 * @param data 订单编号
 */
export function startCharge(data) {
  return http.request({
    url: `/mp/v1/charge/startCharge`,
    method: Method.POST,
    needToken: true,
    data,
  });
}

/**
 * 手动结束充电
 * @param data 订单编号
 */
export function stopCharge(data) {
  return http.request({
    url: `/mp/v1/charge/stopCharge`,
    method: Method.POST,
    needToken: true,
    data,
  });
}

/**
 * 充电订单推送通知
 * @param data 订单编号
 */
export function setOrderNofity(data) {
  return http.request({
    url: `/mp/v1/push/msg/orderChargeTaskOnceMsg`,
    method: Method.POST,
    needToken: true,
    data,
  });
}
