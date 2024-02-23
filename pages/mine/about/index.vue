
<template>
  <view class="edition-intro">
    <image :src="theme=='light'?'/static/logo.png':'/static/logo-dark.png'" class="logo" />
    <!-- <h1> {{config.name}}</h1> -->
    <view class="version">
      <!-- #ifdef APP-PLUS -->
      Version {{localVersion.version}}
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      {{localVersion.version}}
      <!-- {{ localVersion.envVersion}} -->
      <!--  #endif -->
    </view>

    <!-- {{localVersion}} -->

    <view class="intro">
      <!-- <view>{{config.customerServiceMobile ? `客服热线：${config.customerServiceMobile}` : ``}}</view> -->
      <view style="margin:20rpx 0 0 0;">{{config.customerServiceEmail ? `客服邮箱：${config.customerServiceEmail}` : ``}}</view>

      <!-- <view style="margin:20rpx 0; color:#003a8c;" @click="navigateTo('/pages/mine/help/tips?type=user')">《{{config.name}}用户协议》</view> -->
      <view>CopyRight ©{{config.name}}</view>
    </view>
  </view>
</template>

<script>
import config from "@/config/config";
import { getAppVersion } from "@/api/message.js";
export default {
  data() {
    return {
      config,
      IosWhether: false, //是否是ios
      editionHistory: [], //版本历史
      versionData: {}, //版本信息
      localVersion: "", //当前版本信息
      params: {
        pageNum: 1,
        pageSize: 5,
      },
      theme: ""
    };
  },
  onLoad() {
    // #ifdef APP-PLUS
    const platform = uni.getSystemInfoSync().platform;
    /**
     * 获取是否是安卓
     */
    if (platform === "android") {
      this.params.type = 0;
    } else {
      this.IosWhether = true;
      this.params.type = 1;
    }
    this.getVersion(platform);

    plus.runtime.getProperty(plus.runtime.appid, (inf) => {
      this.localVersion = {
        versionCode: inf.version.replace(/\./g, ""),
        version: inf.version,
      };
    });
    // #endif


    // #ifdef MP-WEIXIN
    const accountInfo = wx.getAccountInfoSync();
    console.log("===========accountInfo==============");
    console.log(accountInfo);
    this.version_number = accountInfo.miniProgram.version // 小程序 版本号
    this.localVersion = {
      versionCode: accountInfo.miniProgram.version.replace(/\./g, ""),
      version: accountInfo.miniProgram.version,// 小程序 版本号,
      envVersion: accountInfo.miniProgram.envVersion, //判断小程序是开发版本还是release版本
    };
    // #endif
  },
  onReady() {
    // 检查深浅模式，确定地图样式
    let _this = this
    uni.getSystemInfo({
      success: function (res) {
        _this.theme = res.hostTheme || 'light'
        console.log(_this.theme);
      }
    });
  },
  methods: {
    async getVersion(platform) {
      let type;
      platform == "android" ? (type = "ANDROID") : (type = "IOS");

      let res = await getAppVersion(type);
      if (res.data.success) {
        this.versionData = res.data.result;
      }
    },

    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// page {
//   background: #fff !important;
// }
.cell {
  width: 90%;
  margin: 0 auto;
}
.edition-intro {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > h1 {
    margin: 20rpx 0 20rpx 0;
    letter-spacing: 2rpx;
  }
  > .version {
    font-size: 30rpx;
    margin-bottom: 100rpx;
  }
}
.intro {
  margin-top: 100rpx;
  font-size: 24rpx;
  letter-spacing: 2rpx;
  text-align: center;
}
.logo {
  width: 288rpx;
  height: 288rpx;
  margin-bottom: 32rpx;
}
</style>
