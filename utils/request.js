import Request from "@/lib/request/index.js";
import { refreshTokenFn } from "@/api/login.js";
import storage from "@/utils/storage.js";
import { md5 } from "@/utils/md5.js";
import Foundation from "@/utils/Foundation.js";
import api from "@/config/api.js";
import uuid from "@/utils/uuid.modified.js";

let isNavigateTo = false;

const urlMap = {};
//同一个接口，最短请求间隔
const minDuration = 300;
const tooManyRequest = 'TooManyRequest';
const ignoreMessages = ['/mp/v1/push/msg/orderChargeTaskOnceMsg'];

function cleanStorage() {
  uni.showToast({
    title: "你的登录状态已过期，请重新登录",
    icon: "none",
    duration: 1500,
  });
  if (uni.showLoading()) {
    uni.hideLoading();
  }

  storage.setHasLogin(false);
  storage.setAccessToken("");
  storage.setRefreshToken("");
  console.log("清空token");
  storage.setUuid("");
  storage.setUserInfo({});

  if (!isNavigateTo) {
    isNavigateTo = true;
    // 防抖处理跳转
    // #ifdef MP-WEIXIN || MP-ALIPAY
    uni.navigateTo({
      url: "/pages/passport/mpLogin",
    });
    // #endif
    // #ifndef MP-WEIXIN || MP-ALIPAY
    uni.navigateTo({
      url: "/pages/passport/login",
    });
    //  #endif
  }
}

let http = new Request();

http.setConfig((config) => {
  // 没有uuid创建
  if (!storage.getUuid()) {
    storage.setUuid(uuid.v1());
  }

  /* 设置全局配置 */
  config.baseURL = api.common;
  // config.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX3R5cGUiOiIwMCIsInVzZXJfaWQiOjEsImxvZ2luX3R5cGUiOiJMaW5rV2VDaGF0QVBJIiwidXNlcl9uYW1lIjoiYWRtaW4iLCJ1c2VyX2tleSI6IjU3N2Y5ODhmLWEyNDEtNDU1Yy1iYTMwLTU3MDU3YTdlNmQxOSIsImNvcnBfbmFtZSI6IuaCoOeggeenkeaKgCIsImNvcnBfaWQiOiJ3dzEwYjk2NTQwYmUwNjc4ZDYifQ.IurVYb-vOf0Qufw1gH2Fvlrh1UpB394beLfSawJRYVRTbGadQUr6qpHh_872XQJF-eQ8Mv8Li5MnhIrfUFjQww'

  config.validateStatus = (statusCode) => {
    // 不论什么状态,统一在正确中处理
    return true;
  };
  return config;
});

http.interceptors.request.use(
  (config) => {
    /* 请求之前拦截器。可以使用async await 做异步操作 */
    //对post和delete做限制，对同一个请求，请求间隔小于minDuration，做拦截
    if(['DELETE', 'POST'].includes(config.method) && ignoreMessages.indexOf(config.url) == -1){
      let now = Date.now()
      if(urlMap[config.url]){
        let last = urlMap[config.url];
        if((now - last) < minDuration){
          console.log('request limit: ', config.url)
          config.baseURL = tooManyRequest
          config.url = ''
          return config;
        }
      }
      urlMap[config.url] = now;
    }
    const noncecode = Foundation.randomString(8);
    const tm = parseInt(new Date().getTime() / 1000);
    const appkey = "dbkUZnQjnIsUW0n7";
    const app_secret = "k1E4e6ssJhk5ZIUkD1yn65NEX8ZwFCTF";
    // const sign = md5(noncecode + timestamp + accessToken);
    const sign = md5(
      `appkey=${appkey}&noncecode=${noncecode}&tm=${tm}${app_secret}`
    ).toUpperCase();
    const _params = {
      noncecode,
      tm,
      sign,
      appkey,
    };
    let params = config.params || {};
    params = {
      ...params,
      ..._params,
    };
    config.params = params;

    let accessToken = storage.getAccessToken();
    if (accessToken) {
      config.header.token = accessToken;
    }
    config.header = {
      ...config.header,
      uuid: storage.getUuid() || uuid.v1(),
    };
    return config;
  },
  (config) => {
    return Promise.reject(config);
  }
);

// 是否正在刷新的标记
let isRefreshing = false;
//重试队列
let requests = [];
// 必须使用异步函数，注意
http.interceptors.response.use(
  async (response) => {
    isNavigateTo = false;
    /* 请求之后拦截器。可以使用async await 做异步操作  */
    // token存在并且token过期
    // if (isRefreshing && response.statusCode === 403) {
    //   cleanStorage();
    //   isRefreshing = false;
    // }

    let token = storage.getAccessToken();
    if (
      (token && response.statusCode === 403) ||
      response.data.status === 403
    ) {
      if (!isRefreshing) {
        console.log("旧token", token);
        isRefreshing = true;
        storage.setAccessToken("");
        let oldRefreshToken = storage.getRefreshToken();
        //调用刷新token的接口
        return refreshTokenFn(oldRefreshToken)
          .then((res) => {
            let { accessToken, refreshToken } = res.data.result;
            storage.setAccessToken(accessToken);
            storage.setRefreshToken(refreshToken);

            response.header.accessToken = `${accessToken}`;
            // token 刷新后将数组的方法重新执行
            console.log("接口队列", requests, "新token", accessToken);
            requests.forEach((cb) => cb(accessToken));
            requests = []; // 重新请求完清空
            return http.request(response.config);
          })
          .catch((err) => {
            console.log("刷新token报错" + oldRefreshToken, err);
            cleanStorage();
            return Promise.reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // 返回未执行 resolve 的 Promise
        return new Promise((resolve) => {
          // 用函数形式将 resolve 存入，等待刷新后再执行
          requests.push((token) => {
            response.header.accessToken = `${token}`;
            resolve(http.request(response.config));
          });
        });
      }

      // 如果当前返回没登录
    } else if (
      (!token && !storage.getRefreshToken() && response.statusCode === 403) ||
      response.data.code === 403
    ) {
      console.log(
        "没有token 以及刷新token 内容",
        token,
        storage.getRefreshToken()
      );
      cleanStorage();

      // 如果当前状态码为正常但是success为不正常时
    } else if (
      (response.statusCode == 200 &&
        response.data.code != 200 &&
        response.data.status != 0) ||
      response.statusCode == 400
    ) {
      if (response.data.message) {
        uni.showToast({
          title: response.data.message,
          icon: "none",
          duration: 1500,
        });
      }
    }
    return response;
  },
  (error) => {
    if(error.config.baseURL == tooManyRequest){
      uni.showToast({
        title: "不要点得太快哟",
        icon: "none",
        duration: 1500,
      });
    }
    return error;
  }
);

export { http };

export const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};
