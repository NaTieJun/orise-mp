<template>
  <div class="wrapper">
    <view class="top-bg">
      <!--  #ifndef  MP-ALIPAY -->
      <u-navbar :border-bottom="false" title="订单详情" back-icon-color="#fff" title-color="#fff" :background="{ background: 'tranparent' }"></u-navbar>
      <!--  #endif -->
      <view class="layer-icon">
        <image style="width: 90rpx; height: 85rpx;vertical-align: top;margin-right:20rpx;" src="/static/order/order-complete.png" mode="scaleToFill" />
        <view class="tip">
          <view v-if="info.startChargeSeqStat == 4">已完成</view>
          <view class="sub" v-if="info.billInfo.occupyPrice>0 && info.billInfo.occupyFlag==1">请尽快拔枪驶离</view>
          <view class="sub" v-if="info.billInfo.occupyPrice==0 && info.billInfo.occupyFlag==1">您还未拔枪</view>
        </view>
      </view>
    </view>
    <view class="layer-top">
      <image style="width: 32rpx; height: 32rpx;vertical-align: top;margin-right:10rpx;" src="/static/order/station.png" mode="scaleToFill" />
      {{ info.stationName }}
    </view>
    <view class="layer-divider"></view>

    <!-- 基本信息 -->
    <view class="card-box layer-middle">
      <view class="card-row">
        <view class="lable">充电枪编号</view>
        <view class="content">{{ info.connectorId }}</view>
      </view>
      <view class="card-row">
        <view class="lable">充电电量</view>
        <view class="content">{{ info.totalPower }}度</view>
      </view>
      <view class="card-row">
        <view class="lable">充电时长</view>
        <view class="content">{{ parseInt(info.chargeDur / 1000 / 60) }}分{{ parseInt(info.chargeDur / 1000) % 60 }}秒</view>
      </view>
      <view class="card-row">
        <view class="lable">启动时间</view>
        <view class="content">{{ info.startTime }}</view>
      </view>
      <view class="card-row">
        <view class="lable">停止时间</view>
        <view class="content">{{ info.endTime }}</view>
      </view>
      <view class="divider"></view>
      <view class="card-row">
        <view class="lable">订单编号</view>
        <view class="content">{{ info.startChargeSeq }}</view>
      </view>
      <view class="card-row">
        <view class="lable">创建时间</view>
        <view class="content">{{ info.createTime }}</view>
      </view>
      <view class="card-row">
        <view class="lable">支付时间</view>
        <view class="content">{{ info.payInfo.payTime }}</view>
      </view>
    </view>
    <view class="layer-divider"></view>
    <!-- 基本信息 -->
    <view class="card-box pay layer-middle" v-if="info.payState == 1">
      <view class="card-row">
        <view class="lable">充电费</view>
        <view class="content">￥{{ info.totalElecMoney | unitPrice }}</view>
      </view>
      <view class="card-row">
        <view class="lable">服务费</view>
        <view class="content">￥{{ info.totalServiceMoney | unitPrice }}</view>
      </view>
      <view class="card-row">
        <view class="lable">订单总额</view>
        <view class="content">￥{{ info.totalMoney | unitPrice }}</view>
      </view>
      <view class="card-row">
        <view class="lable"></view>
        <view class="content">
          实际支付
          <text class="actual-pay">￥{{ info.realPayMoney | unitPrice }}</text>
        </view>
      </view>
    </view>
    <view class="layer-bottom"></view>
    <view style="height:60rpx;"></view>
  </div>
</template>

<script>
import { getOrderDetail } from "@/api/order";
export default {
  data() {
    return {
      keyword: "",
      params: {
        id: ""
      },
      info: [], //订单数据
    };
  },
  onLoad(options) {
    this.params.id = options.id;
    this.init();
  },
  onShow() {
    this.$nextTick(() => {
      this.$refs.carRef && this.$refs.carRef.reload();
    })
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },
    async init() {
      let res = await getOrderDetail(this.params.id);
      if (res.data.code == 200) {
        this.info = res.data.data;
      }
    },
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
.wrapper {
}

.top-bg {
  background-image: linear-gradient(230deg, #00a5ff 7%, #0089c9 100%);
  // background-size: 100% 400rpx;
  background-repeat: no-repeat;
  height: 400rpx;
  /*  #ifdef  MP-ALIPAY  */
  height: 450rpx;
  margin-top: -50rpx;
  padding-top: 200rpx;
  /*  #endif  */
}

.layer-icon {
  width: 100%;
  height: 100rpx;
  margin-top: 50rpx;
  margin-bottom: 20rpx;
  text-align: left;
  font-size: 32rpx;
  line-height: 100rpx;
  font-weight: 500;
  color: #fff;
  display: flex;
  justify-content: center;
  .tip {
    // display: flex;
    // flex-wrap: wrap;
    line-height: 1;
    align-self: center;
    max-width: 590rpx;
    .sub {
      font-size: 24rpx;
      margin-top: 10rpx;
    }
  }
}

.layer-top {
  background: transparent url("@/static/order/order-t.png") no-repeat;
  background-size: 100%;
  height: 100rpx;
  line-height: 35rpx;
  text-align: left;
  padding: 0px 80rpx;
  padding-top: 50rpx;
  margin-top: -50rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.layer-divider {
  background: transparent url("@/static/order/order-m.png") no-repeat;
  background-size: 100%;
  width: 100%;
  height: 30rpx;
}

.layer-middle {
  background: transparent url("@/static/order/order-bg.png") repeat-y;
  background-size: 100%;
  padding: 0px 80rpx;
}

.layer-bottom {
  background: transparent url("@/static/order/order-b.png") no-repeat;
  background-size: 100%;
  width: 100%;
  height: 64rpx;
}

.card-row {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  line-height: 40rpx;
  padding: 10rpx 0;

  .lable {
    width: 150rpx;
    color: #bdbfc0;
  }

  .content {
    flex: 1;
    text-align: left;
  }
  .orange {
    color: #ff9920;
  }
}

.card-box.pay .content {
  text-align: right;
}

.actual-pay {
  font-size: 32rpx;
  margin-left: 10rpx;
}

/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  .layer-top {
    background: transparent url("@/static/order/order-t-dark.png") no-repeat;
    background-size: 100%;
  }

  .layer-divider {
    background: transparent url("@/static/order/order-m-dark.png") no-repeat;
    background-size: 100%;
  }

  .layer-middle {
    background: transparent url("@/static/order/order-bg-dark.png") repeat-y;
    background-size: 100%;
  }

  .layer-bottom {
    background: transparent url("@/static/order/order-b-dark.png") no-repeat;
    background-size: 100%;
  }
}
</style>