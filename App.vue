<script>
/**
 * vuex管理登录状态，具体可以参考官方登录模板示例
 */
import {
  mapMutations
} from "vuex";
import config from "@/config/config";
import storage from "@/utils/storage";
import { mpLogin, alipayLogin } from "@/api/connect.js";
import Foundation from "@/utils/Foundation.js";



/**
 * 路由监听并删除路由
 * https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
 * */
// #ifdef MP-WEIXIN
wx.onAppRoute((res) => {
  const pages = getCurrentPages();
  if (pages.length > 3) {
    delete getCurrentPages()[2]
  }
})
// #endif

export default {
  data() {
    return {
      config,
    };
  },


  /**
   * 监听返回
   */
  onBackPress(e) {
    if (e.from == "backbutton") {
      let routes = getCurrentPages();
      routes.forEach((item) => {
        if (
          item.route.indexOf("pages/station/index") != -1
        ) {
          uni.redirectTo({
            url: item.route,
          });
        }
      });

      uni.navigateBack();
      return true; //阻止默认返回行为
    }
  },
  methods: {
    ...mapMutations(["login"]),
  },
  onLaunch: function (options) {
    // #ifdef APP-PLUS
    this.checkArguments(); // 检测启动参数

    // 重点是以下： 一定要监听后台恢复 ！一定要
    plus.globalEvent.addEventListener("newintent", (e) => {
      this.checkArguments(); // 检测启动参数
    });
    // #endif

    // #ifdef MP-WEIXIN
    this.applyUpdateWeChat();
    this.autoMpLogin()
    // #endif

    // #ifdef MP-ALIPAY
    // this.autoMpLogin()
    // #endif

    // #ifdef MP-ALIPAY
    //存储支付宝扫码参数
    if(options.query && options.query.qrCode){
      const qrCode = options.query.qrCode
      let connectId = Foundation.urlParse(decodeURIComponent(qrCode)).n
      this.globalData.connectId = connectId
    }
    // #endif
  },

  onShow() {
  },
  methods: {
    /**
     * 微信小程序版本提交更新版本 解决缓存问题
     */
    applyUpdateWeChat() {
      const updateManager = uni.getUpdateManager();

      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
      });

      updateManager.onUpdateReady(function (res) {
        uni.showModal({
          title: "更新提示",
          content: "发现新版本，是否重启应用？",
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });
      updateManager.onUpdateFailed(function (res) {
        // 新的版本下载失败
      });
    },

    //  TODO 开屏广告 后续优化添加
    launch() {
      try {
        // 获取本地存储中launchFlag标识 开屏广告
        const value = uni.getStorageSync("launchFlag");
        if (!value) {
          // this.$u.route("/pages/index/agreement");
        } else {
          //app启动时打开启动广告页
          var w = plus.webview.open(
            "/hybrid/html/advertise/advertise.html",
            "本地地址", {
            top: 0,
            bottom: 0,
            zindex: 999,
          },
            "fade-in",
            500
          );
          //设置定时器，4s后关闭启动广告页
          setTimeout(function () {
            plus.webview.close(w);
          }, 3000);
        }
      } catch (e) {
        // error
        uni.setStorage({
          key: "launchFlag",
          data: true,
          success: function () {
            console.log("error时存储launchFlag");
          },
        });
      }
    },

    /**
     * h5中打开app获取跳转app的链接并跳转
     */
    checkArguments() {
      // #ifdef APP-PLUS
      setTimeout(() => {
        const args = plus.runtime.arguments;
        if (args) {
          const argsStr = decodeURIComponent(args);
          const path = argsStr.split("//")[1];
          if (path.indexOf("tabbar") != -1) {
            uni.switchTab({
              url: `/${path}`,
            });
          } else {
            uni.navigateTo({
              url: `/${path}`,
            });
          }
        }
      });
      // #endif
    },

    /**
     * 自动登录
     */
    autoMpLogin() {
      // !this.$options.filters.isLogin("auth") && 
      uni.login({
        success: (res) => {
          let loginMethod = mpLogin
          // #ifdef MP-ALIPAY
          loginMethod = alipayLogin
          // #endif
          loginMethod({
            code: res.code,
          }, config.appid).then((res) => {
            if (res.data.code == 200) {
              storage.setAccessToken(res.data.data.token);
              storage.setUserInfo(res.data.data.userInfo);
            } else {
              storage.setAccessToken("");
              storage.setRefreshToken("");
              storage.setUserInfo({});
              uni.showToast({
                title: "账户异常",
                duration: 2000,
                icon: "error",
              });
            }
          });
        },
      });
    }
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";

// -------适配底部安全区  苹果x系列刘海屏


.mp-iphonex-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
  // height: auto !important;
  padding-top: 10rpx;
}


page {
  height: 100%;
  background-color: $bg-color;
}

/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  page {
    background-color: $bg-color-dark;
    color: #fff;
  }
}

/************************ */
.w200 {
  width: 200rpx !important;
}

.flex1 {
  flex: 1; //必须父级设置flex
}
</style>
