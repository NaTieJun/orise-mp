<template>
  <view class="evaluate-box">
    <view class="eva-section">
      <view class="e-header">
        <view class="evaluate-title">
          <text v-for="n in tabName" :key="n" style="margin-right:30rpx">{{ n.name }}</text>
        </view>
      </view>
      <view v-if="equipmentList && equipmentList.length > 0">
        <view
          v-for="(equipment, equipmentIndex) in  equipmentList"
          :key="equipmentIndex"
          :class="['card-flex', 'type' + equipment.equipmentType]"
          @click="scan(equipment)"
        >
          <view class="card-title">
            <u-image width="64rpx" height="64rpx" :src="`/static/index/station-${equipment.status}.png`"></u-image>
            <text class="status-text" v-if="equipment.status == 0">离线</text>
            <text class="status-text" v-if="equipment.status == 1">空闲</text>
            <text class="status-text" v-if="equipment.status == 2">已插枪</text>
            <text class="status-text" v-if="equipment.status == 3">充电中</text>
            <text class="status-text" v-if="equipment.status == 4">已锁定</text>
            <text class="status-text" v-if="equipment.status == 255">故障</text>
          </view>
          <view class="card-content">
            <view class="total-equipment">
              {{ equipment.connectorName || equipment.connectorId }}
              <text class="progress-text" v-if="equipment.chargingPer>0">{{equipment.chargingPer}}%</text>
            </view>
            <text
              class="sub-equipment"
            >{{ equipment.equipmentType == 1 ? '快充' : '慢充' }} {{ equipment.power }}kW</text>
          </view>
        </view>
      </view>

      <div v-else class="stationNoMore">
        <u-empty text="暂无充电设备" mode="message"></u-empty>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      lightColor: this.$lightColor,
      equipmentList: [],
      current: 0,
      tabName: [],
      connectorCounter: [0, 0], // [快充，慢充]
      connectorFreeCounter: [0, 0], // [快充，慢充]
    };
  },
  props: {
    stationData: {
      default: {},
      type: Object,
    },
  },
  watch: {
    stationData: {
      handler(val) {
        this.equipmentList = []
        if (val.pileList) {
          let pileList = JSON.parse(JSON.stringify(val.pileList))
          this.connectorCounter = [0, 0]
          this.connectorFreeCounter = [0, 0]
          pileList.sort(this.compare('equipmentType'))
          pileList && pileList.forEach(p => {
            p.gunList.forEach(c => {
              this.equipmentList.push(Object.assign(c, { equipmentType: p.equipmentType }))
              // 如果有快充/慢充桩，则更新下面的标记
              if (p.equipmentType == 1) {
                this.connectorCounter[0] += 1
                c.status == 1 && (this.connectorFreeCounter[0] += 1)
              }
              if (p.equipmentType == 2) {
                this.connectorCounter[1] += 1
                c.status == 1 && (this.connectorFreeCounter[1] += 1)
              }
            })
          });
          this.tabName = []
          // 整理快慢充检的标签显示
          this.connectorCounter[0] && this.tabName.push({
            name: `快充 ${this.connectorFreeCounter[0]}/${this.connectorCounter[0]}`
          })
          this.connectorCounter[1] && this.tabName.push({
            name: `慢充 ${this.connectorFreeCounter[1]}/${this.connectorCounter[1]}`
          })
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {

  },
  methods: {
    changeTab(index) {
      this.current = index;
      console.log(index)
    },
    compare(key) {
      return function (value1, value2) {
        var val1 = value1[key];
        var val2 = value2[key];
        return val1 - val2;
      }
    },
    scan(equipment) {
      uni.navigateTo({
        url: `/pages/station/charge/charging?id=${equipment.connectorId}`,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./connector.scss";

.evaluate-title {
  font-size: 32rpx;

  &::before {
    display: none;
  }
}

.card-title {
  flex: none;
  width: 64rpx;
  text-align: center;
}

.status-text {
  font-size: 20rpx;
  text-align: center;
  width: 100%;
  display: inline-block;
}

.card-content {
  padding: 0 40rpx;
  text-align: left;
  flex: 1;

  // flex: 6;
  .total-equipment {
    font-size: 32rpx;
    font-weight: 500;
    .progress-text {
      font-size: 24rpx;
      color: $main-color;
      float: right;
    }
  }

  .unit-equipment {
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
    margin-left: 5rpx;
  }

  .sub-equipment {
    font-size: 24rpx;
    color: #bdbfc0;

    & + .sub-equipment {
      margin-left: 30rpx;
    }
  }
}
</style>
