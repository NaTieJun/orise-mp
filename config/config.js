const name = "奥升"; //全局商城name
const schemeName = "Orise"; //唤醒app需要的schemeName
export default {
  name: name,
  customerServiceMobile: "", //默认客服电话
  customerServiceEmail: "", //客服邮箱
  qrLink: "http://plat.trytowish.cn/",
  // #ifdef MP-WEIXIN
  appid: "wx66a19ee384891552", //微信测试
  // #endif
  // #ifdef MP-ALIPAY
  appid: "2021004128601128", //支付宝测试
  // #endif
  wxMapSubKey: "BAGBZ-CJOLG-K7BQ2-IO6GZ-5FLWE-J6B46", //微信地图的key
  wxNotifyKey: ["O5_2PL86dBvmL_bv4OL7mQDobDoP0iexPR5VOKDOiJs","6jg6BYBHRl_AU5e7oPhpK-a6-Qxen1ovP2a-ywL8bAs"], //微信推送模板,订单开发、结束两个模板
  /**
   * 如需更换主题请修改此处以及uni.scss中的全局颜色
   */
  mainColor: "#4A98D3", // 主题色
  lightColor: "#0974C5", // 高亮主题色
  aiderLightColor: "#00d591", // 辅助高亮颜色
};
