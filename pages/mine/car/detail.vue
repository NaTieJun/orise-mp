<template>
  <div class="wrapper">
    <!-- <div class="content-box" v-if="checkState === 0 || checkState === 1">
      <view class="opt-view">
        <view >认证状态</view>
        <view class="check-state-0" v-if="checkState === 0">
          <u-tag 
            text="认证中"
            shape="square"
          ></u-tag>
        </view>
        <view class="check-state-1" v-if="checkState === 1">
          <u-tag 
            text="已认证"
            shape="square"
          ></u-tag>
        </view>
      </view>
    </div> -->
    <div class="content-box">
      <h4>车牌号码</h4>
      <view class="plate-number">
        <view class="plate-item" v-for="(item, index) in plateList" :key="index" :class="{'ml-10': item.ml10, current:index == currentIndex}">
           <!--  #ifdef  MP-WEIXIN -->
           <u-input
            class="field-input"
            input-align="center"
            :border-bottom="false"
            v-model="item.text"
            :maxlength="1"
            @click="showKeyboard(index)"
            :custom-style="{backgroundColor:'#80808020',borderRadius: '10rpx', width: '80rpx', height: '100rpx'}"
            :style="{width: '80rpx'}"
            :clearable="false"
            placeholder=" "
            disabled
          ></u-input>
          <!--  #endif -->
          <!--  #ifndef  MP-WEIXIN -->
          <u-input
            class="field-input"
            input-align="center"
            :border-bottom="false"
            v-model="item.text"
            :maxlength="1"
            @click="showKeyboard(index)"
            :custom-style="{backgroundColor:'#EFEFEFFF',borderRadius: '10rpx', width: '80rpx', height: '100rpx'}"
            :style="{width: '80rpx'}"
            :clearable="false"
            placeholder=" "
            disabled
          ></u-input>
          <!--  #endif -->
        </view>
      </view>
      <u-keyboard
        ref="uKeyboard"
        mode="car"
        v-model="isShowKeyboard"
        @change="valChange"
        @confirm="hideKeyboard"
        @backspace="backspace"
        :abc="showAbc"
        safe-area-inset-bottom
        :mask="false"
      ></u-keyboard>
    </div>

    <!-- 上传凭证 -->
    <div class="content-box">
      <view class="opt-view">
        <view class="img-title">上传行驶证，完成车辆认证</view>
        <view class="images-view">
          <u-upload
            :header="{ accessToken: storage.getAccessToken() }"
            :action="action"
            width="150"
            @on-remove="onRemove"
            @on-success="onSuccess"
            @on-error="onError"
            :before-upload="beforeUpload"
            :max-count="1"
            :fileList="fileList"
            :show-progress="false"
            :deletable="canEdit"
          ></u-upload>
        </view>
        <view class="img-tip" v-if="canEdit">请上传车辆行驶证主页（带红印）</view>
      </view>
    </div>
    <u-button type="success" :ripple="true" shape="circle" @click="save" v-if="canEdit" :loading="loading">提交</u-button>
    <u-top-tips ref="uTips"></u-top-tips>
  </div>
</template>

<script>
import storage from "@/utils/storage.js";
import config from "@/config/config";
import { addCar, getCar, updateCar } from "@/api/car.js";
import { upload } from "@/api/common.js";
export default {
  data() {
    return {
      storage,
      config,
      fileList: [],
      action: upload, //图片上传地址
      img: [],
      isShowKeyboard: true,
      plateList: [
        {},
        {},
        { ml10: true },
        {},
        {},
        {},
        {},
        {},
      ],
      currentIndex: 0,
      showAbc: false,
      canEdit: true,
      carId: undefined,
      checkState: -1,
      loading: false
    };
  },
  watch: {
  },
  onLoad(options) {
    this.carId = options.id
    this.loadCarInfo()
  },
  methods: {
    async loadCarInfo(){
      if(this.carId == null) return
      const res = await getCar(this.carId)
      const data = res.data.data;
      this.checkState = data.checkState
      this.canEdit = (this.checkState === 2 || this.checkState === 3)
      this.isShowKeyboard = this.canEdit
      const title = this.canEdit ? "编辑车辆" : "车辆详情"
      uni.setNavigationBarTitle({
        title: title
      });
      for(let index = 0; index < this.plateList.length; index++){
        this.plateList[index].text = data.plateNo[index]
      }
      if(data.licenseImgs && data.licenseImgs.length > 0){
        this.img = JSON.parse(data.licenseImgs)
      }
      data.licenseImgsShow.forEach((item) => {
        this.fileList.push({url: item})
      });
    },
    //图片上传成功
    onSuccess(data, index, lists, name) {
      this.img.push(data.data.name);
      this.loading = false
    },
    //删除图片
    onRemove(index, lists, name) {
      this.img.splice(index, 1);
    },
    onError(res, index, lists, name) {
      this.loading = false
    },
    beforeUpload(index, list) {
      this.loading = true
      return true;
    },
    /**
     * 提交车辆审核
     */
    async save() {
      let params = {}
      params.plateNo = "";
      this.plateList.forEach((platItem, index) => {
        const text = platItem.text;
        if (text != null && text !== '') {
          params.plateNo += text
        }
      })
      if (!this.$u.test.carNo(params.plateNo)) {
        uni.showToast({
          title: "请填入正确的车牌号码",
          duration: 2000,
          icon: "none",
        });
        return false;
      }
      /** 提交 */
      params.licenseImgs = JSON.stringify(this.img)
      let submitMethod = addCar;
      if(this.carId != null){
        params.id = this.carId
        submitMethod = updateCar
      }
      const res = await submitMethod(params)
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
      } else if (res.data.msg != null) {
        this.$refs.uTips.show({ title: res.data.msg, type: "error" });
      }
    },
    showKeyboard(index) {
      // uni.hideKeyboard();
      if(this.canEdit === false) return
      this.currentIndex = index;
      this.showAbc = this.currentIndex == 0 ? false : true
      this.isShowKeyboard = true
    },
    hideKeyboard() {
      this.isShowKeyboard = false
    },
    // 按键被点击(点击退格键不会触发此事件)
    valChange(val) {
      // 将每次按键的值拼接到value变量中，注意+=写法
      this.plateList[this.currentIndex].text = val;
      this.currentIndex++;
      if (this.currentIndex >= this.plateList.length) {
        this.currentIndex = 0;
        this.isShowKeyboard = false
      }
      this.showAbc = this.currentIndex == 0 ? false : true
    },
    // 退格键被点击
    backspace() {
      for (let index = this.currentIndex; index >= 0; index--) {
        let text = this.plateList[index].text;
        console.log(text === null)
        console.log(text === '')
        if (text !== null && text !== '') {
          this.plateList[index].text = ''
          this.$set(this.plateList, index, this.plateList[index])
          this.currentIndex = index;
          if (this.currentIndex <= 0) {
            this.currentIndex = 0;
            this.isShowKeyboard = false
          }
          break;
        }
      }
      this.showAbc = this.currentIndex == 0 ? false : true
    }
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 30rpx;
}

.content-box {
  position: relative;
  padding: 30rpx 0;
}

.check-state-0{
  /deep/ .u-tag  {
    color: #FFD75C;
    background-color: #FFD75C16;
    border-color: transparent;
    margin-right:10rpx;
    margin-top:10rpx;
    display:inline-block;
  }
}
.check-state-1{
  /deep/ .u-tag  {
    color: #46D290;
    background-color: #46D29016;
    border-color: transparent;
    margin-right:10rpx;
    margin-top:10rpx;
    display:inline-block;
  }
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

h4 {
  font-size: 30rpx;
  margin-bottom: 20rpx;
}

.field-input {
  margin: 10rpx 0;
  border-radius: 10rpx;
}
.img-tip {
  font-size: 24rpx;
  color: #bdbfc0;
  margin-top: 10rpx;
}

.plate-number {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.plate-item {
  margin: 0rpx 7rpx;
  width: 75rpx;
}

.ml-10 {
  margin: 0rpx 5rpx 0rpx 15rpx;
}
.current {
  border: 1px solid #0974C5;
  border-radius: 10rpx;
}
</style>
