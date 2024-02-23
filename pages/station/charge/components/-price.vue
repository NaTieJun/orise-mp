<template>
  <view class="evaluate-box">
    <view class="eva-section">
      <view class="e-header">
        <view class="evaluate-title">分时段价格</view>
      </view>
      <view v-if="priceDetail && priceDetail.length > 0">
        <view
          v-for="(price, priceIndex) in priceDetail"
          :key="priceIndex"
          class="card-flex"
          :class="{ 'current-price': priceIndex == currentTimeIndex }"
        >
          <view class="card-title">
            {{price.startTm.slice(0, 2)}}:{{price.startTm.slice(2)}}-{{price.endTm.slice(0, 2)}}:{{price.endTm.slice(2)}}
            <view class="current-tag" v-if="priceIndex == currentTimeIndex">当前时段</view>
          </view>
          <view class="card-content">
            <view class="total-price">
              ￥{{(Number(price.elecPrice) + Number(price.servicePrice)).toFixed(2)}}
              <text class="unit-price">/度</text>
            </view>
            <text class="sub-price">电价:￥{{ Number(price.elecPrice).toFixed(2) }}</text>
            <text class="sub-price">服务费:￥{{ Number(price.servicePrice).toFixed(2) }}</text>
          </view>
        </view>
      </view>

      <div v-else class="stationNoMore">
        <u-empty text="暂无价格" mode="message"></u-empty>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      lightColor: this.$lightColor,
      priceDetail: [],
    };
  },
  props: {
    stationData: {
      default: {},
      type: Object,
    },
    currentTimeIndex: {
      type: Number,
    },
  },

  watch: {
    stationData: {
      handler(val) {
        this.priceDetail = val.priceList;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {

  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.evaluate-box {
  border-radius: 20rpx;
  padding: 0rpx 20rpx;
  box-shadow: 0 1px 5px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 20rpx;
}

.evaluate-title {
  font-size: 28rpx;
  font-weight: 400;
  height: 90rpx;
  line-height: 90rpx;
  position: relative;

  &::before {
    background-color: #0974C5;
    content: "";
    position: absolute;
    border-radius: 3rpx;
    left: -20rpx;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 3px;
    height: 15px;
  }
}
.card-flex {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #80808020;
  &:last-child {
    border: none;
  }
}
.card-title {
  flex: none;
  font-weight: 400;
  padding-left: 12rpx;
}

.card-content {
  padding: 0 40rpx;
  text-align: right;
  flex: 1;

  // flex: 6;
  .total-price {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
  }

  .unit-price {
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
    margin-left: 5rpx;
  }

  .sub-price {
    font-size: 24rpx;
    color: #bdbfc0;

    & + .sub-price {
      margin-left: 30rpx;
    }
  }
}

.current-price {
  border: 1px solid #ff9920;
  background-color: #ff992030;
  border-radius: 10rpx;

  .current-tag {
    background-color: #ff9920;
    color: #fff;
    font-size: 24rpx;
    line-height: 1.5;
    text-align: center;
    border-radius: 10rpx;
    margin-top: 5rpx;
  }
}

/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  .card-content {
    .total-price,
    .unit-price {
      color: #bdbfc0;
    }
  }
}
</style>
