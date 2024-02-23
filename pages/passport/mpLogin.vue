<template>
  <view class="container">
    <u-modal v-model="phoneAuthPopup" :mask-close-able="true" :title="projectName + '商城'" :show-confirm-button="false">
      <div class="tips">为了更好地用户体验，需要您授权手机号</div>
      <button class="register" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">去授权</button>
    </u-modal>
    <view class="wx-auth-container">
      <div class="box">
        <view class="logo-info">
          <text class="title">欢迎进入{{ projectName }}</text>
        </view>
        <view class="small-tips">
          <view>请授权您的手机号来完成登录</view>
        </view>
        <view class="btns">
          <button class="btn-auth" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权手机号</button>
          <div @click="backToHome" class="btn-callback">暂不登录</div>
        </view>
      </div>
    </view>
    <u-top-tips ref="uTips" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
  </view>
</template>

<script>
import { mpUpdateUserProfile, mpBindPhone, mpLogin, alipayLogin, alipayBindPhone } from "@/api/connect.js";

import { whetherNavigate } from "@/utils/Foundation"; //登录跳转
import storage from "@/utils/storage.js";
import config from '@/config/config'
export default {
  data() {
    return {
      // 是否展示手机号码授权弹窗，默认第一步不展示，要先获取用户基础信息
      phoneAuthPopup: false,
      // 授权信息展示，商城名称
      projectName: config.name,
      //微信返回信息，用于揭秘信息，获取sessionkey
      code: "",
      //微信昵称
      nickName: "",
      //微信头像
      image: "",
      showTip: null,
      // 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      // 导航栏内容区域高度，不包括状态栏高度在内
      navbarHeight: 44
    };
  },
  async onLoad(options) {
    this.showTip = options.showTip
  },
  onReady() {
    this.showTip && this.$refs.uTips.show({ title: "请先登录", type: "success" });
  },
  //微信小程序进入页面，先获取code，否则几率出现code和后续交互数据不对应情况
  mounted() {
    
    // #ifdef MP-WEIXIN
    uni.showShareMenu({ withShareTicket: true });
    // #endif
  },
  methods: {
    /**
     * 小程序返回bug
     * 1.介于微信登录是在login.vue的基础上作为判断跳转来
     * 所以在页面栈中会自动记录回退路径，所以导致每次微信小程序点击回退就会自动返回login页面
     * 当然login页面的判断就是 没有登录就会跳转到微信小程序页面 导致了无法回退到之前页面
     * 2.解决方法： 尝试在回退的时候判断地址，让回退多一级这样就避免了
     */
    back() {
      whetherNavigate("wx");
    },
    backToHome() {
      uni.switchTab({
        url: `/pages/tabbar/station/stationList`,
      });
    },
    //获取手机号授权
    getPhoneNumber(e) {
      // #ifdef MP-WEIXIN
      this.getPhoneNumberWeiXin(e)
      // #endif
      // #ifndef MP-WEIXIN
      this.getPhoneNumberAlipay(e)
      // #endif
    },
    launchapp(e){
      console.log("launchapp: ", e)
    },
    //获取手机号授权
    getPhoneNumberWeiXin(e) {
      let that = this
      if (e.detail.code) {
        //获取code
        uni.login({
          success: (res) => {
            that.code = res.code;
            mpLogin({
              code: that.code,
            }, config.appid).then((res) => {
              if (res.data.code == 200) {
                storage.setAccessToken(res.data.data.token);
                storage.setUserInfo(res.data.data.userInfo);
              } else if(res.data.msg != null){
                this.$refs.uTips.show({ title: res.data.msg, type: "error" });
              }else {
                uni.showToast({
                  title: "登录失败，请重试",
                  duration: 2000,
                  icon: "error",
                });
                return
              }

              // 用户没有手机号时，请示手机号
              if (res.data.data.userInfo.mobile == "") {
                let iv = e.detail.iv;
                let encryptedData = e.detail.encryptedData;
                let code = e.detail.code;
                if (!e.detail.encryptedData) {
                  uni.showToast({
                    title: "请授予手机号码来完成登录",
                    icon: "error",
                  });
                  return;
                }
                mpBindPhone({
                  encryptedData,
                  iv,
                  code,
                }, config.appid).then((res) => {
                  storage.setAccessToken(res.data.data.token);
                  storage.setUserInfo(res.data.data.userInfo);
                  uni.showToast({
                    title: "登录成功",
                    duration: 2000,
                    icon: "success",
                  });
                  setTimeout(() => {
                    uni.navigateBack({
                      delta: 1,
                    });
                  }, 1000);
                });
              } else {
                uni.showToast({
                  title: "登录成功",
                  duration: 2000,
                  icon: "success",
                });
                setTimeout(() => {
                  uni.navigateBack({
                    delta: 1,
                  });
                }, 1000);
              }
            });
          },
        });
      } else {
        uni.showToast({
          title: "请授予手机号码来完成登录",
          icon: "error",
        });
        return;
      }
    },
    //获取手机号授权
    getPhoneNumberAlipay(e) {
      let that = this
      console.log(e);
      console.log(uni.getSystemInfoSync());
      if (e.detail.encryptedData) {
        //获取code
        uni.login({
          success: (res) => {
            that.code = res.code;
            alipayLogin({
              code: that.code,
              appid: config.appid
            }, config.appid).then((res) => {
              if (res.data.code == 200) {
                storage.setAccessToken(res.data.data.token);
                storage.setUserInfo(res.data.data.userInfo);
              } else if(res.data.msg != null){
                this.$refs.uTips.show({ title: res.data.msg, type: "error" });
              }else {
                uni.showToast({
                  title: "登录失败，请重试",
                  duration: 2000,
                  icon: "error",
                });
                return
              }

              // 用户没有手机号时，请示手机号
              if (res.data.data.userInfo.mobile == "") {
                let encryptedData = e.detail.encryptedData;
                let sign = e.detail.sign;
                if (!e.detail.encryptedData) {
                  uni.showToast({
                    title: "请授予手机号码来完成登录",
                    icon: "error",
                  });
                  return;
                }
                alipayBindPhone({
                  encryptedData,
                  sign,
                  appid: config.appid
                }).then((res) => {
                  storage.setAccessToken(res.data.data.token);
                  storage.setUserInfo(res.data.data.userInfo);
                  uni.showToast({
                    title: "登录成功",
                    duration: 2000,
                    icon: "success",
                  });
                  setTimeout(() => {
                    uni.navigateBack({
                      delta: 1,
                    });
                  }, 1000);
                });
              } else {
                uni.showToast({
                  title: "登录成功",
                  duration: 2000,
                  icon: "success",
                });
                setTimeout(() => {
                  uni.navigateBack({
                    delta: 1,
                  });
                }, 1000);
              }
            });
          },
        });
      } else {
        uni.showToast({
          title: "请授予手机号码来完成登录",
          icon: "error",
        });
        return;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/*微信授权*/
page {
  background-color: #ffffff;
}

.wx-auth-container {
  width: 100%;
  margin-top: 50%;
}

.logo-info {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  padding: 20rpx;

  flex-direction: column;
  font-weight: bold;
}

image {
  width: 100px;
  height: 100px;
  text-align: center;
  -webkit-transform: scale(2.5);
  transform: scale(2.5);
}

.logo-info-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: none;
}

text.title,
text.shop {
  display: inline-block;
  font-size: 60rpx;
  color: #333;
}

text.shop {
  display: inline-block;
  font-size: 55rpx;
  color: #333;
}

.box {
  margin: 0 32rpx;
}

/* 文字提示*/
.small-tips {
  width: 94%;
  padding: 20rpx;
  font-size: 32rpx;
  margin: 0 0 20rpx;
  color: #999;
}

.auth-button {
  padding: 10px 20px;
  width: calc(100% - 20 * 4rpx);
}

.tips {
  width: 80%;
  text-align: left;
  margin: 6% 10%;
  margin-top: 48rpx;
  line-height: 1.75;
}

.register {
  color: $weChat-color !important;
  border: none !important;
  background: #fff !important;
}

.btn-auth {
  width: 92%;
  margin: 0 auto 40rpx;
  border-radius: 100px;
}

.btn-callback {
  text-align: center;
  font-size: 30rpx;
  background: #ededed;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 100px;
  width: 92%;
  margin: 0 auto;
}

.btns {
  margin-top: 100rpx;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
}

@keyframes mymove {
  0% {
    transform: scale(1);
    /*开始为原始大小*/
  }

  25% {
    transform: scale(1.1);
    /*放大1.1倍*/
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.1);
  }
}
</style>
