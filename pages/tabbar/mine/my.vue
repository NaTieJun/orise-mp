<template>
  <view class="wrapper">
    <view class="status_bar">
    </view>
    <view class="header" @click="userDetail">
      <view class="head-1">
        <image :src="avatarUrl || '/static/missing-face.png'" />
      </view>
      <view class="head-2" v-if="userInfo.uid">
        <view class="user-name">{{ userInfo.nickName }}</view>
      </view>
      <view class="head-2" v-else>
        <view class="user-name">点击登录</view>
      </view>
      <view style="display: flex;align-items: flex-start;">
        <u-icon  name="arrow-right"></u-icon>
      </view>
    </view>

    <tool />

    <view style="height:40rpx;text-align:center;padding-top:4rpx;"></view>

  </view>
</template>
<script>
import tool from "@/pages/tabbar/mine/utils/tool.vue";
import { fetchUserInfo } from "@/api/members.js";
import storage from "@/utils/storage";
export default {
  components: {
    tool,
  },
  data() {
    return {
      coverTransform: "translateY(0px)",
      coverTransition: "0s",
      moving: false,
      userInfo: {},
      avatarUrl: null,
    };
  },
  onLoad() { },
  onShow() {
    if (this.$options.filters.isLogin("auth")) {
      this.getUserOrderNum();
    } else {
      this.$options.filters.navigateToLogin("navigateTo", true);
    }
  },
  onPullDownRefresh() {
    this.getUserOrderNum();
    this.userInfo = this.$options.filters.isLogin();
    this.reloadAvatar(this.userInfo.avatarUrl, true);
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.navigateTo("/pages/mine/set/setUp");
    }
  },
  // #endif

  mounted() {
    console.log(this.userInfo);
  },
  methods: {
    /**
     * 统一跳转接口,拦截未登录路由
     * navigator标签现在默认没有转场动画，所以用view
     */
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },
    userDetail() {
      this.userInfo.uid
        ? this.navigateTo("/pages/mine/profile/index")
        : this.$options.filters.navigateToLogin();
    },
    async getUserOrderNum() {
      uni.stopPullDownRefresh();

      if (this.$options.filters.isLogin("auth")) {
        fetchUserInfo().then((res) => {
          if (res.data.code == 200) {
            storage.setUserInfo(res.data.data.userInfo);
            this.userInfo = this.$options.filters.isLogin();
            this.reloadAvatar(this.userInfo.avatarUrl);
          }
        });
      }
    },
    reloadAvatar(avatarUrl, isForce) {
      if (isForce) {
        this.avatarUrl = avatarUrl;
        return;
      }

      let localUrl = this.avatarUrl;
      let toUpdateUrl = avatarUrl;
      if (localUrl != null) {
        localUrl = localUrl.split('?')[0];
      }
      if (toUpdateUrl != null) {
        toUpdateUrl = toUpdateUrl.split('?')[0];
      }
      if (localUrl != toUpdateUrl) {
        this.avatarUrl = avatarUrl;
      }
    }
  },
};
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  page {
    background-color: #121425;
  }
}
</style>
<style lang="scss" scoped>
html,
body {
  overflow: auto;
}

.wrapper {
  padding: 0 30rpx;
  // height: 100%;
  // background-color: #f7f7f7;
  .header {
    max-width: 100%;
    padding: calc(50rpx + var(--status-bar-height)) 0 0;
    height: calc(var(--status-bar-height) + 300rpx);
    background-position: bottom;
    background-repeat: no-repeat;
    display: flex;
    justify-content: space-between;

    .head-1 {
      text-align: center;
      width: 152rpx;
      position: relative;
      display: flex;
      align-items: center;

      image {
        width: 152rpx;
        height: 144rpx;
        border-radius: 50%;
        // margin-bottom: 30rpx;
        border: 3px solid #fff;
      }

      .edti-head {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        top: 100rpx;
        right: 0;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .head-2 {
      flex: 1;
      margin-left: 30rpx;
      margin-top: 100rpx;
      line-height: 1;
    }

    /deep/ .u-icon,
    .u-icon {
      margin-top: 106rpx;
    }
  }
}

/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  .wrapper {
    .pointBox {
      background-color: #222336;
    }
  }
}

.user-name {
  font-size: 34rpx;
}
</style>
