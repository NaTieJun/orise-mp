<template>
  <div class="wrapper">
    <view class v-for="(item, oIndex) in list" :key="oIndex" @click="navigateTo(`/pages/mine/feedback/detail?id=${item.id}`)">
      <view class="view-item">
        <view class="view-item-detail">
          <view class="-title">{{ item.createTime }}</view>
          <view class="-number">
            问题类型：{{ typeList.find((i) => {
            return i.value === item.feedbackType;
            }).text }}
          </view>
          <view class="-number" v-if="item.connectorId">充电枪编号：{{ item.connectorId }}</view>
          <view class="-content">{{ item.feedbackContent }}</view>
          <image
            style="width: 160rpx; height: 160rpx;margin:10rpx 20rpx 0 0;border-radius: 10rpx;"
            :src="i"
            mode="aspectFill"
            v-for="(i, index) in item.imgUrls"
            :key="index"
            @click="preview(item.imgUrls, index)"
          />
        </view>
        <view class="view-item-detail mt-30" v-if="item.replyFlag == 1">
          <view class="-title">
            <img src="/static/index/support.png" class="img" />客服回复
          </view>
          <view class="-number">{{ item.updateTime }}</view>
          <view class="-content">{{ item.replyContent }}</view>
        </view>
      </view>
    </view>
    <u-empty style="margin-top:20%;" text="欢迎提供意见建议" v-if="list.length == 0"></u-empty>
    <uni-load-more :status="loadStatus"></uni-load-more>
    <!-- 底部 -->
    <div class="bottom-bar mp-iphonex-bottom">
      <view class="button">
        <u-button type="success" :ripple="true" shape="circle" @click="navigateTo('/pages/mine/feedback/submit')">反馈意见</u-button>
      </view>
    </div>
  </div>
</template>
    
<script>
import { getFeedbackList } from "@/api/members";
export default {
  data() {
    return {
      keyword: "",
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [], // 店铺列表
      loadStatus: 'more',
      statusText: ['未开票', '已开票', '已发送'],
      typeList: [
        { text: "无法启动", value: 1 },
        { text: "枪头损坏", value: 2 },
        { text: "充电慢", value: 3 },
        { text: "车位被占用", value: 4 },
        { text: "其他", value: 99 },
      ],
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
  onShow() {
    this.params.pageNum = 1
    this.list = []
    this.init();
  },
  methods: {
    /**
     * 点击图片放大或保存
     */
    preview(urls, index) {
      uni.previewImage({
        current: index,
        urls: urls,
        longPressActions: {
          itemList: ["保存图片"],
          success: function (data) { },
          fail: function (err) { },
        },
      });
    },
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },
    search() {
      this.list = [];
      this.init();
    },
    async init() {
      uni.stopPullDownRefresh()
      let res = await getFeedbackList(this.params);
      if (res.data.code == 200) {
        let data = res.data.rows;
        this.total = res.data.total
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
  padding: 0 0 100rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  overflow: hidden;
  line-height: 100rpx;
  margin-bottom: 0px !important;
  background: #ffffff;
  display: flex;
  justify-content: space-between;

  > .button {
    margin: 0 30rpx;
    flex: 1;
  }
}

/* DarkMode 下的样式 start */
@media (prefers-color-scheme: dark) {
  .bottom-bar {
    background: #121425;
  }
}

.view-item {
  padding: 32rpx;
  align-items: center;
  box-shadow: 0px 0px 2px 1px #b7b7b740;
  border-radius: 10px;
  margin: 30rpx;
}

.view-item-change {
  text-align: right;

  > .-money {
    font-size: 36rpx;
    color: $main-color;
    font-weight: bold;
  }

  > .-time {
    font-size: 22rpx;
    color: #999;
  }
}

.view-item-detail {
  line-height: 1.75;
  flex: 1;

  > .-title {
    font-size: 28rpx;
  }

  > .-number {
    font-size: 24rpx;
    color: #bdbfc0;
  }

  > .-content {
    font-size: 24rpx;
  }
}

.img {
  width: 30rpx;
  height: 30rpx;
  margin-right: 4rpx;
  margin-bottom: 4rpx;
  vertical-align: middle;
}
</style>