<template>
  <view class="u-cell-box">
    <view class="u-cell-title" v-if="title" :style="[titleStyle]">{{ title }}</view>
    <view class="u-cell-item-box" :class="{ 'u-border-bottom u-border-top': border }">
      <slot />
    </view>
  </view>
</template>

<script>
/**
 * cellGroup 单元格父组件Group
 * @description cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。搭配u-cell-item
 * @tutorial https://www.uviewui.com/components/cell.html
 * @property {String} title 分组标题
 * @property {Boolean} border 是否显示外边框（默认true）
 * @property {Object} title-style 分组标题的的样式，对象形式，如{'font-size': '24rpx'} 或 {'fontSize': '24rpx'}
 * @example <u-cell-group title="设置喜好">
 */
export default {
  name: "u-cell-group",
  props: {
    // 分组标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示分组list上下边框
    border: {
      type: Boolean,
      default: true
    },
    // 分组标题的样式，对象形式，注意驼峰属性写法
    // 类似 {'font-size': '24rpx'} 和 {'fontSize': '24rpx'}
    titleStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      index: 0,
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../libs/css/style.components.scss";

.u-cell-box {
  width: 100%;
}

// .u-cell-title {
//   padding: 30rpx 32rpx 10rpx 32rpx;
//   font-size: 30rpx;
//   text-align: left;
//   color: $u-tips-color;
// }
.u-cell-title {
  font-size: 28rpx;
  font-weight: 700;
  padding: 30rpx 32rpx 10rpx 50rpx;
  position: relative;

  &::before {
    background-color: #0974C5;
    content: "";
    position: absolute;
    border-radius: 4rpx;
    top: 48rpx;
    left: 30rpx;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 4px;
    height: 15px;
  }
}

.u-cell-item-box {
  // background-color: #FFFFFF;
}
</style>
