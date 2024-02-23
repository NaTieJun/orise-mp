<template>
  <div class="wrapper">
    <view v-for="(order, oIndex) in list" :key="oIndex" class="orderCard" @click="handleClick(order)">
      <view class="bottom address">
        <text class="left">订单编号 {{ order.startChargeSeq }}</text>
        <text class="right">{{ order.statusText}}</text>
      </view>
      <view class="divider"></view>
      <view class="title">{{ order.stationName }}</view>
      <view class="address">充电方式：扫码充电</view>
      <view class="address">
        下单时间：{{
        order.startTm
        }}
      </view>
      <view class="bottom">
        <view class="left price">
          <text class="unit">￥</text>
          <text>{{ order.realMoney | unitPrice }}</text>
        </view>
      </view>
    </view>
    <u-empty style="margin-top:20%;" text="还没有订单" v-if="list.length == 0"></u-empty>
    <uni-load-more :status="loadStatus"></uni-load-more>
  </div>
</template>

<script>
import { getOrderList } from "@/api/order";
export default {
  data() {
    return {
      keyword: "",
      params: {
        pageNum: 1,
        pageSize: 10,
        isOnlyCharing: 0,
      },
      list: [], // 订单列表
      statusOptions: {
        1: '启动中',
        2: '充电中',
        3: '停止中',
        4: '已完成',
        5: '未知',
        8: '异常订单',
        20: '已完成',
      },
      loadStatus: 'more',
      total: 10
    };
  },
  onReachBottom() {
    if(this.list.length < this.total){
      this.params.pageNum++;
      this.init();
    }
  },
  onPullDownRefresh() {
    this.params.pageNum = 1
    this.list = []
    this.init();
  },
  mounted() {
    this.init();
  },
  methods: {
    handleClick(item) {
      if (item.status >= 4) {
        uni.navigateTo({
          url: `/pages/mine/order/detail?id=${item.startChargeSeq}`
        });
      }
      else {
        uni.navigateTo({
          url: `/pages/station/charge/charging?id=${item.connectorId}`
        })
      }
    },
    search() {
      this.list = [];
      this.init();
    },
    async init() {
      uni.stopPullDownRefresh()
      let res = await getOrderList(this.params);
      if (res.data.code == 200) {
        let data = res.data.rows;
        this.total = res.data.total
        data.forEach(item => {
          item.statusText = this.statusOptions[item.status]
        });
        this.list.push(...data);
        if(this.list.length >= res.data.total){
          this.loadStatus = 'noMore'
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 0 30rpx 30rpx;
}

.orderCard {
  background: url(/static/order/order-list-bg.png) right 20rpx bottom no-repeat;
  background-size: auto 50%;
  border-radius: 20rpx;
  box-shadow: 0px 0px 2px 1px #b7b7b740;
  margin: 30rpx 0;
  padding: 20rpx;
  text-align: left;
  line-height: 1.5;

  .title {
    font-size: 28rpx;
    font-weight: 500;
    margin-bottom: 20rpx;
    position: relative;

    &::before {
      background-color: #0974C5;
      content: "";
      position: absolute;
      border-radius: 3rpx;
      left: -20rpx;
      top: 46%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 3px;
      height: 15px;
    }
  }

  .address {
    font-size: 24rpx;
    color: #707070;
    margin-bottom: 10rpx;
  }

  .unit {
    font-size: 20rpx;
  }

  .price {
    font-size: 32rpx;
    line-height: 1;
    font-weight: 500;
    margin-right: 10rpx;
    color: $main-color;
  }

  .bottom {
    display: flex;
    justify-content: space-between;
  }
}
</style>