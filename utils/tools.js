import configs from "@/config/config";
import Foundation from "@/utils/Foundation.js";

const getNetworkType = () => {
  uni.getNetworkType({
    success: (res) => {
      if (res.networkType === "none") {
        uni.showToast({
          title: "网络好像有点问题,请检查后重试！",
          duration: 2000,
          icon: "none",
        });
        let pages = getCurrentPages();
        if (pages.length) {
          let route = pages[pages.length - 1].route;
          if (route !== "pages/empty/empty") {
            uni.navigateTo({
              url: `/pages/empty/empty?type=wifi`,
            });
          }
        } else {
          uni.navigateTo({
            url: `/pages/empty/empty?type=wifi`,
          });
        }
      }
    },
  });
};

const throttle = (fn, that, gapTime) => {
  // export function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1800;
  }
  let _lastTime = that.lastTime;
  let _nowTime = +new Date();
  if (_nowTime - _lastTime > gapTime || !_lastTime) {
    fn.apply(that, arguments); //将this和参数传给原函数
    that.lastTime = _nowTime;
  }
};

/**
 * 计算传秒数的倒计时【天、时、分、秒】
 * @param seconds
 * @returns {{day : *, hours : *, minutes : *, seconds : *}}
 */
const countTimeDown = (seconds) => {
  const leftTime = (time) => {
    if (time < 10) time = "0" + time;
    return time + "";
  };
  return {
    day: leftTime(parseInt(seconds / 60 / 60 / 24, 10)),
    hours: leftTime(parseInt((seconds / 60 / 60) % 24, 10)),
    minutes: leftTime(parseInt((seconds / 60) % 60, 10)),
    seconds: leftTime(parseInt(seconds % 60, 10)),
  };
};

/**
 * 计算当前时间到第二天0点的倒计时[秒]
 * @returns {number}
 */
const theNextDayTime = () => {
  const nowDate = new Date();
  const time =
    new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate() + 1,
      0,
      0,
      0
    ).getTime() - nowDate.getTime();
  return parseInt(time / 1000);
};

const mpScan = () => {
  uni.scanCode({
    success: function (res) {
      let path = encodeURIComponent(res.result);

      // WX_CODE 为小程序码
      if (res.scanType == "WX_CODE") {
        uni.navigateTo({
          url: `/${res.path}`,
        });
      }
      // QR_CODE 为字符串
      else if (res.scanType == "QR_CODE" || res.scanType == "QR") {
        // 如果匹配qrLink，说明是枪编号，直接跳转到枪详情
        if (
          res.result != undefined
        ) {
          let connectorNum = Foundation.urlParse(res.result).n;
          uni.navigateTo({
            url: `/pages/station/charge/charging?id=${connectorNum}`,
          });
        } else {
          uni.navigateTo({
            url: `${res.result}`,
          });
        }
      }
    },
  });
};

const serviceCall = (tel) => {
  uni.makePhoneCall({
    phoneNumber: tel
  })
};

export { getNetworkType, throttle, countTimeDown, theNextDayTime, mpScan, serviceCall };
