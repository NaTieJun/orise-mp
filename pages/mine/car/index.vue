<template>
  <view>
    <div class="wrapper">
      <u-swipe-action
        v-for="(item, index) in list"
        :key="item.id"
        :index="index"
        :show="item.show"
        @click="clickDeleteCar(index)"
        @open="open(index)"
        :options="options"
        :bg-color="$bg-color"
      >
        <view class="view-item-content" @click="navigateTo(`/pages/mine/car/detail?id=${item.id}`)">
          <view class="view-item-detail">
            <view class="-title">{{ item.plateNo }}</view>
            <!-- <view class="-number">{{getCarVinText(item)}}</view> -->
          </view>
        </view>
      </u-swipe-action>
      <u-empty style="margin-top:20%;" text="还没有车辆记录" v-if="list.length == 0"></u-empty>
      <!-- 底部 -->
      <div class="bottom-bar mp-iphonex-bottom">
        <view class="button">
          <u-button type="success" :ripple="true" shape="circle" @click="navigateTo('/pages/mine/car/detail')">添加车辆</u-button>
        </view>
      </div>
    </div>
    <view>
      <u-modal
        v-model="showDeleteCar"
        :title="modalTitle"
        :content="modalContent"
        @confirm="handleDeleteCar"
        :showCancelButton="true"
        @cancel="handleCancel"
      ></u-modal>
    </view>
    <u-top-tips ref="uTips"></u-top-tips>
  </view>
</template>
  
<script>
import { getCarList, deleteCar } from "@/api/car";
export default {
  computed: {
    modalContent() {
      let plateNo = ""
      if (this.selectedCarIndex != -1) {
        let selectedCar = this.list[this.selectedCarIndex];
        if (selectedCar) {
          plateNo = selectedCar.plateNo;
        }
      }
      return `是否确认删除车辆[${plateNo}]?`;
    }
  },
  data() {
    return {
      keyword: "",
      params: {
      },
      list: [],
      options: [{
        text: '删除',
        style: {
          backgroundColor: '#dd524d'
        }
      }],
      modalTitle: '删除车辆',
      showDeleteCar: false,
      selectedCarIndex: -1,
    };
  },
  onReachBottom() {
  },
  onPullDownRefresh() {
    this.list = []
    this.init();
  },
  mounted() {
  },
  onShow() {
    this.reload()
  },
  methods: {
    getCarVinText(item) {
      let text = '';
      switch (item.checkState) {
        case 0:
          text = '认证中'
          break
        case 1:
          text = item.carVin || '已认证'
          break
        case 2:
          text = '认证未通过'
          break
        case 3:
          text = '未认证'
          break
        default:
          text = '未认证'
          break
      }
      return text
    },
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },
    search() {
      this.init();
    },
    async init() {
      uni.stopPullDownRefresh()
      let res = await getCarList(this.params);
      if (res.data.code == 200) {
        let data = res.data.data;
        this.list = data;
      }
    },
    reload() {
      this.init();
    },
    clickDeleteCar(index) {
      this.selectedCarIndex = index;
      this.showDeleteCar = true;
    },
    // 如果打开一个的时候，不需要关闭其他，则无需实现本方法
    open(carIndex) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      let car = this.list[carIndex];
      car.show = true;
      this.list.map((car, idx) => {
        if (carIndex != idx) {
          this.list[idx].show = false;
        }
      })
      this.$set(this.list, carIndex, car)
    },
    async handleDeleteCar() {
      let selectedCar = this.list[this.selectedCarIndex];
      const response = await deleteCar(selectedCar.id)
      if (response.data.code == 200) {
        uni.showToast({
          icon: "success",
          title: "删除成功!",
        });
        this.reload();
      } else if (response.data.msg != null) {
        this.$refs.uTips.show({ title: response.data.msg, type: "error" });
      }
      selectedCar.show = false;
      this.$set(this.list, this.selectedCarIndex, selectedCar)
      this.selectedCarIndex = -1;
    },
    handleCancel() {
      let selectedCar = this.list[this.selectedCarIndex];
      selectedCar.show = false;
      this.$set(this.list, this.selectedCarIndex, selectedCar)
    }
  },
};
</script>
  
<style lang="scss" scoped>
.wrapper {
  padding: 0 0 100rpx;
  height: calc(100vh - 170rpx);
  overflow-y: auto;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 0px 2px 1px #b7b7b740;
  border-radius: 10px;
  margin: 30rpx;
}

.view-item-content {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: url(/static/mine/car-list-bg.png) right -30rpx bottom no-repeat;
  background-size: auto 80%;
  box-shadow: 0px 0px 2px 1px #b7b7b740;
  border-radius: 10px;
  margin: 15rpx 30rpx;
}

.view-item-detail {
  line-height: 1.75;
  flex: 1;

  > .-title {
    font-size: 32rpx;
    font-weight: 500;
  }

  > .-number {
    font-size: 24rpx;
    color: #bdbfc0;
  }
}
</style>