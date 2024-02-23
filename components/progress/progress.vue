<template>
  <view class="wrapper">
    <view class="progress_box" :style="{margin: '0 auto',width:progress_width+'rpx',height:progress_height+'rpx'}">
      <view class="bg" :style="{width:progress_width+'rpx',height:progress_height+'rpx'}"></view>
      <canvas class="progress_bg" canvas-id="cpbg" id="cpbg" :style="{width:progress_width+'rpx',height:progress_height+'rpx',left:0}"></canvas>
      <canvas class="progress_bar" canvas-id="cpbar" id="cpbar" :style="{width:progress_width+'rpx',height:progress_height+'rpx',left:0}"></canvas>
    </view>
  </view>
</template>

<script>
/**
 * circleProgress 自己写的环形进度条
 * @property {String Number} value 圆环进度百分比值，为数值类型，0-100(默认必传).
 * @property {String Number} progress_time 圆环进度总时间
 * @property {String Number} border_width 圆环边框宽度
 * @property {String Number} progress_width 圆环宽度(建议宽高一致)
 * @property {String Number} progress_height 圆环高度（建议宽高一致）
 * @property {String} bg_color 圆环的背景色
 * @property {String} start_color 圆环开始渐变色
 * @property {String} bg_color 圆环结束渐变色
 */
export default {
  props: {
    value: {
      type: Number,
      default: 10,
      required: true
    },
    progress_time: {
      type: Number,
      default: 1500
    },
    progress_width: {
      type: Number,
      default: 670
    },
    progress_height: {
      type: Number,
      default: 340
    },
    border_width: {
      type: Number,
      default: 10
    },
    bg_color: {
      type: String,
      default: 'rgba(255,255,255,0.2)'
    },
    start_color: {
      type: String,
      default: '#01D8D0'
    },
    end_color: {
      type: String,
      default: '#14E7A0'
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value(val) {
      // 监听value进度变化，如果进度大于现有进度，则开始绘制
      if (this.value > this.percent) {
        this.percent++
        this.drawCircle(this.percent)
      }
    },
  },
  computed: {
    wRpx() {
      return this.rpxToPx(this.progress_width)
    },
    hRpx() {
      return this.rpxToPx(this.progress_height)
    },
  },
  data() {
    return {
      percent: 0, // 保存进度值的变化前后值，用于比较用
    }
  },
  mounted() {
    this.drawProgressbg();
    this.drawCircle(this.value);
  },
  beforeDestroy: function () {
    // 在组件实例被从页面节点树移除时执行
    console.log('visitor detached');
    this.clear()
  },
  methods: {
    // rpx转px
    rpxToPx(rpx) {
      const screenWidth = uni.getSystemInfoSync().windowWidth
      return (screenWidth * Number.parseInt(rpx)) / 750
    },
    // 背景
    drawProgressbg: function () {
      // 自定义组件实例 this ，表示在这个自定义组件下查找拥有 canvas-id 的 <canvas/>
      let ctx = uni.createCanvasContext('cpbg', this);
      ctx.setLineWidth(this.border_width);
      ctx.setStrokeStyle(this.bg_color);
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(this.wRpx / 2, this.hRpx - this.border_width, this.wRpx / 2 - this.border_width - 15, 0.99 * Math.PI, 0.01 * Math.PI, false);
      ctx.stroke();
      ctx.draw();
    },
    // 画圆（递归调用）
    drawCircle: function (step) {
      if (step === 0) return;
      let time = Math.floor(this.progress_time / 100)
      let ctx = uni.createCanvasContext('cpbar', this);
      let gradient = ctx.createLinearGradient(28, 55, 192, 55);
      gradient.addColorStop('0', this.start_color);
      gradient.addColorStop('1.0', this.end_color);
      ctx.setLineWidth(this.border_width);
      ctx.setStrokeStyle(gradient);
      ctx.setLineCap('round');
      ctx.beginPath();
      step = 0.01 * step + 0.99;
      if (step === 1) {
        step = 0.99
      }
      if (step >= 2) {
        step = step % 2;
      }
      if (step === 1.99) {
        step = 0.01
      }
      ctx.arc(this.wRpx / 2, this.hRpx - this.border_width, this.wRpx / 2 - this.border_width - 15, 0.99 * Math.PI, step * Math.PI, false);
      ctx.stroke();
      ctx.draw();
      if (this.value > this.percent) {
        this.percent++
        setTimeout(() => {
          this.drawCircle(this.percent)
        }, time)
      }
    },
    clear: function () {
      let ctx = uni.createCanvasContext('cpbar', this);
      ctx.draw();
      let ctxBg = uni.createCanvasContext('cpbg', this);
      ctxBg.draw();
    }
  }
};
</script>

<style> 
.wrapper {
  width: 100%;
  height: 100%;
  text-align: center;
}
.progress_box {
  position: relative;
  /* width: 100%;
  height: 100%; */
  /* display: flex;
  align-items: center;
  justify-content: center; */
  text-align: center;
}

.progress_bg,
.progress_bar {
  position: absolute;
}
.bg {
  position: absolute;
  background: url("@/static/index/progress-bg.png") center 0 no-repeat;
  background-size: contain;
}
.canvasHide {
  position: fixed;
  left: 100%;
}
</style>
