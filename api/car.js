/**
 * 车辆相关API
 */

import { http, Method } from "@/utils/request.js";

/**
 * 添加车辆
 * @param data
 */
export function addCar(data) {
  return http.request({
    url: `/mp/v1/car/insert`,
    method: Method.POST,
    needToken: true,
    data,
  });
}

/**
 * 删除
 * @param params
 */
export function deleteCar(carId) {
  return http.request({
    url: `/mp/v1/car/del/${carId}`,
    method: Method.PUT,
    needToken: true,
  });
}

/**
 * 获取用户车辆列表
 * @param params
 */
export function getCarList(params) {
  return http.request({
    url: "/mp/v1/car/list",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取车辆详情
 * @param params
 */
export function getCar(carId) {
  return http.request({
    url: `/mp/v1/car/info/${carId}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 修改车辆
 * @param data
 */
export function updateCar(data) {
  return http.request({
    url: `/mp/v1/car/upcar`,
    method: Method.POST,
    needToken: true,
    data,
  });
}

