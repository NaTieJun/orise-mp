<template>
  <view class="floatBtn" ref="floatBtnRef" @click="showChargingOrder()" :class="[{moveBtn: longClick}, `${btnType}Btn`]">
    <div class="lighting"></div>
    <span style="margin-right:16rpx;">充电中</span>
  </view>
</template>

<script>
export default {
  data() {
    return {
      timeOutEvent: 0,
      longClick: 0,
      // 手指原始位置
      oldMousePos: {},
      // 元素原始位置
      oldNodePos: {},
      btnType: 'right'
    };
  },
  props: {
    connectorId: {
      default: null,
      type: String,
    },
  },
  mounted() {
  },
  onShow() {
  },
  methods: {
    showChargingOrder() {
      if (this.connectorId != null) {
        uni.navigateTo({
          url: `/pages/station/charge/charging?id=${this.connectorId}`
        })
      }
    },
    touchstart(ev) {
      // 定时器控制长按时间，超过500毫秒开始进行拖拽
      this.timeOutEvent = setTimeout(() => {
        this.longClick = 1;
      }, 500);
      let selectDom = ev.currentTarget;
      const { pageX, pageY } = ev.touches[0];
      const { offsetLeft, offsetTop } = selectDom;
      // 手指原始位置
      this.oldMousePos = {
        x: pageX,
        y: pageY
      };
      // 元素原始位置
      this.oldNodePos = {
        x: offsetLeft,
        y: offsetTop
      };
      this.$refs.floatBtn.style.left = `${offsetLeft}px`;
      this.$refs.floatBtn.style.top = `${offsetTop}px`;
    },
    touchMove(ev) {
      // 未达到500毫秒就移动则不触发长按，清空定时器
      clearTimeout(this.timeOutEvent);
      if (this.longClick === 1) {
        const selectDom = ev.currentTarget;
        // x轴偏移量
        const lefts = this.oldMousePos.x - this.oldNodePos.x;
        // y轴偏移量
        const tops = this.oldMousePos.y - this.oldNodePos.y;
        const { pageX, pageY } = ev.touches[0]; // 手指位置
        selectDom.style.left = `${pageX - lefts}px`;
        selectDom.style.top = `${pageY - tops}px`;
      }
    },
    touchEnd(ev) {
      // 清空定时器
      clearTimeout(this.timeOutEvent);
      if (this.longClick === 1) {
        this.longClick = 0;
        let selectDom = ev.currentTarget;
        const { clientWidth, clientHeight } = document.body;
        const { offsetLeft, offsetTop } = selectDom;
        selectDom.style.left =
          (offsetLeft + 50) > (clientWidth / 2) ?
            'calc(100% - 196px)' : 0;
        if (offsetTop < 90) {
          selectDom.style.top = '90px';
        } else if (offsetTop + 36 > clientHeight) {
          selectDom.style.top = `${clientHeight - 36}px`;
        }
        this.btnType =
          (offsetLeft + 50) > (clientWidth / 2) ?
            'right' : 'left';
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./float-btn.scss";
</style>