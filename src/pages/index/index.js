//logs.js
const app = getApp();
Page({
  data: {
  },
  onGotUserInfo({detail}) {
    if (!detail.userInfo) {
      wx.showToast({
        title: '您拒绝了授权'
      });
    } else {
      app.globalData.userInfo = detail.userInfo;
      wx.navigateTo({
        url: '../ld-cropper/ld-cropper'
      });
    }
  },
  onLoad: function () {
  }
})
