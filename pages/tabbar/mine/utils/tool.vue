<template>
  <view>
    <view class="interact-tools" style="margin-bottom: 15px">
      <u-cell-group :border="false">

        <u-cell-item title="我的订单" @click="navigateTo('/pages/mine/order/myOrder')" :title-style="titleStyle">
          <u-image slot="icon" width="40rpx" height="40rpx" src="/static/mine/order.png"></u-image>
        </u-cell-item>
        <u-cell-item title="我的车辆" @click="navigateTo('/pages/mine/car/index')" :title-style="titleStyle">
          <u-image slot="icon" width="40rpx" height="40rpx" src="/static/mine/car.png"></u-image>
        </u-cell-item>
        <u-cell-item title="意见反馈" @click="navigateTo('/pages/mine/feedback/list')" :title-style="titleStyle">
          <u-image slot="icon" width="40rpx" height="40rpx" src="/static/mine/feedback.png"></u-image>
        </u-cell-item>
        <u-cell-item :title="`关于`" @click="navigateTo('/pages/mine/about/index')" :border-bottom="false" :title-style="titleStyle">
          <u-image slot="icon" width="40rpx" height="40rpx" src="/static/mine/about.png" ></u-image>
        </u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
import configs from "@/config/config";
import storage from "@/utils/storage";

export default {
  data() {
    return {
      configs,
      storage,
      hasEnterprise: false,
      cellClass: 'cell-class',
      titleStyle: {"margin-left": '20rpx'}
    }
  },
  mounted() {
    if (this.$options.filters.isLogin("auth")) {
      
    }
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },

    linkMsgDetail() {
      uni.navigateTo({
        url: `/pages/tabbar/home/web-view?IM=0`,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.interact-tools {
  background-color: #ffffff;
  border-left: none;
  border-right: none;
  margin-top: 40rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 1px 4px 2px rgba(118, 118, 118, 0.05);

  .interactBox {
    height: 156rpx;
  }

  .interact-container {
    margin: 0 20rpx;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);

    .interact-item-img {
      width: 52rpx !important;
      height: 52rpx !important;
      // margin-bottom:  !important;
      margin: 0 auto 6rpx auto !important;
    }

    image {
      width: 52rpx;
      height: 52rpx;
      margin-bottom: 6rpx;
    }

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;

    .interact-item {
      font-size: $font-sm;
      width: 25%;
      height: 160rpx;
      padding: 30rpx;
    }
  }
}

.cell-class{
  margin-right:20rpx;
}

/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  .interact-tools {
    background-color: #222336;
  }
}
</style>
