<template>
  <div class="main-page">
    <view class="product-container u-skeleton" :style="{ height: productRefHeight }" ref="productRef" id="productRef">
      <scroll-view scroll-anchoring enableBackToTop="true" scroll-with-animation scroll-y class="scroll-page" :scroll-top="tabScrollTop">
        <!-- 基本信息 -->
        <view class="card-box">
          <view class="station-title">
            {{ stationInfo.stationName }}
            <view class="stition-image-wrapper">
              <u-image :src="stationInfo.imgs[0]" mode="aspectFill" width="80px" height="60px" @click="imgPreview(0)">
                <u-loading slot="loading"></u-loading>
              </u-image>
            </view>
          </view>
          <view class="time">营业时间：{{ stationInfo.busineHours }}</view>
          <view class="address">
            地址：{{ stationInfo.address }}
            <view style="float:right;display:flex;" v-if="stationInfo.address" @click="toNavigation()">
              <u-image width="40rpx" height="40rpx" src="/static/index/navigation.png"></u-image>
              <text style="margin-left:12rpx;line-height: 40rpx;">{{ Number(stationDistance).toFixed(1) }}KM</text>
            </view>
          </view>
        </view>

        <!-- 价格 -->
        <PriceCom :stationData="stationInfo" :currentTimeIndex="curnetPrice.currentTimeIndex" />

        <!-- 枪 -->
        <ConnectorCom :stationData="stationInfo" />

        <view style="height:40rpx;text-align:center;padding-top:10rpx;"></view>
      </scroll-view>

      <view class="page-bottom">
        <view class="icon-btn">
          <view class="icon-btn-item" @click="linkMsgDetail()">
            <u-icon size="34" name="kefu-ermai"></u-icon>
            <view class="icon-btn-name">客服</view>
          </view>
        </view>
        <!-- 扫码充电 -->
        <view class="detail-btn">
          <view class="button scan" @click="scan()">
            <img class="list_img" src="/static/map/scan.png" alt />扫码充电
          </view>
        </view>
      </view>
    </view>
    <u-skeleton :loading="loading" :animation="true" bgcolor="#FFF"></u-skeleton>
  </div>
</template>

<script>
/************接口API***************/
import { getStation } from "@/api/station.js";
import { mpScan, serviceCall } from "@/utils/tools.js";
import config from "@/config/config";
/************组件***************/
import PriceCom from "./components/-price"; //价格组件
import ConnectorCom from "./components/-connector"; 
import { wait } from "@/utils/utils.js";
export default {
  components: {
    PriceCom,
    ConnectorCom
  },
  data() {
    return {
      stationInfo: {},
      curnetPrice: {
        currentTimeIndex: null,
        price: null,
      },
      stationDistance: 0,
      loading: true,
      priceShow: false, //弹窗开关
      navbarOnlyBack: {
        background: "transparent",
      },
      navbar: {
        background: "#fff",
      },

      productRefHeight: "",
      tabScrollTop: null,
      scrollArr: [],
      scrollId: "1",
      scrollFlag: true,
      current: "1", //当前显示的轮播图页
      stationData: {}, //站点数据
      routerVal: "",
      pagesLength: getCurrentPages().length,
    };
  },
  mounted() {
    const { windowHeight } = uni.getSystemInfoSync();
    let bottomHeight = 0;
    let _this = this
    uni.getSystemInfo({
      success: function (res) {
        // res - 各种参数
        let bottom = uni.createSelectorQuery().select(".page-bottom");
        bottom
          .boundingClientRect(function (data) {
            if (data && data.height) {
              //data - 各种参数
              bottomHeight = data.height; // 获取元素宽度
            }
            _this.productRefHeight = windowHeight - bottomHeight + "px";
            console.log(bottomHeight);
          }).exec();
      },
    });
  },
  onLoad(options) {
    this.routerVal = options;
    // #ifdef MP-WEIXIN
    uni.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    // #endif
    if (this.$options.filters.isLogin("auth")) {
      this.init(this.routerVal.id);
    }
  },
  onShow() {
    if (this.$options.filters.isLogin("auth")) {
      this.refreshConnector(this.routerVal.id);
    } else {
      this.$options.filters.navigateToLogin("navigateTo", true);
    }
  },
  methods: {
    toNavigation() {
      uni.openLocation({
        name: this.stationInfo.stationName,
        address: this.stationInfo.address,
        latitude: this.stationInfo.lat,
        longitude: this.stationInfo.lon,
        success(res) {
          // 打开成功
        }
      })
    },
    share() {
      return `/pages/station/inde?id=${this.routerVal.id}&goodsId=${this.routerVal.goodsId}`;
    },
    /**
     * 循环出当前促销是否为空
     */
    countPromotion() {
      return count
    },
    /**
     * 初始化信息
     */
    async init(id, distance, distributionId = "") {

    },
    /**
     * 刷新枪状态
     */
    async refreshConnector(id) {
      this.loading = true;
      let response = await getStation(id);
      this.stationInfo = response.data.data;
      this.stationInfo.lon = Number(this.stationInfo.lon)
      this.stationInfo.lat = Number(this.stationInfo.lat)
      if (response.data.code != 200) {
        uni.navigateBack(
          {
            complete: () => {
              uni.showToast({
                icon: "none",
                duration: 2000,
                title: "站点未开放",
              }
              )
            }
          })
      }

      let _this = this
      // 计算距离
      uni.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: async function (res) {
          const lat = parseFloat(res.latitude)
          const lon = parseFloat(res.longitude)
          while (_this.stationInfo.lon == null) {
            await wait(50)
          }
          _this.stationDistance = Math.round(_this.$options.filters.calcDistance(lon, lat, _this.stationInfo.lon, _this.stationInfo.lat) / 100) / 10;
        },
        fail: function (res) {
          console.log(res)
        },
      })

      // 获取当时时段价格
      let myDate = new Date();
      let currentTime = this.$u.timeFormat(myDate, 'hhMM');
      this.curnetPrice.currentTimeIndex = null;
      this.curnetPrice.price = null;
      let currentIndex = null;
      this.stationInfo.priceList.forEach((t, tIndex) => {
        if (Number(currentTime) >= Number(t.startTm)) {
          currentIndex = tIndex;
        }
      })
      this.curnetPrice.currentTimeIndex = currentIndex;
      if (currentIndex != null) {
        const price = this.stationInfo.priceList[currentIndex];
        this.curnetPrice.price = Number(price.elecPrice) + Number(price.servicePrice);
      } else {
        this.curnetPrice.price = null
      }
      this.loading = false;
    },
    linkMsgDetail() {
      serviceCall(this.stationInfo.servicePhone || config.customerServiceMobile)
    },

    /**
     * 返回
     */
    back() {
      console.log(this.pagesLength);
      if (this.pagesLength == 1) {
        uni.switchTab({
          url: "/pages/tabbar/station/stationList",
        });
      } else {
        uni.navigateBack();
      }
    },

    /**
     * 计算每个要跳转到的模块高度信息
     */
    calcSize() {
      let h = 0;
      let that = this;
      let arr = [
        "main1",
        "main2",
        "main3",
        "main4",
        "main5",
        "main6",
        "main7",
        "main8",
        "main9",
        "main10",
        "main11",
      ];
      arr.forEach((item) => {
        let view = uni.createSelectorQuery().select("#" + item);
        view
          .fields(
            {
              size: true,
            },
            (data) => {
              if (
                item === "main1" ||
                item === "main4" ||
                item === "main9" ||
                item === "main11"
              ) {
                that.scrollArr.push(h);
              }
              if (data && data.height) {
                h += data.height;
              }
            }
          )
          .exec();
      });
      this.scrollFlag = false;
    },

    /**
     * 点击顶部跳转到对应位置
     */
    headerTab(id) {
      if (this.scrollFlag) {
        this.calcSize();
      }
      this.scrollId = id;

      this.$nextTick(() => {
        this.tabScrollTop = this.scrollArr[id - 1];
      });
    },
    scan() {
      mpScan()
    },
    imgPreview(index) {
      uni.previewImage({
        current: index,
        indicator: "number",
        loop: true,
        urls: this.stationInfo.imgs
      })
    }
  },
};
</script>

<style lang="scss" scoped>

.detail-btn {
  display: flex;
  align-items: center;

  .button.scan {
    flex: 1;
    width: 100%;
    margin: 0 10rpx;
    background-image: linear-gradient(230deg, #00a5ff 7%, #0089c9 100%);
    box-shadow: 0 1px 12px 0 #0089c980;
    border-radius: 20px;
    font-size: 28rpx;
    line-height: 80rpx;
    color: #ffffff;
    text-align: center;
    margin: 0 16rpx;

    img {
      width: 40rpx;
      height: 40rpx;
      vertical-align: text-bottom;
      margin-right: 16rpx;
    }
  }
}

.header,
.header-only-back {
  padding-left: 10rpx;
  position: fixed;
  top: var(--status-bar-height);
  width: 100%;
  z-index: 8;
  height: 90rpx;
  font-size: 30rpx;
  transition: all 0.5s;
}

/deep/ .u-navbar {
  padding-left: 10rpx;
}

.page-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9;
  background: #fff;
  width: 100%;
  display: flex;
  border-top: 2rpx solid #f2f2f2;
  box-sizing: border-box;
  height: 120rpx;
  height: calc(120rpx + constant(safe-area-inset-bottom));
  height: calc(120rpx + env(safe-area-inset-bottom));
  padding-bottom: 20rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  > .icon-btn {
    display: flex;
    align-items: center;
    padding-left: 20rpx;

    // flex: 1;
    > .icon-btn-item {
      // flex: 1;
      position: relative;
      text-align: center;
      font-size: 22rpx;
      color: #262626;
      display: flex;
      flex-direction: column;
      width: 60rpx;
      height: 100%;
      align-items: center;
      justify-content: center;

      > .icon-btn-name {
        margin: 4rpx 0;
      }
    }
  }

  > .detail-btn {
    flex: 1.5;
  }
}

.main-page {
  height: calc(100% - var(--status-bar-height));
  overflow: hidden;
}

.product-container {
  .header-line {
    height: 1px;
    background: #f2f2f2;
    position: fixed;
    top: 90rpx;
    left: 0;
    right: 0;
    z-index: 999;
    transition: all 0.5s;

    &.scroll-hide {
      background: none;
    }
  }

  .scroll-page {
    width: 100%;
    height: 100%;
    padding-bottom: 20rpx;
  }
}

.status_bar {
  background: #fff;
  height: var(--status-bar-height);
}

.card-box,
.evaluate-box {
  border-radius: 20rpx;
  padding: 0rpx 20rpx;
  background: #ffffff;
  box-shadow: 0 3px 4px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 20rpx;
}

.evaluate-title {
  color: #262626;
  font-size: 28rpx;
  font-weight: 400;
  height: 90rpx;
  line-height: 90rpx;
  position: relative;

  &::before {
    background-color: #0974c5;
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

.scroll_mask {
  // height: 868rpx;
  // padding-bottom: 100rpx;
  overflow-y: auto;
}

.mask {
  height: 600px;
}

.card-flex {
  padding: 30rpx 0;
}

.card-box {
  padding-top: 0 !important;
}

.card-content {
  padding: 0 20rpx;
  // flex: 6;
}

.card-p {
  display: block;
  padding-bottom: 20rpx;
}

.card-title {
  flex: 1;
  // color: #262626;
  font-weight: 700;
}

.station-title {
  font-size: 40rpx;
  line-height: 60rpx;
  font-weight: 500;
  margin: 20rpx 0 40rpx;
}

.time,
.address {
  margin: 16rpx 0;
}

.stition-image-wrapper {
  float: right;
  margin: 16rpx;
}
.stationCard {
  position: relative;
  text-align: left;
  padding: 0 25rpx;
  line-height: 1.5;

  &.round-top {
    padding-top: 30rpx;
    margin-top: -30rpx;
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
  }

  .title {
    font-size: 32rpx;
    font-weight: 700;
    line-height: 64rpx;
    margin-bottom: 10rpx;
  }

  .time {
    font-size: 24rpx;
    color: #707070;
    margin-bottom: 10rpx;
  }

  .address {
    font-size: 24rpx;
    color: #707070;
    margin-bottom: 10rpx;
  }

  .price {
    font-size: 48rpx;
    font-weight: 500;
    margin-right: 10rpx;
  }

  .label {
    display: inline-block;
    float: right;
    height: 40rpx;
    line-height: 38rpx;
    font-size: 20rpx;
    padding: 0 20rpx 0 55rpx;
    background-position: left top;
    background-repeat: no-repeat;
    background-size: 42rpx 100%;
    border-radius: 5px;
  }

  .label.fast {
    margin-right: 20rpx;
    border: 1px solid #00a5ff;
    background-image: url(/static/map/fast-pile-count-l.png);
  }

  .label.slow {
    border: 1px solid #ff9920;
    background-image: url(/static/map/slow-pile-count-l.png);
  }

  .bottom {
    height: 100rpx;
    position: relative;
  }
}

/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  .product-container {
    // background-image: linear-gradient(
    //   180deg,
    //   #00c4b8 12%,
    //   #015a54 29%,
    //   #121425 40%
    // );
    background-color: #121425;
  }

  .gap-line {
    background-color: #121425;
  }

  .recommend-box,
  .detail-box,
  .store-recommend,
  .store-info,
  .evaluate-box,
  .card-box,
  .group-list {
    background: #222336;
    color: #ffffff;
    box-shadow: 0 1px 5px 2px rgba(255, 255, 255, 0.05);
  }

  .store-recommend-title,
  .evaluate-title,
  .group-name {
    color: #ffffff;
  }

  .money {
    color: #ffffff;
  }

  .card-row .lable {
    color: #a9a9a9;
  }

  .card-row .content {
    color: #ffffff;
  }

  .radio-button {
    background: #f6f6f720;
  }

  .page-bottom {
    background: #222336;
    border-top: 2rpx solid #343434;

    > .icon-btn > .icon-btn-item {
      color: #ffffff;
    }

    .detail-btn > .to-scan {
      background-image: linear-gradient(230deg, #00a5ff 7%, #0089c9 100%);
      border: 1px solid #f6f6f720;
      box-shadow: none;
    }
  }

  .title {
    color: #ffffff;
  }

  .time,
  .address {
    color: #a9a9a9;
  }
}
</style>

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