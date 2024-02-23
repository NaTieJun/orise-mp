<template>
  <view class="person-msg">
    <button class="head c-content" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" @click="onClickAvatar">
      <image :src="form.avatarUrl || '/static/missing-face.png'"></image>
      <view>点击修改头像</view>
    </button>
    <u-form :model="form" class="form">
      <u-form-item label="昵称" label-width="150">
        <u-input type="nickname" v-model="form.nickName" placeholder="请输入昵称" :clearable="false" />
      </u-form-item>
      <u-form-item label="手机号" label-width="150">
        <u-input v-model="form.mobile" placeholder="未绑定手机号" disabled />
      </u-form-item>
      <view class="submit" @click="save">保存</view>
    </u-form>
    <u-top-tips ref="uTips" ></u-top-tips>
    <view ref="vvv"></view>
  </view>
</template>
<script>
import { logout } from "@/api/login";
import { mpUpdateUserProfile } from "@/api/connect.js";
import { upload } from "@/api/common.js";
import storage from "@/utils/storage.js";
import uFormItem from "@/uview-ui/components/u-form-item/u-form-item.vue";
export default {
  components: {
    uFormItem,
  },
  data() {
    return {
      avatarName: '',
      quitShow: false,
      lightColor: this.$lightColor, //高亮颜色
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      form: {
        nickName: storage.getUserInfo().nickName || "",
        mobile: storage.getUserInfo().mobile || "",
        avatarUrl: storage.getUserInfo().avatarUrl || "/static/missing-face.png", //默认头像
        sex: storage.getUserInfo().sex, //性别
      },
      photo: [
        { text: "立即拍照", color: this.$mainColor },
        { text: "从相册选择", color: this.$mainColor },
      ],
    };
  },
  methods: {
    /**
     * 显示退出登录对话框
     */
    showModalDialog() {
      this.quitShow = true;
    },

    clear() {
      storage.setAccessToken("");
      storage.setRefreshToken("");
      storage.setUserInfo({});
      this.$options.filters.navigateToLogin("redirectTo");
    },

    /**
     * 确认退出
     * 清除缓存重新登录
     */
    async confirm() {
      try {
        await logout();
        this.clear();
      } catch (e) {
        //TODO handle the exception
        this.clear();
      }
    },

    /**
     * 提交保存
     */
     save() {
      let params = JSON.parse(JSON.stringify(this.form));
      params.avatarUrl = this.avatarName;
      mpUpdateUserProfile(params).then((res) => {
        if (res.data.code == 200) {
          storage.setUserInfo(res.data.data);
          uni.navigateBack();
        } else {
          // 拿不到$refs.uTips?! 其他页面是可以的，待查 04-05
          this.$refs.uTips.show({ title: res.data.msg, type: "error" });
        }
      });
    },

    onClickAvatar(){
      // #ifndef MP-WEIXIN
      uni.chooseImage({
        success: (chooseImageRes) => {
          const avatarFilePath = chooseImageRes.tempFilePaths[0];
          this.form.avatarUrl = avatarFilePath;
          this.uploadAvatar(avatarFilePath)
        },
      });
      // #endif
    },

    onChooseAvatar(e) {
      const avatarFilePath = e.detail.avatarUrl;
      this.form.avatarUrl = avatarFilePath;
      this.uploadAvatar(avatarFilePath)
    },

    uploadAvatar(avatarFilePath){
      uni.uploadFile({
        url: upload,
        filePath: avatarFilePath,
        name: "file",
        header: {
          accessToken: storage.getAccessToken(),
        },
        success: (uploadFileRes) => {
          let data = JSON.parse(uploadFileRes.data)
          if (data.code == 200) {
            this.form.avatarUrl = data.data.url
            this.avatarName = data.data.name
          } else {
            uni.showToast({
              title: "上传失败",
              duration: 2000,
              icon: "error",
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.submit {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  margin-top: 90rpx;

  width: 100%;
  margin: 0 auto;
  color: $main-color;
  border-radius: 100px;
}

.head {
  height: 260rpx;
  color: $font-color-light;
  font-size: $font-sm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 2em;

  image {
    width: 144rpx;
    height: 144rpx;
    border-radius: 50%;
  }
}

/deep/ .u-form {
  padding: 0;
  margin-top: 30rpx;

  .u-form-item {
    padding: 0 20rpx;
    height: 110rpx;
    line-height: 110rpx;
  }
}

/deep/ .u-input__input {
  color: inherit !important;
}

.form {
  background-color: #ffffff;
}
</style>
