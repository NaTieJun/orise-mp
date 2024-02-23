<template>
  <div class="main-page">
    <!--  #ifndef  MP-ALIPAY -->
    <u-navbar
      :border-bottom="false"
      :title="statusOptions[orderInfo.status]"
      back-icon-color="#fff"
      title-color="#fff"
      class="header-only-back"
      :back-icon-name="pagesLength == 1 ? 'home' : 'arrow-left'"
      :background="{ background: 'tranparent' }"
      :custom-back="back"
    ></u-navbar>
    <!--  #endif -->

    <view class="product-container" :style="{ height: productRefHeight }">
      <scroll-view scroll-anchoring enableBackToTop="true" scroll-y class="scroll-page" :scroll-top="tabScrollTop">
        <!-- 枪未开放，或有故障 -->
        <view v-if="orderInfo.status == 0 || orderInfo.status == 255">
          <view style="margin-top:200rpx;padding:30rpx 20rpx;display: flex;color:#fff;">
            <image style="width: 80rpx; height: 80rpx;margin-right:20rpx;" src="/static/index/connector.png" mode="scaleToFill" />
            <view style="flex:1">
              <view style="font-size:32rpx;">无法使用，请尝试其他充电枪</view>
              <view style="font-size:24rpx;">枪编号 {{ routerVal.id }}</view>
            </view>
          </view>
        </view>
        <!-- 枪被其他用户充电中 -->
        <view v-if="orderInfo.status == 5">
          <view style="margin-top:200rpx;padding:30rpx 20rpx;display: flex;color:#fff;">
            <image style="width: 80rpx; height: 80rpx;margin-right:20rpx;" src="/static/index/connector.png" mode="scaleToFill" />
            <view style="flex:1">
              <view style="font-size:32rpx;">已经有人在充电了哦，请使用其他枪</view>
              <view style="font-size:24rpx;">枪编号 {{ routerVal.id }}</view>
            </view>
          </view>
        </view>

        <!-- 未插枪，空闲状态 -->
        <view v-if="orderInfo.status == 1">
          <view style="margin-top:200rpx;padding:30rpx 20rpx;display: flex;color:#fff;">
            <image style="width: 80rpx; height: 80rpx;margin-right:20rpx;" src="/static/index/connector.png" mode="scaleToFill" />
            <view style="flex:1">
              <view style="font-size:32rpx;">请先插枪</view>
              <view style="font-size:24rpx;">枪编号 {{ routerVal.id }}</view>
            </view>
          </view>
        </view>

        <!-- 已插枪 -->
        <view v-if="orderInfo.status == 2">
          <view style="margin-top:200rpx;padding:30rpx 20rpx;display: flex;color:#fff;">
            <image style="width: 80rpx; height: 80rpx;margin-right:20rpx;" src="/static/index/connector.png" mode="scaleToFill" />
            <view style="flex:1">
              <view style="font-size:32rpx;">已插枪</view>
              <view style="font-size:24rpx;">枪编号 {{ routerVal.id }}</view>
            </view>
          </view>

          <!-- 基本信息 -->
          <view class="card-box" style="padding:30rpx 20rpx;">
            <view class="card-row">
              <view class="lable">站点名称</view>
              <view class="content">{{ equipmentInfo.stationName }}</view>
            </view>
            <view class="card-row">
              <view class="lable">设备编号</view>
              <view class="content">{{ equipmentInfo.equipmentId }}</view>
            </view>
            <view class="card-row">
              <view class="lable">终端类型</view>
              <view class="content">{{ equipmentInfo.type == 1 ? '快充' : '慢充' }}</view>
            </view>
            <view class="card-row">
              <view class="lable">功率</view>
              <view class="content">{{ equipmentInfo.power }}kW</view>
            </view>
          </view>

          <!-- 充电与停车费 -->
          <view class="card-box">
            <view class="card-flex set-image" @click="shutMask">
              <u-image width="40rpx" height="40rpx" src="/static/index/electric.png"></u-image>
              <u-image width="40rpx" height="40rpx" src="/static/index/car-parking.png"></u-image>
              <view class="card-title">充电与停车费</view>
              <view class="card-content">￥{{ curnetPrice.price | unitPrice }}/度</view>
              <view class="card-bottom">
                <u-icon name="more-dot-fill"></u-icon>
              </view>
            </view>
          </view>

          <!-- 预充金额 -->
          <view class="card-box">
            <view class="card-flex">
              <view class="card-title charge-amount">
                预充金额
                <u-row gutter="16">
                  <u-col span="3" v-for="(a, aIndex) in chargeMaxAmount" :key="a">
                    <view :class="['radio-button', { isActive: aIndex == chargeAmountIndex }]" v-if="aIndex < 2" @click="radioChange(aIndex)">{{ a }}元</view>
                    <view :class="['radio-button', { isActive: aIndex == chargeAmountIndex }]" v-if="aIndex == 2" @click="radioChange(aIndex)">充满</view>
                    <!--  #ifdef  MP-ALIPAY -->
                    <view :class="['amount-input', { isActive: aIndex == chargeAmountIndex }]" v-if="aIndex == 3" @click="radioChange(aIndex)">
                      <input
                        @input="chargeMaxAmountChange($event)"
                        type="number"
                        placeholder="其他金额"
                        placeholder-style="font-size: 28rpx"
                        :value="chargeMaxAmount[3]"
                      />
                    </view>
                    <!--  #endif -->
                    <!--  #ifndef  MP-ALIPAY -->
                    <input
                      :class="['radio-button', { isActive: aIndex == chargeAmountIndex }]"
                      v-if="aIndex == 3"
                      @input="chargeMaxAmountChange($event)"
                      @click="radioChange(aIndex)"
                      type="number"
                      placeholder="其他金额"
                      :value="chargeMaxAmount[3]"
                    />
                    <!--  #endif -->
                  </u-col>
                </u-row>
                <view class="card-row" style="margin-bottom: -20rpx;">
                  <view class="small">充电过程中，可随时停止充电，费用按实际充电量收取。</view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 充电中 -->
        <view v-if="orderInfo.status == 3">
          <view style="margin-top:200rpx;">
            <view style="margin-top:150rpx;padding:30rpx 20rpx;display: flex;color:#fff;">
              <u-circle-progress active-color="#0089c9" bg-color="transparent" width="80" :percent="equipmentInfo.soc" :show="orderInfo.status == 3"></u-circle-progress>
              <view style="flex:1">
                <view style="font-size:32rpx;">充电中</view>
                <view style="font-size:24rpx;">{{Number(equipmentInfo.soc)}}%</view>
              </view>
            </view>

            <!-- 基本信息 -->
            <view class="card-box" style="padding:30rpx 20rpx;">
              <view class="card-row">
                <view class="lable">站点名称</view>
                <view class="content">{{ equipmentInfo.stationName }}</view>
              </view>
              <view class="card-row">
                <view class="lable">充电枪编号</view>
                <view class="content">{{ equipmentInfo.connectorId }}</view>
              </view>
            </view>

            <!-- 充电参数，只在枪对应的订单状态是2 充电中时，才显示 -->
            <view class="card-box" style="padding:30rpx 20rpx;"  v-if="equipmentInfo.status == 2">
              <view class="card-title">充电详情</view>
              <view class="card-row">
                <view class="lable">充电电量</view>
                <view class="content">{{ equipmentInfo.totalPower }}度</view>
              </view>
              <view class="card-row">
                <view class="lable">充电时长</view>
                <view class="content">{{ chargeDurStr }}</view>
              </view>
              <view class="card-row">
                <view class="lable">充电金额</view>
                <view class="content">￥{{ equipmentInfo.totalMoney }}</view>
              </view>
            </view>

            <!-- 参数 -->
            <view
              class="card-swapper"
              v-if="equipmentInfo.status == 1 || equipmentInfo.status == 3 || (equipmentInfo.status == 4 && equipmentInfo.orderStatus == 10)"
            >
              <u-row gutter="8">
                <u-col span="12">
                  <view class="label">
                    <view class="number">
                      <u-loading mode="circle" size="64" color="#00d591"></u-loading>
                    </view>
                    <view class="label" v-if="equipmentInfo.status == 1">启动中...</view>
                    <view class="label" v-if="equipmentInfo.status == 3">停止中...</view>
                  </view>
                </u-col>
              </u-row>
            </view>
          </view>

          <u-modal
            show-cancel-button
            v-model="endChargeShow"
            @confirm="endCharge"
            :confirm-color="lightColor"
            :async-close="true"
            :content="'确定要结束充电么？'"
          ></u-modal>
        </view>

        <!-- 充电结束，占位中 -->
        <view v-if="orderInfo.status == 98">
          <view style="margin-top:200rpx;padding:30rpx 20rpx;display: flex;color:#fff;">
            <image style="width: 80rpx; height: 80rpx;margin-right:20rpx;" src="/static/index/connector.png" mode="scaleToFill" />
            <view style="flex:1">
              <view style="font-size:32rpx;">充电结束，请拔枪</view>
            </view>
          </view>
        </view>

        <!-- 结算订单 -->
        <view v-if="orderInfo.status == 99">
          <view style="margin-top:150rpx;padding:30rpx 20rpx;display: flex;color:#fff;">
            <image style="width: 80rpx; height: 80rpx;margin:0 20rpx;" src="/static/index/order-wait.png" mode="scaleToFill" />
            <view style="flex:1">
              <view style="font-size:32rpx;">充电详情</view>
              <view style="font-size:24rpx;">订单已支付</view>
            </view>
          </view>

          <!-- 基本信息 -->
          <view class="card-box" style="padding:30rpx 20rpx;">
            <view class="card-row">
              <view class="lable">站点名称</view>
              <view class="content">{{ equipmentInfo.stationName }}</view>
            </view>
            <view class="card-row">
              <view class="lable">充电枪编号</view>
              <view class="content">{{ equipmentInfo.connectorId }}</view>
            </view>
          </view>
          <view class="card-box" style="padding:30rpx 20rpx;">
            <view class="card-title">充电详情</view>
            <view class="card-row">
              <view class="lable">充电开始时间</view>
              <view class="content">{{ equipmentInfo.startTime }}</view>
            </view>
            <view class="card-row">
              <view class="lable">充电结束时间</view>
              <view class="content">{{ equipmentInfo.endTime }}</view>
            </view>
            <view class="card-row">
              <view class="lable">充电时长</view>
              <view class="content">{{ chargeDurStr }}</view>
            </view>
            <view class="card-row">
              <view class="lable">充电量</view>
              <view class="content">{{ equipmentInfo.totalPower }}度</view>
            </view>
          </view>
          <view class="card-box" style="padding:30rpx 20rpx;">
            <view class="card-title">费用详情</view>
            <view class="card-row">
              <view class="lable">充电费</view>
              <view class="content">￥{{ equipmentInfo.totalElecMoney | unitPrice }}</view>
            </view>
            <view class="card-row">
              <view class="lable">服务费</view>
              <view class="content">￥{{ equipmentInfo.totalServiceMoney | unitPrice }}</view>
            </view>
            <view class="card-row">
              <view class="lable">订单总额</view>
              <view class="content">
                ￥{{ (equipmentInfo.totalMoney) |
                unitPrice }}
              </view>
            </view>
            <view class="card-row">
              <view class="lable"></view>
              <view class="content">
                实际支付
                <text class="actual-pay">
                  ￥{{ equipmentInfo.totalMoney |
                  unitPrice }}
                </text>
              </view>
            </view>
          </view>
          <view class="card-box" style="padding:30rpx 20rpx;">
            <view class="card-title">支付详情</view>
            <view class="card-row">
              <view class="lable">订单号</view>
              <view class="content">{{ equipmentInfo.startChargeSeq }}</view>
            </view>
          </view>
        </view>
        <view style="height:40rpx;text-align:center;padding-top:10rpx;" v-if="orderInfo.status == 2 || orderInfo.status == 99"></view>
      </scroll-view>

      <view class="page-bottom">
        <view class="icon-btn">
          <view class="icon-btn-item" @click="linkMsgDetail()">
            <u-icon size="34" name="kefu-ermai"></u-icon>
            <view class="icon-btn-name">客服</view>
          </view>
        </view>
        <!-- 正常结算页面 -->
        <view class="detail-btn">
          <view class="button" @click="charge()" v-if="orderInfo.status == 2">启动充电</view>
          <view class="button" @click="endChargeShow = true" v-if="orderInfo.status == 3">结束充电</view>
          <view class="button" @click="back()" v-if="orderInfo.status == 99">完成</view>
        </view>
      </view>
    </view>

    <!-- 规格-模态层弹窗 -->
    <view v-if="orderInfo.status == 2">
      <!-- 价格弹窗 -->
      <u-popup
        v-model="priceShow"
        :height="setup.height"
        :mode="setup.mode"
        :border-radius="setup.radius"
        @close="priceShow = false"
        :mask-close-able="setup.close"
        closeable
      >
        <view class="price-title">费用</view>
        <scroll-view class="scroll_mask" :scroll-y="true">
          <!-- 价格 -->
          <PriceCom :stationData="stationInfo" :currentTimeIndex="curnetPrice.currentTimeIndex" />
          <!-- 空白 -->
          <view style="height:80rpx;"></view>
        </scroll-view>
      </u-popup>
    </view>

    <u-top-tips ref="uTips" :navbar-height="statusBarHeight"></u-top-tips>
  </div>
</template>

<script>
/************接口API***************/
import { getConnector, getStation } from "@/api/station.js";
import { startCharge, stopCharge, getOrderDetail, setOrderNofity } from "@/api/order.js";
import Foundation from "@/utils/Foundation.js";
import { serviceCall } from "@/utils/tools.js";
import config from "@/config/config";
/************组件***************/
import PriceCom from "./components/-price"; //价格组件
import Progress from "@/components/progress/progress"; //气泡框
export default {
  components: {
    PriceCom,
    Progress
  },
  data() {
    return {
      endChargeShow: false,
      lightColor: this.$lightColor, //高亮颜色
      equipmentInfo: { soc: 0, status: 0 },
      stationInfo: { priceList: [] },
      // 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      soc: 0,
      orderInfo: { status: -1 },
      orderInfoUpdateTimeout: null,
      orderInfoUpdateTime: 5000,
      curnetPrice: {
        currentTimeIndex: null,
        price: null,
      },
      chargeMaxAmount: [30, 50, -1, undefined],
      //弹出窗设置
      setup: {
        height: "1000rpx", //弹出层高度
        mode: "bottom", //弹出层位置
        radius: "30", //圆角 rpx,
        close: true //能否点击遮罩退出
      },
      priceShow: false, //弹窗开关
      navbarOnlyBack: {
        background: "transparent",
      },
      navbar: {
        background: "#fff",
      },
      productRefHeight: "",
      header: {
        top: 0,
        height: 50,
      },
      tabScrollTop: null,
      routerVal: "",
      countStart: 0,
      statusOptions: ['', '未插枪', '准备充电', '充电中', '充电结束', '充电中'],
      chargeAmountIndex: 2,
      pagesLength: getCurrentPages().length,
      //缓存充电时间
      chargeDurInt: 0,
      //缓存充电时间字符
      chargeDurStr: '0',
      shouldRetry: true,
    };
  },
  onUnload() {
    // 退出页面时，清除轮询任务
    this.orderInfoUpdateTimeout && clearTimeout(this.orderInfoUpdateTimeout)

  },
  mounted() {
    const { windowHeight } = uni.getSystemInfoSync();
    let bottomHeight = 0;
    let topHeight = 0;
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

              _this.productRefHeight = windowHeight - bottomHeight - topHeight + "px";

            }
          })
          .exec();
        let top = uni.createSelectorQuery().select(".header");
        top
          .boundingClientRect(function (data) {
            if (data && data.height) {
              //data - 各种参数
              topHeight = data.height; // 获取元素宽度
            }
          })
          .exec();
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
    let qid = Foundation.urlParse(decodeURIComponent(options.q)).n
    if (qid) {
      this.routerVal.id = qid
    }
    // #endif
    // #ifdef MP-ALIPAY
    //存储支付宝扫码参数
    const connectId = getApp().globalData.connectId
    getApp().globalData.connectId = null
    if (connectId != null) {
      this.routerVal.id = connectId
    }
    // #endif
  },
  onShow() {
    if (this.$options.filters.isLogin("auth")) {
      this.init(this.routerVal.id);
      this.$nextTick(() => {
        this.$refs.carRef && this.$refs.carRef.reload();
      })
    } else {
      this.$options.filters.navigateToLogin("navigateTo", true);
    }
  },
  methods: {
    updateCountStart() {
      this.countStart = Number(this.equipmentInfo.soc)
    },
    share() {
      return `/pages/station/index?id=${this.routerVal.id}&goodsId=${this.routerVal.goodsId}`;
    },
    radioChange(index) {
      this.chargeAmountIndex = index
    },
    chargeMaxAmountChange(e) {
      this.chargeMaxAmount[3] = e.target.value
    },
    /**
     * 初始化信息
     */
    async init(id) {
      let response = await getConnector({ connectorId: id, hasPrice: 1 });
      if (response.data.code == 401) {
        this.$options.filters.navigateToLogin("navigateTo", true);
      } else if (response.data.code == 500) {
        //充电桩被他人使用中
        this.$set(this.orderInfo, 'status', 5)
      } else if (response.data.code == 200) {
        this.$set(this.orderInfo, 'status', response.data.data.status)
        this.$set(this.orderInfo, 'startChargeSeq', response.data.data.startChargeSeq)
        // 如果检查到枪在充电中，则去拿枪对应的订单信息
        if (this.orderInfo.status != 4 || this.orderInfo.orderStatus != 30 || (this.orderInfo.billInfo && this.orderInfo.billInfo.occupyFlag != 0)) {
          this.getChargeInfo()
        }
        console.log("getConnector", response.data.data)
        this.equipmentInfo = Object.assign({}, response.data.data, { soc: 0 });

        let stationRes = await getStation(response.data.data.stationId);
        this.stationInfo = stationRes.data.data

        // 枪详情返回价格详情后，加到
        this.$set(this.stationInfo, 'priceList', this.equipmentInfo.priceList)

        // 获取当时时段价格
        let myDate = new Date();
        let currentTime = this.$u.timeFormat(myDate, 'hhMM');
        this.curnetPrice.currentTimeIndex = null;
        this.curnetPrice.price = null;
        response.data.data.priceList.forEach((t, tIndex) => {
          if (Number(currentTime) >= Number(t.startTm) && Number(currentTime) < Number(t.endTm)) {
            this.curnetPrice.currentTimeIndex = tIndex;
            this.curnetPrice.price = Number(t.elecPrice) + Number(t.servicePrice);
          }
        })
      }

      this.updateNavigationBarTitle()

      if (this.shouldRetry == true && response.data && response.data.data?.status != 2) {
        this.shouldRetry = false
        setTimeout(() => {
          this.init(id)
        }, 5000);
      }
    },
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
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
     * 规格弹窗开关
     */
    shutMask() {
      this.priceShow = true;
    },

    charge() {
      // 点击先进充电中状态等待接口返回，以防止多次点击
      this.$set(this.orderInfo, 'status', 3)
      this.$set(this.equipmentInfo, 'status', 1)
      this.tabScrollTop = 0
      let postData = {
        connectorId: this.routerVal.id,
        type: this.chargeAmountIndex == 2 ? 1 : 2, //充电类型 1、充满;2、按金额充电
        money: Number(this.chargeMaxAmount[this.chargeAmountIndex]),
        userFlag: 1
      }
      startCharge(postData).then((res) => {
        if (res.data.code == 200) {
          this.orderInfo = Object.assign({ startChargeSeq: res.data.data.startChargeSeq }, { status: 3 })
          this.$refs.uTips.show({ title: "启动成功", type: "success" });
          // 开始轮询状态变化
          this.getChargeInfo()
          // 请求通知授权,仅微信支持
          // #ifdef MP-WEIXIN
          this.requestNotify(res.data.data.data)
          // #endif
        } else {
          this.$refs.uTips.show({ title: res.data.msg, type: "error" });
          this.orderInfo.status = 2
        }
      });
    },
    requestNotify(startChargeSeq) {
      let tmplIds = config.wxNotifyKey
      uni.requestSubscribeMessage({
        tmplIds,
        success(res) {
          tmplIds.map(t => {
            if (res[t] === 'accept') {
              // console.log("用户订阅了启动充电");
              setOrderNofity({
                startChargeSeq,
                tempId: t
              })
            } else if (res[t] === 'reject') {
              // console.log("用户取消订阅启动充电");
            } else {
              wx.showToast({
                title: '授权启动充电订阅消息有误',
                icon: 'error'
              })
            }
          })
        },
        fail: (errCode, errMessage) => {
          console.log("订阅消息 失败 " + errCode + " message " + errMessage);
        },
      });
    },
    async getChargeInfo() {
      // if (this.orderInfo.status == 3 || this.orderInfo.status == 99) {
      let res = await getOrderDetail(this.orderInfo.startChargeSeq);
      if (res.data.code == 200 && res.data.data != null) {
        this.equipmentInfo = res.data.data;
        //TODO 改为使用startChargeSeqStat
        this.equipmentInfo.status = this.equipmentInfo.startChargeSeqStat
        console.log("getOrderDetail", this.equipmentInfo)
        // this.equipmentInfo.chargeDurInt = parseInt(this.equipmentInfo.chargeDur)
        // 云快充soc是0-1 星云是0-100
        this.$set(this.equipmentInfo, 'soc', this.equipmentInfo.soc)
        this.$set(this.equipmentInfo, 'currentP', this.equipmentInfo.currentP ? parseInt(this.equipmentInfo.currentP / 1000) : 0)
        if ([1, 2].includes(this.equipmentInfo.status)) {
          this.updateChargeDur()
        } else {
          this.clearChargeDurTimer();
        }
        /* 
         * 订单充电状态bill 1 启动中 2 充电中 3 停止中 4 已停止
         * 订单支付状态order(10进行中 20取消 21待取消 30已完成 40异常订单)
         * 只有充电枪状态=4且订单状态=30时，表示充电已停止且订单已结算时，才结算轮巡请求，显示最终订单确认。
         */
        if (this.equipmentInfo.status == 4 && this.equipmentInfo.orderStatus == 30 && this.equipmentInfo.billInfo.occupyPrice > 0 && this.equipmentInfo.billInfo.occupyFlag == 1) {
          this.$set(this.orderInfo, 'status', 98)
        }
        if (this.equipmentInfo.status == 4) {
          this.$set(this.orderInfo, 'status', 99)
          this.$refs.uTips.show({ title: "充电结束", type: "success" });
        } else if (this.equipmentInfo.status == 5 || (this.equipmentInfo.status == 4 && this.equipmentInfo.orderStatus == 40)) {
          this.$set(this.orderInfo, 'status', 99)
          this.$refs.uTips.show({ title: "结束异常", type: "error" });
        } else {
          this.orderInfoUpdateTimeout = setTimeout(() => {
            this.getChargeInfo()
          }, this.orderInfoUpdateTime)
        }
        if ([1, 2].includes(this.equipmentInfo.status) == false) {
          const duration = parseInt(this.equipmentInfo.chargeDur)
          const minutes = parseInt(duration / 1000 / 60)
          const seconds = parseInt(duration / 1000) % 60
          this.chargeDurStr = `${minutes}分${seconds}秒`
        }
        this.updateNavigationBarTitle()
      }
    },
    endCharge() {
      this.endChargeShow = false
      // 暂停拿订单状态，防止拿到上一次的充电中状态
      this.orderInfoUpdateTimeout && clearTimeout(this.orderInfoUpdateTimeout)
      this.$set(this.equipmentInfo, 'status', 3)
      // 间隔后，再去拿订单充电
      this.orderInfoUpdateTimeout = setTimeout(() => {
        this.getChargeInfo()
      }, this.orderInfoUpdateTime)
      let postData = {
        startChargeSeq: this.orderInfo.startChargeSeq,
      }
      stopCharge(postData).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          // this.getChargeInfo()
        }
      });
    },
    //前端刷新充电时间
    updateChargeDur() {
      if (this.equipmentInfo.status != 2) {
        this.clearChargeDurTimer()
        return
      }
      if (this.chargeDurInt != 0) {
        return
      }
      let duration = parseInt(this.equipmentInfo.chargeDur)
      if (duration <= 0) {
        return
      }
      const minutes = parseInt(duration / 1000 / 60)
      const seconds = parseInt(duration / 1000) % 60
      this.chargeDurStr = `${minutes}分${seconds}秒`
      this.chargeDurInt = duration
      this.updateChargeDurTimer = setInterval(() => {
        if (this.orderInfo.status == 3) {
          if (this.chargeDurInt != 0) {
            this.chargeDurInt += 500
            let serverDuration = parseInt(this.equipmentInfo.chargeDur)
            if ((serverDuration - this.chargeDurInt) > 30000) {
              this.chargeDurInt = serverDuration;
            }
            const minutes = parseInt(this.chargeDurInt / 1000 / 60)
            const seconds = parseInt(this.chargeDurInt / 1000) % 60
            this.chargeDurStr = `${minutes}分${seconds}秒`
          }
        } else {
          this.clearChargeDurTimer()
        }
      }, 500)
    },
    //停止刷新充电时长
    clearChargeDurTimer() {
      if (this.updateChargeDurTimer) {
        clearInterval(this.updateChargeDurTimer)
        this.updateChargeDurTimer = null
        this.chargeDurInt = 0;
      }
    },
    updateNavigationBarTitle() {
      let title = this.statusOptions[this.orderInfo.status]
      if (title == null) title = ''
      uni.setNavigationBarTitle({
        title: title
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.header-title {
  font-weight: bold;
  // text-align: center;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 34rpx;
}

.price-title {
  font-weight: bold;
  text-align: center;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 34rpx;
  margin-left: 10rpx;
}

.cuxiao-title {
  color: #999;
  font-size: 24rpx;
}

.cuxiao {
  padding: 16rpx 32rpx;
}

.detail-btn {
  display: flex;
  align-items: center;

  > .button {
    flex: 1;
    width: 100%;
    margin: 0 10rpx;
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    color: #fff;
    font-size: 26rpx;
    border-radius: 214px;
    padding: 0;
    background-image: linear-gradient(230deg, #00a5ff 7%, #0089c9 100%);
    border: 1px solid #ffffff;
    box-shadow: 0 1px 12px 0 #0089c980;

    u-image {
      vertical-align: sub;
      display: inline-block;
      margin-right: 10rpx;
    }
  }
}

.header-only-back {
  background: transparent;
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
  height: 110rpx;
  width: 100%;
  display: flex;
  border-top: 2rpx solid #f2f2f2;
  box-sizing: border-box;
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
  background-image: linear-gradient(
    180deg,
    #0593d5 12%,
    #00a5ff 18%,
    #f7f7f7 44%
  );

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
  }
}

.status_bar {
  background: #fff;
  height: var(--status-bar-height);
}

.recommend-box,
.detail-box,
.store-recommend,
.store-info,
.evaluate-box,
.card-box,
.group-list {
  border-radius: 20rpx;
  padding: 0rpx 20rpx;
  background: #ffffff;
  box-shadow: 0 1px 5px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 20rpx;
}

.store-recommend-title,
.evaluate-title,
.group-name {
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

#main1 {
  height: 360rpx;
}

.percent-text {
  margin-top: -120rpx;
  display: block;
  text-align: center;
  color: #0089c9;
}

.money {
  font-size: 32rpx;
  font-weight: 500;
  margin-top: 20rpx;

  .unit {
    font-size: 20rpx;
  }
}

.name {
  font-weight: 500;
}

.charge-amount {
  /deep/ .u-row {
    //display: block;
    margin-top: 20rpx;
  }
}

.radio-button {
  height: 80rpx;
  border-radius: 20rpx;
  background: #f4f6f9;
  text-align: center;
  line-height: 80rpx;
  border: 1px solid #f4f6f9;

  &.isActive {
    color: #0974c5;
    background: rgba(0, 201, 164, 0.1);
    border: 1px solid #0974c5;
  }
}

.amount-input {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 80rpx;
  border-radius: 20rpx;
  border: 1px solid #f4f6f9;
  background: #f4f6f9;
  &.isActive {
    color: #0974c5;
    background: rgba(0, 201, 164, 0.1);
    border: 1px solid #0974c5;
  }
  /deep/ input {
    text-align: center;
    line-height: 80rpx;
    background: transparent;
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

.card-box {
  padding-top: 0;
}

.card-content {
  padding: 0 20rpx;
}

.card-p {
  display: block;
  padding-bottom: 20rpx;
}

.card-flex {
  padding: 30rpx 0;

  &.top {
    align-items: flex-start;
  }

  &.title {
    padding: 30rpx 0 0;
    border: none;
  }

  &:last-child {
    border: none;
  }
}

.card-title {
  flex: 1;
  // padding-bottom: 10rpx;
  font-weight: 500;
}

.set-image {
  /deep/ .u-image {
    margin-right: 10rpx;
  }
}

.card-row {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  line-height: 40rpx;
  padding: 10rpx 0;

  .lable {
    flex: 1;
    color: #707070;
  }

  .content {
  }
  .small {
    font-size: 24rpx;
    color: #707070;
  }
}

.card-swapper {
  padding: 30rpx 20rpx;
  .u-row {
    display: block;

    .number {
      font-size: 48rpx;
      font-weight: 700;
      text-align: center;
      margin-top: 40rpx;
    }

    .label {
      font-size: 28rpx;
      color: #707070;
      text-align: center;
    }

    .title {
      font-size: 28rpx;
      text-align: center;
      margin-bottom: 10rpx;
    }
  }
}

.actual-pay {
  font-size: 32rpx;
  margin-left: 10rpx;
}

.dicount-tag {
  /deep/ .u-tag {
    color: #f28227;
    background-color: transparent;
    border-color: #f28227;
    margin: 0 10rpx;
    display: inline-block;
  }
}

/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  .product-container {
    background-image: linear-gradient(
      180deg,
      #039ef1 12%,
      #056d9e 18%,
      #121425 40%
    );
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

  .title,
  .number,
  .percent-text,
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
}
</style>