<template>
  <div class="wrapper">
    <div class="feedBack-box">
      <h4>问题类型</h4>
      <view class="charge-amount">
        <view
          class="radio-button"
          v-for="(item, index) in list"
          :key="index"
          :class="{ selected: feedBack.type == item.value }"
          @click="handleClick(index)"
        >{{ item.text }}</view>
      </view>
    </div>

    <div class="feedBack-box">
      <h4>问题描述</h4>
      <u-input
        class="field-input"
        height="200"
        :border-bottom="false"
        v-model="feedBack.txt"
        type="textarea"
        placeholder="请说明您遇到的问题"
        :maxlength="200"
        :custom-style="{backgroundColor:'#80808020',borderRadius: '10rpx'}"
      ></u-input>
      <!--  #ifdef  MP-WEIXIN -->
      <div class="word-limit">{{ getTextLen() }}/200</div>
      <!--  #endif -->
    </div>

    <div class="feedBack-box" v-if="connectorType.includes(feedBack.type)">
      <h4>充电枪编号</h4>
      <!--  #ifdef  MP-WEIXIN -->
      <u-input
        class="field-input"
        :border-bottom="false"
        v-model="feedBack.connectorId"
        placeholder="请输入充电枪编号"
        :custom-style="{backgroundColor:'#80808020',borderRadius: '10rpx'}"
      ></u-input>
      <!--  #endif -->
      <!--  #ifndef  MP-WEIXIN -->
      <u-input
        class="field-input"
        :border-bottom="false"
        v-model="feedBack.connectorId"
        placeholder="请输入充电枪编号"
        :custom-style="{backgroundColor:'#EFEFEFFF',borderRadius: '10rpx'}"
        :clearable="false"
      ></u-input>
      <!--  #endif -->
    </div>

    <!-- 上传凭证 -->
    <div class="feedBack-box">
      <view class="opt-view">
        <view class="img-title">上传凭证（最多2张）</view>
        <view class="images-view">
          <u-upload
            :header="{ accessToken: storage.getAccessToken() }"
            :action="action"
            width="150"
            @on-remove="onRemove"
            @on-success="onSuccess"
            @on-uploaded="onUploaded"
            :before-upload="beforeUpload"
            :max-count="2"
            :show-progress="false"
          ></u-upload>
        </view>
      </view>
    </div>

    <u-button type="success" :ripple="true" shape="circle" @click="save" :loading="loading">提交</u-button>
  </div>
</template>

<script>
import storage from "@/utils/storage.js";
import config from "@/config/config";
import { feedback, getFeedbackInfo } from "@/api/members.js";
import { upload } from "@/api/common.js";
export default {
  data() {
    return {
      storage,
      config,
      selectedIndex: 0,
      feedBack: {
        type: 1,
      },
      action: upload, //图片上传地址
      list: [
        { text: "无法启动", value: 1 },
        { text: "枪头损坏", value: 2 },
        { text: "充电慢", value: 3 },
        { text: "车位被占用", value: 4 },
        { text: "其他", value: 99 },
      ],
      connectorType: [2, 3, 7, 8, 9, 11, 12, 13],
      img: [],
      loading:false,
    };
  },
  watch: {
    feedBack: {
      handler(val) {
        this.parkingPriceDetail = val.parkFeeList;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getTextLen() {
      let strLength = 0
      if (this.feedBack && this.feedBack.txt) strLength = this.feedBack.txt.length;
      if (strLength > 200) strLength = 200;
      return strLength;
    },
    // 点击反馈内容
    handleClick(index) {
      this.$set(this.feedBack, "type", this.list[index].value);
      if (!this.connectorType.includes(this.list[index].value)) {
        this.feedBack.connectorId = "";
      }
    },
    //图片上传成功
    onSuccess(data, index, lists, name) {
      this.img.push(data.data.name);
    },
    //删除图片
    onRemove(index, lists, name) {
      this.img.splice(index, 1);
    },
    onUploaded(lists) {
      this.loading = false
    },
    beforeUpload(index, list) {
      this.loading = true
      return true;
    },
    /**
     * 提交意见反馈
     */
     save() {
      if (!this.feedBack.type) {
        uni.showToast({
          title: "请填写反馈类型",
          duration: 2000,
          icon: "none",
        });
        return false;
      }
      if (!this.feedBack.txt) {
        uni.showToast({
          title: "请填写反馈信息",
          duration: 2000,
          icon: "none",
        });
        return false;
      }
      if (this.feedBack.mobile && !this.$u.test.mobile(this.feedBack.mobile)) {
        uni.showToast({
          title: "请填写您的正确手机号",
          duration: 2000,
          icon: "none",
        });
        return false;
      }
      /** 提交 */
      this.feedBack.imgArrayJson = JSON.stringify(this.img)
      feedback(this.feedBack).then((res) => {
        if (res.data.code == 200) {
          uni.showToast({
            title: "提交成功!",
            duration: 2000,
            icon: "success",
          });
          setTimeout(() => {
            uni.navigateBack({
              delta: 1,
            });
          }, 1000);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 30rpx;
}

.feedBack-box {
  position: relative;
  padding: 30rpx 0;
}

.word-limit {
  position: absolute;
  color: #95989e;
  // background-color: ;
  right: 48rpx;
  bottom: 30rpx;
}
/deep/ .u-input__textarea {
  padding: 20rpx;
}
/deep/ .u-input__input {
  padding: 0 10rpx;
}

.feedBack-item {
  margin: 20rpx 0;
  font-size: 24rpx;
  color: #666;
}

h4 {
  font-size: 30rpx;
  margin-bottom: 20rpx;
}

.field-input {
  margin: 10rpx 0;
  border-radius: 10rpx;
}

.charge-amount {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.radio-button {
  border-radius: 20rpx;
  background: #7c7c7c15;
  text-align: center;
  line-height: 62rpx;
  height: 62rpx;
  width: 210rpx;
  margin: 10rpx;
  font-size: 25rpx;
  border: 1px solid transparent;

  &.selected {
    background: rgba(0, 201, 164, 0.1);
    border: 1px solid #0974C5;
    color: #0974C5;
  }

  .amount {
    font-size: 32rpx;
    font-weight: 700;
    margin-bottom: 24rpx;
  }

  .sub {
    font-size: 24rpx;
  }
}
</style>
