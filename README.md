## Orise充电站

[🔥 充电平台微服务源码](https://gitee.com/orise001/orise-charge-cloud)

[🔥 充电管理后台源码](https://gitee.com/orise001/orise-admin)

[🔥 充电小程序源码](https://gitee.com/orise001/orise-mp)

### 快速开始

#### 阅读文档

`uni-app` https://uniapp.dcloud.net.cn/api/

`vue2` https://v2.cn.vuejs.org/

`uView v1` https://v1.uviewui.com/

#### 环境

在开发之前保证本地安装了以下软件
`hbulider` https://www.dcloud.io/hbuilderx.html

### 技术栈

本项目技术栈为 `uni-app` + `scss` + `ES2015` + `uView` 提前学习和了解这些知识将帮助你更好地上手我们的项目。

### 安装

1. 克隆项目到本地

```shell
git clone https://gitee.com/orise001/orise-mp.git
```

2. 从`hbulider`中打开项目

```shell
直接将项目拖进hbulider中点击运行即可
```

### 目录结构

```
├── api  // 接口
├── components  // 组件
├── config  // 配置文件
├── pages  // 页面
├── static  // 静态资源
├── store  // vuex
├── utils  // 工具类
├── uview-ui  // uview
├── App.vue  // 入口页面
├── main.js  // 入口文件
├── manifest.json  // hbulider配置文件
├── pages.json  // 路由配置文件
├── uni.scss  // 全局样式
└── vue.config.js  // vue配置文件
```

### 运行

#### 运行在微信小程序

1.需要保证本地要有`微信开发者工具` https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

2.在`hbulider`中点击`运行`->`运行到小程序模拟器`->`微信开发者工具` 运行的时候需要配置小程序的`appid`，配置完成后即可运行


### 项目配置/开发

#### config配置
在根目录`config`下的`config`设置中配置了一些默认的配置，可以根据自己的需求进行修改

```
const name = "lilishop"; //全局商城name
const schemeName = "lilishop"; //唤醒app需要的schemeName
export default {
  name: name,
  customerServiceMobile: "", //默认客服电话
  customerServiceEmail: "", //默认客服邮箱
  /**
   * 如需更换主题请修改此处以及uni.scss中的全局颜色
   */
  mainColor: "#ff3c2a", // 主题色
  lightColor: "#ff6b35", // 高亮主题色
  aiderLightColor: "#ff9f28", // 辅助高亮颜色
};

```
#### 组件
在根目录`components`下的`components`设置中配置了一些默认的组件，可以根据自己的需求进行修改

#### 页面
在`pages`文件夹写入或修改页面代码，在`pages.json`中去配置页面路由，具体配置可以参考`pages.json` 或参考uni-app的文档

在微信小程序中默认启用分包操作，如果需要在微信小程序中使用分包，需要在`pages.json`中配置分包路径，具体配置可以参考`pages.json` 或参考uni-app的文档

#### 主题
1.现在`config`中设置主题色

2.在`uni.scss`中设置全局颜色

3.替换项目中一些icon以及图片的颜色




### 常见问题

#### 微信小程序移动端启动报错

小程序直播插件报错，在`manifest`中删除代码。

#### 微信小程序上传文件过大超出 2MB

1.关闭微信小程序，停止微信小程序运行

2.重新点击运行小程序模拟器，在最下方有一个 `运行时是否压缩代码` 勾选并重新运行

3.如果还是提示超出2MB，重新执行1步骤，然后点击`发行`->`小程序`即可

4.以上1-3步骤都不行，可以尝试删除一些自己开发的代码或本地的静态资源图片

#### 微信小程序在开发者工具中可以使用接口在测试版却不行
1.首先保证是否填写`request`合法域名 在微信小程序后台配置

2.需保证接口为https请求

#### 如何配置API
在根目录 `config` -> `api` 中配置开发环境以及生产环境 api 接口地址

#### 运行报错
初次运行时候可能因为本地环境缺少编译插件，这个时候一定要注意看报错信息，根据报错信息安装相应的插件即可

#### 如何配置微信小程序appid
在根目录 `manifest.json` 中配置微信小程序appid


#### 微信登录报错
需检查appId是否配置正确，在后台管理中信任登录的`appId`以及`appSecret`是否配置正确

